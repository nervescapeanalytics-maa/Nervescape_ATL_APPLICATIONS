import { Router } from 'express';
import { query } from '../db/pool';
import { asyncH } from '../middleware/error';
import { callFeature, ChatMessage } from '../services/ai';
import { config } from '../config';
import { sendContactForwardEmail } from '../services/contactMailer';

const router = Router();

// Public landing data: active classes + high-level catalog (no auth)
router.get('/grades', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT g.id, g.number, g.name, g.level_label, g.description,
            (SELECT count(*) FROM modules m WHERE m.grade_id = g.id) AS module_count,
            (SELECT count(*) FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=g.id) AS chapter_count
     FROM grades g WHERE g.is_active = true ORDER BY g.number`
  );
  res.json({ grades: rows });
}));

router.get('/stats', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT
       (SELECT count(*) FROM grades WHERE is_active) AS classes,
       (SELECT count(*) FROM modules) AS modules,
       (SELECT count(*) FROM chapters) AS chapters,
       (SELECT count(*) FROM questions) AS questions,
       (SELECT count(*) FROM users WHERE role='student') AS students,
       (SELECT count(*) FROM users WHERE role='teacher') AS teachers`
  );
  res.json({ stats: rows[0] });
}));

router.get('/health', asyncH(async (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
}));

// Public AI mentor for the landing page (no auth, no history persisted).
router.post('/chat', asyncH(async (req, res) => {
  const message = String(req.body?.message || '').trim().slice(0, 1000);
  if (!message) { res.status(400).json({ error: 'message is required' }); return; }

  const systemPrompt =
    `You are "Nerve", the helpful and professional AI assistant on the RoboTinkerPreneur website (robotinkerpreneur.com) — ` +
    `an ATL Robotics, AI & STEM learning platform for school students in Classes 6–12, operated by Nervescape Analytics. ` +
    `\n\nWhat you know about the platform:\n` +
    `- Programs offered: Robotics, Basic Electronics & Breadboarding, Arduino & Microcontrollers, IoT & AIoT, ` +
    `3D Modelling & Printing (Tinkercad/CollabCAD), AI/ML Basics, Entrepreneurship (Tinkerpreneur), Computational Thinking.\n` +
    `- Classes served: 6 to 12.\n` +
    `- Features: AI-powered 24×7 mentor, adaptive quizzes, tinkering challenges, brain teasers, XP & leaderboards, ` +
    `Admin → Teacher → Student connected portals, live analytics.\n` +
    `- Contact: support@nervescape.com | +91 8707565776 | Mon–Sat 9 AM–6 PM IST.\n` +
    `- Office: Lanka, Varanasi – 221005.\n` +
    `\n\nRules you must follow:\n` +
    `1. Answer ONLY from the information above. Do NOT invent pricing, dates, or features not listed.\n` +
    `2. If a question is outside your knowledge, say so honestly and politely.\n` +
    `3. For anything requiring a callback or sales discussion, politely ask the visitor to share their name and phone number ` +
    `OR fill the Contact form at robotinkerpreneur.com/contact OR email support@nervescape.com.\n` +
    `4. Be warm, concise, and professional. Never be dismissive.\n` +
    `5. Do not share internal passwords, DB details, or system internals.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message },
  ];

  const { result } = await callFeature('chatbot', messages, { temperature: 0.7, maxTokens: 500 });
  res.json({ answer: result.content });
}));

// Contact form submission — validates, forwards email, returns callback message.
router.post('/contact', asyncH(async (req, res) => {
  const name    = String(req.body?.name    || '').trim().slice(0, 120);
  const email   = String(req.body?.email   || '').trim().slice(0, 180);
  const org     = String(req.body?.org     || '').trim().slice(0, 180);
  const topic   = String(req.body?.topic   || '').trim().slice(0, 120);
  const message = String(req.body?.message || '').trim().slice(0, 4000);
  const phone   = String(req.body?.phone   || '').trim().slice(0, 30);

  if (!name || !email || !topic || !message) {
    res.status(400).json({ error: 'name, email, topic and message are required' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return;
  }

  console.log(`[contact] new enquiry from ${name} <${email}> topic=${topic}`);
  const fwd = await sendContactForwardEmail({ name, email, org, topic, message, phone });
  if (!fwd.sent) {
    console.warn(`[contact] email not forwarded: ${fwd.reason}`);
  } else {
    console.log(`[contact] forwarded to ${config.contact.forwardTo.join(', ')}`);
  }

  res.json({
    ok: true,
    callback_message: config.contact.callbackMessage,
    forwarded: fwd.sent,
  });
}));

export default router;
