// =====================================================================
//  Curriculum content model + builder
//  Each chapter is authored as a compact ChapterSpec and expanded into
//  rich, structured content blocks (beginner -> advanced) with real-world
//  examples, diagrams, facts, and AI-ready question banks.
// =====================================================================

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'callout'; variant: 'tip' | 'concept' | 'logic' | 'realworld' | 'warning' | 'curiosity'; title: string; text: string }
  | { type: 'steps'; title: string; items: string[] }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'figure'; svg: string; caption: string }
  | { type: 'image'; url: string; caption: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'example'; title: string; text: string };

export interface QSpec {
  qtype: 'mcq' | 'oneliner' | 'brain_teaser' | 'tinkering' | 'computational' | 'logical';
  prompt: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  points?: number;
}

export interface ChapterSpec {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  est: number;
  summary: string;
  hook: string;                 // curiosity hook
  layman: string;               // explanation in simple terms
  concept: string;              // the core concept
  howItWorks: string[];         // step-by-step working
  realWorld: string[];          // real-life examples
  logic: string;                // computational/logical thinking insight
  steps?: string[];             // hands-on build steps
  code?: { language: string; code: string; note?: string };
  diagram: keyof typeof DIAGRAMS;
  facts: string[];
  questions: QSpec[];
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

// ---------- reusable inline SVG diagrams (render offline, no external deps) ----------
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
  wood: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="140" fill="#0b1020" rx="8"/><rect x="60" y="50" width="200" height="20" fill="#8d5524"/><rect x="60" y="74" width="200" height="20" fill="#a06a35"/><rect x="60" y="98" width="200" height="14" fill="#c68642"/><text x="70" y="130" fill="#8d99ae" font-size="10">Measure twice, cut once - safe woodworking</text></svg>`,
};

// ---------- expand a ChapterSpec into rich content blocks ----------
export function buildBlocks(spec: ChapterSpec): Block[] {
  const b: Block[] = [];
  b.push({ type: 'callout', variant: 'curiosity', title: 'Spark your curiosity', text: spec.hook });
  b.push({ type: 'heading', level: 2, text: 'In simple words (Layman terms)' });
  b.push({ type: 'paragraph', text: spec.layman });
  b.push({ type: 'figure', svg: DIAGRAMS[spec.diagram], caption: `Diagram: ${spec.title}` });
  b.push({ type: 'heading', level: 2, text: 'The core concept' });
  b.push({ type: 'callout', variant: 'concept', title: 'Concept', text: spec.concept });
  b.push({ type: 'heading', level: 2, text: 'How it works (step by step)' });
  b.push({ type: 'steps', title: 'Working principle', items: spec.howItWorks });
  b.push({ type: 'heading', level: 2, text: 'Real-world examples' });
  b.push({ type: 'list', title: 'You already see this around you', items: spec.realWorld });
  if (spec.steps && spec.steps.length) {
    b.push({ type: 'heading', level: 2, text: 'Build it yourself (Hands-on)' });
    b.push({ type: 'steps', title: 'Activity steps', items: spec.steps });
  }
  if (spec.code) {
    b.push({ type: 'heading', level: 2, text: 'Code it' });
    if (spec.code.note) b.push({ type: 'paragraph', text: spec.code.note });
    b.push({ type: 'code', language: spec.code.language, code: spec.code.code });
  }
  b.push({ type: 'heading', level: 2, text: 'Concept & Logic (Think like an engineer)' });
  b.push({ type: 'callout', variant: 'logic', title: 'Computational & logical thinking', text: spec.logic });
  b.push({ type: 'callout', variant: 'tip', title: 'Become the GOAT', text: 'Finish the quiz, crack the brain teaser, and complete the tinkering challenge for this chapter to truly master it. Every iteration makes you sharper!' });
  return b;
}
