// =====================================================================
//  Curriculum content model + book-quality builder
//  Each chapter is authored as a rich ChapterSpec and expanded into
//  structured educational content with: objectives, story, analogies,
//  did-you-know, activities, troubleshooting, industry scenarios,
//  mini-project, revision notes and inline quizzes.
// =====================================================================

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'callout'; variant: 'tip' | 'concept' | 'logic' | 'realworld' | 'warning' | 'curiosity' | 'objective' | 'story' | 'industry' | 'project' | 'revision'; title: string; text: string }
  | { type: 'steps'; title: string; items: string[] }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'figure'; svg: string; caption: string }
  | { type: 'image'; url: string; caption: string }
  | { type: 'code'; language: string; code: string; note?: string }
  | { type: 'example'; title: string; text: string }
  | { type: 'analogy'; concept: string; analogy: string; explanation: string }
  | { type: 'mistake'; mistake: string; why: string; fix: string }
  | { type: 'troubleshoot'; problem: string; cause: string; fix: string }
  | { type: 'activity'; title: string; duration: string; materials: string[]; steps: string[]; expected: string }
  | { type: 'miniproject'; title: string; description: string; time: string; materials: string[]; steps: string[]; expectedOutput: string; extensions?: string[] }
  | { type: 'industry'; company: string; useCase: string; impact: string }
  | { type: 'quiz'; questions: QSpec[] }
  // ── content-focused interactive blocks (AI for Everyone) ──────────
  | { type: 'media'; kind: 'audio' | 'video'; url?: string; caption: string }
  | { type: 'drawboard'; prompt: string; caption?: string; svg?: string }
  | { type: 'dynamic_quiz'; topic: string; summary: string };

export interface QSpec {
  qtype: 'mcq' | 'oneliner' | 'brain_teaser' | 'tinkering' | 'computational' | 'logical';
  prompt: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  points?: number;
}

export interface ActivitySpec {
  title: string;
  duration: string;
  materials: string[];
  steps: string[];
  expected: string;
}

export interface AnalogSpec {
  concept: string;
  analogy: string;
  explanation: string;
}

export interface MistakeSpec {
  mistake: string;
  why: string;
  fix: string;
}

export interface TroubleshootSpec {
  problem: string;
  cause: string;
  fix: string;
}

export interface IndustrySpec {
  company: string;
  useCase: string;
  impact: string;
}

export interface MiniProjectSpec {
  title: string;
  description: string;
  time: string;
  materials: string[];
  steps: string[];
  expectedOutput: string;
  extensions?: string[];
}

export interface ChapterSpec {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  est: number;
  summary: string;

  // ── SECTION 1: Curiosity & Objectives ───────────────────────────
  hook: string;                 // Real-life problem that creates curiosity
  objectives?: string[];        // SMART learning objectives (auto-derived if missing)

  // ── SECTION 2: Story & Explanation ──────────────────────────────
  story?: string;               // Explain as a narrative story (falls back to layman)
  layman: string;               // Simple terms explanation

  // ── SECTION 3: Analogies ────────────────────────────────────────
  analogies?: AnalogSpec[];     // Concept analogies for better retention

  // ── SECTION 4: Core Concept ─────────────────────────────────────
  concept: string;              // The core concept / formula

  // ── Content-focused extras (used by buildConceptBlocks) ──────────
  deeper?: string;              // Class 9-12 technical depth (auto-derived if missing)
  useCases?: string[];          // Practical, relatable use cases (auto-derived if missing)
  videoUrl?: string;            // Optional attached video for this chapter
  audioUrl?: string;            // Optional attached audio for this chapter

  // ── SECTION 5: Did You Know ─────────────────────────────────────
  didYouKnow?: string[];        // Surprising/interesting facts (supplements facts[])

  // ── SECTION 6: How It Works ─────────────────────────────────────
  howItWorks: string[];         // Step-by-step working principle

  // ── SECTION 7: Real World & Industry ────────────────────────────
  realWorld: string[];          // Real-life examples
  industryScenarios?: IndustrySpec[];  // Detailed industry use cases

  // ── SECTION 8: Hands-On Activities ──────────────────────────────
  steps?: string[];             // Simple hands-on steps (legacy)
  activities?: ActivitySpec[];  // Rich structured activities

  // ── SECTION 9: Code ──────────────────────────────────────────────
  code?: { language: string; code: string; note?: string };

  // ── SECTION 10: Common Mistakes ──────────────────────────────────
  commonMistakes?: MistakeSpec[];

  // ── SECTION 11: Troubleshooting ──────────────────────────────────
  troubleshooting?: TroubleshootSpec[];

  // ── SECTION 12: Mini Project ─────────────────────────────────────
  miniProject?: MiniProjectSpec;

  // ── SECTION 12b: Mini Challenge (quick gamified task) ────────────
  miniChallenge?: string;       // A short challenge/game to spark engagement

  // ── SECTION 13: Logic & Thinking ─────────────────────────────────
  logic: string;                // Computational/logical thinking insight

  // ── SECTION 13b: Discussion, Careers & Homework ──────────────────
  discussionQuestions?: string[];  // Open-ended questions for class debate
  careerConnections?: string[];    // How this topic links to real jobs/careers
  homework?: string[];             // Practice / take-home tasks

  // ── SECTION 14: Revision Notes ───────────────────────────────────
  revisionNotes?: string[];     // Quick bullet-point revision summary

  // ── SECTION 15: Questions ────────────────────────────────────────
  diagram: keyof typeof DIAGRAMS;
  facts: string[];              // Interesting facts for the DB
  questions: QSpec[];           // Question bank

  // ── SECTION 16: Teaching & engagement pack (optional) ────────────
  weekLabel?: string;           // e.g. "Week 1 · Session 1-2"
  sessionPlan?: string[];       // Minute-by-minute / phase lesson flow
  visualRequirements?: string[];// Posters, slides, charts to prepare/show
  videoRequirements?: string[]; // Videos to play (with intent)
  worksheet?: string[];         // Printable worksheet tasks
  assessmentRubric?: string[];  // Rubric lines: criterion → levels
  teacherNotes?: string[];      // Tips, facilitation, differentiation
  parentEngagement?: string[];  // At-home activities with family
}

export interface ModuleSpec {
  title: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  chapters: ChapterSpec[];
}

export interface GradeSpec {
  number: number;
  name: string;
  level_label: string;
  description: string;
  modules: ModuleSpec[];
}

// ---------- inline SVG diagrams ----------
export const DIAGRAMS = {
  circuit: `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="150" fill="#0b1020" rx="8"/><line x1="40" y1="40" x2="280" y2="40" stroke="#4cc9f0" stroke-width="3"/><line x1="40" y1="110" x2="280" y2="110" stroke="#4cc9f0" stroke-width="3"/><line x1="40" y1="40" x2="40" y2="110" stroke="#4cc9f0" stroke-width="3"/><rect x="60" y="30" width="22" height="20" fill="#f72585"/><text x="58" y="22" fill="#fff" font-size="11">Battery</text><circle cx="200" cy="40" r="12" fill="#ffd60a"/><text x="180" y="22" fill="#fff" font-size="11">Bulb</text><rect x="255" y="95" width="30" height="10" fill="#90e0ef"/><text x="245" y="128" fill="#fff" font-size="11">Switch</text><text x="120" y="135" fill="#8d99ae" font-size="10">Current flows in a closed loop</text></svg>`,
  series_parallel: `<svg viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="160" fill="#0b1020" rx="8"/><text x="10" y="20" fill="#4cc9f0" font-size="12">SERIES</text><line x1="20" y1="40" x2="150" y2="40" stroke="#90e0ef" stroke-width="2"/><circle cx="60" cy="40" r="8" fill="#ffd60a"/><circle cx="110" cy="40" r="8" fill="#ffd60a"/><text x="180" y="20" fill="#f72585" font-size="12">PARALLEL</text><line x1="190" y1="40" x2="320" y2="40" stroke="#90e0ef" stroke-width="2"/><line x1="190" y1="80" x2="320" y2="80" stroke="#90e0ef" stroke-width="2"/><line x1="190" y1="40" x2="190" y2="80" stroke="#90e0ef" stroke-width="2"/><line x1="320" y1="40" x2="320" y2="80" stroke="#90e0ef" stroke-width="2"/><circle cx="255" cy="40" r="8" fill="#ffd60a"/><circle cx="255" cy="80" r="8" fill="#ffd60a"/><text x="20" y="120" fill="#8d99ae" font-size="10">Series: one path. Parallel: many paths.</text></svg>`,
  flow: `<svg viewBox="0 0 340 120" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="120" fill="#0b1020" rx="8"/><rect x="15" y="40" width="80" height="40" rx="6" fill="#4361ee"/><text x="30" y="64" fill="#fff" font-size="12">INPUT</text><rect x="130" y="40" width="80" height="40" rx="6" fill="#7209b7"/><text x="142" y="64" fill="#fff" font-size="12">PROCESS</text><rect x="245" y="40" width="80" height="40" rx="6" fill="#f72585"/><text x="258" y="64" fill="#fff" font-size="12">OUTPUT</text><line x1="95" y1="60" x2="130" y2="60" stroke="#90e0ef" stroke-width="3" marker-end="url(#a)"/><line x1="210" y1="60" x2="245" y2="60" stroke="#90e0ef" stroke-width="3"/><defs><marker id="a" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#90e0ef"/></marker></defs></svg>`,
  sensor: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="140" fill="#0b1020" rx="8"/><circle cx="60" cy="70" r="28" fill="#ffd60a" opacity="0.9"/><text x="40" y="74" fill="#000" font-size="11">Light</text><rect x="130" y="50" width="60" height="40" rx="6" fill="#06d6a0"/><text x="138" y="74" fill="#000" font-size="11">Sensor</text><rect x="230" y="50" width="70" height="40" rx="6" fill="#ef476f"/><text x="240" y="74" fill="#fff" font-size="11">Action</text><line x1="90" y1="70" x2="130" y2="70" stroke="#90e0ef" stroke-width="3"/><line x1="190" y1="70" x2="230" y2="70" stroke="#90e0ef" stroke-width="3"/><text x="60" y="125" fill="#8d99ae" font-size="10">Sense -> Decide -> Act</text></svg>`,
  gear: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="140" fill="#0b1020" rx="8"/><circle cx="110" cy="70" r="40" fill="none" stroke="#4cc9f0" stroke-width="6" stroke-dasharray="6 6"/><circle cx="200" cy="70" r="28" fill="none" stroke="#f72585" stroke-width="6" stroke-dasharray="5 5"/><text x="70" y="74" fill="#fff" font-size="11">Big gear</text><text x="175" y="74" fill="#fff" font-size="10">Small</text><text x="50" y="128" fill="#8d99ae" font-size="10">Mechanical advantage: force vs speed trade-off</text></svg>`,
  cube3d: `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="150" fill="#0b1020" rx="8"/><polygon points="120,40 200,40 230,70 150,70" fill="#4361ee"/><polygon points="120,40 150,70 150,130 120,100" fill="#3a0ca3"/><polygon points="150,70 230,70 230,130 150,130" fill="#7209b7"/><text x="60" y="145" fill="#8d99ae" font-size="10">3D model = length x breadth x height, printed layer by layer</text></svg>`,
  chart: `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="150" fill="#0b1020" rx="8"/><line x1="40" y1="20" x2="40" y2="120" stroke="#90e0ef" stroke-width="2"/><line x1="40" y1="120" x2="300" y2="120" stroke="#90e0ef" stroke-width="2"/><rect x="60" y="70" width="30" height="50" fill="#4cc9f0"/><rect x="110" y="40" width="30" height="80" fill="#f72585"/><rect x="160" y="85" width="30" height="35" fill="#06d6a0"/><rect x="210" y="55" width="30" height="65" fill="#ffd60a"/><text x="70" y="140" fill="#8d99ae" font-size="10">Data turned into a picture tells a story fast</text></svg>`,
  design_thinking: `<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="120" fill="#0b1020" rx="8"/>${['Empathize','Define','Ideate','Prototype','Test'].map((s,i)=>`<circle cx="${40+i*70}" cy="55" r="22" fill="${['#4361ee','#7209b7','#f72585','#06d6a0','#ffd60a'][i]}"/><text x="${20+i*70}" y="95" fill="#fff" font-size="9">${s}</text>`).join('')}<line x1="62" y1="55" x2="88" y2="55" stroke="#90e0ef" stroke-width="2"/><line x1="132" y1="55" x2="158" y2="55" stroke="#90e0ef" stroke-width="2"/><line x1="202" y1="55" x2="228" y2="55" stroke="#90e0ef" stroke-width="2"/><line x1="272" y1="55" x2="298" y2="55" stroke="#90e0ef" stroke-width="2"/></svg>`,
  arduino: `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="150" fill="#0b1020" rx="8"/><rect x="90" y="40" width="140" height="70" rx="8" fill="#0aa1a1"/><text x="120" y="80" fill="#fff" font-size="12">ARDUINO UNO</text>${Array.from({length:7}).map((_,i)=>`<rect x="${100+i*18}" y="34" width="8" height="8" fill="#ffd60a"/>`).join('')}${Array.from({length:7}).map((_,i)=>`<rect x="${100+i*18}" y="110" width="8" height="8" fill="#ffd60a"/>`).join('')}<text x="70" y="140" fill="#8d99ae" font-size="10">A tiny programmable brain for your projects</text></svg>`,
  iot: `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="150" fill="#0b1020" rx="8"/><rect x="20" y="55" width="60" height="40" rx="6" fill="#06d6a0"/><text x="28" y="80" fill="#000" font-size="10">Device</text><circle cx="170" cy="75" r="26" fill="#4361ee"/><text x="150" y="79" fill="#fff" font-size="10">Cloud</text><rect x="260" y="55" width="60" height="40" rx="6" fill="#f72585"/><text x="270" y="80" fill="#fff" font-size="10">Phone</text><line x1="80" y1="75" x2="144" y2="75" stroke="#90e0ef" stroke-width="2" stroke-dasharray="4 4"/><line x1="196" y1="75" x2="260" y2="75" stroke="#90e0ef" stroke-width="2" stroke-dasharray="4 4"/><text x="60" y="135" fill="#8d99ae" font-size="10">Things talk to each other over the internet</text></svg>`,
  ohm: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="140" fill="#0b1020" rx="8"/><text x="110" y="60" fill="#ffd60a" font-size="28">V = I × R</text><text x="40" y="95" fill="#4cc9f0" font-size="12">V=Voltage</text><text x="140" y="95" fill="#06d6a0" font-size="12">I=Current</text><text x="240" y="95" fill="#f72585" font-size="12">R=Resistance</text><text x="60" y="125" fill="#8d99ae" font-size="10">Ohm's Law links voltage, current and resistance</text></svg>`,
  wood: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="140" fill="#0b1020" rx="8"/><rect x="60" y="50" width="200" height="20" fill="#8d5524"/><rect x="60" y="74" width="200" height="14" fill="#a06a35"/><rect x="60" y="92" width="200" height="14" fill="#c68642"/><text x="70" y="130" fill="#8d99ae" font-size="10">Measure twice, cut once - safe woodworking</text></svg>`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Auto-derivation helpers
// ─────────────────────────────────────────────────────────────────────────────
function autoObjectives(spec: ChapterSpec): string[] {
  return [
    `Explain "${spec.title}" in your own words using simple analogies`,
    `Understand the core principle: ${spec.concept.split('.')[0].trim()}`,
    `Identify at least 3 real-world applications of ${spec.title}`,
    `Build or program a working example demonstrating ${spec.title}`,
    `Troubleshoot common problems related to ${spec.title}`,
  ];
}

function autoRevisionNotes(spec: ChapterSpec): string[] {
  const notes: string[] = [
    `Core concept: ${spec.concept}`,
    ...spec.howItWorks.slice(0, 3).map((s, i) => `Step ${i + 1}: ${s}`),
    `Real-world use: ${spec.realWorld[0] || 'Used widely in industry'}`,
  ];
  if (spec.code) notes.push(`Key code pattern: See code block — use ${spec.code.language} for implementation`);
  return notes;
}

function autoActivities(spec: ChapterSpec): ActivitySpec[] {
  if (spec.steps && spec.steps.length > 0) {
    return [{
      title: `Build: ${spec.title}`,
      duration: `${Math.round(spec.est * 0.4)} minutes`,
      materials: ['Components as specified in the chapter', 'Arduino Uno / ESP32', 'USB cable', 'Laptop with Arduino IDE', 'Breadboard and jumper wires'],
      steps: spec.steps,
      expected: `A working demonstration of ${spec.title} confirming the concept from this chapter.`,
    }];
  }
  return [{
    title: `Experiment: ${spec.title}`,
    duration: `${Math.round(spec.est * 0.3)} minutes`,
    materials: ['Notebook', 'Pen', 'Relevant components'],
    steps: spec.howItWorks.slice(0, 5),
    expected: `Understand and verify the behaviour of ${spec.title} through direct observation.`,
  }];
}

function autoCommonMistakes(spec: ChapterSpec): MistakeSpec[] {
  return [
    {
      mistake: `Skipping the layman understanding and jumping straight to the formula`,
      why: `Without intuition, formulas are meaningless — you cannot apply them to new problems`,
      fix: `Always read the analogy section first, then re-read the concept section`,
    },
    {
      mistake: `Not testing with actual hardware or code`,
      why: `${spec.title} concepts only become solid with hands-on verification`,
      fix: `Complete the activity section and observe real behaviour before moving on`,
    },
    {
      mistake: `Memorising steps without understanding why each step is needed`,
      why: `Steps without reasoning cannot be adapted when something goes wrong`,
      fix: `For each step in "How It Works", ask yourself: what would break if I skipped this step?`,
    },
  ];
}

function autoTroubleshooting(spec: ChapterSpec): TroubleshootSpec[] {
  return [
    {
      problem: `The circuit/code does not work at all`,
      cause: `Missing connection, reversed polarity, or wrong pin number in code`,
      fix: `Check every wire connection against the diagram. Verify power LED on board is on. Check Serial Monitor for error messages.`,
    },
    {
      problem: `Partial or intermittent behaviour`,
      cause: `Loose breadboard connections, low battery, or missing delay() in code`,
      fix: `Press each wire firmly into breadboard. Replace battery. Add delay(100) after sensor read.`,
    },
    {
      problem: `Unexpected values or strange readings`,
      cause: `Floating input pin, ground connection missing, or interference from nearby components`,
      fix: `Add pull-up/pull-down resistor to input pin. Ensure all GNDs are connected to same ground rail.`,
    },
  ];
}

function autoIndustry(spec: ChapterSpec): IndustrySpec[] {
  return spec.realWorld.slice(0, 3).map((rw, i) => ({
    company: ['Tesla', 'ISRO', 'Bosch', 'Samsung', 'Google', 'Tata Motors'][i % 6],
    useCase: rw,
    impact: `This application saves millions of dollars and improves reliability at industrial scale`,
  }));
}

function autoMiniProject(spec: ChapterSpec): MiniProjectSpec {
  return {
    title: `Mini-Project: ${spec.title} in Action`,
    description: `Apply everything you learned about ${spec.title} in a complete, working mini-project that demonstrates the core concept in a meaningful real-world context.`,
    time: `${spec.est} minutes`,
    materials: ['Arduino Uno or ESP32', 'Breadboard', 'Jumper wires', 'USB cable', 'Relevant sensors/components from this chapter', 'Laptop with Arduino IDE or Thonny'],
    steps: [
      `Review the concept and draw your circuit on paper first`,
      `Gather all components and verify them with a multimeter if needed`,
      `Build the circuit on breadboard following the diagram`,
      `Write the code step-by-step, testing each function independently`,
      `Combine all code sections and run the complete program`,
      `Measure and record results — compare with expected behaviour`,
      `Try at least one modification: change a value, add a sensor, or add an LED indicator`,
      `Document: take a photo, note what worked, what didn't, and what you learned`,
    ],
    expectedOutput: `A working ${spec.title} demonstration with measurable, observable output that you can explain to a classmate.`,
    extensions: [
      `Add a display (LCD/OLED) to show live readings`,
      `Log data to Serial Monitor and export to Excel for graph analysis`,
      `Add a mobile control interface using Bluetooth or WiFi`,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BUILDER — produces book-quality content blocks from ChapterSpec
// ─────────────────────────────────────────────────────────────────────────────
export function buildBlocks(spec: ChapterSpec): Block[] {
  const b: Block[] = [];

  // ── 1. REAL-LIFE PROBLEM (Curiosity Hook) ────────────────────────
  b.push({ type: 'heading', level: 1, text: spec.title });
  b.push({
    type: 'callout', variant: 'curiosity',
    title: '🌍 Real-Life Problem — Why Does This Topic Exist?',
    text: spec.hook,
  });

  // ── 2. LEARNING OBJECTIVES ───────────────────────────────────────
  const objectives = spec.objectives ?? autoObjectives(spec);
  b.push({ type: 'heading', level: 2, text: '🎯 What You Will Learn' });
  b.push({
    type: 'callout', variant: 'objective',
    title: 'Learning Objectives',
    text: 'After completing this chapter, you will be able to:',
  });
  b.push({ type: 'list', title: '', items: objectives });

  // ── 2b. SESSION PLAN (optional, for teacher-led courses) ─────────
  if (spec.sessionPlan && spec.sessionPlan.length > 0) {
    b.push({ type: 'heading', level: 2, text: '🗓️ Session Plan' });
    if (spec.weekLabel) b.push({ type: 'callout', variant: 'tip', title: spec.weekLabel, text: 'Suggested flow for this week — adjust timing to your class.' });
    b.push({ type: 'steps', title: 'Lesson flow', items: spec.sessionPlan });
  }

  // ── 3. EXPLAIN LIKE A STORY ──────────────────────────────────────
  b.push({ type: 'heading', level: 2, text: '📖 The Story — Understand Before You Memorise' });
  b.push({ type: 'callout', variant: 'story', title: 'Let me tell you a story…', text: spec.story ?? spec.layman });
  b.push({ type: 'paragraph', text: spec.layman });

  // ── 4. VISUAL DIAGRAM ────────────────────────────────────────────
  b.push({ type: 'heading', level: 2, text: '🖼️ Visual Diagram' });
  b.push({ type: 'figure', svg: DIAGRAMS[spec.diagram], caption: `Visual: ${spec.title} — Study this diagram carefully before reading on.` });

  // ── 5. ANALOGY CORNER ────────────────────────────────────────────
  if (spec.analogies && spec.analogies.length > 0) {
    b.push({ type: 'heading', level: 2, text: '💡 Analogy Corner — Concepts Made Easy' });
    for (const a of spec.analogies) {
      b.push({ type: 'analogy', concept: a.concept, analogy: a.analogy, explanation: a.explanation });
    }
  }

  // ── 6. CORE CONCEPT ─────────────────────────────────────────────
  b.push({ type: 'heading', level: 2, text: '📐 Core Concept' });
  b.push({ type: 'callout', variant: 'concept', title: 'The Science Behind It', text: spec.concept });

  // Inline check question after concept
  b.push({
    type: 'quiz',
    questions: [{
      qtype: 'brain_teaser',
      prompt: `Quick Check: In your own words, explain the core concept of "${spec.title}" in one sentence.`,
      answer: spec.concept.split('.')[0],
      difficulty: spec.difficulty,
    }],
  });

  // ── 7. DID YOU KNOW ─────────────────────────────────────────────
  const didYouKnow = spec.didYouKnow ?? spec.facts.slice(0, 3);
  if (didYouKnow.length > 0) {
    b.push({ type: 'heading', level: 2, text: '🤔 Did You Know?' });
    b.push({ type: 'list', title: 'Surprising facts about this topic:', items: didYouKnow });
  }

  // ── 8. HOW IT WORKS (Step-by-Step) ──────────────────────────────
  b.push({ type: 'heading', level: 2, text: '⚙️ How It Works — Step by Step' });
  b.push({ type: 'steps', title: 'Working Principle', items: spec.howItWorks });

  // Inline check question after how-it-works
  b.push({
    type: 'quiz',
    questions: [{
      qtype: 'logical',
      prompt: `If you had to remove one step from the "How It Works" sequence, which step would cause the MOST damage and why?`,
      answer: spec.howItWorks[0],
      difficulty: spec.difficulty,
    }],
  });

  // ── 9. REAL WORLD & INDUSTRY SCENARIOS ──────────────────────────
  b.push({ type: 'heading', level: 2, text: '🏭 Real World — You See This Every Day' });
  b.push({ type: 'list', title: 'Applications around you:', items: spec.realWorld });

  const industries = spec.industryScenarios ?? autoIndustry(spec);
  if (industries.length > 0) {
    b.push({ type: 'heading', level: 3, text: '🏢 Real Industry Scenarios' });
    for (const ind of industries) {
      b.push({ type: 'industry', company: ind.company, useCase: ind.useCase, impact: ind.impact });
    }
  }

  // ── 10. HANDS-ON ACTIVITY ────────────────────────────────────────
  const activities = spec.activities ?? autoActivities(spec);
  b.push({ type: 'heading', level: 2, text: '🔧 Hands-On Activity — Learn by Doing' });
  for (const act of activities) {
    b.push({ type: 'activity', ...act });
  }

  // ── 10b. MINI CHALLENGE (quick gamified task) ────────────────────
  if (spec.miniChallenge) {
    b.push({ type: 'heading', level: 3, text: '🎯 Mini Challenge' });
    b.push({ type: 'callout', variant: 'project', title: '⚡ Beat the Clock', text: spec.miniChallenge });
  }

  // ── 11. CODE ─────────────────────────────────────────────────────
  if (spec.code) {
    b.push({ type: 'heading', level: 2, text: '💻 Code It Yourself' });
    if (spec.code.note) b.push({ type: 'paragraph', text: spec.code.note });
    b.push({ type: 'code', language: spec.code.language, code: spec.code.code });

    // Inline code challenge
    b.push({
      type: 'quiz',
      questions: [{
        qtype: 'tinkering',
        prompt: `Code Challenge: Modify the code above to add one new feature. What feature did you add and why?`,
        difficulty: spec.difficulty,
      }],
    });
  }

  // ── 12. COMMON MISTAKES ──────────────────────────────────────────
  const mistakes = spec.commonMistakes ?? autoCommonMistakes(spec);
  b.push({ type: 'heading', level: 2, text: '⚠️ Common Mistakes — Learn from Others' });
  b.push({ type: 'paragraph', text: 'These are the mistakes that 90% of students make. Read carefully — each one wastes hours!' });
  for (const m of mistakes) {
    b.push({ type: 'mistake', ...m });
  }

  // ── 13. TROUBLESHOOTING ──────────────────────────────────────────
  const troubleshooting = spec.troubleshooting ?? autoTroubleshooting(spec);
  b.push({ type: 'heading', level: 2, text: '🔍 Troubleshooting Guide — When Things Go Wrong' });
  b.push({ type: 'paragraph', text: 'Most textbooks ignore this section. In real life, things break. Here is how to diagnose and fix the most common problems:' });
  for (const ts of troubleshooting) {
    b.push({ type: 'troubleshoot', ...ts });
  }

  // ── 14. MINI PROJECT ─────────────────────────────────────────────
  const project = spec.miniProject ?? autoMiniProject(spec);
  b.push({ type: 'heading', level: 2, text: '🚀 Mini Project — Apply Everything' });
  b.push({ type: 'miniproject', ...project });

  // ── 15. THINK LIKE AN ENGINEER ───────────────────────────────────
  b.push({ type: 'heading', level: 2, text: '🧠 Think Like an Engineer' });
  b.push({ type: 'callout', variant: 'logic', title: 'Computational & Logical Thinking', text: spec.logic });

  // ── 15b. DISCUSSION QUESTIONS ────────────────────────────────────
  if (spec.discussionQuestions && spec.discussionQuestions.length > 0) {
    b.push({ type: 'heading', level: 2, text: '💬 Talk About It — Discussion Questions' });
    b.push({ type: 'callout', variant: 'tip', title: 'No wrong answers here!', text: 'Discuss these in pairs or as a class. Listen to other ideas — that is how great thinkers grow.' });
    b.push({ type: 'list', title: '', items: spec.discussionQuestions });
  }

  // ── 15c. CAREER CONNECTIONS ──────────────────────────────────────
  if (spec.careerConnections && spec.careerConnections.length > 0) {
    b.push({ type: 'heading', level: 2, text: '💼 Career Connections — Jobs That Use This' });
    b.push({ type: 'list', title: 'People who use this every day:', items: spec.careerConnections });
  }

  // ── 15d. HOMEWORK / PRACTICE ─────────────────────────────────────
  if (spec.homework && spec.homework.length > 0) {
    b.push({ type: 'heading', level: 2, text: '🏠 Homework & Practice Tasks' });
    b.push({ type: 'callout', variant: 'project', title: 'Keep the spark alive', text: 'Try these at home. Bring back what you discover to share next class!' });
    b.push({ type: 'list', title: '', items: spec.homework });
  }

  // ── 16. QUICK REVISION NOTES ─────────────────────────────────────
  const revision = spec.revisionNotes ?? autoRevisionNotes(spec);
  b.push({ type: 'heading', level: 2, text: '📝 Quick Revision Notes' });
  b.push({ type: 'callout', variant: 'revision', title: '⚡ Key Points to Remember', text: '' });
  b.push({ type: 'list', title: '', items: revision });

  // ── 16b. CLASSROOM MEDIA & RESOURCES (optional) ──────────────────
  if (spec.visualRequirements && spec.visualRequirements.length > 0) {
    b.push({ type: 'heading', level: 2, text: '🎨 Visual Requirements' });
    b.push({ type: 'list', title: 'Prepare / display these visuals:', items: spec.visualRequirements });
  }
  if (spec.videoRequirements && spec.videoRequirements.length > 0) {
    b.push({ type: 'heading', level: 2, text: '🎬 Video Requirements' });
    b.push({ type: 'list', title: 'Show these videos (with purpose):', items: spec.videoRequirements });
  }
  if (spec.worksheet && spec.worksheet.length > 0) {
    b.push({ type: 'heading', level: 2, text: '📄 Worksheet' });
    b.push({ type: 'callout', variant: 'project', title: 'Printable worksheet', text: 'Students complete these tasks individually or in pairs.' });
    b.push({ type: 'list', title: '', items: spec.worksheet });
  }
  if (spec.assessmentRubric && spec.assessmentRubric.length > 0) {
    b.push({ type: 'heading', level: 2, text: '✅ Assessment Rubric' });
    b.push({ type: 'list', title: 'How this week is evaluated:', items: spec.assessmentRubric });
  }
  if (spec.teacherNotes && spec.teacherNotes.length > 0) {
    b.push({ type: 'heading', level: 2, text: '👩‍🏫 Teacher Notes' });
    b.push({ type: 'callout', variant: 'tip', title: 'Facilitation & differentiation', text: '' });
    b.push({ type: 'list', title: '', items: spec.teacherNotes });
  }
  if (spec.parentEngagement && spec.parentEngagement.length > 0) {
    b.push({ type: 'heading', level: 2, text: '👨‍👩‍👧 Parent Engagement' });
    b.push({ type: 'callout', variant: 'realworld', title: 'Learn together at home', text: '' });
    b.push({ type: 'list', title: '', items: spec.parentEngagement });
  }

  // ── 17. CHAPTER QUIZ ─────────────────────────────────────────────
  b.push({ type: 'heading', level: 2, text: '❓ Chapter Quiz — Test Your Knowledge' });
  b.push({
    type: 'callout', variant: 'tip',
    title: '🏆 Challenge Yourself',
    text: 'Answer every question below. For MCQs, think through WHY each wrong answer is wrong — not just which one is right. That is what separates good students from great ones.',
  });
  b.push({ type: 'quiz', questions: spec.questions });

  // Final fun facts
  if (spec.facts.length > 0) {
    b.push({ type: 'heading', level: 3, text: '✨ Amazing Facts About This Topic' });
    b.push({ type: 'list', title: '', items: spec.facts });
  }

  return b;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT-FOCUSED BUILDER — deep explanations, visuals, media & live quiz.
// Used by the standalone "AI for Everyone" course. Deliberately drops the
// generic template scaffolding (objectives, story heading, analogy corner,
// did-you-know, hands-on activity, mini challenge, think-like-an-engineer,
// discussion, careers, mini project, rubric, teacher notes, parent engagement)
// and instead leads with real content for Class 4-8, plus a deeper layer for
// Class 9-12, visuals, audio/video placeholders, a draw-it-yourself board and
// an API-driven dynamic quiz.
// ─────────────────────────────────────────────────────────────────────────────
function deriveUseCases(spec: ChapterSpec): string[] {
  if (spec.industryScenarios && spec.industryScenarios.length > 0) {
    return spec.industryScenarios.map((s) => `${s.company} — ${s.useCase}`);
  }
  return spec.realWorld.slice(0, 5).map((r) => r);
}

function deriveDeeper(spec: ChapterSpec): string {
  const mech = spec.howItWorks && spec.howItWorks.length
    ? ` Step by step, under the hood: ${spec.howItWorks.join(' → ')}.`
    : '';
  const ind = spec.industryScenarios && spec.industryScenarios.length
    ? ` In the real industry, ${spec.industryScenarios[0].company} applies this: ${spec.industryScenarios[0].useCase} (${spec.industryScenarios[0].impact}).`
    : '';
  const logic = spec.logic ? ` The thinking pattern behind it: ${spec.logic}` : '';
  return `${spec.concept}${mech}${ind}${logic}`;
}

export function buildConceptBlocks(spec: ChapterSpec): Block[] {
  const b: Block[] = [];

  // 1) Title + an engaging, story-led introduction (flowing prose, no label)
  b.push({ type: 'heading', level: 1, text: spec.title });
  const intro = [spec.hook, spec.story ?? ''].filter(Boolean).join(' ');
  if (intro) b.push({ type: 'paragraph', text: intro });

  // 2) The core explanation in simple, Class 4-8 friendly language
  b.push({ type: 'heading', level: 2, text: 'Understanding it simply' });
  b.push({ type: 'paragraph', text: spec.layman });
  if (spec.howItWorks && spec.howItWorks.length > 0) {
    b.push({ type: 'paragraph', text: `Here is the idea broken into a simple chain: ${spec.howItWorks.join(' → ')}.` });
  }

  // 3) A primary visual (diagram / flowchart / infographic)
  b.push({ type: 'figure', svg: DIAGRAMS[spec.diagram], caption: `A visual overview of ${spec.title}.` });

  // 4) Analogies woven in as content (only where authored)
  for (const a of spec.analogies ?? []) {
    b.push({ type: 'analogy', concept: a.concept, analogy: a.analogy, explanation: a.explanation });
  }

  // 5) Everyday, real-life examples
  if (spec.realWorld.length > 0) {
    b.push({ type: 'heading', level: 2, text: 'Real-life examples you already know' });
    b.push({ type: 'list', items: spec.realWorld });
  }

  // 6) Practical use cases students can relate to
  const useCases = spec.useCases ?? deriveUseCases(spec);
  if (useCases.length > 0) {
    b.push({ type: 'heading', level: 2, text: 'Where it is actually used' });
    b.push({ type: 'list', items: useCases });
  }

  // 7) Optional code (coding / project lessons)
  if (spec.code) {
    b.push({ type: 'heading', level: 2, text: 'Try it in code' });
    if (spec.code.note) b.push({ type: 'paragraph', text: spec.code.note });
    b.push({ type: 'code', language: spec.code.language, code: spec.code.code });
  }

  // 8) Going deeper — technical depth for Class 9 to 12
  const deeper = spec.deeper ?? deriveDeeper(spec);
  b.push({ type: 'heading', level: 2, text: '🎓 Going Deeper — for Class 9 to 12' });
  b.push({ type: 'callout', variant: 'concept', title: 'The technical view', text: deeper });

  // 9) Media: audio + video (real player if a URL is attached, else a placeholder)
  b.push({ type: 'heading', level: 2, text: 'Watch & listen' });
  b.push({ type: 'media', kind: 'video', url: spec.videoUrl, caption: `Video explainer for ${spec.title}.` });
  b.push({ type: 'media', kind: 'audio', url: spec.audioUrl, caption: `Audio recap of ${spec.title}.` });

  // 10) Interactive: draw-it-yourself board (Paint-like studio)
  b.push({
    type: 'drawboard',
    prompt: `Draw your own picture of "${spec.title}". Sketch how it works in your own way!`,
    caption: 'Open the drawing studio and explain the idea visually.',
    svg: DIAGRAMS[spec.diagram],
  });

  // 11) Dynamic, API-generated quiz (unlimited, level-adaptive)
  b.push({ type: 'dynamic_quiz', topic: spec.title, summary: spec.summary || spec.layman.slice(0, 200) });

  return b;
}
