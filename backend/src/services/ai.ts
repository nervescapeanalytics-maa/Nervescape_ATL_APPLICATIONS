import { config } from '../config';
import { pool } from '../db/pool';

/**
 * AI service abstraction.
 * - When AI_PROVIDER != 'offline' and an API key is set, calls an OpenAI-compatible
 *   chat/completions endpoint (works with OpenAI, Azure OpenAI, Ollama, LM Studio, vLLM...).
 * - Otherwise falls back to a deterministic offline engine so the LMS is fully
 *   functional without external dependencies.
 */

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }

export const aiEnabled = config.ai.provider !== 'offline' && !!config.ai.apiKey;

export interface LLMResult { content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }

export async function logAiUsage(userId: string | null, feature: string, usage: LLMResult['usage'], model: string) {
  try {
    await pool.query(
      `INSERT INTO ai_usage (user_id, feature, prompt_tokens, completion_tokens, total_tokens, model)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, feature, usage.prompt_tokens, usage.completion_tokens, usage.total_tokens, model]
    );
  } catch { /* non-critical */ }
}

async function callLLM(messages: ChatMessage[], opts: { temperature?: number; maxTokens?: number } = {}): Promise<LLMResult> {
  const zeroUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  if (!aiEnabled) return { content: offlineReply(messages), usage: zeroUsage };
  try {
    const res = await fetch(`${config.ai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        messages,
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 700,
      }),
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    const data: any = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim() || offlineReply(messages);
    const usage = data.usage ? {
      prompt_tokens: data.usage.prompt_tokens || 0,
      completion_tokens: data.usage.completion_tokens || 0,
      total_tokens: data.usage.total_tokens || 0,
    } : zeroUsage;
    return { content, usage };
  } catch (e) {
    console.warn('[ai] provider call failed, using offline fallback:', (e as Error).message);
    return { content: offlineReply(messages), usage: zeroUsage };
  }
}

// ---------------- Offline deterministic engine ----------------
function offlineReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const ctx = messages.find((m) => m.role === 'system')?.content || '';
  const topic = (ctx.match(/chapter "([^"]+)"/i)?.[1]) || 'this topic';
  const q = lastUser.toLowerCase();
  if (/what|define|explain|meaning/.test(q)) {
    return `Great question! In simple terms, ${topic} is about understanding how the core idea works step by step. ` +
      `Think of it like building with blocks: start with the basics, see a real example, then try it yourself. ` +
      `Key points: (1) understand the concept, (2) connect it to something you see daily, (3) experiment and observe the result. ` +
      `Try the quiz and the tinkering challenge for this chapter to lock in your learning!`;
  }
  if (/how|steps|build|make|do/.test(q)) {
    return `Here's a simple approach for ${topic}:\n1. Gather what you need.\n2. Do one small step and observe.\n3. Compare with what you expected.\n4. Adjust and repeat.\nLearning by tinkering is the fastest way to master it. You've got this!`;
  }
  if (/why/.test(q)) {
    return `Because the underlying principle of ${topic} stays consistent: cause leads to effect. ` +
      `When you change the input, the output changes in a predictable way — that's the logic to look for.`;
  }
  return `Good thinking about ${topic}! Break the problem into smaller parts, test one idea at a time, and note what changes. ` +
    `If you get stuck, re-read the chapter's "Concept & Logic" section and try the brain teaser to spark new ideas.`;
}

// ---------------- Public helpers ----------------
export async function chatbotAnswer(studentName: string, chapterTitle: string | null, history: ChatMessage[], question: string): Promise<{ answer: string; usage: LLMResult['usage'] }> {
  const system: ChatMessage = {
    role: 'system',
    content:
      `You are "TinkerBot", a friendly, encouraging AI tutor for school students (classes 6-8) in an ATL Tinkering LMS. ` +
      `Explain in simple layman terms with real-life examples, encourage curiosity, creativity and logical thinking. ` +
      (chapterTitle ? `The student is studying the chapter "${chapterTitle}". ` : '') +
      `Keep answers concise, positive and age-appropriate. Student name: ${studentName}.`,
  };
  const messages = [system, ...history.slice(-6), { role: 'user', content: question } as ChatMessage];
  const result = await callLLM(messages, { temperature: 0.6, maxTokens: 500 });
  return { answer: result.content, usage: result.usage };
}

export interface GenQuestion { qtype: string; prompt: string; options?: string[]; answer: string; explanation: string; difficulty: string; }

export async function generateQuestions(chapterTitle: string, summary: string, count: number, qtype: string, userId?: string): Promise<{ questions: GenQuestion[]; usage: LLMResult['usage'] }> {
  const zeroUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  if (aiEnabled) {
    const sys: ChatMessage = { role: 'system', content: 'You generate JSON quiz questions for school students. Respond ONLY with a JSON array.' };
    const user: ChatMessage = {
      role: 'user',
      content: `Create ${count} ${qtype} questions for the chapter "${chapterTitle}". Context: ${summary}. ` +
        `Each item: {"qtype":"${qtype}","prompt":"","options":["","","",""],"answer":"","explanation":"","difficulty":"beginner|intermediate|advanced"}. ` +
        `For non-mcq types omit options or use empty array.`,
    };
    try {
      const result = await callLLM([sys, user], { temperature: 0.7, maxTokens: 1200 });
      const json = result.content.slice(result.content.indexOf('['), result.content.lastIndexOf(']') + 1);
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length) {
        if (userId) await logAiUsage(userId, 'quiz_gen', result.usage, config.ai.model);
        return { questions: parsed.slice(0, count), usage: result.usage };
      }
    } catch (e) {
      console.warn('[ai] generateQuestions parse failed, using template fallback');
    }
  }
  return { questions: offlineQuestions(chapterTitle, count, qtype), usage: zeroUsage };
}

function offlineQuestions(title: string, count: number, qtype: string): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    if (qtype === 'mcq') {
      out.push({
        qtype: 'mcq',
        prompt: `Which statement best describes a key idea from "${title}"? (Q${i})`,
        options: [
          `It is a core concept covered in ${title}.`,
          'It is unrelated to the chapter.',
          'It only applies to adults.',
          'It cannot be tested or observed.',
        ],
        answer: `It is a core concept covered in ${title}.`,
        explanation: `Revisit the Concept & Logic section of "${title}" to confirm.`,
        difficulty: i <= count / 2 ? 'beginner' : 'intermediate',
      });
    } else if (qtype === 'oneliner') {
      out.push({ qtype, prompt: `In one line, what is the main takeaway of "${title}"? (Q${i})`, answer: `${title} teaches a hands-on concept you can build and observe.`, explanation: 'Summarise in your own words.', difficulty: 'beginner' });
    } else if (qtype === 'brain_teaser') {
      out.push({ qtype, prompt: `Brain teaser ${i}: If you changed one variable in "${title}", what would happen and why?`, answer: 'Open-ended — reason about cause and effect.', explanation: 'Look for predictable input→output relationships.', difficulty: 'advanced' });
    } else {
      out.push({ qtype, prompt: `Tinkering challenge ${i}: Design a tiny experiment to test an idea from "${title}".`, answer: 'Open-ended', explanation: 'Plan, build, observe, improve.', difficulty: 'advanced' });
    }
  }
  return out;
}

export async function evaluateChallenge(prompt: string, response: string, userId?: string): Promise<{ feedback: string; score: number; usage: LLMResult['usage'] }> {
  const zeroUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  if (aiEnabled) {
    const sys: ChatMessage = { role: 'system', content: 'You are a kind teacher grading a student challenge from 0-10. Respond as JSON {"score":number,"feedback":"..."}.' };
    const user: ChatMessage = { role: 'user', content: `Challenge: ${prompt}\nStudent response: ${response}\nGive encouraging, constructive feedback.` };
    try {
      const result = await callLLM([sys, user], { temperature: 0.4, maxTokens: 300 });
      const json = JSON.parse(result.content.slice(result.content.indexOf('{'), result.content.lastIndexOf('}') + 1));
      if (userId) await logAiUsage(userId, 'challenge_eval', result.usage, config.ai.model);
      return { feedback: json.feedback || 'Good effort!', score: Math.max(0, Math.min(10, json.score ?? 6)), usage: result.usage };
    } catch { /* fall through */ }
  }
  const len = response.trim().split(/\s+/).filter(Boolean).length;
  const score = Math.max(4, Math.min(10, 4 + Math.floor(len / 8)));
  return {
    feedback: `Nice attempt! You wrote ${len} words. To improve, explain your reasoning step by step and add a real example. Keep tinkering — every iteration makes you sharper!`,
    score,
    usage: zeroUsage,
  };
}
