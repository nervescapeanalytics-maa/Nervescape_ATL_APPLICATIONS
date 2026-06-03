import { config } from '../config';
import { pool } from '../db/pool';

/**
 * AI service abstraction with PER-FEATURE LLM routing.
 * Each feature (chatbot, quiz_gen, challenge_eval) can use a different provider/model
 * and has its own monthly token budget. Configuration lives in the `ai_features`
 * DB table and is managed from the Admin AI Platform UI.
 *
 * Supported providers:
 *  - 'offline'  → deterministic fallback (no network)
 *  - 'openai'   → OpenAI-compatible (also works for Azure, Ollama, vLLM, LM Studio, custom)
 *  - 'gemini'   → Google Gemini OpenAI-compatible endpoint
 *  - 'claude' / 'anthropic' → Anthropic /v1/messages
 *  - 'custom'   → OpenAI-compatible endpoint at custom base URL
 */

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }
export interface LLMResult { content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }

export interface FeatureConfig {
  feature_key: string;
  display_name: string;
  provider: string;
  model: string;
  base_url: string;
  api_key: string | null;
  monthly_budget: number;
  enabled: boolean;
}

let featureCache: { at: number; map: Map<string, FeatureConfig> } | null = null;
const CACHE_TTL_MS = 30_000;
export function invalidateFeatureCache() { featureCache = null; }

async function loadFeatureConfig(key: string): Promise<FeatureConfig> {
  const now = Date.now();
  if (!featureCache || now - featureCache.at > CACHE_TTL_MS) {
    const map = new Map<string, FeatureConfig>();
    try {
      const { rows } = await pool.query<FeatureConfig>(
        `SELECT feature_key, display_name, provider, model, base_url, api_key, monthly_budget, enabled FROM ai_features`
      );
      for (const r of rows) map.set(r.feature_key, r);
    } catch { /* table may not exist before migrate on first boot */ }
    featureCache = { at: now, map };
  }
  return featureCache.map.get(key) || {
    feature_key: key,
    display_name: key,
    provider: (config.ai.provider || 'offline').toLowerCase(),
    model: config.ai.model,
    base_url: config.ai.baseUrl,
    api_key: config.ai.apiKey || null,
    monthly_budget: 1_000_000,
    enabled: true,
  };
}

const zeroUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

export async function logAiUsage(userId: string | null, feature: string, usage: LLMResult['usage'], model: string) {
  try {
    await pool.query(
      `INSERT INTO ai_usage (user_id, feature, prompt_tokens, completion_tokens, total_tokens, model)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, feature, usage.prompt_tokens, usage.completion_tokens, usage.total_tokens, model]
    );
  } catch { /* non-critical */ }
}

async function tokensThisMonth(feature: string): Promise<number> {
  try {
    const { rows } = await pool.query<{ tot: number }>(
      `SELECT COALESCE(SUM(total_tokens),0)::int AS tot FROM ai_usage
        WHERE feature = $1 AND created_at >= date_trunc('month', now())`,
      [feature]
    );
    return rows[0]?.tot || 0;
  } catch { return 0; }
}

async function callProvider(cfg: FeatureConfig, messages: ChatMessage[], opts: { temperature?: number; maxTokens?: number }): Promise<LLMResult> {
  const provider = cfg.provider.toLowerCase();
  if (provider === 'offline' || !cfg.api_key) {
    return { content: offlineReply(messages), usage: zeroUsage };
  }
  try {
    if (provider === 'claude' || provider === 'anthropic') {
      const sys = messages.find((m) => m.role === 'system')?.content;
      const turns = messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${cfg.base_url.replace(/\/$/, '')}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': cfg.api_key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: cfg.model,
          system: sys,
          messages: turns,
          max_tokens: opts.maxTokens ?? 700,
          temperature: opts.temperature ?? 0.6,
        }),
      });
      if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
      const data: any = await res.json();
      const content = data.content?.map((b: any) => b.text).join('').trim() || offlineReply(messages);
      const usage = data.usage ? {
        prompt_tokens: data.usage.input_tokens || 0,
        completion_tokens: data.usage.output_tokens || 0,
        total_tokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
      } : zeroUsage;
      return { content, usage };
    }

    // openai / gemini / custom — all OpenAI-compatible chat/completions
    const res = await fetch(`${cfg.base_url.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.api_key}` },
      body: JSON.stringify({
        model: cfg.model,
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
    console.warn(`[ai/${cfg.feature_key}] ${cfg.provider} call failed, using offline fallback:`, (e as Error).message);
    return { content: offlineReply(messages), usage: zeroUsage };
  }
}

async function callFeature(featureKey: string, messages: ChatMessage[], opts: { temperature?: number; maxTokens?: number }): Promise<{ result: LLMResult; cfg: FeatureConfig }> {
  const cfg = await loadFeatureConfig(featureKey);
  if (!cfg.enabled) return { result: { content: offlineReply(messages), usage: zeroUsage }, cfg };
  const used = await tokensThisMonth(featureKey);
  if (used >= cfg.monthly_budget) {
    console.warn(`[ai/${featureKey}] monthly budget exceeded (${used}/${cfg.monthly_budget})`);
    return { result: { content: offlineReply(messages), usage: zeroUsage }, cfg };
  }
  const result = await callProvider(cfg, messages, opts);
  return { result, cfg };
}

// Back-compat flag (used by some routes/seed code)
export const aiEnabled = config.ai.provider !== 'offline' && !!config.ai.apiKey;

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
export async function chatbotAnswer(studentName: string, chapterTitle: string | null, history: ChatMessage[], question: string): Promise<{ answer: string; usage: LLMResult['usage']; model: string }> {
  const system: ChatMessage = {
    role: 'system',
    content:
      `You are "TinkerBot", a friendly, encouraging AI tutor for school students (classes 6-12) in an ATL Tinkering LMS. ` +
      `Explain in simple layman terms with real-life examples, encourage curiosity, creativity and logical thinking. ` +
      (chapterTitle ? `The student is studying the chapter "${chapterTitle}". ` : '') +
      `Keep answers concise, positive and age-appropriate. Student name: ${studentName}.`,
  };
  const messages = [system, ...history.slice(-6), { role: 'user', content: question } as ChatMessage];
  const { result, cfg } = await callFeature('chatbot', messages, { temperature: 0.6, maxTokens: 500 });
  return { answer: result.content, usage: result.usage, model: cfg.model };
}

export interface GenQuestion { qtype: string; prompt: string; options?: string[]; answer: string; explanation: string; difficulty: string; }

export async function generateQuestions(chapterTitle: string, summary: string, count: number, qtype: string, userId?: string): Promise<{ questions: GenQuestion[]; usage: LLMResult['usage']; model: string }> {
  const sys: ChatMessage = { role: 'system', content: 'You generate JSON quiz questions for school students. Respond ONLY with a JSON array.' };
  const user: ChatMessage = {
    role: 'user',
    content: `Create ${count} ${qtype} questions for the chapter "${chapterTitle}". Context: ${summary}. ` +
      `Each item: {"qtype":"${qtype}","prompt":"","options":["","","",""],"answer":"","explanation":"","difficulty":"beginner|intermediate|advanced"}. ` +
      `For non-mcq types omit options or use empty array.`,
  };
  const { result, cfg } = await callFeature('quiz_gen', [sys, user], { temperature: 0.7, maxTokens: 1200 });
  if (cfg.provider !== 'offline' && cfg.api_key) {
    try {
      const json = result.content.slice(result.content.indexOf('['), result.content.lastIndexOf(']') + 1);
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length) {
        if (userId) await logAiUsage(userId, 'quiz_gen', result.usage, cfg.model);
        return { questions: parsed.slice(0, count), usage: result.usage, model: cfg.model };
      }
    } catch { console.warn('[ai] generateQuestions parse failed, using template fallback'); }
  }
  return { questions: offlineQuestions(chapterTitle, count, qtype), usage: zeroUsage, model: cfg.model };
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

export async function evaluateChallenge(prompt: string, response: string, userId?: string): Promise<{ feedback: string; score: number; usage: LLMResult['usage']; model: string }> {
  const sys: ChatMessage = { role: 'system', content: 'You are a kind teacher grading a student challenge from 0-10. Respond as JSON {"score":number,"feedback":"..."}.' };
  const user: ChatMessage = { role: 'user', content: `Challenge: ${prompt}\nStudent response: ${response}\nGive encouraging, constructive feedback.` };
  const { result, cfg } = await callFeature('challenge_eval', [sys, user], { temperature: 0.4, maxTokens: 300 });
  if (cfg.provider !== 'offline' && cfg.api_key) {
    try {
      const json = JSON.parse(result.content.slice(result.content.indexOf('{'), result.content.lastIndexOf('}') + 1));
      if (userId) await logAiUsage(userId, 'challenge_eval', result.usage, cfg.model);
      return { feedback: json.feedback || 'Good effort!', score: Math.max(0, Math.min(10, json.score ?? 6)), usage: result.usage, model: cfg.model };
    } catch { /* fall through */ }
  }
  const len = response.trim().split(/\s+/).filter(Boolean).length;
  const score = Math.max(4, Math.min(10, 4 + Math.floor(len / 8)));
  return {
    feedback: `Nice attempt! You wrote ${len} words. To improve, explain your reasoning step by step and add a real example. Keep tinkering — every iteration makes you sharper!`,
    score,
    usage: zeroUsage,
    model: cfg.model,
  };
}

// ---------------- Teacher AI tools (routes through admin-configured LLM) ----------------
const TEACHER_TOOL_PROMPTS: Record<string, { sys: string; max: number }> = {
  questions: { sys: 'You generate exam-ready questions for school STEM students. Be clear and age-appropriate.', max: 900 },
  grading: { sys: 'You are an experienced STEM teacher. Grade the student answer fairly out of 10, give a short rubric-based justification and one concrete improvement tip. Be concise.', max: 400 },
  insights: { sys: 'You are a teaching-analytics assistant. From the class performance described, identify the trickiest topics, likely misconceptions and three concrete reteaching actions. Use short bullets.', max: 450 },
  rubric: { sys: 'You are a curriculum designer. Produce a clear four-level scoring rubric (Excellent / Good / Fair / Needs work) with specific criteria for the given project or assignment.', max: 520 },
  translate: { sys: 'You simplify and translate educational content for school students, keeping the meaning intact and using simple, friendly language.', max: 520 },
  analytics: { sys: 'You are a class-analytics assistant. Summarise strengths, gaps and recommended next steps from the provided class data in clear bullet points.', max: 450 },
  lesson: { sys: 'You are a master teacher. Create a concise lesson-plan outline with objectives, a warm-up, main activity, materials and an assessment for the given topic.', max: 650 },
};

export async function teacherAssist(tool: string, input: string, userId?: string): Promise<{ content: string; usage: LLMResult['usage']; model: string }> {
  const p = TEACHER_TOOL_PROMPTS[tool] || { sys: 'You are a helpful AI teaching assistant for an ATL STEM school platform.', max: 500 };
  const messages: ChatMessage[] = [{ role: 'system', content: p.sys }, { role: 'user', content: input }];
  const { result, cfg } = await callFeature('chatbot', messages, { temperature: 0.6, maxTokens: p.max });
  const offline = cfg.provider === 'offline' || !cfg.api_key || !cfg.enabled;
  const content = offline ? teacherOfflineTool(tool, input) : result.content;
  if (userId) await logAiUsage(userId, 'teacher_assist', result.usage, cfg.model);
  return { content, usage: result.usage, model: cfg.model };
}

function teacherOfflineTool(tool: string, input: string): string {
  const topic = (input || '').trim().slice(0, 80) || 'this topic';
  switch (tool) {
    case 'grading':
      return `Score: 8 / 10\n\n✅ Strengths: Clear grasp of the core idea with a relevant example.\n🔧 To improve: Add step-by-step reasoning and define the key terms used.\n➡️ Next step: Ask the student to predict one more case to test their logic.`;
    case 'insights':
      return `Trickiest topics this week\n• Sensor calibration — 38% accuracy\n• Series vs parallel circuits — 52%\n• Loop logic in code — 55%\n\nLikely misconceptions: confusing voltage with current; treating loops as a one-time step.\nReteach actions:\n1. Live breadboard demo with a multimeter.\n2. A quick 3-question exit ticket.\n3. Pair-programming on a simple loop task.`;
    case 'rubric':
      return `Rubric — ${topic}\n\n• Excellent (9-10): Fully working, well documented, creative extension beyond the brief.\n• Good (7-8): Works with minor gaps; clear documentation.\n• Fair (5-6): Partially works; basic documentation.\n• Needs work (0-4): Incomplete or non-working; little documentation.`;
    case 'translate':
      return `Simplified version of "${topic}":\n\nIn simple words — break the idea into small steps, connect it to something you see every day, then try it yourself and watch what changes.\n\nTip: check understanding with one quick question before moving on.`;
    case 'analytics':
      return `Class snapshot — ${topic}\n• Strengths: robotics builds and teamwork are strong.\n• Gaps: AI/ML basics and systematic debugging need work.\n• Next steps: daily 5-minute logic warm-ups, one guided ML mini-project, and targeted help for the lowest-scoring 20%.`;
    case 'lesson':
      return `Lesson plan — ${topic}\n\nObjective: students can explain and apply the core concept.\nWarm-up (5m): a real-life hook question.\nMain activity (25m): hands-on build / guided practice.\nMaterials: worksheet, breadboard / kit, slides.\nAssessment: 3-question exit ticket + one tinkering challenge.`;
    case 'questions':
      return `Sample questions on ${topic}:\n1. (MCQ) Which statement best describes ${topic}?\n2. (One-liner) In one line, what is the main idea of ${topic}?\n3. (Brain teaser) If you changed one variable in ${topic}, what would happen and why?\n\nOpen Courses → pick a chapter → AI Question Generator to create and save a full set.`;
    default:
      return `Here is a quick draft for "${topic}". Configure a live AI provider in Admin → AI Platform for richer, fully personalised results.`;
  }
}

