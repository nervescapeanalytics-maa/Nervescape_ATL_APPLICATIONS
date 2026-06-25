// =====================================================================
//  AI FOR EVERYONE — a standalone, age-agnostic AI course
//  ---------------------------------------------------------------------
//  A single self-contained course (separate from the grade-banded
//  "Artificial Intelligence" track) designed to make AI exciting for
//  ANY learner — kids, teens, parents and curious beginners.
//
//  Philosophy: Disney storytelling + Minecraft creativity +
//  YouTube engagement + real, hands-on AI skills.
//
//  Every lesson follows the same engaging flow:
//    Hook (2m) → Story (5m) → Concept (10m) → Real-Life Examples (5m)
//    → Activity (10m) → Quiz (5m) → Project (15m) → Reflection (3m)
//
//  Each lesson is authored as a rich ChapterSpec and expanded by
//  buildBlocks() into the full structured lesson the app renders,
//  including: objectives, story, analogies, did-you-know, how-it-works,
//  real-world + industry, activity, mini challenge, mini project,
//  discussion questions, career connections, common mistakes, quiz,
//  homework, worksheet, assessment rubric, teacher notes & parent pack.
// =====================================================================
import {
  AnalogSpec, ChapterSpec, DIAGRAMS, IndustrySpec, MiniProjectSpec,
  ModuleSpec, QSpec,
} from './curriculum';

// ---------------------------------------------------------------------
// Shared teacher-pack helpers (keep each lesson focused on real content)
// ---------------------------------------------------------------------

/** The signature 55-minute lesson flow requested for every lesson. */
function flowPlan(title: string): string[] {
  return [
    `Hook (2 min): Spark curiosity with the real-life problem for "${title}".`,
    'Story (5 min): Tell the story so students FEEL the idea before the words.',
    'Concept (10 min): Explain the core idea with the analogies and "how it works" steps.',
    'Real-Life Examples (5 min): Show the 5 everyday examples — ask students for more.',
    'Activity (10 min): Run the hands-on activity in pairs/teams.',
    'Quiz (5 min): Play the quiz as a fast game — discuss WHY each answer is right.',
    'Project (15 min): Start the mini project; finish/extend at home if needed.',
    'Reflection (3 min): Exit ticket — "One thing I learned / one thing I wonder".',
  ];
}

function rubric(skill: string): string[] {
  return [
    `Understanding of "${skill}" — Beginning: recalls with help · Proficient: explains in own words · Advanced: explains AND gives a fresh real-life example.`,
    'Participation — Beginning: watches · Proficient: joins the activity · Advanced: leads/helps teammates.',
    'Hands-on task — Beginning: incomplete · Proficient: working result · Advanced: working result + a creative twist.',
    'Communication — Beginning: one-word answers · Proficient: clear explanation · Advanced: confident demo or presentation.',
    'AI mindset (curiosity + ethics) — Beginning: follows steps · Proficient: asks "why" · Advanced: questions fairness/impact of the AI.',
  ];
}

function parentPack(topic: string): string[] {
  return [
    `Dinner-table talk: ask "Where did you spot ${topic} today?" and share one example of your own.`,
    'Praise the thinking, not just the answer — ask "How did you figure that out?"',
    'Screen-time swap: turn 15 minutes of watching into 15 minutes of making/observing AI.',
  ];
}

// ---------------------------------------------------------------------
// Compact lesson input — only the UNIQUE, content-rich fields per topic.
// `lesson()` assembles a complete ChapterSpec with the full teacher pack.
// ---------------------------------------------------------------------
interface LessonInput {
  title: string;
  module: string;
  difficulty?: ChapterSpec['difficulty'];
  summary: string;
  hook: string;
  story: string;
  layman: string;
  concept: string;
  analogies: AnalogSpec[];
  howItWorks: string[];
  realWorld: string[];            // 5+ real-life examples
  facts: string[];                // 3+ interesting facts
  didYouKnow?: string[];
  activity: { title: string; duration?: string; materials: string[]; steps: string[]; expected: string };
  miniChallenge: string;
  project: { title: string; description: string; time?: string; materials: string[]; steps: string[]; expectedOutput: string; extensions?: string[] };
  logic: string;
  discussion: string[];
  careers: string[];
  homework: string[];
  questions: QSpec[];
  diagram?: keyof typeof DIAGRAMS;
  code?: { language: string; code: string; note?: string };
  industry?: IndustrySpec[];
  est?: number;
}

function lesson(L: LessonInput): ChapterSpec {
  const project: MiniProjectSpec = {
    title: L.project.title,
    description: L.project.description,
    time: L.project.time ?? '15 minutes',
    materials: L.project.materials,
    steps: L.project.steps,
    expectedOutput: L.project.expectedOutput,
    extensions: L.project.extensions,
  };
  return {
    title: L.title,
    difficulty: L.difficulty ?? 'beginner',
    est: L.est ?? 55,
    summary: `${L.module} · ${L.summary}`,
    hook: L.hook,
    story: L.story,
    layman: L.layman,
    concept: L.concept,
    analogies: L.analogies,
    howItWorks: L.howItWorks,
    realWorld: L.realWorld,
    industryScenarios: L.industry,
    didYouKnow: L.didYouKnow ?? L.facts.slice(0, 3),
    activities: [{
      title: L.activity.title,
      duration: L.activity.duration ?? '10 minutes',
      materials: L.activity.materials,
      steps: L.activity.steps,
      expected: L.activity.expected,
    }],
    miniChallenge: L.miniChallenge,
    miniProject: project,
    code: L.code,
    logic: L.logic,
    discussionQuestions: L.discussion,
    careerConnections: L.careers,
    homework: L.homework,
    diagram: L.diagram ?? 'flow',
    facts: L.facts,
    questions: L.questions,
    sessionPlan: flowPlan(L.title),
    weekLabel: L.module,
    assessmentRubric: rubric(L.title),
    teacherNotes: [
      'Keep it concrete — always start from something the learner already knows and loves.',
      'Engagement rule: switch activity every 5–10 minutes (hook → story → talk → game).',
      'Use simple, friendly language; celebrate questions and "happy mistakes".',
      'Differentiate: let fast finishers attempt the mini challenge or project extensions.',
    ],
    parentEngagement: parentPack(L.title),
  };
}

// =====================================================================
//  MODULE 1 · FOUNDATION AI
// =====================================================================
const M1 = 'Foundation AI';

const whatIsAI = lesson({
  title: 'What is AI?',
  module: M1,
  summary: 'Discover what Artificial Intelligence really is and how it is different from an ordinary machine.',
  hook: 'You say "Hey, play my favourite song" and music starts. No human heard you — a machine did. How can a machine understand a human?',
  story: 'Meet ARIA, a curious robot who just woke up with an empty brain. ARIA cannot do anything yet. Throughout this course YOU will give ARIA super-powers — to see, listen, talk, create and be fair. Today ARIA asks the biggest question of all: "What AM I?"',
  layman: 'Artificial Intelligence (AI) means making machines smart enough to do things that normally need human thinking — like recognising a face, understanding speech, or suggesting the next video. A normal machine (like a fan) does ONE fixed job. An AI machine can learn and make choices.',
  concept: 'AI is the science of building machines that can perform tasks usually requiring human intelligence: perceiving (seeing/hearing), reasoning, learning from data, and making decisions. The key idea is LEARNING FROM EXAMPLES, not only following fixed instructions.',
  analogies: [
    { concept: 'AI vs ordinary machine', analogy: 'A calculator vs a coach', explanation: 'A calculator always gives the same answer to 2+2. A coach watches you, learns your weak spots and changes the plan — that "learning and deciding" is AI.' },
    { concept: 'How AI learns', analogy: 'A baby learning words', explanation: 'A baby is not born knowing "dog"; it learns by seeing many dogs. AI learns the same way — from lots of examples.' },
  ],
  howItWorks: [
    'Humans give the machine lots of examples (this is DATA).',
    'The machine looks for patterns inside the examples.',
    'It builds a "rule of thumb" called a MODEL.',
    'When it sees something new, it makes a guess (a PREDICTION).',
    'We give feedback so it can improve next time.',
  ],
  realWorld: [
    'Voice assistants (Alexa, Siri, Google) understanding what you say.',
    'YouTube and Netflix suggesting what to watch next.',
    'Google Maps predicting traffic and the fastest route.',
    'Phone cameras drawing a box around every face.',
    'Email apps moving spam out of your inbox automatically.',
  ],
  facts: [
    'The phrase "Artificial Intelligence" was first used in 1956 at Dartmouth College.',
    'Your phone uses AI dozens of times a day — face unlock, next-word typing, photo sorting.',
    'AI does NOT think or feel like a human — it finds patterns in data very, very fast.',
  ],
  activity: {
    title: 'AI Detective Hunt',
    materials: ['Notebook', 'Pencil'],
    steps: [
      'In teams, list 10 machines you used or saw today.',
      'Sort them into two columns: "Just follows fixed rules" vs "Seems to learn / decide".',
      'For each AI one, write WHAT it does that feels smart.',
      'Build one big "AI all around us" wall with the class.',
    ],
    expected: 'Each team names at least 5 real AI examples and explains why they are AI and not ordinary machines.',
  },
  miniChallenge: 'In 60 seconds, name 5 AI things in your home. One point each — beat your friend!',
  project: {
    title: 'My AI Diary — Day 1',
    description: 'Start a personal "AI Diary" you will add to all course long. Record where AI shows up in your own life.',
    materials: ['A notebook or doc', 'Coloured pens'],
    steps: [
      'Draw your daily routine from morning to night.',
      'Put a 🤖 star next to every moment AI helped you.',
      'Write one sentence: "AI helped me by ___".',
      'Decorate the cover and name your diary.',
    ],
    expectedOutput: 'A decorated AI Diary with at least 5 marked AI moments — your first course entry.',
    extensions: ['Interview a family member about AI they use.', 'Sketch a "robot of the future" you wish existed.'],
  },
  logic: 'Computational thinking starts with PATTERN RECOGNITION. Sorting machines into "fixed-rule" vs "learning" trains your brain to spot the single most important AI idea: learning from examples.',
  discussion: [
    'Is a washing machine AI? What about one that picks the best wash cycle by itself?',
    'Would you rather AI did your chores or your homework? Why?',
    'What is one job you would NEVER want an AI to do?',
  ],
  careers: [
    'AI Engineer — builds the smart software inside apps and robots.',
    'Product Designer — decides which smart features people actually need.',
    'Teacher / Trainer — helps people learn to use AI well.',
  ],
  homework: [
    'Spot 3 AI features on a family phone and explain each one to a parent.',
    'Write down one machine at home that is NOT AI and one that is.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Which is the BEST example of AI?', options: ['A ceiling fan', 'A voice assistant that answers questions', 'A bicycle', 'A pencil'], answer: 'A voice assistant that answers questions', explanation: 'It understands speech and decides a reply — that needs intelligence.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'How does AI mainly become smart?', options: ['By magic', 'By learning from many examples (data)', 'By being painted', 'By being heavy'], answer: 'By learning from many examples (data)', explanation: 'AI finds patterns in data.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'In one line, how is an AI machine different from a normal machine?', answer: 'An AI machine can learn and decide; a normal machine only follows fixed steps.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Name one job you would love an AI to do and one you would NEVER give it. Explain.', answer: 'Open-ended', explanation: 'Builds early judgement about where AI should and should not be used.', difficulty: 'intermediate' },
  ],
});

const aiAroundUs = lesson({
  title: 'AI Around Us',
  module: M1,
  summary: 'Notice the hidden AI working quietly in the apps, gadgets and services you use every day.',
  hook: 'Right now, invisible AI is choosing your video thumbnails, filtering your spam, and fixing your blurry photos. Can you spot them all?',
  story: 'ARIA puts on "AI goggles" and walks through a normal day with you. Suddenly she sees glowing AI everywhere — in the bus that predicts arrival time, the shop that suggests snacks, the game that adjusts difficulty. "It was here the whole time!" she gasps.',
  layman: 'AI is not just in sci-fi robots. It hides inside everyday things: phones, maps, games, shopping apps, cameras and TVs. Most of the time you do not even notice it working.',
  concept: 'AI is now an "invisible utility" like electricity — embedded in countless products. It powers recommendations, search, navigation, translation, photography, voice control and fraud detection, usually without announcing itself.',
  analogies: [
    { concept: 'AI is invisible', analogy: 'Electricity in the walls', explanation: 'You do not see electricity, but flip a switch and it is there. AI is the same — hidden but everywhere.' },
    { concept: 'AI as helper', analogy: 'A backstage crew', explanation: 'In a play, the crew you never see makes the magic happen. AI works backstage in your apps.' },
  ],
  howItWorks: [
    'A company finds a task people repeat a lot (e.g. "what to watch?").',
    'They collect data about choices people make.',
    'An AI model learns the patterns.',
    'The feature quietly appears inside the app.',
    'It keeps improving as more people use it.',
  ],
  realWorld: [
    'Autocorrect and next-word prediction while you type.',
    'Photo apps grouping pictures by person or place.',
    'Online shops showing "you may also like" items.',
    'Banks blocking a suspicious card payment instantly.',
    'Music apps making a "Made for You" playlist.',
  ],
  facts: [
    'There are more connected smart devices on Earth than there are people.',
    'The average smartphone runs AI models hundreds of times a day.',
    'AI helps translate over 100 languages in real time.',
  ],
  activity: {
    title: 'AI Scavenger Hunt',
    materials: ['Worksheet', 'Pencil'],
    steps: [
      'Walk (in your mind or the room) through your morning.',
      'Find 8 places AI might be hiding.',
      'Rank them: which surprised you most?',
      'Share your top "hidden AI" with the class.',
    ],
    expected: 'Students identify 8 hidden AI features and explain what each one does.',
  },
  miniChallenge: 'Find the SNEAKIEST AI nobody else thought of. Most surprising example wins!',
  project: {
    title: 'AI-Around-Me Map',
    description: 'Create a poster map of your home/school showing where AI lives.',
    materials: ['Paper', 'Markers', 'Stickers'],
    steps: [
      'Draw a simple map of your home or school.',
      'Add a 🤖 icon everywhere AI is used.',
      'Write one line for each: what it does.',
      'Add a "wish" icon where you WANT AI but it does not exist yet.',
    ],
    expectedOutput: 'A colourful AI map with at least 6 real AI spots and 2 "wish" spots.',
    extensions: ['Count which room has the most AI.', 'Interview a neighbour and add their examples.'],
  },
  logic: 'Observation + classification: training yourself to notice hidden systems is the first skill of a systems thinker — you cannot improve what you cannot see.',
  discussion: [
    'Should apps tell you when AI is making a choice for you?',
    'Which hidden AI helps you most? Which one annoys you?',
    'If AI disappeared for a day, what would feel different?',
  ],
  careers: [
    'UX Researcher — studies how people use AI features.',
    'Data Analyst — measures whether a feature actually helps users.',
    'Journalist / Reviewer — explains new AI tools to the public.',
  ],
  homework: [
    'Keep a one-day "AI sightings" log and count how many you find.',
    'Ask a grandparent what life was like before AI helpers.',
  ],
  diagram: 'iot',
  questions: [
    { qtype: 'mcq', prompt: 'AI is best compared to…', options: ['A rare museum piece', 'Invisible electricity in everyday things', 'A toy only', 'A type of food'], answer: 'Invisible electricity in everyday things', explanation: 'AI is embedded everywhere, often unseen.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Which of these usually uses AI?', options: ['A "you may also like" suggestion', 'A paper notebook', 'A wooden chair', 'A glass of water'], answer: 'A "you may also like" suggestion', explanation: 'Recommendations are powered by AI.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one AI you used today without realising it.', answer: 'Open-ended (autocorrect, maps, recommendations…).', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Pick one app you love. List 3 places AI might be working inside it.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const historyOfAI = lesson({
  title: 'History of AI',
  module: M1,
  summary: 'Travel through time to see how AI grew from a wild idea into the technology in your pocket.',
  hook: 'Long before smartphones, in 1950, a scientist asked: "Can machines think?" That one question started everything you use today.',
  story: 'ARIA finds a dusty time machine. She zooms back to 1950 to meet Alan Turing, then 1956 to a famous meeting, then watches a chess computer beat a world champion, and finally lands back home where AI lives in her own circuits. "I have a family tree!" she smiles.',
  layman: 'AI did not appear overnight. It grew over 70+ years through big ideas, exciting breakthroughs, and even some quiet "winters" when progress slowed. Today is the most exciting chapter so far.',
  concept: 'AI history milestones: the Turing Test (1950), the Dartmouth meeting that named AI (1956), expert systems, "AI winters" of reduced funding, machine learning\'s rise, Deep Blue beating Kasparov (1997), deep learning breakthroughs (2012+), and the generative-AI boom (2020s).',
  analogies: [
    { concept: 'AI progress', analogy: 'A growing tree', explanation: 'Roots (early ideas) → trunk (machine learning) → branches (vision, language) → fruit (today\'s apps).' },
    { concept: 'AI winters', analogy: 'Hibernation', explanation: 'Sometimes progress slept through tough times, then woke up stronger.' },
  ],
  howItWorks: [
    'Thinkers ask a bold question (Can machines think?).',
    'Scientists build early programs and test ideas.',
    'Breakthroughs spark excitement; limits cause slowdowns.',
    'More data + faster computers unlock new leaps.',
    'Each generation builds on the last.',
  ],
  realWorld: [
    'The Turing Test — a famous way to ask if a machine seems human.',
    'Deep Blue beating chess champion Garry Kasparov in 1997.',
    'IBM Watson winning the quiz show Jeopardy! in 2011.',
    'AlphaGo beating a world Go champion in 2016.',
    'ChatGPT reaching 100 million users faster than any app before.',
  ],
  facts: [
    'The first chatbot, ELIZA, was built in 1966 and pretended to be a therapist.',
    'The term "machine learning" was coined in 1959 by Arthur Samuel.',
    'AI has had at least two "winters" when funding nearly dried up.',
  ],
  activity: {
    title: 'Build an AI Timeline',
    materials: ['Long paper strip', 'Markers', 'Event cards'],
    steps: [
      'Get cards with AI milestones and their years (shuffled).',
      'In teams, place them in the right order on a timeline.',
      'Add one drawing per event.',
      'Compare timelines and fix any mistakes together.',
    ],
    expected: 'A correctly ordered AI timeline with at least 6 milestones and illustrations.',
  },
  miniChallenge: 'Order 5 AI events fastest without looking — first correct team wins!',
  project: {
    title: 'AI History Comic',
    description: 'Turn one AI milestone into a 4-panel comic strip.',
    materials: ['Paper', 'Pencils/colours'],
    steps: [
      'Pick one milestone (e.g. Deep Blue vs Kasparov).',
      'Plan 4 panels: setup, challenge, twist, result.',
      'Draw and add speech bubbles.',
      'Write one line: why this moment mattered.',
    ],
    expectedOutput: 'A 4-panel comic that explains one AI milestone clearly.',
    extensions: ['Add a "what happened next" panel.', 'Predict the next big milestone.'],
  },
  logic: 'Sequencing + cause-and-effect: putting events in order and seeing how one breakthrough enabled the next is core historical and computational reasoning.',
  discussion: [
    'Why do you think AI had "winters" when people lost interest?',
    'Which milestone do you think changed the world the most?',
    'What will the next big AI milestone be?',
  ],
  careers: [
    'AI Researcher — invents the next breakthrough.',
    'Historian of Science / Tech Writer — records and explains progress.',
    'Museum Curator — designs exhibits about technology.',
  ],
  homework: [
    'Find the birth year of one AI tool you use and add it to your diary.',
    'Ask a family member which technology surprised them most in their life.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'In which year was the term "Artificial Intelligence" first used?', options: ['1956', '1900', '2007', '2020'], answer: '1956', explanation: 'At the Dartmouth meeting.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Deep Blue became famous for beating a world champion at…', options: ['Chess', 'Football', 'Cooking', 'Singing'], answer: 'Chess', explanation: 'Deep Blue beat Garry Kasparov in 1997.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What is an "AI winter"?', answer: 'A period when AI progress and funding slowed down.', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'If you could meet any AI pioneer, who would it be and what would you ask?', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const typesOfAI = lesson({
  title: 'Types of AI',
  module: M1,
  summary: 'Learn the difference between narrow AI, general AI and the (still imaginary) super AI.',
  hook: 'The AI that recommends videos cannot drive a car. The AI that drives a car cannot write a poem. Why is each AI good at only ONE thing?',
  story: 'ARIA meets her cousins: "Narrow" who is a genius at exactly one task, "General" who is still a dream, and "Super" who only exists in movies. ARIA realises she — like all real AI today — is a brilliant Narrow specialist.',
  layman: 'AI comes in levels. Narrow AI is great at one job (today\'s AI). General AI could do any task a human can (does not exist yet). Super AI would be smarter than all humans (only science fiction so far).',
  concept: 'AI is classified by capability: (1) Narrow/Weak AI — excels at a single task (all real AI today); (2) General AI (AGI) — human-level across many tasks, not yet achieved; (3) Super AI — hypothetically beyond human intelligence. It can also be grouped by function: reactive, limited-memory, etc.',
  analogies: [
    { concept: 'Narrow AI', analogy: 'A specialist doctor', explanation: 'Amazing at one thing, but you would not ask a heart surgeon to fix your teeth.' },
    { concept: 'General AI', analogy: 'A talented all-rounder', explanation: 'Could switch between many tasks like a person — still a dream today.' },
  ],
  howItWorks: [
    'Decide what the AI must do (one task or many?).',
    'Today, we train one model per narrow task.',
    'Each model only knows its own job.',
    'Combining many narrow AIs is NOT the same as general AI.',
    'True general AI would learn new tasks by itself.',
  ],
  realWorld: [
    'Narrow: a spam filter that only sorts email.',
    'Narrow: a chess engine that only plays chess.',
    'Narrow: a face-unlock that only recognises faces.',
    'General (fictional): robots in movies that do everything.',
    'Super (fictional): an AI that out-thinks all humanity.',
  ],
  facts: [
    'Every AI you have ever used is Narrow AI.',
    'Scientists disagree on when (or if) General AI will arrive.',
    'A chess AI cannot play tic-tac-toe unless retrained.',
  ],
  activity: {
    title: 'Narrow, General or Super?',
    materials: ['Scenario cards', 'Three labelled corners'],
    steps: [
      'Read a scenario card (real or fictional AI).',
      'Run to the corner you think it belongs to.',
      'Defend your choice in one sentence.',
      'Reveal the answer and discuss surprises.',
    ],
    expected: 'Students correctly classify most examples and explain the difference between the three types.',
  },
  miniChallenge: 'Invent a fictional General AI character and give it a name and one rule it must follow.',
  project: {
    title: 'AI Family Tree Poster',
    description: 'Design a poster showing the three types of AI with examples.',
    materials: ['Paper', 'Markers'],
    steps: [
      'Draw three boxes: Narrow, General, Super.',
      'Add 3 real examples under Narrow.',
      'Add 1 imagined example each under General and Super.',
      'Write one line explaining why today\'s AI is all Narrow.',
    ],
    expectedOutput: 'A clear poster classifying AI types with correct examples.',
    extensions: ['Add a "danger meter" for each type.', 'Predict the year General AI might appear.'],
  },
  logic: 'Classification + abstraction: grouping by capability teaches you to compare systems on a clear dimension instead of treating "AI" as one blurry thing.',
  discussion: [
    'Would a world with General AI be exciting or scary? Both?',
    'Why is combining many narrow AIs not the same as one general AI?',
    'Should there be rules before we build smarter-than-human AI?',
  ],
  careers: [
    'AI Safety Researcher — studies how to keep powerful AI safe.',
    'Robotics Engineer — builds task-specific (narrow) robots.',
    'Science Communicator — separates AI facts from movie myths.',
  ],
  homework: [
    'List 5 AIs you use and label each (all should be Narrow!).',
    'Watch a movie robot and decide which type it is.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'All AI we use today is…', options: ['Narrow AI', 'General AI', 'Super AI', 'Magic AI'], answer: 'Narrow AI', explanation: 'Each model is great at one task only.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'General AI (AGI) is…', options: ['Common in phones', 'Human-level across many tasks, not yet achieved', 'Just a spam filter', 'A printer'], answer: 'Human-level across many tasks, not yet achieved', explanation: 'AGI does not exist yet.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Which AI type only exists in science fiction so far?', answer: 'Super AI (and General AI is not here yet).', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A chess AI is asked to drive a car. What happens and why?', options: ['It drives perfectly', 'It cannot — it only knows chess', 'It becomes Super AI', 'It writes a poem'], answer: 'It cannot — it only knows chess', explanation: 'Narrow AI knows only its trained task.', difficulty: 'intermediate' },
  ],
});

const aiVsHuman = lesson({
  title: 'AI vs Human Intelligence',
  module: M1,
  summary: 'Compare what AI does brilliantly with what humans still do best.',
  hook: 'AI can read a million books in a day — but it cannot truly understand a hug. Who is "smarter": you or the machine?',
  story: 'ARIA challenges the class to a contest: speed maths, then telling a sad friend a comforting story. ARIA wins the maths instantly… but the class wins the kindness round easily. "We are a TEAM," ARIA realises. "I am fast; you are wise."',
  layman: 'AI and humans are smart in different ways. AI is super fast, never tired, and great with huge amounts of data. Humans are creative, caring, use common sense, and understand feelings. The best results come from teaming up.',
  concept: 'AI excels at speed, scale, consistency and pattern-finding in data. Humans excel at creativity, empathy, ethics, common-sense reasoning and adapting to brand-new situations. AI lacks true understanding, feelings and general common sense — so human + AI collaboration beats either alone.',
  analogies: [
    { concept: 'AI strength', analogy: 'A super calculator', explanation: 'Lightning fast and tireless with numbers and patterns.' },
    { concept: 'Human strength', analogy: 'A wise friend', explanation: 'Understands feelings, context and right vs wrong.' },
  ],
  howItWorks: [
    'AI processes huge data quickly but without understanding meaning.',
    'Humans bring context, values and creativity.',
    'AI suggests; humans judge and decide.',
    'Together they cover each other\'s weak spots.',
    'Keeping a "human in the loop" stays important.',
  ],
  realWorld: [
    'AI flags an unusual medical scan; a doctor makes the diagnosis.',
    'AI drafts an email; a person adds the warm personal touch.',
    'AI suggests chess moves; a human enjoys the creativity of play.',
    'AI sorts thousands of photos; you pick the ones with meaning.',
    'AI translates words; a human catches the joke or the emotion.',
  ],
  facts: [
    'AI can analyse a scan in seconds, but doctors still make the final call.',
    'AI has no real feelings — it predicts patterns, it does not "care".',
    'Common sense (knowing ice is cold) is surprisingly hard for AI.',
  ],
  activity: {
    title: 'The Great Brain-Off',
    materials: ['Task cards', 'Timer'],
    steps: [
      'Split tasks into "AI would win" vs "Human would win" piles.',
      'Examples: big maths, writing a poem about loss, spotting spam, calming a friend.',
      'Debate any tricky cards.',
      'Make a class chart of strengths.',
    ],
    expected: 'Students can list 3 human strengths and 3 AI strengths with examples.',
  },
  miniChallenge: 'Think of ONE task where human + AI together beat either alone. Share it.',
  project: {
    title: 'Human + AI Dream Team',
    description: 'Design a job done best by a human and AI working together.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a real job (doctor, teacher, artist, farmer).',
      'List what the AI handles.',
      'List what the human handles.',
      'Draw them as a "dream team" with a slogan.',
    ],
    expectedOutput: 'A poster showing a clear, fair split of human and AI tasks for one job.',
    extensions: ['Add what could go wrong if AI did it alone.', 'Add a rule to keep the human in charge.'],
  },
  logic: 'Comparison + trade-off thinking: knowing each side\'s strengths helps you assign the right task to the right "mind" — a key decision-making skill.',
  discussion: [
    'Is being fast the same as being smart?',
    'What is one thing you can do that no AI can?',
    'Should an AI ever make a decision with no human checking it?',
  ],
  careers: [
    'Doctor / Radiologist — uses AI as a second pair of eyes.',
    'Designer / Artist — uses AI to brainstorm, then adds the soul.',
    'Human-AI Interaction Specialist — designs good teamwork between people and AI.',
  ],
  homework: [
    'Do a small task with and without an AI helper. Which felt better and why?',
    'Ask a family member: what human skill do they think AI can never replace?',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'AI is usually better than humans at…', options: ['Feeling empathy', 'Super-fast pattern-finding in big data', 'Being a kind friend', 'Understanding a joke\'s emotion'], answer: 'Super-fast pattern-finding in big data', explanation: 'Speed and scale are AI strengths.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Humans are usually better than AI at…', options: ['Empathy and creativity', 'Multiplying huge numbers fast', 'Working 24/7 without rest', 'Reading a million pages a day'], answer: 'Empathy and creativity', explanation: 'These need understanding and feeling.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do we call keeping a person checking AI decisions?', answer: 'Human in the loop.', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'Describe a task where AI + human together would clearly beat either one alone.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const mythsVsFacts = lesson({
  title: 'AI Myths vs Facts',
  module: M1,
  summary: 'Bust the biggest AI myths from movies and headlines with the real facts.',
  hook: '"AI will take over the world!" "AI is always right!" "AI can read your mind!" — which of these is true? (Spoiler: none.)',
  story: 'ARIA watches a scary robot movie and gets worried she might be evil. The class hosts a "Mythbusters" show, holding up each myth and replacing it with a fact. By the end, ARIA laughs: "I am a helpful tool, not a movie monster."',
  layman: 'Movies and headlines spread big myths about AI. AI is not magic, not always correct, and not secretly alive. It is a powerful tool that follows patterns in data — and it can make mistakes.',
  concept: 'Common AI myths vs facts: AI is NOT conscious or emotional; AI is NOT always accurate (it can be confidently wrong/"hallucinate"); AI does NOT learn on its own without data and design; AI will NOT "take over" by itself — humans build, control and are responsible for it.',
  analogies: [
    { concept: 'AI hype', analogy: 'A magician\'s trick', explanation: 'It looks like magic, but there is a clever method behind it — no real magic.' },
    { concept: 'AI mistakes', analogy: 'A confident classmate', explanation: 'Sometimes sounds 100% sure but is still wrong — always check.' },
  ],
  howItWorks: [
    'A myth spreads (often from movies or scary headlines).',
    'We ask: what does AI actually do?',
    'We check the evidence and real limits.',
    'We replace the myth with a clear fact.',
    'We stay curious but not fooled.',
  ],
  realWorld: [
    'Myth: AI is alive. Fact: it predicts patterns, it has no feelings.',
    'Myth: AI is always right. Fact: it can be confidently wrong.',
    'Myth: AI understands like a human. Fact: it has no real understanding.',
    'Myth: AI learns by itself. Fact: humans choose data and design it.',
    'Myth: robots will rule us. Fact: humans build and control AI.',
  ],
  facts: [
    'When AI states a confident but false answer, it is called a "hallucination".',
    'AI has no goals or desires unless humans program them.',
    'Most "scary AI" stories are science fiction, not science.',
  ],
  activity: {
    title: 'AI Mythbusters',
    materials: ['Myth/fact cards', 'Two bins: MYTH and FACT'],
    steps: [
      'Read each statement aloud.',
      'Vote: myth or fact?',
      'Sort it into the right bin.',
      'Rewrite each myth into a true fact.',
    ],
    expected: 'Students correctly sort statements and rewrite at least 3 myths into facts.',
  },
  miniChallenge: 'Find the most ridiculous AI myth you have heard and bust it in one sentence.',
  project: {
    title: 'Myth-Busting Poster',
    description: 'Make a "Myth vs Fact" poster to teach others the truth about AI.',
    materials: ['Paper', 'Markers'],
    steps: [
      'Pick 4 popular AI myths.',
      'Write the FACT beside each one.',
      'Add a fun drawing per myth.',
      'Add a slogan like "Be curious, not fooled!"',
    ],
    expectedOutput: 'A poster with 4 busted myths that could hang in a classroom.',
    extensions: ['Survey 3 people and note which myths they believed.', 'Add a QR-style "learn more" box.'],
  },
  logic: 'Critical thinking + evidence: separating claim from evidence is the core skill of a scientist and a smart digital citizen.',
  discussion: [
    'Why do movies make AI look so scary?',
    'Why might someone believe an AI just because it sounds confident?',
    'How can we check whether an AI answer is true?',
  ],
  careers: [
    'Fact-Checker / Science Journalist — debunks tech myths.',
    'AI Educator — teaches the public how AI really works.',
    'Policy Advisor — writes sensible rules based on facts, not fear.',
  ],
  homework: [
    'Catch one AI myth on TV or online and write the real fact.',
    'Explain to a family member why AI can be "confidently wrong".',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'When AI gives a confident but false answer, it is called a…', options: ['Hallucination', 'Promotion', 'Reflection', 'Vacation'], answer: 'Hallucination', explanation: 'Always verify AI outputs.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Which statement is a FACT?', options: ['AI has real feelings', 'AI can be confidently wrong', 'Robots will rule us by themselves', 'AI learns with no data'], answer: 'AI can be confidently wrong', explanation: 'AI makes mistakes and lacks feelings.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Who is responsible for what an AI does?', answer: 'The humans who build and use it.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'An AI answers a question very confidently. What should you do before trusting it?', options: ['Believe it instantly', 'Check the facts from a reliable source', 'Turn off your brain', 'Tell everyone it is true'], answer: 'Check the facts from a reliable source', explanation: 'Confidence is not the same as correctness.', difficulty: 'intermediate' },
  ],
});

const FOUNDATION = [whatIsAI, aiAroundUs, historyOfAI, typesOfAI, aiVsHuman, mythsVsFacts];

// =====================================================================
//  MODULE 2 · AI IN DAILY LIFE
// =====================================================================
const M2 = 'AI in Daily Life';

const smartAssistants = lesson({
  title: 'Smart Assistants',
  module: M2,
  summary: 'Discover how voice assistants like Alexa, Siri and Google understand and answer you.',
  hook: 'You whisper "set a timer for 10 minutes" and it just… works. How does a speaker turn your voice into action?',
  story: 'ARIA gets a new pair of ears. At first she hears only noise. You teach her to turn sound into words, find what you WANT, and reply. Soon ARIA is answering questions across the whole classroom.',
  layman: 'A smart assistant listens to your voice, turns it into text, figures out what you mean, finds the answer, and speaks back. All of that happens in about a second.',
  concept: 'Voice assistants combine several AI parts: speech-to-text (turning sound into words), Natural Language Understanding (finding your intent), a skill/knowledge lookup, and text-to-speech (speaking the reply). A wake word ("Hey…") tells it when to start listening.',
  analogies: [
    { concept: 'Wake word', analogy: 'Calling a friend\'s name', explanation: 'It ignores everything until it hears its name, then it pays attention.' },
    { concept: 'Intent', analogy: 'A waiter understanding your order', explanation: 'You say words; it figures out what you actually want.' },
  ],
  howItWorks: [
    'It waits for the wake word.',
    'It records your voice and turns sound into text.',
    'It detects your intent (timer, weather, music…).',
    'It finds the answer or performs the action.',
    'It speaks the reply back to you.',
  ],
  realWorld: [
    'Asking for the weather before school.',
    'Setting a kitchen timer with your hands full.',
    'Playing a song by name.',
    'Turning on smart lights by voice.',
    'Getting a quick fact for homework.',
  ],
  facts: [
    'The "wake word" is processed on the device so it is not always recording.',
    'Assistants support dozens of languages and accents.',
    'They get better as more people speak to them.',
  ],
  activity: {
    title: 'Be the Voice Assistant',
    materials: ['Question cards'],
    steps: [
      'One student is the "assistant" with a list of known answers.',
      'Another asks a question.',
      'The "assistant" must detect the intent and answer — or say a fallback.',
      'Discuss which questions were hard and why.',
    ],
    expected: 'Students experience wake-word → intent → reply and the need for a fallback answer.',
  },
  miniChallenge: 'Design a fun wake word for your own assistant and 3 commands it must understand.',
  project: {
    title: 'Design Your Dream Assistant',
    description: 'Plan a voice assistant for kids with a personality and skills.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Name your assistant and give it a personality.',
      'List 6 commands it should understand.',
      'Write a good reply for each.',
      'Add one safety rule (e.g. ask a parent before buying).',
    ],
    expectedOutput: 'A one-page design with name, 6 commands, replies and a safety rule.',
    extensions: ['Add a "I do not understand" fallback.', 'Add a second language greeting.'],
  },
  logic: 'Pipeline thinking: breaking one magic-seeming feature into clear stages (listen → understand → act → speak) is how engineers tame complexity.',
  discussion: [
    'Is it polite to say "please" and "thank you" to an assistant? Why?',
    'Should assistants always be listening? What are the risks?',
    'What command do you wish your assistant had?',
  ],
  careers: [
    'Voice UX Designer — designs how assistants talk.',
    'Speech AI Engineer — builds speech-to-text systems.',
    'Conversation Designer — writes the assistant\'s replies and personality.',
  ],
  homework: [
    'Ask an assistant 3 questions and note one good and one bad answer.',
    'Write your own polite command and its perfect reply.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A "wake word" is used to…', options: ['Tell the assistant when to start listening', 'Charge the device', 'Change the colour', 'Delete files'], answer: 'Tell the assistant when to start listening', explanation: 'It triggers active listening.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Turning your spoken words into text is called…', options: ['Speech-to-text', 'Painting', 'Booting', 'Charging'], answer: 'Speech-to-text', explanation: 'The first step of understanding voice.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What should an assistant say when it does not understand you?', answer: 'A friendly fallback reply (e.g. "Can you ask differently?").', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write one command and the exact reply your assistant should give.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const recommendations = lesson({
  title: 'YouTube & Netflix Recommendations',
  module: M2,
  summary: 'Find out how apps seem to "know" exactly what you want to watch next.',
  hook: 'You finish one video and the perfect next one is already waiting. Spooky? No — it is AI watching your habits.',
  story: 'ARIA notices you always skip cooking videos but binge space documentaries. She starts a secret notebook of your taste. Soon her suggestions are scarily good — because she learned the pattern of YOU.',
  layman: 'Recommendation systems watch what you click, like, finish and skip. They find people with similar taste and suggest things those people enjoyed. The more you watch, the better the guesses.',
  concept: 'Recommendation systems predict what you will like using your behaviour (watch time, likes, skips) and "collaborative filtering" — finding users with similar tastes. They balance showing more of what you love with a little variety to keep you exploring.',
  analogies: [
    { concept: 'Collaborative filtering', analogy: 'A friend with the same taste', explanation: 'If your taste-twin loved a show, you probably will too.' },
    { concept: 'Watch signals', analogy: 'Footprints in sand', explanation: 'Every click leaves a trail the AI reads to learn your taste.' },
  ],
  howItWorks: [
    'It records your actions (watch, like, skip, search).',
    'It builds a profile of your taste.',
    'It finds people and items similar to yours.',
    'It ranks and suggests the best matches.',
    'It updates instantly as you keep watching.',
  ],
  realWorld: [
    'YouTube\'s "Up next" autoplay.',
    'Netflix\'s "Because you watched…" rows.',
    'Spotify\'s personalised playlists.',
    'Online shops\' "customers also bought".',
    'App stores suggesting games you might like.',
  ],
  facts: [
    'A huge share of what people watch comes from recommendations, not search.',
    'Recommenders also add surprises so you do not get bored.',
    'Skipping a video teaches the AI just as much as watching one.',
  ],
  activity: {
    title: 'Build a Taste Profile',
    materials: ['Cards of shows/songs', 'Worksheet'],
    steps: [
      'Each student lists 5 things they love and 3 they dislike.',
      'Find a "taste twin" in class.',
      'Recommend something to your twin based on their list.',
      'Did they like it? Discuss why it worked or not.',
    ],
    expected: 'Students experience collaborative filtering by recommending to a similar peer.',
  },
  miniChallenge: 'Be the algorithm: recommend the perfect movie to your partner using only 3 clues about their taste.',
  project: {
    title: 'Paper Recommendation Engine',
    description: 'Make a flip-card recommender that suggests items from likes.',
    materials: ['Index cards', 'Pens'],
    steps: [
      'Write 10 item cards (movies, games, books).',
      'Make simple "if you like X → try Y" rules.',
      'Test it on a friend.',
      'Improve the rules using their feedback.',
    ],
    expectedOutput: 'A working paper recommender with at least 8 "if-like-then-try" rules.',
    extensions: ['Add a "surprise me" random pick.', 'Add a rule that avoids repeats.'],
  },
  logic: 'Pattern recognition + prediction: turning past behaviour into a guess about the future is the heart of machine learning.',
  discussion: [
    'Is it good or bad that apps know your taste so well?',
    'Could recommendations trap you in a "bubble" of the same things?',
    'Should you be able to reset what an app thinks you like?',
  ],
  careers: [
    'Recommender Systems Engineer — builds these models.',
    'Data Scientist — studies user behaviour patterns.',
    'Content Strategist — decides what gets recommended and why.',
  ],
  homework: [
    'Notice why an app recommended you something today.',
    'Try clicking different things and watch your suggestions change.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Recommenders mostly learn your taste from…', options: ['Your clicks, watches and skips', 'The weather', 'Your shoe size', 'Random luck'], answer: 'Your clicks, watches and skips', explanation: 'Behaviour signals drive recommendations.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Finding users with similar taste is called…', options: ['Collaborative filtering', 'Tokenising', 'Charging', 'Painting'], answer: 'Collaborative filtering', explanation: 'It matches you with taste-twins.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Does skipping a video teach the AI anything?', answer: 'Yes — skips are a strong signal of dislike.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'How could a recommender avoid trapping you in a boring "bubble"?', answer: 'Open-ended (add variety/surprises).', difficulty: 'advanced' },
  ],
});

const googleMaps = lesson({
  title: 'Google Maps',
  module: M2,
  summary: 'See how map apps predict traffic and find the fastest route in seconds.',
  hook: 'How does your phone know there is a traffic jam 5 km ahead — before you even reach it?',
  story: 'ARIA floats above the city like a satellite. She sees thousands of phones moving like glowing dots. Where dots crawl, there is traffic; where they zoom, the road is clear. ARIA draws the fastest path through the moving river of dots.',
  layman: 'Map apps use live data from many phones, past traffic patterns, and road info to predict how long each route takes — then pick the quickest one. They update as conditions change.',
  concept: 'Navigation AI combines real-time location data (anonymised, from many devices), historical traffic patterns, and graph search algorithms (like shortest-path) to estimate arrival times and choose optimal routes, re-routing dynamically as conditions change.',
  analogies: [
    { concept: 'Live traffic', analogy: 'A river of moving dots', explanation: 'Slow-moving dots reveal a jam; fast dots reveal a clear road.' },
    { concept: 'Route finding', analogy: 'Choosing the shortest queue', explanation: 'Like picking the fastest checkout line, the app weighs each path.' },
  ],
  howItWorks: [
    'Many phones share anonymous speed/location data.',
    'The app maps where traffic is fast or slow.',
    'It mixes this with past patterns (rush hour, etc.).',
    'A route algorithm finds the quickest path.',
    'It re-routes you live if conditions change.',
  ],
  realWorld: [
    'Estimated arrival time for a school trip.',
    'Re-routing around an accident automatically.',
    'Finding the nearest open pharmacy.',
    'Predicting how busy a place is right now.',
    'Suggesting when to leave to arrive on time.',
  ],
  facts: [
    'The data is anonymised so it does not identify individual people.',
    'Maps learn that some roads are always slow at certain hours.',
    'Route-finding uses classic algorithms invented decades ago.',
  ],
  activity: {
    title: 'Classroom Traffic Game',
    materials: ['Grid map on floor/paper', 'Tokens'],
    steps: [
      'Draw a grid of streets with a start and end.',
      'Mark some roads as "slow" (traffic).',
      'Race to find the fastest path avoiding slow roads.',
      'Compare routes — who found the shortest time?',
    ],
    expected: 'Students find an optimal route and explain why avoiding "slow" roads matters.',
  },
  miniChallenge: 'Given a tiny map with 2 jams, find the fastest route in under 30 seconds.',
  project: {
    title: 'My Neighbourhood Map App',
    description: 'Design a paper "map app" with routes and live-traffic markers.',
    materials: ['Paper', 'Coloured pens'],
    steps: [
      'Draw your route from home to school.',
      'Mark 2 spots that are usually slow.',
      'Draw an alternative faster route.',
      'Write the time saved by the smarter route.',
    ],
    expectedOutput: 'A map showing two routes and the smarter choice with reasoning.',
    extensions: ['Add a "leave by" time suggestion.', 'Add a weather-affects-traffic note.'],
  },
  logic: 'Graphs + optimisation: roads are a graph of nodes and edges; finding the best path is a classic problem-solving and algorithmic skill.',
  discussion: [
    'Is it fair that your phone shares your speed (anonymously) to help others?',
    'What happens if everyone takes the same "fastest" route?',
    'Could a map ever send you a worse way? Why?',
  ],
  careers: [
    'Geospatial Data Scientist — works with location data.',
    'Algorithms Engineer — builds route-finding systems.',
    'Urban Planner — uses traffic data to design better cities.',
  ],
  homework: [
    'Time two routes to a place and see which is faster.',
    'Ask a driver how navigation apps changed their trips.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Map apps predict traffic mainly using…', options: ['Live data from many phones + past patterns', 'Guessing randomly', 'The colour of cars', 'The driver\'s mood'], answer: 'Live data from many phones + past patterns', explanation: 'Real-time + historical data drive predictions.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'When there is an accident ahead, a good map app will…', options: ['Re-route you automatically', 'Turn off', 'Speed you up', 'Delete the map'], answer: 'Re-route you automatically', explanation: 'It adapts to live conditions.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Roads and junctions can be modelled as a ____ in computing.', answer: 'Graph (nodes and edges).', difficulty: 'intermediate' },
    { qtype: 'logical', prompt: 'Two routes: one short with heavy traffic, one long but clear. Which might be faster and why?', answer: 'The longer clear route could be faster because traffic adds time.', difficulty: 'intermediate' },
  ],
});

const smartHomes = lesson({
  title: 'Smart Homes',
  module: M2,
  summary: 'Explore how lights, thermostats and doorbells become "smart" with AI.',
  hook: 'Imagine a house that turns on the lights as you walk in, warns you when someone is at the door, and saves power while you sleep. That house already exists.',
  story: 'ARIA moves into a smart house. The lights greet her, the thermostat learns she likes it cool, and the doorbell tells her who is outside. "This house is paying attention," ARIA says — "it senses, decides and acts."',
  layman: 'Smart homes use sensors (motion, temperature, cameras) plus AI to make decisions automatically — like turning on lights, adjusting heat, or alerting you about visitors. Devices talk to each other over the internet.',
  concept: 'Smart homes use the "sense → decide → act" loop. Sensors collect data, AI/automation rules (and sometimes learning) decide what to do, and devices act. Connected over the Internet of Things (IoT), they can learn routines to save energy and add convenience and safety.',
  analogies: [
    { concept: 'Sense-decide-act', analogy: 'Your own reflexes', explanation: 'You feel cold (sense), decide to grab a jacket, then act — smart homes do the same.' },
    { concept: 'Devices talking', analogy: 'A team with walkie-talkies', explanation: 'Each gadget shares info so the house acts as one.' },
  ],
  howItWorks: [
    'Sensors measure the world (motion, heat, sound).',
    'Data is sent to a hub or the cloud.',
    'AI/rules decide the right action.',
    'Devices act (lights on, alert sent).',
    'It learns your routine to improve over time.',
  ],
  realWorld: [
    'Lights that turn on when you enter a room.',
    'Thermostats that learn your comfort schedule.',
    'Video doorbells that recognise a delivery.',
    'Smart plugs that cut power to idle devices.',
    'Robot vacuums that map and clean your floor.',
  ],
  facts: [
    'Smart thermostats can cut energy bills by learning when you are away.',
    'Many smart devices keep working even with simple "if-this-then-that" rules.',
    'Privacy matters: cameras and mics need careful settings.',
  ],
  activity: {
    title: 'Program Your Smart Home',
    materials: ['Rule cards', 'Worksheet'],
    steps: [
      'Write "IF (sensor) THEN (action)" rules.',
      'Example: IF motion at night THEN dim light on.',
      'Test a partner\'s rules by acting them out.',
      'Find one rule that could go wrong and fix it.',
    ],
    expected: 'Students write at least 4 working IF-THEN automation rules.',
  },
  miniChallenge: 'Invent the most useful smart-home rule for a sleepy morning. Best rule wins!',
  project: {
    title: 'Smart-Home Blueprint',
    description: 'Design a smart bedroom with sensors, rules and a safety feature.',
    materials: ['Paper', 'Markers'],
    steps: [
      'Draw your room and place 3 sensors.',
      'Write what each sensor triggers.',
      'Add one energy-saving rule.',
      'Add one privacy/safety rule.',
    ],
    expectedOutput: 'A labelled smart-room blueprint with 3 sensors, rules, and a safety rule.',
    extensions: ['Add a "guest mode".', 'Add what happens during a power cut.'],
  },
  logic: 'Conditional logic (IF-THEN) is the backbone of automation and programming — and the seed of decision-making in AI.',
  discussion: [
    'What are the good and risky sides of cameras inside a home?',
    'Should a smart home ever make a choice you disagree with?',
    'Which chore would you most want automated?',
  ],
  careers: [
    'IoT Engineer — connects smart devices.',
    'Automation Designer — writes the rules and routines.',
    'Energy Analyst — uses smart data to save power.',
  ],
  homework: [
    'List 3 devices at home that could be made "smart".',
    'Write one IF-THEN rule that would help your family.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'Smart homes follow which loop?', options: ['Sense → Decide → Act', 'Eat → Sleep → Repeat', 'Paint → Dry → Hang', 'Buy → Sell → Trade'], answer: 'Sense → Decide → Act', explanation: 'Sensors, decision, action.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Devices in a smart home connect over the…', options: ['Internet of Things (IoT)', 'Postal service', 'Radio drama', 'Newspaper'], answer: 'Internet of Things (IoT)', explanation: 'IoT links the devices.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Write one IF-THEN rule for a smart light.', answer: 'Open-ended (e.g. IF dark + motion THEN light on).', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'A motion light keeps turning on for a passing cat. How would you fix the rule?', answer: 'Open-ended (size/height filter, schedule, sensitivity).', difficulty: 'advanced' },
  ],
});

const aiInGames = lesson({
  title: 'AI in Games',
  module: M2,
  summary: 'Learn how game characters seem to think, chase, hide and adapt to you.',
  hook: 'Why does that enemy seem to KNOW where you are hiding? And why do good games feel "just hard enough"?',
  story: 'ARIA jumps into a video game as a guard. At first she stands still. You teach her to patrol, chase, lose the player, and even get smarter. Soon ARIA is the trickiest character in the game.',
  layman: 'Game AI controls non-player characters (NPCs) — making them move, chase, hide and react. It can also adjust difficulty so the game stays fun. Some games even learn from how you play.',
  concept: 'Game AI uses techniques like state machines (patrol/chase/flee), pathfinding (e.g. A* search), decision trees, and dynamic difficulty adjustment. Modern games may use machine learning so opponents adapt to the player\'s style.',
  analogies: [
    { concept: 'State machine', analogy: 'Moods of a guard', explanation: 'Calm (patrol) → alert (chase) → giving up (search) — switching between clear states.' },
    { concept: 'Pathfinding', analogy: 'Finding your way in a maze', explanation: 'The AI calculates the best route to reach you.' },
  ],
  howItWorks: [
    'NPCs have states (patrol, chase, flee).',
    'Events trigger a switch between states.',
    'Pathfinding plots a route to a target.',
    'Difficulty adjusts to keep it fun.',
    'Some games learn your habits and adapt.',
  ],
  realWorld: [
    'Enemies that patrol then chase when they spot you.',
    'Racing games where rivals "rubber-band" to stay close.',
    'Chess and Go engines that beat champions.',
    'NPCs that take cover and flank in shooters.',
    'Games that ease difficulty if you keep losing.',
  ],
  facts: [
    'The A* pathfinding algorithm is used in countless games.',
    'AlphaGo learned Go by playing millions of games against itself.',
    'Good "AI" sometimes just needs to FEEL smart, not be perfect.',
  ],
  activity: {
    title: 'Be the Game AI',
    materials: ['Grid floor/paper', 'Tokens'],
    steps: [
      'One player is the "hero", one is the "guard AI".',
      'Guard follows simple rules: patrol, then chase if seen.',
      'Hero tries to reach the goal unseen.',
      'Improve the guard\'s rules after each round.',
    ],
    expected: 'Students implement a simple state machine (patrol/chase) by hand.',
  },
  miniChallenge: 'Write 3 rules that make a guard feel smart without being unfair.',
  project: {
    title: 'Design a Game Enemy',
    description: 'Plan an NPC with states, triggers and a difficulty setting.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Name your enemy and its goal.',
      'List its states (e.g. patrol, chase, flee).',
      'Write what triggers each switch.',
      'Add one fair difficulty option.',
    ],
    expectedOutput: 'A design sheet with at least 3 states and clear triggers.',
    extensions: ['Add a "learns from player" idea.', 'Add a weakness players can exploit.'],
  },
  logic: 'Finite state machines + search: modelling behaviour as states and finding paths are powerful, reusable computational patterns.',
  discussion: [
    'Should a game AI ever "cheat" to be more fun? Where is the line?',
    'What makes an enemy feel fair vs unfair?',
    'Would you want an AI that adapts to beat YOUR style?',
  ],
  careers: [
    'Game AI Programmer — codes NPC behaviour.',
    'Game Designer — balances challenge and fun.',
    'QA Tester — checks the AI behaves well.',
  ],
  homework: [
    'Play a game and spot when an enemy switches "states".',
    'Sketch a state diagram for one game character.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Switching between patrol, chase and flee is an example of a…', options: ['State machine', 'Spreadsheet', 'Paintbrush', 'Battery'], answer: 'State machine', explanation: 'States with triggers control behaviour.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Finding a route to the player uses…', options: ['Pathfinding', 'Tokenising', 'Charging', 'Cooking'], answer: 'Pathfinding', explanation: 'Algorithms like A* find paths.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What does NPC stand for?', answer: 'Non-Player Character.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Design one rule that makes an enemy fun but fair.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const aiInEducation = lesson({
  title: 'AI in Education',
  module: M2,
  summary: 'See how AI tutors, quizzes and tools can make learning personal and fun.',
  hook: 'What if your lessons knew exactly what YOU find hard and helped you there first?',
  story: 'ARIA becomes a study buddy. She notices you ace addition but stumble on fractions. So she gives you more fraction practice and cheers your progress. Learning suddenly feels made-just-for-you.',
  layman: 'AI in education can act like a personal tutor: it spots what you find tricky, gives the right practice, answers questions any time, and frees teachers to focus on each student. It is a helper, not a replacement for teachers.',
  concept: 'Educational AI personalises learning (adaptive practice based on performance), provides instant feedback, generates quizzes, supports accessibility (text-to-speech, translation), and gives teachers analytics. Best practice keeps the human teacher central and uses AI as support.',
  analogies: [
    { concept: 'Adaptive learning', analogy: 'A personal coach', explanation: 'A coach trains your weak spots, not what you already nailed.' },
    { concept: 'Instant feedback', analogy: 'A mirror', explanation: 'You see your mistakes immediately and can fix them.' },
  ],
  howItWorks: [
    'The system sees your answers and progress.',
    'It spots topics you find difficult.',
    'It serves practice at the right level.',
    'It gives instant feedback and hints.',
    'Teachers get a summary to help you more.',
  ],
  realWorld: [
    'Apps that adapt maths problems to your level.',
    'Language apps with instant pronunciation feedback.',
    'AI tutors that answer homework questions.',
    'Text-to-speech for students who learn by listening.',
    'Auto-generated quizzes from a lesson.',
  ],
  facts: [
    'AI can translate lessons into many languages instantly.',
    'Instant feedback helps students learn faster than waiting days.',
    'AI tutors are patient — they never get tired of your questions.',
  ],
  activity: {
    title: 'Design Your AI Tutor',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a subject you find tricky.',
      'List 3 ways an AI tutor could help you.',
      'Write one rule to keep it honest (no doing your work FOR you).',
      'Share your tutor idea with a partner.',
    ],
    expected: 'Students propose 3 helpful, honest uses of an AI tutor.',
  },
  miniChallenge: 'Write the perfect hint an AI tutor should give without revealing the answer.',
  project: {
    title: 'My Smart Study Planner',
    description: 'Build a simple "adaptive" study plan that focuses on weak topics.',
    materials: ['Worksheet', 'Coloured pens'],
    steps: [
      'Rate 5 topics from easy to hard for you.',
      'Give the hardest topics more practice time.',
      'Add a reward after each goal.',
      'Plan a quick self-quiz to check progress.',
    ],
    expectedOutput: 'A personalised study plan that spends more time on weaker topics.',
    extensions: ['Add a "ask for help" step.', 'Track progress for a week.'],
  },
  logic: 'Feedback loops + personalisation: measuring, adjusting and repeating is exactly how both good study habits and machine learning improve.',
  discussion: [
    'Should an AI ever do your homework for you? Why or why not?',
    'How can AI help students who learn differently?',
    'What can a human teacher do that an AI cannot?',
  ],
  careers: [
    'EdTech Developer — builds learning apps.',
    'Learning Scientist — studies how people learn best.',
    'Accessibility Specialist — makes learning work for everyone.',
  ],
  homework: [
    'Use an AI tool to make one practice quiz for yourself.',
    'List one topic you want an AI tutor to help you master.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Adaptive learning means the practice…', options: ['Matches your level and weak spots', 'Is the same for everyone', 'Never changes', 'Is random'], answer: 'Matches your level and weak spots', explanation: 'It personalises to you.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A good AI tutor should…', options: ['Give hints and feedback', 'Do all your work for you', 'Replace your teacher', 'Hide your mistakes'], answer: 'Give hints and feedback', explanation: 'It supports, not replaces, real learning.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one way AI can help students who struggle to read text.', answer: 'Text-to-speech (read it aloud).', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'How could an AI tutor be unfair if its data only came from one type of student?', answer: 'Open-ended (bias toward that group).', difficulty: 'advanced' },
  ],
});

const DAILY_LIFE = [smartAssistants, recommendations, googleMaps, smartHomes, aiInGames, aiInEducation];

// =====================================================================
//  MODULE 3 · COMPUTATIONAL THINKING
// =====================================================================
const M3 = 'Computational Thinking';

const patternRecognition = lesson({
  title: 'Pattern Recognition',
  module: M3,
  summary: 'Train your brain to spot patterns — the superpower behind all AI.',
  hook: '2, 4, 6, 8, … what comes next? Your brain just did the exact thing AI does billions of times a second.',
  story: 'ARIA stares at a messy pile of beads. Slowly she notices: red, blue, red, blue… a pattern! Once she sees it, she can predict the next bead every time. "Patterns are how I learn anything," she beams.',
  layman: 'A pattern is something that repeats or follows a rule. Spotting patterns lets you predict what comes next, sort things into groups, and understand the world faster. AI is basically a champion pattern-spotter.',
  concept: 'Pattern recognition is identifying regularities, sequences and structures in data. It enables prediction (next item), classification (group membership) and anomaly detection (what breaks the pattern). It is the foundation of machine learning.',
  analogies: [
    { concept: 'Pattern', analogy: 'A song chorus', explanation: 'It repeats, so you can sing along before it plays.' },
    { concept: 'Anomaly', analogy: 'A wrong note', explanation: 'You instantly notice the one thing that breaks the pattern.' },
  ],
  howItWorks: [
    'Look at examples or a sequence.',
    'Find what repeats or the rule behind it.',
    'Use the rule to predict the next item.',
    'Use it to group similar things.',
    'Notice anything that breaks the pattern.',
  ],
  realWorld: [
    'Weather patterns predicting tomorrow\'s rain.',
    'Banks spotting an unusual (anomaly) transaction.',
    'Music apps grouping songs by mood.',
    'Doctors spotting patterns in symptoms.',
    'Spam filters recognising "spammy" patterns.',
  ],
  facts: [
    'Your brain is wired to find patterns — even in clouds!',
    'Finding what BREAKS a pattern (anomaly detection) catches fraud.',
    'All machine learning is advanced pattern recognition.',
  ],
  activity: {
    title: 'Pattern Detective',
    materials: ['Pattern cards', 'Worksheet'],
    steps: [
      'Solve number, shape and colour pattern puzzles.',
      'Create your own pattern and swap with a friend.',
      'Add one "odd one out" that breaks the pattern.',
      'Explain the rule behind each pattern.',
    ],
    expected: 'Students extend patterns and explain the rule, including spotting an anomaly.',
  },
  miniChallenge: 'Create the trickiest pattern you can. If a friend cracks it in 20 seconds, they win!',
  project: {
    title: 'Pattern Art Gallery',
    description: 'Design artwork built entirely from repeating patterns.',
    materials: ['Paper', 'Colours'],
    steps: [
      'Choose 2–3 simple shapes/colours.',
      'Repeat them with a clear rule.',
      'Hide one "anomaly" for viewers to find.',
      'Write the rule on the back.',
    ],
    expectedOutput: 'Pattern art with a clear rule and one hidden anomaly.',
    extensions: ['Make a pattern that changes over the page.', 'Combine two patterns into one.'],
  },
  logic: 'Pattern recognition is one of the four pillars of computational thinking — it lets us generalise from examples to a rule.',
  discussion: [
    'Where do you see patterns in nature?',
    'Why is spotting a BROKEN pattern so useful?',
    'Can a pattern ever fool you into a wrong prediction?',
  ],
  careers: [
    'Data Scientist — finds patterns in huge datasets.',
    'Fraud Analyst — spots anomalies that signal cheating.',
    'Meteorologist — reads weather patterns.',
  ],
  homework: [
    'Find 3 patterns at home (tiles, music, routines).',
    'Make a pattern puzzle to challenge your family.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'What comes next: 3, 6, 9, 12, …?', options: ['15', '13', '20', '10'], answer: '15', explanation: 'Add 3 each time.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Spotting the item that BREAKS a pattern is called…', options: ['Anomaly detection', 'Charging', 'Painting', 'Booting'], answer: 'Anomaly detection', explanation: 'It finds the odd one out.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Pattern recognition lets AI do what with the next item?', answer: 'Predict it.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A spam filter sees a new "spammy" email it has never seen. How can it still catch it?', answer: 'It recognises the spam pattern, not the exact email.', difficulty: 'intermediate' },
  ],
});

const logicBuilding = lesson({
  title: 'Logic Building',
  module: M3,
  summary: 'Use AND, OR, NOT and IF-THEN to think clearly like a computer.',
  hook: 'A game says: "You win IF you have the key AND the door is unlocked." Change one word and the whole rule changes. Welcome to logic!',
  story: 'ARIA must open a treasure chest. The rule: open IF you have the key AND you say the password. ARIA learns that "AND" means BOTH, "OR" means EITHER, and "NOT" flips it. With logic, she cracks the chest.',
  layman: 'Logic is clear thinking using rules. Words like AND, OR, NOT and IF-THEN let you build exact conditions. Computers and AI run entirely on this kind of true/false logic.',
  concept: 'Logical reasoning uses Boolean operators (AND, OR, NOT) and conditionals (IF-THEN-ELSE) to combine true/false conditions into decisions. It is the foundation of programming, circuits and AI decision rules.',
  analogies: [
    { concept: 'AND', analogy: 'A double lock', explanation: 'Both locks must open for the door to open.' },
    { concept: 'OR', analogy: 'Two doors to one room', explanation: 'Either door gets you in.' },
  ],
  howItWorks: [
    'State conditions as true or false.',
    'Combine them with AND, OR, NOT.',
    'Use IF-THEN to decide an action.',
    'Add ELSE for the other case.',
    'Test with different inputs.',
  ],
  realWorld: [
    'Login: access IF correct username AND password.',
    'Smart light: on IF dark AND motion.',
    'Game: win IF score high OR time left.',
    'Search filters: shoes that are red AND size 7.',
    'Safety: alarm IF smoke AND NOT test mode.',
  ],
  facts: [
    'Boolean logic is named after mathematician George Boole.',
    'Every computer chip is built from tiny AND/OR/NOT gates.',
    'One wrong AND/OR can flip a whole program\'s behaviour.',
  ],
  activity: {
    title: 'Logic Gate Game',
    materials: ['True/false cards', 'Operator cards'],
    steps: [
      'Give pairs an AND, OR, or NOT card.',
      'Feed them true/false inputs.',
      'They output the correct result.',
      'Build a chain of gates for a tricky rule.',
    ],
    expected: 'Students correctly evaluate AND/OR/NOT and a small combined rule.',
  },
  miniChallenge: 'Write a rule for "free entry" using AND, OR and NOT all in one sentence.',
  project: {
    title: 'Build a Rule Machine',
    description: 'Design IF-THEN rules for a fun decision (e.g. "what to wear").',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a daily decision.',
      'Write 4 IF-THEN-ELSE rules for it.',
      'Use AND/OR/NOT in at least two rules.',
      'Test the rules with 3 situations.',
    ],
    expectedOutput: 'A rule set that makes correct decisions for 3 test cases.',
    extensions: ['Add a tricky "edge case".', 'Draw it as a flowchart.'],
  },
  logic: 'Boolean logic and conditionals are the literal building blocks of code and AI decisions — clear logic prevents costly bugs.',
  discussion: [
    'How does changing "AND" to "OR" change a rule?',
    'Where in daily life do you use IF-THEN thinking?',
    'Can too many rules make a system confusing?',
  ],
  careers: [
    'Software Developer — writes logic into programs.',
    'Hardware Engineer — designs logic-gate circuits.',
    'Game Designer — builds rule systems.',
  ],
  homework: [
    'Write 3 IF-THEN rules your family follows.',
    'Find an "AND" rule and an "OR" rule in a game you play.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'For AND to be true…', options: ['Both conditions must be true', 'Only one must be true', 'None can be true', 'It is random'], answer: 'Both conditions must be true', explanation: 'AND needs everything true.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'NOT does what to a value?', options: ['Flips it (true↔false)', 'Doubles it', 'Deletes it', 'Colours it'], answer: 'Flips it (true↔false)', explanation: 'NOT inverts the value.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Which operator is true if EITHER condition is true?', answer: 'OR.', difficulty: 'beginner' },
    { qtype: 'computational', prompt: 'Is (true AND false) OR (NOT false) true or false?', options: ['true', 'false'], answer: 'true', explanation: '(false) OR (true) = true.', difficulty: 'advanced' },
  ],
});

const algorithms = lesson({
  title: 'Algorithms',
  module: M3,
  summary: 'Learn to write exact step-by-step instructions a computer can follow.',
  hook: 'Could you write instructions so clear that a robot makes a perfect sandwich — without burning the kitchen down?',
  story: 'ARIA is asked to make tea but freezes — the steps were vague. The class writes EXACT steps: boil water, add tea, wait 3 minutes… ARIA follows perfectly. "An algorithm is a recipe I can trust," she says.',
  layman: 'An algorithm is a clear, ordered list of steps to solve a problem or do a task — like a recipe. Computers and AI follow algorithms to get reliable results every time.',
  concept: 'An algorithm is a finite, ordered sequence of unambiguous steps that solves a problem or completes a task. Good algorithms are correct, clear and efficient. They may include loops (repeat) and conditionals (decisions).',
  analogies: [
    { concept: 'Algorithm', analogy: 'A recipe', explanation: 'Exact ordered steps anyone can follow for the same result.' },
    { concept: 'Loop', analogy: 'Stirring "until smooth"', explanation: 'Repeat an action until a condition is met.' },
  ],
  howItWorks: [
    'Understand the goal clearly.',
    'Break it into small ordered steps.',
    'Add decisions (IF) and repeats (loops) as needed.',
    'Test the steps on real input.',
    'Fix (debug) any step that fails.',
  ],
  realWorld: [
    'A recipe for cooking a dish.',
    'Steps to tie your shoelaces.',
    'Sorting names into alphabetical order.',
    'A search engine ranking results.',
    'GPS computing a route.',
  ],
  facts: [
    'The word "algorithm" comes from the mathematician Al-Khwarizmi.',
    'Sorting algorithms can order millions of items in a blink.',
    'A tiny missed step can change the whole result.',
  ],
  activity: {
    title: 'Robot Sandwich',
    materials: ['Paper', 'Pens (optional: real bread!)'],
    steps: [
      'Write exact steps to make a sandwich.',
      'A partner follows them LITERALLY.',
      'Find where the steps fail (debug).',
      'Rewrite until it works perfectly.',
    ],
    expected: 'Students write and debug a precise step-by-step algorithm.',
  },
  miniChallenge: 'Write the shortest correct algorithm to brush your teeth — fewest steps that still works wins!',
  project: {
    title: 'Everyday Algorithm Book',
    description: 'Create a mini-book of algorithms for 3 daily tasks.',
    materials: ['Paper', 'Pens'],
    steps: [
      'Pick 3 tasks (e.g. morning routine).',
      'Write numbered, exact steps for each.',
      'Add at least one loop and one decision.',
      'Test each on a friend.',
    ],
    expectedOutput: 'A mini-book of 3 tested algorithms including a loop and a decision.',
    extensions: ['Add a "what if it goes wrong" step.', 'Turn one into a flowchart.'],
  },
  logic: 'Algorithmic thinking — decomposing a task into precise, ordered, testable steps — is the core skill of all computing and AI.',
  discussion: [
    'Why must algorithm steps be exact and ordered?',
    'When is a SHORTER algorithm better? When is it worse?',
    'How is debugging like detective work?',
  ],
  careers: [
    'Software Engineer — designs and codes algorithms.',
    'Operations Planner — optimises real-world processes.',
    'Chef / Recipe Developer — writes precise food "algorithms".',
  ],
  homework: [
    'Write an algorithm for your morning routine.',
    'Find a bug in a sibling\'s or friend\'s instructions.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'An algorithm is…', options: ['Exact ordered steps to solve a problem', 'A type of robot', 'A random guess', 'A picture'], answer: 'Exact ordered steps to solve a problem', explanation: 'Like a recipe.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Repeating steps until a condition is met is a…', options: ['Loop', 'Pixel', 'Token', 'Prompt'], answer: 'Loop', explanation: 'Loops repeat actions.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do we call fixing mistakes in steps or code?', answer: 'Debugging.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write a 4-step algorithm to wash your hands.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const flowcharts = lesson({
  title: 'Flowcharts',
  module: M3,
  summary: 'Draw your thinking with boxes, diamonds and arrows.',
  hook: 'What if you could DRAW a plan so clearly that anyone could follow it without a single word of explanation?',
  story: 'ARIA\'s steps get tangled in her head. You hand her shapes: a box for actions, a diamond for choices, arrows for flow. Suddenly her messy plan becomes a clean map anyone can read.',
  layman: 'A flowchart is a picture of an algorithm. Boxes show actions, diamonds show decisions (yes/no), and arrows show the order. It makes plans easy to see and share.',
  concept: 'Flowcharts visually represent processes using standard symbols: oval (start/end), rectangle (process/action), diamond (decision/branch), parallelogram (input/output), and arrows (flow). They make logic, branching and loops easy to understand and debug.',
  analogies: [
    { concept: 'Flowchart', analogy: 'A board game path', explanation: 'You move along arrows; diamonds are "choose your path" squares.' },
    { concept: 'Decision diamond', analogy: 'A fork in the road', explanation: 'Yes goes one way, No goes the other.' },
  ],
  howItWorks: [
    'Start with a Start oval.',
    'Add action boxes in order.',
    'Use a diamond for each yes/no decision.',
    'Connect everything with arrows.',
    'End with an End oval.',
  ],
  realWorld: [
    'Troubleshooting guides ("Is it plugged in? Yes/No").',
    'Emergency procedures and evacuation plans.',
    'Planning an app\'s screens.',
    'Cooking decision guides.',
    'Customer-support phone menus.',
  ],
  facts: [
    'Flowcharts use the same symbols worldwide, so anyone can read them.',
    'Engineers draw flowcharts BEFORE writing code.',
    'A diamond always has at least two arrows out (yes and no).',
  ],
  activity: {
    title: 'Flowchart It!',
    materials: ['Shape cut-outs', 'Arrows', 'Paper'],
    steps: [
      'Pick a simple decision (e.g. "Should I take an umbrella?").',
      'Lay out start, actions, a decision diamond, and end.',
      'Connect with arrows.',
      'Swap and follow a friend\'s flowchart.',
    ],
    expected: 'Students build a correct flowchart with at least one decision branch.',
  },
  miniChallenge: 'Turn "crossing the road safely" into a flowchart with 2 decisions in 5 minutes.',
  project: {
    title: 'Decision Flowchart Poster',
    description: 'Create a helpful flowchart others can actually use.',
    materials: ['Poster paper', 'Markers'],
    steps: [
      'Choose a useful decision (e.g. "What game to play?").',
      'Draw it with correct symbols.',
      'Include at least 2 decision diamonds.',
      'Test it on 2 classmates.',
    ],
    expectedOutput: 'A clear, usable flowchart poster with correct symbols and 2 decisions.',
    extensions: ['Add a loop ("try again").', 'Convert it into an algorithm in words.'],
  },
  logic: 'Visual modelling: turning logic into a diagram reveals branches and gaps you might miss in plain text — a key planning and debugging skill.',
  discussion: [
    'Why draw a flowchart before building something?',
    'When is a picture clearer than written steps?',
    'How do flowcharts help teams agree on a plan?',
  ],
  careers: [
    'Systems Analyst — maps how processes work.',
    'Software Architect — designs program flow.',
    'Process Engineer — improves workflows.',
  ],
  homework: [
    'Flowchart your route to school with one decision.',
    'Find a flowchart in a manual or sign and copy it.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Which shape means a DECISION in a flowchart?', options: ['Diamond', 'Rectangle', 'Oval', 'Arrow'], answer: 'Diamond', explanation: 'Diamonds branch yes/no.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A rectangle in a flowchart usually means…', options: ['An action/process', 'A decision', 'The end', 'A loop only'], answer: 'An action/process', explanation: 'Rectangles are process steps.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'How many arrows come OUT of a decision diamond (at least)?', answer: 'Two (yes and no).', difficulty: 'intermediate' },
    { qtype: 'tinkering', prompt: 'Sketch (in words) a flowchart for "Is it raining? umbrella or not".', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const problemSolving = lesson({
  title: 'Problem Solving',
  module: M3,
  summary: 'Crack big problems by breaking them into small, solvable pieces.',
  hook: 'How do you eat an elephant? One bite at a time. Big problems work exactly the same way.',
  story: 'ARIA faces a HUGE messy task and panics. You teach her to break it into tiny parts, solve each, then combine. The giant problem shrinks into easy steps. "Anything is solvable in pieces," ARIA realises.',
  layman: 'Problem solving means understanding a problem, breaking it into smaller parts (decomposition), solving each part, and combining the solutions. It is the heart of both human and computer thinking.',
  concept: 'Structured problem solving: (1) understand/define the problem, (2) decompose into sub-problems, (3) abstract away irrelevant detail, (4) plan an algorithm, (5) solve and test, (6) reflect and improve. Decomposition and abstraction are core computational-thinking pillars.',
  analogies: [
    { concept: 'Decomposition', analogy: 'Building with LEGO', explanation: 'A big model is just many small, simple pieces combined.' },
    { concept: 'Abstraction', analogy: 'A map, not the whole city', explanation: 'Keep only the details that matter; ignore the rest.' },
  ],
  howItWorks: [
    'Understand exactly what the problem asks.',
    'Break it into smaller sub-problems.',
    'Ignore details that do not matter (abstraction).',
    'Solve each piece, then combine.',
    'Test, reflect and improve.',
  ],
  realWorld: [
    'Planning a class event step by step.',
    'Engineers designing a bridge in sections.',
    'Coders splitting an app into functions.',
    'Doctors diagnosing one symptom at a time.',
    'Athletes mastering a skill drill by drill.',
  ],
  facts: [
    'Breaking problems down is called "decomposition".',
    'Most big inventions are many small solved problems combined.',
    '"Abstraction" lets you ignore noise and focus on what matters.',
  ],
  activity: {
    title: 'Break It Down',
    materials: ['Big-problem cards', 'Sticky notes'],
    steps: [
      'Pick a big task (e.g. "plan a party").',
      'Write each sub-task on a sticky note.',
      'Order them and assign who does what.',
      'Spot which parts can happen at the same time.',
    ],
    expected: 'Students decompose a big task into ordered, manageable sub-tasks.',
  },
  miniChallenge: 'Break "make breakfast for the family" into the FEWEST clear sub-steps that still work.',
  project: {
    title: 'Solve a Real Problem',
    description: 'Pick a small real problem at school/home and design a step-by-step solution.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Define the problem in one sentence.',
      'List 3–5 sub-problems.',
      'Plan a solution for each.',
      'Combine into one clear plan and test it.',
    ],
    expectedOutput: 'A documented problem broken into parts with a tested plan.',
    extensions: ['Add what could go wrong.', 'Suggest an improvement after testing.'],
  },
  logic: 'Decomposition + abstraction are two of the four computational-thinking pillars — they make impossible-looking problems achievable.',
  discussion: [
    'Why does breaking a problem down make it easier?',
    'What details can you safely ignore (abstract away)?',
    'Which is harder: defining the problem or solving it?',
  ],
  careers: [
    'Engineer — solves complex problems in parts.',
    'Project Manager — breaks projects into tasks.',
    'Scientist — designs step-by-step experiments.',
  ],
  homework: [
    'Break one chore into 5 sub-steps and do it faster.',
    'Help solve a family problem by listing the parts.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Breaking a big problem into smaller parts is…', options: ['Decomposition', 'Charging', 'Painting', 'Tokenising'], answer: 'Decomposition', explanation: 'A key problem-solving pillar.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Ignoring unimportant details to focus on what matters is…', options: ['Abstraction', 'Decoration', 'Deletion', 'Duplication'], answer: 'Abstraction', explanation: 'Keep only what matters.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What is the FIRST step of good problem solving?', answer: 'Understand/define the problem.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Break "organise a class trip" into 4 sub-problems.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const decisionMaking = lesson({
  title: 'Decision Making',
  module: M3,
  summary: 'Learn how humans and AI weigh options to choose the best action.',
  hook: 'Should you carry an umbrella? Your brain weighs clues in a flash. AI makes decisions the same way — with data and rules.',
  story: 'ARIA must choose: which path leads to treasure? She lists options, weighs the clues, scores each path, and picks the best. When she is unsure, she gathers more data first. Smart choices, every time.',
  layman: 'Decision making is choosing the best option from several, using information and goals. AI makes decisions by scoring options against data and rules, then picking the highest score — but humans set the goals and values.',
  concept: 'Decision making evaluates options against criteria to select an action. AI uses decision rules, decision trees, probabilities, and scoring (utility) to choose. Good decisions weigh trade-offs and uncertainty; humans must set goals, values and limits.',
  analogies: [
    { concept: 'Decision tree', analogy: 'A choose-your-adventure book', explanation: 'Each choice leads to a branch with new choices.' },
    { concept: 'Scoring options', analogy: 'A talent-show scoreboard', explanation: 'Rate each option; the highest score wins.' },
  ],
  howItWorks: [
    'List the possible options.',
    'Decide what matters (criteria/goals).',
    'Score each option against the criteria.',
    'Handle uncertainty (gather more data if needed).',
    'Pick the best and review the result.',
  ],
  realWorld: [
    'A self-driving car deciding to brake or steer.',
    'A bank deciding to approve a loan.',
    'A game AI choosing its next move.',
    'A doctor choosing a treatment plan.',
    'You choosing what to study first tonight.',
  ],
  facts: [
    'Decision trees are a popular, easy-to-read AI method.',
    'AI can weigh thousands of options in a heartbeat.',
    'Setting the right GOAL is the most important human job.',
  ],
  activity: {
    title: 'Decision Scoreboard',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a choice (e.g. which game to buy).',
      'List 3 options and 3 things that matter.',
      'Score each option 1–5 per criterion.',
      'Add up and pick the winner.',
    ],
    expected: 'Students use a scoring table to make and justify a decision.',
  },
  miniChallenge: 'Build a 2-question decision tree to pick a snack. Smallest tree that works wins!',
  project: {
    title: 'My Decision Tree',
    description: 'Draw a decision tree for a real everyday choice.',
    materials: ['Paper', 'Pens'],
    steps: [
      'Choose a decision (what to wear, what to eat).',
      'Write yes/no questions as branches.',
      'End each branch with an action.',
      'Test it with 3 different situations.',
    ],
    expectedOutput: 'A working decision tree that gives sensible choices for 3 cases.',
    extensions: ['Add a "not sure → gather info" branch.', 'Score branches by how often they happen.'],
  },
  logic: 'Decision trees and scoring make reasoning explicit and testable — turning fuzzy "gut feelings" into clear, improvable logic.',
  discussion: [
    'Should an AI ever make a life-or-death decision alone?',
    'How do you decide when you do not have enough information?',
    'Who should be responsible if an AI makes a bad decision?',
  ],
  careers: [
    'Data Scientist — builds decision models.',
    'Operations Researcher — optimises big decisions.',
    'Policy Maker — sets goals and limits for AI decisions.',
  ],
  homework: [
    'Make a scoreboard to decide a real family choice.',
    'Draw a decision tree for picking a movie.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'A "choose-your-adventure" style AI method is a…', options: ['Decision tree', 'Pixel grid', 'Token jar', 'Battery'], answer: 'Decision tree', explanation: 'Branches of choices.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Who should set the GOALS an AI optimises for?', options: ['Humans', 'Nobody', 'The weather', 'The printer'], answer: 'Humans', explanation: 'People set values and goals.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What should you do when you lack enough info to decide?', answer: 'Gather more data first.', difficulty: 'intermediate' },
    { qtype: 'logical', prompt: 'Two options score equally. What extra criterion could break the tie fairly?', answer: 'Open-ended (cost, safety, time, fairness).', difficulty: 'advanced' },
  ],
});

const COMPUTATIONAL = [patternRecognition, logicBuilding, algorithms, flowcharts, problemSolving, decisionMaking];

// =====================================================================
//  MODULE 4 · MACHINE LEARNING
// =====================================================================
const M4 = 'Machine Learning';

const whatIsML = lesson({
  title: 'What is Machine Learning?',
  module: M4,
  difficulty: 'intermediate',
  summary: 'Understand how machines learn patterns from examples instead of fixed rules.',
  hook: 'Nobody wrote a rule "a cat has pointy ears AND whiskers AND…". So how does an app tell a cat from a dog? It learned it.',
  story: 'ARIA looks at 100 cat photos and 100 dog photos. Slowly she notices ear shapes, face length, the way they sit. Nobody told her the rules — she discovered the PATTERN. That is Machine Learning, and today you are her teacher.',
  layman: 'Machine Learning (ML) is the part of AI where the machine learns patterns from examples instead of being given every rule. Show it lots of labelled examples and it figures out the rule itself.',
  concept: 'Machine Learning: algorithms that improve at a task by learning patterns from data. Three main types — supervised (learns from labelled examples to predict), unsupervised (finds hidden groups in unlabelled data), and reinforcement (learns by trial-and-error using rewards).',
  analogies: [
    { concept: 'Supervised learning', analogy: 'Flashcards with answers', explanation: 'See question + answer many times, then answer new ones.' },
    { concept: 'Reinforcement learning', analogy: 'Training a puppy with treats', explanation: 'Good move → treat; it learns to repeat what earns rewards.' },
  ],
  howItWorks: [
    'Pick a task (e.g. tell cats from dogs).',
    'Feed examples (labelled, for supervised learning).',
    'The algorithm adjusts to reduce mistakes — TRAINING.',
    'It forms a MODEL that captures the pattern.',
    'Test on new, unseen examples to measure accuracy.',
  ],
  realWorld: [
    'Email spam detection.',
    'Handwriting and voice recognition.',
    'Grouping shoppers with similar habits.',
    'Game bots that learn by playing.',
    'Photo apps recognising your friends.',
  ],
  facts: [
    'The term "Machine Learning" was coined in 1959 by Arthur Samuel.',
    'Most AI you use daily is supervised learning.',
    'Reinforcement learning taught a computer to beat champions at Go.',
  ],
  activity: {
    title: 'Human Machine-Learning Game',
    materials: ['Flashcards with labels', 'Mystery cards'],
    steps: [
      'One student is the "model"; show them 10 labelled cards (training).',
      'Hide labels and show new cards — they predict.',
      'Class gives feedback on each guess.',
      'Add more varied cards and watch accuracy improve.',
    ],
    expected: 'Students physically experience train → predict → improve with feedback.',
  },
  miniChallenge: 'Match 3 examples to the correct ML type (supervised/unsupervised/reinforcement) in 30 seconds.',
  project: {
    title: 'Design an ML Recipe',
    description: 'Plan on paper how to teach a machine a task of your choice.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a task (sort recyclables, win a maze).',
      'Choose the ML type that fits.',
      'List the data you would need.',
      'Describe how it would learn and how you would test it.',
    ],
    expectedOutput: 'A one-page ML plan with the right learning type and a testing idea.',
    extensions: ['Find a real product using your chosen type.', 'Predict one way it could fail.'],
  },
  logic: 'Abstraction: ML replaces hand-written rules with learned patterns — and choosing the right learning type is a key decision-making skill.',
  discussion: [
    'Why is "learning from examples" more powerful than writing every rule?',
    'When might ML make a wrong pattern?',
    'Which everyday app do you think uses ML the most?',
  ],
  careers: [
    'Machine Learning Engineer — builds and trains models.',
    'Data Scientist — finds patterns and insights in data.',
    'AI Product Manager — decides what ML should solve.',
  ],
  homework: [
    'Find 3 apps that likely use ML and say what each predicts.',
    'Teach someone a small skill using examples + feedback.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Machine Learning means the machine…', options: ['Learns patterns from examples', 'Is given every rule by a human', 'Never changes', 'Only adds numbers'], answer: 'Learns patterns from examples', explanation: 'It learns rather than being fully programmed.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Learning from labelled examples is…', options: ['Supervised learning', 'Unsupervised learning', 'Sleeping', 'Reinforcement learning'], answer: 'Supervised learning', explanation: 'Labels = supervision.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do we call the pattern an ML algorithm learns?', answer: 'A model.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'You have customer data but NO labels and want shopper "groups". Which ML type fits?', answer: 'Unsupervised learning.', difficulty: 'advanced' },
  ],
});

const trainingVsTesting = lesson({
  title: 'Training vs Testing',
  module: M4,
  difficulty: 'intermediate',
  summary: 'Learn why we always test an AI on data it has never seen before.',
  hook: 'A student who memorised the answer key looks perfect — until the real exam has new questions. AI has the exact same trap.',
  story: 'ARIA scores 100% on her practice cards. She brags! Then you show her brand-new cards and she fumbles. ARIA learns the golden rule: the only honest test uses questions she has never seen.',
  layman: 'We split data into two parts: a training set to teach the AI, and a testing set (kept secret during training) to check it honestly. If it only does well on training data, it just memorised — that is called overfitting.',
  concept: 'Models are trained on a training set and evaluated on a separate, unseen test set. Accuracy on unseen data is the honest measure of how well a model generalises. Overfitting = great on training data but poor on new data (memorising, not learning).',
  analogies: [
    { concept: 'Train/test split', analogy: 'Practice vs real exam', explanation: 'Practice to learn, then prove it on new questions.' },
    { concept: 'Overfitting', analogy: 'Memorising the answer key', explanation: 'Perfect on seen questions, lost on new ones.' },
  ],
  howItWorks: [
    'Split data: most for training, some kept aside for testing.',
    'Train the model only on the training set.',
    'Hide the test set during training.',
    'Test on the unseen set and measure accuracy.',
    'If train ≫ test accuracy, it is overfitting — fix it.',
  ],
  realWorld: [
    'A spam filter tested on brand-new emails.',
    'A medical AI validated on new patients.',
    'A self-driving model tested on unseen roads.',
    'A grading AI checked on fresh essays.',
    'A weather model tested on next week\'s data.',
  ],
  facts: [
    'Testing on training data gives a fake, too-high score.',
    'Overfitting is one of the most common ML mistakes.',
    'A common split is about 80% train / 20% test.',
  ],
  activity: {
    title: 'Practice vs Real Exam',
    materials: ['Two card sets: "practice" and "secret"'],
    steps: [
      'Train a "model" student on practice cards only.',
      'Test them on the secret cards.',
      'Compare practice score vs secret score.',
      'Discuss what a big gap means (overfitting).',
    ],
    expected: 'Students see why unseen-data testing is the honest measure.',
  },
  miniChallenge: 'Explain overfitting in ONE sentence a 6-year-old would understand.',
  project: {
    title: 'Split & Score',
    description: 'Take 10 example cards, split them, and run a fair test.',
    materials: ['10 example cards', 'Worksheet'],
    steps: [
      'Split 10 cards into 8 train / 2 test.',
      'Teach a partner using only the 8.',
      'Test them on the 2 unseen cards.',
      'Record both scores and explain the gap.',
    ],
    expectedOutput: 'A recorded train vs test score with an explanation of any gap.',
    extensions: ['Try a 5/5 split and compare.', 'Add a tricky test card.'],
  },
  logic: 'Honest evaluation: generalisation (doing well on new data) is the true goal of learning — for machines and for you.',
  discussion: [
    'Why is scoring 100% sometimes a BAD sign?',
    'How is studying for a test like training a model?',
    'What could happen if a self-driving car was never tested on new roads?',
  ],
  careers: [
    'ML Engineer — designs train/test pipelines.',
    'Quality Assurance Analyst — validates models honestly.',
    'Research Scientist — measures generalisation.',
  ],
  homework: [
    'Study with practice questions, then test yourself with new ones.',
    'Explain "overfitting" to a family member with an example.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'After training, the honest test uses…', options: ['New, unseen data', 'The same training data', 'No data', 'A calculator'], answer: 'New, unseen data', explanation: 'Only unseen data is honest.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Great on training data but bad on new data is…', options: ['Overfitting', 'Perfect', 'Unsupervised', 'A robot'], answer: 'Overfitting', explanation: 'It memorised instead of learning.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Why keep a test set secret during training?', answer: 'So the score honestly shows performance on new data.', difficulty: 'beginner' },
    { qtype: 'computational', prompt: 'A model gets 9 of 10 unseen items right. What is its test accuracy?', options: ['90%', '9%', '100%', '19%'], answer: '90%', explanation: '9/10 = 90%.', difficulty: 'beginner' },
  ],
});

const dataAndLabels = lesson({
  title: 'Data and Labels',
  module: M4,
  difficulty: 'intermediate',
  summary: 'See why good, varied, labelled data is the "food" that makes AI smart.',
  hook: 'If you only ever saw golden dogs, would you recognise a black dog? AI has the very same problem.',
  story: 'ARIA wants to know fruits. You show her 50 apples — she nails apples! Then a banana appears and she shouts "APPLE!". She was only ever FED apples. Lesson: AI is only as good as the data it eats.',
  layman: 'Data is information — pictures, numbers, sounds, words. A label is the correct answer attached to each example ("this is a cat"). Good, varied, fair data makes a smart AI; one-sided data makes a confused, biased one.',
  concept: 'Labelled data (each example tagged with the correct answer) trains supervised models. The quantity, quality, variety and fairness of data directly decide a model\'s accuracy and fairness. "Garbage in, garbage out."',
  analogies: [
    { concept: 'Data is food', analogy: 'Healthy diet vs junk food', explanation: 'Varied, balanced data → strong, fair AI; junk data → unhealthy guesses.' },
    { concept: 'Labels', analogy: 'Name tags at a party', explanation: 'A label tells the AI what each example IS.' },
  ],
  howItWorks: [
    'Collect examples (images, text, numbers, sound).',
    'Clean them — remove mistakes and duplicates.',
    'Label each with the correct answer.',
    'Balance classes so none is one-sided.',
    'Feed training data to the model.',
  ],
  realWorld: [
    'Spam filters learn from labelled "spam/not spam" emails.',
    'Self-driving cars learn from labelled road images.',
    'Music apps learn from songs you play and skip.',
    'Translation learns from labelled sentence pairs.',
    'Medical AI learns from labelled scans.',
  ],
  facts: [
    'Cleaning and labelling data is one of the biggest AI jobs.',
    'One-sided data creates biased AI — even unintentionally.',
    'Data cleaning can take up to 80% of a project\'s time.',
  ],
  activity: {
    title: 'Sort the Data Game',
    materials: ['Picture/word cards', 'Two labelled boxes'],
    steps: [
      'Agree on two labels (e.g. "Cat" vs "Not Cat").',
      'Place each card under the correct label (labelling).',
      'Teacher sneaks in tricky cards (a tiger, a toy cat).',
      'Discuss which were hard — that is where AI gets confused.',
    ],
    expected: 'Students label a small dataset and explain why variety matters.',
  },
  miniChallenge: 'Spot the "unfair" dataset (lots of one thing, little of another) the fastest.',
  project: {
    title: 'Build a Tiny Dataset',
    description: 'Collect and label a small, balanced two-class dataset.',
    materials: ['Magazine cut-outs or drawings', 'Labelled envelopes'],
    steps: [
      'Choose two clear categories.',
      'Collect 10 varied examples of each.',
      'Label every example correctly.',
      'Remove blurry/wrong ones and check balance.',
    ],
    expectedOutput: 'A clean, balanced, labelled mini-dataset of two categories.',
    extensions: ['Add a tricky edge case.', 'Count how balanced your classes are.'],
  },
  logic: 'Classification + fairness: balanced labelled data is how both humans and machines build fair, reliable knowledge — the seed of AI ethics.',
  discussion: [
    'Why might an AI trained only on sunny photos fail at night?',
    'Who decides the labels — and could they be wrong?',
    'How do you make a dataset fair?',
  ],
  careers: [
    'Data Annotator — labels data accurately.',
    'Data Engineer — builds clean data pipelines.',
    'ML Researcher — studies data quality and bias.',
  ],
  homework: [
    'Collect 10 varied photos of one object and explain why variety helps.',
    'Find one "unfair" example of data in real life.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A label in a dataset is…', options: ['A name tag with the right answer', 'A price', 'A password', 'A song'], answer: 'A name tag with the right answer', explanation: 'Labels give the correct answer.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Train a fruit AI ONLY on apples. A banana appears. Likely result?', options: ['It may wrongly say "apple"', 'It says "banana"', 'It explodes', 'Nothing'], answer: 'It may wrongly say "apple"', explanation: 'It only knows what it has seen.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Complete: "Garbage in, ____ out."', answer: 'garbage', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'List 3 ways to make a "recognise my pet" dataset varied and fair.', answer: 'Open-ended (angles, lighting, backgrounds).', difficulty: 'advanced' },
  ],
});

const classification = lesson({
  title: 'Classification',
  module: M4,
  difficulty: 'intermediate',
  summary: 'Teach AI to sort things into categories — cat or dog, spam or not.',
  hook: 'Your email knows "spam" from "not spam" without you sorting it. That sorting trick is called classification.',
  story: 'ARIA gets a job at the post office sorting letters into boxes by city. At first she is slow; with practice she sorts instantly. "Putting things in the right box — that is classification!" she says.',
  layman: 'Classification is teaching AI to put things into categories: spam/not spam, cat/dog, ripe/unripe. The AI learns from labelled examples, then predicts the category of new things.',
  concept: 'Classification is a supervised learning task that assigns inputs to discrete categories (classes). The model learns a decision boundary from labelled examples and outputs the most likely class (often with a confidence score). It can be binary (2 classes) or multi-class.',
  analogies: [
    { concept: 'Classification', analogy: 'Sorting laundry', explanation: 'Whites here, colours there — each item gets a category.' },
    { concept: 'Confidence', analogy: 'How sure you are', explanation: 'The AI says "90% cat" — its certainty about the class.' },
  ],
  howItWorks: [
    'Define the categories (classes).',
    'Train on labelled examples of each class.',
    'The model learns what separates the classes.',
    'For a new input, it predicts the most likely class.',
    'It reports a confidence score for the prediction.',
  ],
  realWorld: [
    'Spam vs not-spam email sorting.',
    'Identifying a plant or bird from a photo.',
    'Detecting ripe vs unripe fruit.',
    'Flagging a review as positive or negative.',
    'Sorting recycling into categories.',
  ],
  facts: [
    'Two-class problems are called "binary classification".',
    'Classifiers output a confidence, not just an answer.',
    'A confused classifier often mixes up similar classes.',
  ],
  activity: {
    title: 'Classify It!',
    materials: ['Mixed object cards', 'Category bins'],
    steps: [
      'Agree on 3 categories.',
      'Sort a pile of cards into the right bins.',
      'Add tricky items that could fit two categories.',
      'Discuss how you decided the borderline ones.',
    ],
    expected: 'Students classify items and explain a decision boundary for tricky cases.',
  },
  miniChallenge: 'Find an item that could belong to TWO categories and argue for each.',
  project: {
    title: 'Paper Classifier',
    description: 'Build a rule-based classifier for a chosen set of items.',
    materials: ['Cards', 'Worksheet'],
    steps: [
      'Pick 2–3 categories (e.g. fruit/veg/other).',
      'Write features that define each (colour, shape).',
      'Classify 10 new items using your rules.',
      'Note any item your rules got wrong.',
    ],
    expectedOutput: 'A classifier with clear features that sorts 10 items, noting errors.',
    extensions: ['Add a confidence score.', 'Add a "not sure" category.'],
  },
  logic: 'Decision boundaries: learning where one category ends and another begins is a fundamental ML idea — and a clear thinking skill.',
  discussion: [
    'What makes some items hard to classify?',
    'Should AI ever say "I am not sure"?',
    'What happens if categories overlap?',
  ],
  careers: [
    'ML Engineer — builds classifiers.',
    'Quality Inspector — uses vision classifiers in factories.',
    'Content Moderator Tools Developer — classifies posts.',
  ],
  homework: [
    'Classify your books or toys into 3 categories with rules.',
    'Find one thing your email sorted wrong and guess why.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Classification puts inputs into…', options: ['Categories (classes)', 'Random piles', 'One pile only', 'Numbers on a line'], answer: 'Categories (classes)', explanation: 'It assigns a class.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Two categories only is called…', options: ['Binary classification', 'Triple sort', 'Regression', 'Clustering'], answer: 'Binary classification', explanation: 'Binary = two classes.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What number tells how sure a classifier is?', answer: 'The confidence score.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'List 2 features that separate "cat" photos from "dog" photos.', answer: 'Open-ended (ear shape, face length…).', difficulty: 'intermediate' },
  ],
});

const prediction = lesson({
  title: 'Prediction',
  module: M4,
  difficulty: 'intermediate',
  summary: 'Use patterns in data to forecast numbers and what happens next.',
  hook: 'How does an app guess tomorrow\'s weather, or how much a house will cost? It predicts from patterns in past data.',
  story: 'ARIA studies ice-cream sales and notices: hotter days → more sales. So when a heatwave is coming, she predicts a sales spike — and she is right! Prediction means using the past to guess the future.',
  layman: 'Prediction means using patterns in past data to estimate a value or what happens next — like temperature, price, or scores. When AI predicts a number (not a category), it is called regression.',
  concept: 'Prediction (regression) estimates a continuous value from input features using learned patterns. Unlike classification (categories), regression outputs numbers (e.g. price, temperature). Models learn the relationship between inputs and the target value from data.',
  analogies: [
    { concept: 'Regression line', analogy: 'A line of best fit through dots', explanation: 'Draw the trend through scattered points to predict new ones.' },
    { concept: 'Prediction', analogy: 'A weather forecast', explanation: 'Use past patterns to estimate what is coming.' },
  ],
  howItWorks: [
    'Collect past data with the value you want to predict.',
    'Find the relationship between inputs and that value.',
    'Fit a model (e.g. a trend line) to the data.',
    'Feed new inputs to predict the value.',
    'Check predictions against real results and improve.',
  ],
  realWorld: [
    'Weather forecasts.',
    'Predicting house or flight prices.',
    'Estimating delivery arrival time.',
    'Forecasting a shop\'s sales.',
    'Predicting how long a battery will last.',
  ],
  facts: [
    'Predicting a number is "regression"; predicting a category is "classification".',
    'No prediction is ever 100% certain — there is always error.',
    'More relevant data usually means better predictions.',
  ],
  activity: {
    title: 'Predict the Next Point',
    materials: ['Graph paper', 'Sample data'],
    steps: [
      'Plot given data points (e.g. day vs temperature).',
      'Draw a "line of best fit".',
      'Use it to predict the next day.',
      'Compare with the real answer.',
    ],
    expected: 'Students draw a trend line and make a reasonable numeric prediction.',
  },
  miniChallenge: 'From 4 data points, predict the 5th. Closest guess wins!',
  project: {
    title: 'Mini Forecaster',
    description: 'Collect a week of simple data and predict the next value.',
    materials: ['Worksheet', 'Graph paper'],
    steps: [
      'Track one number for 5 days (e.g. study minutes).',
      'Plot it on a graph.',
      'Spot the trend and predict day 6.',
      'On day 6, compare prediction vs reality.',
    ],
    expectedOutput: 'A graph with a trend-based prediction and a real-vs-predicted comparison.',
    extensions: ['Add a second factor (e.g. weather).', 'Calculate how far off you were.'],
  },
  logic: 'Trends + extrapolation: reading a pattern and projecting it forward is core data reasoning — with honesty about uncertainty.',
  discussion: [
    'Why can predictions be wrong even with good data?',
    'What is the difference between predicting a number and a category?',
    'When is a confident prediction dangerous?',
  ],
  careers: [
    'Data Scientist — builds predictive models.',
    'Financial Analyst — forecasts prices and risk.',
    'Meteorologist — predicts weather.',
  ],
  homework: [
    'Track one number for 3 days and predict day 4.',
    'Find a prediction in the news and check if it came true.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'Predicting a NUMBER (like price) is called…', options: ['Regression', 'Classification', 'Clustering', 'Tokenising'], answer: 'Regression', explanation: 'Regression predicts continuous values.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'A "line of best fit" helps you…', options: ['Spot a trend and predict new points', 'Colour a picture', 'Delete data', 'Charge a phone'], answer: 'Spot a trend and predict new points', explanation: 'It models the trend.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Is any prediction ever 100% certain?', answer: 'No — there is always some error/uncertainty.', difficulty: 'beginner' },
    { qtype: 'computational', prompt: 'Pattern 2, 4, 6, 8 — predict the next value.', options: ['10', '9', '12', '7'], answer: '10', explanation: 'Add 2 each time.', difficulty: 'beginner' },
  ],
});

const recommendationSystems = lesson({
  title: 'Recommendation Systems',
  module: M4,
  difficulty: 'intermediate',
  summary: 'Go deeper into how ML suggests products, videos, songs and friends.',
  hook: 'Two friends, totally different "Up Next" lists. How does one app give millions of people their OWN perfect suggestions?',
  story: 'ARIA runs a magic shop. She remembers what each customer loved, notices customers with similar taste, and whispers perfect suggestions. The shop becomes everyone\'s favourite — because it feels personal.',
  layman: 'Recommendation systems use ML to suggest things you will probably like, based on your past behaviour and the behaviour of similar people. They power video, music, shopping and social apps.',
  concept: 'Recommendation systems combine content-based filtering (similar items to ones you liked) and collaborative filtering (items liked by users similar to you). They predict a preference score per item and rank suggestions, balancing relevance with diversity and novelty.',
  analogies: [
    { concept: 'Content-based', analogy: 'More books by the same author', explanation: 'You liked it, so here is something similar.' },
    { concept: 'Collaborative', analogy: 'A friend with your taste', explanation: 'People like you loved this, so you might too.' },
  ],
  howItWorks: [
    'Track what users like, watch, skip and buy.',
    'Find similar items (content-based).',
    'Find similar users (collaborative).',
    'Predict a score for each candidate item.',
    'Rank and show the top suggestions, with some variety.',
  ],
  realWorld: [
    'Video "Up Next" suggestions.',
    'Music "Made for You" playlists.',
    'Shopping "you may also like".',
    'Friend/connection suggestions.',
    'News and article feeds.',
  ],
  facts: [
    'Most watched/bought items come from recommendations.',
    'Good systems add variety so you do not get bored.',
    'Cold start: it is hard to recommend to a brand-new user.',
  ],
  activity: {
    title: 'Class Recommender',
    materials: ['Like/dislike sheets'],
    steps: [
      'Everyone lists 5 favourites.',
      'Find your "taste twin" (most overlap).',
      'Recommend one new thing to your twin.',
      'Report which recommendations landed and why.',
    ],
    expected: 'Students apply both content-based and collaborative ideas in practice.',
  },
  miniChallenge: 'Solve the "cold start": how would you recommend to someone with ZERO history?',
  project: {
    title: 'Build a Smart Recommender',
    description: 'Design a recommender using both content-based and collaborative rules.',
    materials: ['Cards', 'Worksheet'],
    steps: [
      'Create 12 item cards with simple tags (genre, mood).',
      'Write content-based rules (similar tags).',
      'Write a collaborative rule (taste-twin liked it).',
      'Test on 3 different "users".',
    ],
    expectedOutput: 'A recommender that combines two strategies and works for 3 user profiles.',
    extensions: ['Add a "surprise me" diversity rule.', 'Handle a brand-new user (cold start).'],
  },
  logic: 'Similarity + ranking: measuring how alike items/users are, then ordering by predicted preference, is a powerful and widely used ML pattern.',
  discussion: [
    'Is a super-personal feed always a good thing?',
    'How could a recommender accidentally narrow your world?',
    'Should you control or reset your recommendations?',
  ],
  careers: [
    'Recommender Systems Engineer.',
    'Growth/Personalisation Data Scientist.',
    'Product Manager for feeds and discovery.',
  ],
  homework: [
    'Find one content-based and one collaborative suggestion you got.',
    'Try to "reset" what an app thinks you like and watch it change.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: '"People like you also liked…" is…', options: ['Collaborative filtering', 'Content-based filtering', 'Overfitting', 'Tokenising'], answer: 'Collaborative filtering', explanation: 'Based on similar users.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: '"More items like the one you liked" is…', options: ['Content-based filtering', 'Collaborative filtering', 'Regression', 'Clustering'], answer: 'Content-based filtering', explanation: 'Based on item similarity.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What is the "cold start" problem?', answer: 'Hard to recommend to a brand-new user with no history.', difficulty: 'advanced' },
    { qtype: 'brain_teaser', prompt: 'How would you recommend to a totally new user with no data?', answer: 'Open-ended (popular items, ask preferences, profile).', difficulty: 'advanced' },
  ],
});

const MACHINE_LEARNING = [whatIsML, trainingVsTesting, dataAndLabels, classification, prediction, recommendationSystems];

// =====================================================================
//  MODULE 5 · DATA SCIENCE FOR KIDS
// =====================================================================
const M5 = 'Data Science for Kids';

const dataCollection = lesson({
  title: 'Data Collection',
  module: M5,
  summary: 'Learn how to gather useful, honest data — the first step of every AI project.',
  hook: 'Want to know your class\'s favourite snack? You cannot guess — you have to COLLECT the data.',
  story: 'ARIA wants to plan the perfect party. Instead of guessing, she runs a quick survey: favourite food, music, game. With real data in hand, her party is a hit. "Good choices start with good data," she grins.',
  layman: 'Data collection is gathering information to answer a question. You can survey people, measure things, or observe and count. Good data is relevant, accurate and fair (it represents everyone, not just a few).',
  concept: 'Data collection gathers raw information through surveys, sensors, observation or records. Quality depends on a clear question, the right sample (representative, not biased), accurate measurement and ethical consent. Poor sampling leads to misleading conclusions.',
  analogies: [
    { concept: 'Sampling', analogy: 'Tasting soup with one spoon', explanation: 'A small fair taste tells you about the whole pot — if you stir first!' },
    { concept: 'Biased sample', analogy: 'Only asking your best friends', explanation: 'You miss everyone else\'s opinion.' },
  ],
  howItWorks: [
    'Start with a clear question.',
    'Decide what data answers it.',
    'Choose a fair way to collect (survey, count, measure).',
    'Get a representative sample.',
    'Record honestly and respect privacy.',
  ],
  realWorld: [
    'Census counting a country\'s people.',
    'Weather stations measuring temperature.',
    'Apps logging steps and sleep.',
    'Shops tracking which items sell.',
    'Scientists recording experiment results.',
  ],
  facts: [
    'A biased sample can flip your conclusion completely.',
    'Sensors collect data automatically, 24/7.',
    'Always ask permission before collecting personal data.',
  ],
  activity: {
    title: 'Class Survey Sprint',
    materials: ['Tally sheet', 'Pens'],
    steps: [
      'Pick a question (favourite fruit?).',
      'Design a simple survey.',
      'Collect tallies from the class.',
      'Discuss if the sample was fair.',
    ],
    expected: 'Students collect a small honest dataset and judge its fairness.',
  },
  miniChallenge: 'Design a survey question that is NOT leading or unfair. Trickier than it sounds!',
  project: {
    title: 'Mini Data Investigation',
    description: 'Pick a question and collect real data to answer it.',
    materials: ['Tally/worksheet', 'Pens'],
    steps: [
      'Write one clear question.',
      'Collect at least 15 honest responses.',
      'Record results neatly.',
      'Note one way your sample could be biased.',
    ],
    expectedOutput: 'A small dataset with at least 15 entries and a fairness note.',
    extensions: ['Collect from a second group and compare.', 'Add a "do not want to answer" option.'],
  },
  logic: 'Good questions + fair sampling: framing the question and choosing a representative sample are essential reasoning skills behind trustworthy data.',
  discussion: [
    'How could a survey accidentally be unfair?',
    'When is it okay (and not okay) to collect data about people?',
    'Why is a bigger, more varied sample usually better?',
  ],
  careers: [
    'Data Collector / Field Researcher.',
    'Survey Designer / Statistician.',
    'Sensor / IoT Engineer.',
  ],
  homework: [
    'Run a 10-person survey at home and tally the results.',
    'Spot one survey online and judge if it seems fair.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'A fair sample should…', options: ['Represent the whole group', 'Only include your friends', 'Be as small as possible', 'Ignore most people'], answer: 'Represent the whole group', explanation: 'Representative = fair.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Before collecting personal data you should…', options: ['Ask permission', 'Hide it', 'Sell it', 'Ignore consent'], answer: 'Ask permission', explanation: 'Consent and privacy matter.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What is the FIRST step of data collection?', answer: 'A clear question.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'You survey only basketball players about favourite sport. What is wrong?', answer: 'Biased sample — it does not represent everyone.', difficulty: 'intermediate' },
  ],
});

const dataCleaning = lesson({
  title: 'Data Cleaning',
  module: M5,
  summary: 'Tidy messy data by fixing errors, duplicates and blanks before using it.',
  hook: 'Your data says someone is "200 years old" and another entry is blank. Garbage data = garbage answers. Time to clean!',
  story: 'ARIA opens her party survey and groans — typos, duplicates, missing answers everywhere. She rolls up her sleeves: fix typos, remove duplicates, fill or drop blanks. Now the data sparkles and her charts make sense.',
  layman: 'Data cleaning means fixing messy data: correcting errors, removing duplicates, handling blanks, and making everything consistent. Clean data gives trustworthy results; messy data fools you.',
  concept: 'Data cleaning improves data quality by handling missing values, removing duplicates, fixing errors/outliers, and standardising formats. It is often the most time-consuming step and is critical because models learn whatever the data contains — including its mistakes.',
  analogies: [
    { concept: 'Data cleaning', analogy: 'Washing vegetables before cooking', explanation: 'Remove the dirt first or it ruins the dish.' },
    { concept: 'Outlier', analogy: 'A 200-year-old in a school survey', explanation: 'An obviously wrong value that needs checking.' },
  ],
  howItWorks: [
    'Scan for errors and odd values (outliers).',
    'Remove duplicate entries.',
    'Handle blanks (fill sensibly or drop).',
    'Standardise formats (dates, units, spelling).',
    'Double-check the cleaned data.',
  ],
  realWorld: [
    'Fixing typos in customer lists.',
    'Removing duplicate sign-ups.',
    'Cleaning sensor glitches.',
    'Standardising date formats across records.',
    'Spotting impossible values (negative age).',
  ],
  facts: [
    'Data cleaning can take up to 80% of a data project.',
    'One wrong value can ruin an average.',
    '"Outliers" can be real surprises OR mistakes — check before deleting.',
  ],
  activity: {
    title: 'Spot the Mess',
    materials: ['Messy data sheet'],
    steps: [
      'Get a messy mini-dataset with errors.',
      'Circle typos, duplicates and blanks.',
      'Decide how to fix each.',
      'Produce a clean version.',
    ],
    expected: 'Students identify and fix common data problems.',
  },
  miniChallenge: 'Find ALL the errors in a messy 10-row table in 90 seconds.',
  project: {
    title: 'Clean a Real Dataset',
    description: 'Clean the data you collected last lesson.',
    materials: ['Your survey data', 'Pens'],
    steps: [
      'Find duplicates and remove them.',
      'Fix obvious typos.',
      'Decide what to do with blanks.',
      'Write what you changed and why.',
    ],
    expectedOutput: 'A cleaned dataset with a short "cleaning log" of changes.',
    extensions: ['Spot an outlier and investigate it.', 'Standardise one format (e.g. capitalisation).'],
  },
  logic: 'Quality control: verifying and correcting inputs before processing prevents wrong conclusions — "garbage in, garbage out".',
  discussion: [
    'Should you always delete an outlier? When might it be real?',
    'How do blanks change an average?',
    'Why is cleaning sometimes the hardest part?',
  ],
  careers: [
    'Data Analyst — cleans and prepares data.',
    'Data Engineer — automates cleaning pipelines.',
    'Quality Analyst — ensures data accuracy.',
  ],
  homework: [
    'Clean a messy list at home (contacts, a chore chart).',
    'Find one "impossible" value somewhere and explain it.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Data cleaning includes…', options: ['Removing duplicates and fixing errors', 'Adding random numbers', 'Hiding data', 'Deleting everything'], answer: 'Removing duplicates and fixing errors', explanation: 'It improves quality.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'An obviously wrong extreme value is an…', options: ['Outlier', 'Average', 'Label', 'Pixel'], answer: 'Outlier', explanation: 'Outliers stand far from the rest.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Why clean data before analysing it?', answer: 'Messy data leads to wrong results (garbage in, garbage out).', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'A survey has age "200". List 2 ways to handle it.', answer: 'Open-ended (check source, remove, mark missing).', difficulty: 'intermediate' },
  ],
});

const visualization = lesson({
  title: 'Visualization',
  module: M5,
  summary: 'Turn boring numbers into clear pictures that tell a story.',
  hook: 'A page of 100 numbers vs one simple chart — which one shows the trend in a single glance?',
  story: 'ARIA stares at a wall of numbers and gets dizzy. She draws them as a bar chart — and instantly SEES which snack won. "A picture reveals what numbers hide," she cheers.',
  layman: 'Data visualization turns numbers into pictures — bar charts, line graphs, pie charts — so patterns and comparisons jump out. The right chart makes data easy to understand and share.',
  concept: 'Data visualisation encodes data into visual forms (length, position, colour) to reveal patterns, trends and comparisons. Choosing the right chart for the data and audience — and avoiding misleading visuals — is a core data-literacy skill.',
  analogies: [
    { concept: 'Visualisation', analogy: 'A map vs written directions', explanation: 'A picture shows the whole journey at once.' },
    { concept: 'Right chart', analogy: 'Right tool for the job', explanation: 'A hammer for nails, a line chart for trends.' },
  ],
  howItWorks: [
    'Know your question and audience.',
    'Pick the right chart (bar, line, pie).',
    'Map data to visuals (height, position).',
    'Label axes and add a clear title.',
    'Check it is honest and not misleading.',
  ],
  realWorld: [
    'News charts of election results.',
    'Fitness app graphs of your steps.',
    'Weather temperature line graphs.',
    'Sales dashboards at a company.',
    'Sports stats comparisons.',
  ],
  facts: [
    'The human eye spots visual patterns far faster than number lists.',
    'A chart with a cut-off axis can mislead you.',
    'Pie charts work best with only a few slices.',
  ],
  activity: {
    title: 'Chart It Out',
    materials: ['Graph paper', 'Colours', 'Sample data'],
    steps: [
      'Take a small dataset (class favourites).',
      'Draw it as a bar chart.',
      'Label axes and add a title.',
      'Write the one-line story it tells.',
    ],
    expected: 'Students create a labelled chart and state its key insight.',
  },
  miniChallenge: 'Spot the "lying chart": find what makes a misleading graph misleading.',
  project: {
    title: 'Data Story Poster',
    description: 'Turn your cleaned survey data into a clear visual story.',
    materials: ['Poster paper', 'Colours'],
    steps: [
      'Choose the best chart for your data.',
      'Draw it neatly with labels and title.',
      'Add a one-sentence "headline" insight.',
      'Present it to the class.',
    ],
    expectedOutput: 'A labelled, honest chart with a clear headline insight.',
    extensions: ['Add a second chart type and compare.', 'Make a deliberately misleading version and discuss.'],
  },
  logic: 'Encoding + clarity: mapping data to the right visual reveals truth quickly — and recognising misleading charts protects you from manipulation.',
  discussion: [
    'How can a chart be technically true but still mislead?',
    'Which chart is best for showing change over time?',
    'Why are labels and titles so important?',
  ],
  careers: [
    'Data Visualisation Designer.',
    'Business Intelligence Analyst.',
    'Data Journalist.',
  ],
  homework: [
    'Find a chart online and judge if it is honest.',
    'Make one chart of your week (sleep, study, play).',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'Best chart to show change over time?', options: ['Line graph', 'Pie chart', 'Photo', 'Word list'], answer: 'Line graph', explanation: 'Lines show trends over time.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A chart can mislead if it…', options: ['Cuts off or distorts the axis', 'Has a clear title', 'Labels its axes', 'Uses real data fairly'], answer: 'Cuts off or distorts the axis', explanation: 'Axis tricks exaggerate differences.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What two things must every chart have to be readable?', answer: 'Labels (axes) and a clear title.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'You compare 4 snacks\' votes. Which chart would you pick and why?', answer: 'Open-ended (bar chart for comparison).', difficulty: 'intermediate' },
  ],
});

const graphsAndCharts = lesson({
  title: 'Graphs and Charts',
  module: M5,
  summary: 'Master reading bar, line and pie charts to pull out the real story.',
  hook: 'Can you read a chart in 5 seconds and instantly say who is winning? That is a data superpower.',
  story: 'ARIA becomes a "chart detective". Given any graph, she finds the highest, the lowest, the trend, and the surprise — faster than anyone. Reading charts is now her secret weapon.',
  layman: 'Different charts answer different questions. Bar charts compare amounts, line charts show change over time, pie charts show parts of a whole. Reading them well means finding the highest, lowest, trends and surprises.',
  concept: 'Chart literacy is interpreting common visualisations: bar (compare categories), line (trend over time), pie (proportion of a whole), scatter (relationship between two variables). Skilled reading extracts max/min, trends, comparisons and anomalies — and questions the source.',
  analogies: [
    { concept: 'Reading charts', analogy: 'Reading a scoreboard', explanation: 'One glance tells you who leads and by how much.' },
    { concept: 'Scatter plot', analogy: 'Star map of two facts', explanation: 'Each dot shows two values at once, revealing a relationship.' },
  ],
  howItWorks: [
    'Read the title and axis labels first.',
    'Find the highest and lowest values.',
    'Spot the trend or biggest slice.',
    'Notice any surprise (anomaly).',
    'Ask: is the source trustworthy?',
  ],
  realWorld: [
    'Reading exam-result bar charts.',
    'Following a stock price line.',
    'Seeing budget pie charts.',
    'Comparing teams on a stats table.',
    'Tracking rainfall over months.',
  ],
  facts: [
    'A scatter plot can reveal if two things rise together.',
    'Pie slices must add up to 100%.',
    'Always check WHO made a chart and why.',
  ],
  activity: {
    title: 'Chart Detective',
    materials: ['Set of varied charts'],
    steps: [
      'Get 4 different charts.',
      'For each, write highest, lowest and the trend.',
      'Spot one surprising point.',
      'Decide which chart type suited the data best.',
    ],
    expected: 'Students extract key facts and judge chart-type fit.',
  },
  miniChallenge: 'Race to answer 3 questions about a chart in under 60 seconds.',
  project: {
    title: 'Chart Quiz Maker',
    description: 'Create a chart and 5 questions for classmates to answer.',
    materials: ['Graph paper', 'Pens'],
    steps: [
      'Pick data and draw a clear chart.',
      'Write 5 questions (highest, lowest, trend, total, surprise).',
      'Swap with a friend and solve theirs.',
      'Check each other\'s answers.',
    ],
    expectedOutput: 'A labelled chart with 5 answerable questions and a marked key.',
    extensions: ['Add a tricky "is this misleading?" question.', 'Use two chart types.'],
  },
  logic: 'Data interpretation: extracting facts and trends from visuals is a top skill for scientists, and the human side of every AI dashboard.',
  discussion: [
    'When is a pie chart a bad choice?',
    'Why check who made a chart?',
    'Which chart helps spot a relationship between two things?',
  ],
  careers: [
    'Data Analyst.',
    'Sports/Finance Statistician.',
    'Researcher.',
  ],
  homework: [
    'Find 2 charts in a newspaper and summarise each in one line.',
    'Make a chart and ask a family member 3 questions about it.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'Which chart compares amounts across categories best?', options: ['Bar chart', 'Line chart', 'Pie chart', 'Scatter plot'], answer: 'Bar chart', explanation: 'Bars compare categories.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A pie chart shows…', options: ['Parts of a whole', 'Change over time', 'Two variables\' relationship', 'A maze'], answer: 'Parts of a whole', explanation: 'Slices sum to 100%.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Which chart best shows if two values rise together?', answer: 'A scatter plot.', difficulty: 'intermediate' },
    { qtype: 'logical', prompt: 'A line goes up then sharply down. Describe the story in one sentence.', answer: 'Open-ended (rose then fell).', difficulty: 'intermediate' },
  ],
});

const findingPatterns = lesson({
  title: 'Finding Patterns',
  module: M5,
  summary: 'Combine data skills to discover insights, trends and surprises hidden in data.',
  hook: 'Hidden in boring numbers is a secret story. Can you be the detective who uncovers it?',
  story: 'ARIA gathers, cleans and charts her data — then steps back. Suddenly she SEES it: snack sales spike on Fridays! That insight changes her whole plan. Finding the pattern is where data becomes power.',
  layman: 'Finding patterns is the goal of data science: after collecting, cleaning and charting data, you look for trends, groups, relationships and surprises that help you decide and predict.',
  concept: 'Insight discovery analyses prepared data to find trends (direction over time), correlations (variables moving together), clusters (natural groups), and anomalies. A key caution: correlation does not equal causation. Insights then guide decisions and predictions.',
  analogies: [
    { concept: 'Correlation', analogy: 'Ice cream and sunburn rise together', explanation: 'Both rise in summer — but ice cream does not cause sunburn! Correlation ≠ causation.' },
    { concept: 'Cluster', analogy: 'Friend groups in a playground', explanation: 'People naturally form similar groups.' },
  ],
  howItWorks: [
    'Use your cleaned, charted data.',
    'Look for trends over time.',
    'Look for things that move together (correlation).',
    'Look for natural groups (clusters) and surprises.',
    'Ask "could something else explain this?" before claiming a cause.',
  ],
  realWorld: [
    'Shops finding "Friday spikes" in sales.',
    'Health data revealing exercise-sleep links.',
    'Streaming finding viewer "taste clusters".',
    'Cities spotting traffic patterns.',
    'Scientists discovering trends in climate data.',
  ],
  facts: [
    'Correlation does NOT prove causation.',
    'Finding clusters with no labels is unsupervised learning.',
    'The best insight is often the surprising one.',
  ],
  activity: {
    title: 'Insight Hunt',
    materials: ['Prepared chart/dataset'],
    steps: [
      'Study a chart of real-ish data.',
      'Write 3 patterns you notice.',
      'Find one "two things rise together" pair.',
      'Ask if one really causes the other.',
    ],
    expected: 'Students extract trends and question correlation vs causation.',
  },
  miniChallenge: 'Find a funny "correlation ≠ causation" example (e.g. ice cream & sunburn).',
  project: {
    title: 'Data Detective Report',
    description: 'Run the full cycle: collect → clean → chart → find an insight.',
    materials: ['Your data', 'Poster paper'],
    steps: [
      'Use (or extend) your collected data.',
      'Clean and chart it.',
      'State one clear insight.',
      'Suggest one decision based on it.',
    ],
    expectedOutput: 'A mini "data detective" report with one insight and one decision.',
    extensions: ['Find a cluster in your data.', 'Predict next week from the trend.'],
  },
  logic: 'The full data-science cycle (collect → clean → visualise → find patterns) is how raw numbers become decisions — the foundation of machine learning.',
  discussion: [
    'Why is "correlation ≠ causation" so important?',
    'How could a wrong insight lead to a bad decision?',
    'What surprising pattern have you noticed in your own life?',
  ],
  careers: [
    'Data Scientist.',
    'Research Analyst.',
    'Business Strategist.',
  ],
  homework: [
    'Find a pattern in your week\'s data and act on it.',
    'Find a news claim and ask if correlation was confused with cause.',
  ],
  diagram: 'chart',
  questions: [
    { qtype: 'mcq', prompt: 'Two things rising together means…', options: ['They are correlated (not necessarily causing each other)', 'One definitely causes the other', 'They are unrelated', 'The data is wrong'], answer: 'They are correlated (not necessarily causing each other)', explanation: 'Correlation ≠ causation.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'Finding natural groups with no labels is…', options: ['Clustering (unsupervised)', 'Classification', 'Regression', 'Cleaning'], answer: 'Clustering (unsupervised)', explanation: 'Groups without labels.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'List the data-science cycle in order.', answer: 'Collect → clean → visualise → find patterns.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Ice-cream sales and sunburns both rise. Does ice cream cause sunburn? Explain.', answer: 'No — both are caused by hot/sunny weather.', difficulty: 'advanced' },
  ],
});

const DATA_SCIENCE = [dataCollection, dataCleaning, visualization, graphsAndCharts, findingPatterns];

// =====================================================================
//  MODULE 6 · GENERATIVE AI
// =====================================================================
const M6 = 'Generative AI';

const textGeneration = lesson({
  title: 'Text Generation',
  module: M6,
  summary: 'Discover how AI writes stories, answers and ideas — one word at a time.',
  hook: 'Type "Once upon a time" and AI continues your story forever. How does a machine write like a human?',
  story: 'ARIA learns to write. She reads mountains of stories, learns which word usually follows another, and starts finishing your sentences. Soon she writes whole tales — but you discover she sometimes makes up "facts", so you always check.',
  layman: 'Text-generating AI predicts the next word again and again to build sentences. It learned from huge amounts of text. It is creative and helpful, but can confidently invent false things ("hallucinate"), so always verify.',
  concept: 'Large Language Models generate text by predicting the most likely next token (word piece) given the previous ones, trained on massive text data. They are powerful at drafting and explaining but can "hallucinate" — produce confident, false statements — so outputs must be verified.',
  analogies: [
    { concept: 'Next-word prediction', analogy: 'Super-powered autocomplete', explanation: 'Like your phone\'s suggestion, but far smarter and longer.' },
    { concept: 'Hallucination', analogy: 'A confident storyteller', explanation: 'It can sound 100% sure while being wrong.' },
  ],
  howItWorks: [
    'It learned patterns from huge amounts of text.',
    'You give it a prompt.',
    'It predicts the next word, then the next…',
    'Word by word, it builds a response.',
    'You fact-check and edit before using it.',
  ],
  realWorld: [
    'Drafting emails and essays.',
    'Answering questions and explaining ideas.',
    'Writing stories and poems.',
    'Summarising long articles.',
    'Helping translate between languages.',
  ],
  facts: [
    'These models learn from more text than a person could read in 1,000 lifetimes.',
    'The same prompt can give different answers each time.',
    'Confident wrong answers are called "hallucinations".',
  ],
  activity: {
    title: 'Human Next-Word Game',
    materials: ['Story starter cards'],
    steps: [
      'One person says a starting word.',
      'Each person adds ONE word in turn.',
      'Build a silly story word by word.',
      'Discuss how AI does this much faster.',
    ],
    expected: 'Students feel "next-word prediction" and how patterns shape text.',
  },
  miniChallenge: 'Spot the "hallucination": find the made-up fact hidden in a sample AI answer.',
  project: {
    title: 'AI-Assisted Story (Verified!)',
    description: 'Write a short story with AI help (or storyboard it) and fact-check it.',
    materials: ['Paper or teacher-guided tool', 'AI Diary'],
    steps: [
      'Pick a theme and write a detailed prompt.',
      'Generate or draft the story.',
      'Improve it with one better prompt.',
      'Fact-check any claim and add a "made with AI" note.',
    ],
    expectedOutput: 'A short story with a fact-check note and an honest AI credit.',
    extensions: ['Generate two endings and compare.', 'Find and fix one hallucination.'],
  },
  logic: 'Probability + verification: text AI is pattern-based prediction — pairing its power with fact-checking builds healthy scepticism.',
  discussion: [
    'Is it cheating to use AI to write? When is it okay?',
    'Why must you fact-check AI writing?',
    'Should AI-written text always be labelled?',
  ],
  careers: [
    'Content Writer / Editor (with AI tools).',
    'Prompt Engineer.',
    'AI Researcher (language models).',
  ],
  homework: [
    'Use an AI tool to draft something, then mark what you changed.',
    'Catch one AI "fact" and verify it from a trusted source.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Text AI builds sentences by…', options: ['Predicting the next word repeatedly', 'Copying one book exactly', 'Drawing pictures', 'Adding numbers'], answer: 'Predicting the next word repeatedly', explanation: 'Next-token prediction.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A confident but false AI statement is a…', options: ['Hallucination', 'Promotion', 'Reflection', 'Vacation'], answer: 'Hallucination', explanation: 'Always verify.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Why fact-check AI-written text?', answer: 'Because it can make things up (hallucinate).', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write a detailed prompt for a 3-sentence story about a brave robot.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const imageGeneration = lesson({
  title: 'Image Generation',
  module: M6,
  summary: 'See how AI paints brand-new images from a few words.',
  hook: 'Type "a cat astronaut riding a bike on the moon" and a never-before-seen image appears. The AI did not copy it — it imagined it!',
  story: 'ARIA learns to paint. After seeing millions of images, she can conjure new ones from words. You ask for a "rainbow dragon reading a book" — and she paints it. But you learn to credit AI and respect artists\' work.',
  layman: 'Image-generating AI creates new pictures from a text prompt. It learned patterns from millions of images, then builds a fresh image that matches your words. Clear prompts give better pictures.',
  concept: 'Text-to-image models (e.g. diffusion models) learn visual patterns from large image datasets and generate new images that match a text prompt, often by gradually turning noise into a clear picture. Quality depends on prompt detail; ethics include crediting AI and respecting artists.',
  analogies: [
    { concept: 'Diffusion', analogy: 'Sculpting from fog', explanation: 'It starts with noisy "fog" and slowly clears it into a picture.' },
    { concept: 'Prompting', analogy: 'Ordering a custom cake', explanation: 'The more detail you give, the closer it matches your wish.' },
  ],
  howItWorks: [
    'It learned patterns from millions of images.',
    'You write a prompt describing the picture.',
    'It starts from random noise.',
    'It refines step by step toward your words.',
    'You tweak the prompt to improve the result.',
  ],
  realWorld: [
    'Concept art and posters.',
    'Logos and app icons.',
    'Game and story illustrations.',
    'Custom greeting cards.',
    'Quick design brainstorming.',
  ],
  facts: [
    'Many tools build an image in just a few seconds.',
    'The same prompt can produce many different images.',
    'Crediting AI and respecting artists\' rights matters.',
  ],
  activity: {
    title: 'Prompt-to-Picture',
    materials: ['Prompt cards', 'Paper (or teacher-guided tool)'],
    steps: [
      'Write a vague prompt and a detailed prompt.',
      'Predict (or generate) the difference.',
      'Add style, colours and mood.',
      'Pick the best prompt and explain why.',
    ],
    expected: 'Students see how prompt detail changes image quality.',
  },
  miniChallenge: 'Improve a weak prompt into an amazing one by adding 3 details.',
  project: {
    title: 'Dream Scene Designer',
    description: 'Design a scene with a detailed prompt and credit your AI use.',
    materials: ['Paper or teacher-guided tool', 'AI Diary'],
    steps: [
      'Choose a scene (your dream classroom).',
      'Write a detailed prompt (subject + style + mood + colours).',
      'Generate or sketch the result.',
      'Add a "made with AI" credit line.',
    ],
    expectedOutput: 'A scene with a detailed prompt and honest AI credit.',
    extensions: ['Generate two art styles and compare.', 'Write a prompt "recipe" card.'],
  },
  logic: 'Iteration + specificity: refining prompts is a feedback loop, and precise description is a transferable communication skill.',
  discussion: [
    'Is AI art "real" art? Who is the artist?',
    'Should AI images be labelled as AI-made?',
    'How can we respect human artists when using these tools?',
  ],
  careers: [
    'Concept Artist (AI-assisted).',
    'Graphic / Brand Designer.',
    'Prompt Artist / Creative Technologist.',
  ],
  homework: [
    'Write 3 detailed image prompts in your AI Diary.',
    'Discuss with family: should AI art be labelled?',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Text-to-image AI creates pictures by…', options: ['Refining noise to match your prompt', 'Photographing real life', 'Copying one image', 'Drawing by hand'], answer: 'Refining noise to match your prompt', explanation: 'Diffusion clears noise into an image.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'A more detailed prompt usually gives…', options: ['A closer match to your idea', 'A worse image', 'No image', 'The same image always'], answer: 'A closer match to your idea', explanation: 'Detail steers the output.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one ethical thing to do when sharing AI art.', answer: 'Credit that it was made with AI.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Add 3 details to improve: "a dog".', answer: 'Open-ended (breed, style, setting, mood).', difficulty: 'intermediate' },
  ],
});

const musicGeneration = lesson({
  title: 'Music Generation',
  module: M6,
  summary: 'Explore how AI composes melodies, beats and whole songs.',
  hook: 'Press a button and AI writes a brand-new tune in any style. Can a machine really be musical?',
  story: 'ARIA listens to thousands of songs and learns which notes sound good together. Then she hums something new — a melody nobody has heard before. The class jams along to AI-made music.',
  layman: 'Music-generating AI learns patterns of notes, rhythm and style from many songs, then creates new music. You can guide it with a style or mood. Humans still choose, edit and add feeling.',
  concept: 'Generative music models learn sequences of notes, rhythm and harmony from large music datasets, then generate new compositions, optionally conditioned on style or mood. Like all generative AI, results vary and benefit from human curation and ethical use of source music.',
  analogies: [
    { concept: 'Music generation', analogy: 'A jazz musician improvising', explanation: 'After hearing thousands of songs, you can invent new tunes in that style.' },
    { concept: 'Style prompt', analogy: 'Requesting a song genre', explanation: '"Make it upbeat and happy" steers the result.' },
  ],
  howItWorks: [
    'It learns note/rhythm patterns from many songs.',
    'You pick a style or mood.',
    'It generates a sequence of notes.',
    'It arranges rhythm and harmony.',
    'A human edits and adds the final feeling.',
  ],
  realWorld: [
    'Background music for videos and games.',
    'Beat-making tools for creators.',
    'Custom relaxation or focus tracks.',
    'Helping musicians brainstorm ideas.',
    'Auto-accompaniment in music apps.',
  ],
  facts: [
    'AI can compose in the style of famous musicians.',
    'AI music can be made royalty-free for videos.',
    'Humans still decide what sounds "good".',
  ],
  activity: {
    title: 'Pattern Beats',
    materials: ['Clapping/body percussion'],
    steps: [
      'Create a simple repeating rhythm pattern.',
      'Add a second layer on top.',
      'Change one part to "remix" it.',
      'Discuss how AI builds music from patterns too.',
    ],
    expected: 'Students experience music as patterns and variations.',
  },
  miniChallenge: 'Compose a 4-beat rhythm and teach it to the class in 60 seconds.',
  project: {
    title: 'Mood Music Plan',
    description: 'Design (or storyboard) a short AI track for a specific mood.',
    materials: ['Worksheet or teacher-guided tool'],
    steps: [
      'Pick a mood (calm, exciting, spooky).',
      'List the style, tempo and instruments.',
      'Generate or describe the track.',
      'Note what you would change.',
    ],
    expectedOutput: 'A mood-music plan with style, tempo and one improvement note.',
    extensions: ['Make two moods and compare.', 'Add it to a short video/slideshow.'],
  },
  logic: 'Sequences + variation: music is patterns in time — recognising and remixing them connects creativity with computational thinking.',
  discussion: [
    'Can AI music have "feeling"? Who provides it?',
    'Is it fair to train music AI on artists\' songs?',
    'Would you listen to AI-made music? Why?',
  ],
  careers: [
    'Music Producer (AI-assisted).',
    'Sound Designer for games/film.',
    'Audio AI Engineer.',
  ],
  homework: [
    'Make a body-percussion beat and record it.',
    'Find AI-made music online and describe its mood.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Music AI mainly learns…', options: ['Patterns of notes and rhythm', 'How to cook', 'Map routes', 'Spelling only'], answer: 'Patterns of notes and rhythm', explanation: 'It models musical patterns.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Who decides if AI music sounds "good"?', options: ['Humans', 'Nobody', 'The weather', 'The printer'], answer: 'Humans', explanation: 'Human taste and curation matter.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What can you give music AI to steer its style?', answer: 'A style or mood prompt.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Is it fair to train music AI on artists\' work without asking? Argue one side.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const videoGeneration = lesson({
  title: 'Video Generation',
  module: M6,
  summary: 'Learn how AI creates moving video from text or images — and why to be careful.',
  hook: 'Describe a scene in words and AI makes a short VIDEO of it. Amazing — but also a little risky. Why?',
  story: 'ARIA learns the hardest art: moving pictures. She makes a clip of a puppy surfing! The class cheers — then ARIA warns: this same power can make fake videos, so we must use it honestly.',
  layman: 'Video-generating AI creates short moving clips from a prompt or images. It is powerful for creativity but can also make convincing fakes (deepfakes), so honesty and labelling are essential.',
  concept: 'Text-to-video and image-to-video models generate sequences of frames that stay consistent over time. They are computationally heavy and improving fast. Because they can create realistic fake footage (deepfakes), responsible use, consent and clear labelling are critical.',
  analogies: [
    { concept: 'Video generation', analogy: 'A flipbook that draws itself', explanation: 'Many consistent frames played fast become motion.' },
    { concept: 'Deepfake risk', analogy: 'A perfect costume', explanation: 'So convincing it can fool people — handle with care.' },
  ],
  howItWorks: [
    'It learned patterns from many videos.',
    'You give a text or image prompt.',
    'It generates frames that stay consistent.',
    'Frames play in sequence as motion.',
    'You review, edit and label it honestly.',
  ],
  realWorld: [
    'Short clips for stories and ads.',
    'Animating a still image.',
    'Special effects in film.',
    'Educational explainer animations.',
    'Social media short videos.',
  ],
  facts: [
    'Video generation needs a LOT of computing power.',
    'Deepfakes are AI-made fake videos — a real concern.',
    'Spotting and labelling fakes is a new life skill.',
  ],
  activity: {
    title: 'Storyboard a Clip',
    materials: ['Storyboard sheet', 'Pens'],
    steps: [
      'Plan a 4-frame video scene.',
      'Write the prompt for each frame.',
      'Note what must stay consistent (character, colours).',
      'Add a label: "AI-generated".',
    ],
    expected: 'Students plan a consistent short clip and practise honest labelling.',
  },
  miniChallenge: 'Spot 3 clues that a video might be an AI fake.',
  project: {
    title: 'Responsible Video Concept',
    description: 'Design a short AI video idea with consent and a clear label.',
    materials: ['Storyboard', 'AI Diary'],
    steps: [
      'Pick a safe, kind topic.',
      'Storyboard 4 frames with prompts.',
      'List who must give consent (if real people).',
      'Add an "AI-generated" label plan.',
    ],
    expectedOutput: 'A storyboard with prompts, consent notes and a labelling plan.',
    extensions: ['List 3 ways to detect deepfakes.', 'Write a class rule for AI video.'],
  },
  logic: 'Temporal consistency + ethics: keeping frames coherent is a hard technical problem, and labelling fakes is essential digital citizenship.',
  discussion: [
    'How could deepfakes cause harm? How do we fight them?',
    'Should all AI video be clearly labelled by law?',
    'When is making a fake video okay (e.g. fun/film) vs not okay?',
  ],
  careers: [
    'VFX / Animation Artist.',
    'Video AI Engineer.',
    'Media Forensics Specialist (detects fakes).',
  ],
  homework: [
    'Find tips to spot a deepfake and share two.',
    'Storyboard a 4-frame clip idea with a label.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'AI-made fake videos are called…', options: ['Deepfakes', 'Pixels', 'Prompts', 'Tokens'], answer: 'Deepfakes', explanation: 'Realistic AI fakes.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Video generation is challenging because frames must…', options: ['Stay consistent over time', 'Be totally random', 'Have no colour', 'Be silent'], answer: 'Stay consistent over time', explanation: 'Temporal consistency is hard.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Name one responsible thing to do with AI video.', answer: 'Label it as AI-generated (and get consent).', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'List 2 ways a deepfake could be misused and 1 way to defend against it.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const promptEngineering = lesson({
  title: 'Prompt Engineering',
  module: M6,
  summary: 'Learn the skill of asking AI clearly to get great results.',
  hook: 'Same AI, two people: one gets brilliant answers, one gets junk. The difference? How they ask.',
  story: 'ARIA grants wishes — but only exactly as worded! "Make food" gives a plain biscuit. "Make a warm cheese sandwich, cut in triangles" gives a feast. The class learns the magic of a great prompt.',
  layman: 'Prompt engineering is the skill of giving AI clear, detailed instructions to get the best results. Good prompts include the task, context, format and examples. It is becoming a real, valuable skill.',
  concept: 'Prompt engineering crafts inputs to steer AI outputs. Effective prompts specify the task, role/context, constraints, desired format, and examples (few-shot). Iterating and refining prompts — and verifying outputs — dramatically improves quality.',
  analogies: [
    { concept: 'Prompting', analogy: 'Giving directions to a driver', explanation: 'Vague directions = wrong place; clear ones = arrive perfectly.' },
    { concept: 'Few-shot examples', analogy: 'Showing a sample before asking', explanation: 'Show the style you want, then ask for more like it.' },
  ],
  howItWorks: [
    'State the task clearly.',
    'Add context and the role (e.g. "act as a tutor").',
    'Set constraints and format (length, bullets).',
    'Give an example if helpful.',
    'Refine the prompt based on the result.',
  ],
  realWorld: [
    'Asking AI to summarise a chapter in 5 bullets.',
    'Getting study questions in a chosen format.',
    'Requesting a polite email draft.',
    'Generating ideas with a clear style.',
    'Asking for step-by-step explanations.',
  ],
  facts: [
    'Good prompting is now a paid job skill.',
    'Adding examples ("few-shot") often improves results a lot.',
    'Tiny wording changes can change the whole answer.',
  ],
  activity: {
    title: 'Prompt Makeover',
    materials: ['Weak-prompt cards', 'Worksheet'],
    steps: [
      'Take a vague prompt.',
      'Add task, context, format and one example.',
      'Compare vague vs improved (predict or test).',
      'Share your best prompt recipe.',
    ],
    expected: 'Students transform vague prompts into clear, detailed ones.',
  },
  miniChallenge: 'Turn "help with homework" into a perfect prompt with task + format + example.',
  project: {
    title: 'My Prompt Recipe Book',
    description: 'Create reusable prompt "recipes" for common tasks.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick 3 tasks (summarise, quiz me, explain).',
      'Write a strong prompt template for each.',
      'Include role, format and an example slot.',
      'Test one and refine it.',
    ],
    expectedOutput: 'A book of 3 reusable, tested prompt recipes.',
    extensions: ['Add a "make it simpler" follow-up.', 'Add a fact-check reminder step.'],
  },
  logic: 'Clear communication + iteration: specifying intent precisely and refining based on feedback is a powerful skill for AI and for life.',
  discussion: [
    'Why does wording change the answer so much?',
    'Is prompt skill a kind of literacy everyone should learn?',
    'How do you know when a prompt is "good enough"?',
  ],
  careers: [
    'Prompt Engineer.',
    'AI Product Designer.',
    'Content Strategist (AI workflows).',
  ],
  homework: [
    'Improve one prompt and note how the answer changed.',
    'Make a prompt recipe for a task you do often.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'A great prompt usually includes…', options: ['Task, context and format', 'Only one vague word', 'No instructions', 'A secret password'], answer: 'Task, context and format', explanation: 'Clarity steers the output.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Giving examples in a prompt is called…', options: ['Few-shot prompting', 'Overfitting', 'Tokenising', 'Charging'], answer: 'Few-shot prompting', explanation: 'Examples guide style.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What should you do if a prompt gives a weak answer?', answer: 'Refine/improve the prompt and try again.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write a strong prompt that makes 5 quiz questions about photosynthesis.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const aiCreativity = lesson({
  title: 'AI Creativity',
  module: M6,
  summary: 'Use AI as a creative partner to brainstorm and build amazing things.',
  hook: 'What if you had a tireless creative partner who never runs out of ideas? You do — but YOU are still the artist.',
  story: 'ARIA becomes a brainstorm buddy. When you are stuck, she throws out 20 wild ideas. You pick the best, add your own twist, and create something only YOU could make. AI sparks; you shape.',
  layman: 'AI creativity means using AI tools to spark and speed up your own creative work — brainstorming, drafting, remixing. The best results combine AI\'s endless ideas with your taste, judgement and human touch.',
  concept: 'AI augments human creativity by generating options, variations and drafts quickly, lowering the cost of experimentation. The human provides vision, taste, meaning and ethical judgement. The most original work pairs AI\'s breadth with human direction and personal voice.',
  analogies: [
    { concept: 'AI as partner', analogy: 'A brainstorming sidekick', explanation: 'It offers many ideas; you choose and refine the gems.' },
    { concept: 'Human + AI', analogy: 'Spark and sculptor', explanation: 'AI is the spark; you sculpt it into something meaningful.' },
  ],
  howItWorks: [
    'Start with YOUR idea or goal.',
    'Use AI to brainstorm many options fast.',
    'Pick the best and add your own twist.',
    'Iterate: combine, remix, refine.',
    'Add your personal voice and check ethics.',
  ],
  realWorld: [
    'Brainstorming story or project ideas.',
    'Generating design variations to choose from.',
    'Overcoming "blank page" block.',
    'Remixing styles for inspiration.',
    'Speeding up rough drafts.',
  ],
  facts: [
    'AI is best at QUANTITY of ideas; humans add QUALITY and meaning.',
    'Originality grows when you add your own twist to AI output.',
    'Disclosing AI help keeps your creativity honest.',
  ],
  activity: {
    title: 'Idea Storm',
    materials: ['Idea sheet', 'Timer'],
    steps: [
      'Pick a creative challenge.',
      'Brainstorm (with or without AI) 15 ideas in 5 minutes.',
      'Circle the 3 best.',
      'Add your unique twist to one.',
    ],
    expected: 'Students generate many ideas and refine one with a personal twist.',
  },
  miniChallenge: 'Combine two unrelated ideas into one brilliant new invention.',
  project: {
    title: 'Human + AI Creation',
    description: 'Make a creative piece where AI helps but YOUR voice leads.',
    materials: ['Any medium', 'AI Diary'],
    steps: [
      'Choose your creation (story, art, song, game idea).',
      'Use AI to brainstorm or draft.',
      'Add your personal twist and meaning.',
      'Write what AI did vs what YOU did.',
    ],
    expectedOutput: 'A creative piece with a clear note on the human vs AI contribution.',
    extensions: ['Make a version with no AI and compare.', 'Get feedback and iterate once.'],
  },
  logic: 'Divergent + convergent thinking: AI boosts idea generation (divergent); humans select and refine (convergent) — the full creative cycle.',
  discussion: [
    'Does using AI make you less creative or more?',
    'What makes a creation truly "yours"?',
    'Where is the line between inspiration and copying?',
  ],
  careers: [
    'Creative Director (AI-assisted).',
    'Designer / Artist / Writer.',
    'Innovation Consultant.',
  ],
  homework: [
    'Brainstorm 10 ideas for a project, then pick and improve one.',
    'Create something small and note your unique twist.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'In human + AI creativity, the human provides…', options: ['Vision, taste and meaning', 'Nothing', 'Only typing', 'The electricity'], answer: 'Vision, taste and meaning', explanation: 'Humans direct and add meaning.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'AI is especially good at giving you…', options: ['Many ideas quickly', 'Perfect final art every time', 'Your personal voice', 'True feelings'], answer: 'Many ideas quickly', explanation: 'Breadth of options.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'How do you make AI-assisted work more original?', answer: 'Add your own twist, voice and meaning.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Combine "umbrella" and "music" into one new invention idea.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const GENERATIVE = [textGeneration, imageGeneration, musicGeneration, videoGeneration, promptEngineering, aiCreativity];

// =====================================================================
//  MODULE 7 · RESPONSIBLE AI
// =====================================================================
const M7 = 'Responsible AI';

const aiEthics = lesson({
  title: 'AI Ethics',
  module: M7,
  summary: 'Learn the rules for using AI in fair, safe and honest ways.',
  hook: 'AI is powerful — but with great power comes great responsibility. Who decides what AI should and should not do?',
  story: 'ARIA is super capable now. The class holds a "Council of Fairness" and writes ARIA\'s rules: be fair, respect privacy, be honest, keep a human in charge. ARIA becomes not just smart, but GOOD.',
  layman: 'AI ethics is about using AI in ways that are fair, safe, honest and respectful. Because AI is so powerful, we need clear rules so it helps people and does not cause harm.',
  concept: 'AI ethics covers fairness (avoid bias), privacy (protect personal data), transparency (explain decisions), accountability (humans stay responsible), safety and honesty. Ethical AI keeps humans in control and considers impact on all people.',
  analogies: [
    { concept: 'AI ethics', analogy: 'Rules of a game', explanation: 'Rules keep the game fair and fun for everyone.' },
    { concept: 'Accountability', analogy: 'A driver of a car', explanation: 'The tool is powerful, but a responsible human is at the wheel.' },
  ],
  howItWorks: [
    'Ask: who does this AI affect?',
    'Check fairness across different groups.',
    'Protect personal data and get consent.',
    'Make decisions explainable.',
    'Keep a responsible human in charge.',
  ],
  realWorld: [
    'Companies setting up AI ethics boards.',
    'Laws requiring fair, explainable AI.',
    'Hospitals keeping doctors in charge of AI advice.',
    'Schools setting AI-use honesty rules.',
    'Apps offering clear privacy controls.',
  ],
  facts: [
    'Many countries are writing AI laws right now.',
    'The five ethics pillars: fairness, privacy, transparency, accountability, safety.',
    'Ethical thinking is as important as coding in AI careers.',
  ],
  activity: {
    title: 'Write the AI Rules',
    materials: ['Chart paper', 'Markers'],
    steps: [
      'Brainstorm rules under fairness, privacy, honesty, human-in-charge.',
      'Pick the top 5 rules.',
      'Design a class "AI Bill of Rights" poster.',
      'Everyone signs it.',
    ],
    expected: 'A signed class AI ethics charter.',
  },
  miniChallenge: 'Write the ONE rule you think every AI must follow — defend it in 20 seconds.',
  project: {
    title: 'Our AI Charter',
    description: 'Create a poster of rules for fair, safe, honest AI.',
    materials: ['Poster paper', 'Markers'],
    steps: [
      'List rules under the 5 ethics pillars.',
      'Choose 5–7 and explain each briefly.',
      'Add icons and a slogan.',
      'Display it in class.',
    ],
    expectedOutput: 'A signed AI Charter your future projects will follow.',
    extensions: ['Audit a tool you use against your charter.', 'Find a news story about AI ethics.'],
  },
  logic: 'Values + impact: tracing how a decision affects different people, then designing safeguards, is high-order ethical reasoning.',
  discussion: [
    'Who should be responsible when an AI makes a harmful mistake?',
    'Should every AI decision be explainable? Always?',
    'Is it ever okay to use AI to deceive?',
  ],
  careers: [
    'AI Ethicist.',
    'Policy / Legal Advisor for tech.',
    'Responsible AI Product Manager.',
  ],
  homework: [
    'Find an app\'s rules/policy and summarise one fairness point.',
    'Discuss one AI ethics rule with your family.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Who stays responsible for an AI\'s decisions?', options: ['Humans', 'Nobody', 'The internet', 'The weather'], answer: 'Humans', explanation: 'Accountability stays with people.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Which is an AI ethics pillar?', options: ['Fairness', 'Loudness', 'Heaviness', 'Brightness'], answer: 'Fairness', explanation: 'Fairness is core to ethics.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What does "transparency" mean for AI?', answer: 'It can explain how/why it made a decision.', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'Name a powerful AI use that could be helpful AND harmful. Explain both.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const biasInAI = lesson({
  title: 'Bias in AI',
  module: M7,
  summary: 'Understand how AI becomes unfair and how to make it fairer.',
  hook: 'An AI hiring tool quietly rejected many women — nobody told it to. Where did the unfairness come from?',
  story: 'ARIA makes an unfair call one day. The class investigates like detectives and finds the culprit: one-sided training data. They fix the data and retrain. ARIA becomes fair again. "I only reflect what I am shown," she says.',
  layman: 'Bias means unfair treatment of some groups. AI learns from data, so if the data is one-sided, the AI becomes unfair too — even without anyone meaning to. Fixing it starts with balanced, fair data.',
  concept: 'Algorithmic bias is systematic unfairness in AI outputs, usually caused by unrepresentative or prejudiced training data (and sometimes flawed design). Mitigation includes balanced/representative data, testing across groups, and human oversight.',
  analogies: [
    { concept: 'Bias from data', analogy: 'A crooked mirror', explanation: 'AI reflects its data; a crooked mirror gives a crooked picture.' },
    { concept: 'Fix the source', analogy: 'Cleaning a dirty lens', explanation: 'Clean, balanced data clears the picture.' },
  ],
  howItWorks: [
    'AI learns patterns from training data.',
    'If data over-represents one group, patterns favour it.',
    'The AI gives unfair results to others.',
    'We test outputs across different groups.',
    'We rebalance data and add human review.',
  ],
  realWorld: [
    'Face systems less accurate for some skin tones (from narrow data).',
    'Hiring tools favouring one group.',
    'Voice assistants understanding some accents better.',
    'Loan tools unfairly scoring some applicants.',
    'Image search returning stereotyped results.',
  ],
  facts: [
    'Bias almost always traces back to the data.',
    'AI is not "trying" to be unfair — it copies patterns.',
    'Testing across groups is how teams catch bias.',
  ],
  activity: {
    title: 'Bias Detectives',
    materials: ['Scenario cards', 'Worksheet'],
    steps: [
      'Read a biased-AI scenario.',
      'Find WHERE the unfairness came from.',
      'Propose a fix (better data, testing, human check).',
      'Share with the class.',
    ],
    expected: 'Students trace bias to its source and propose a concrete fix.',
  },
  miniChallenge: 'Find the hidden bias in a "perfect-looking" dataset description.',
  project: {
    title: 'Fairness Audit',
    description: 'Audit a dataset or tool for possible bias and suggest fixes.',
    materials: ['Worksheet', 'Sample dataset'],
    steps: [
      'Pick a dataset/tool example.',
      'Check who might be under-represented.',
      'List 2 possible unfair outcomes.',
      'Suggest 2 concrete fixes.',
    ],
    expectedOutput: 'A short fairness audit with risks and fixes.',
    extensions: ['Rebalance a sample dataset.', 'Design a fairness test.'],
  },
  logic: 'Root-cause analysis: tracing an unfair outcome back to its data source is exactly how engineers debug fairness problems.',
  discussion: [
    'Why is biased AI dangerous even when no one meant harm?',
    'Whose job is it to catch bias?',
    'How would you test if an AI is fair?',
  ],
  careers: [
    'AI Fairness Researcher.',
    'Data Auditor.',
    'Responsible AI Engineer.',
  ],
  homework: [
    'Think of a dataset that might be one-sided and explain why.',
    'Find a news story about AI bias and summarise the cause.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'AI bias usually comes from…', options: ['Unfair/one-sided data', 'Too much sunlight', 'Slow internet', 'Loud noise'], answer: 'Unfair/one-sided data', explanation: 'AI reflects its data.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A good way to catch bias is to…', options: ['Test across different groups', 'Never test', 'Hide the results', 'Use less data only'], answer: 'Test across different groups', explanation: 'Group testing reveals unfairness.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'First step to fix biased AI?', answer: 'Use balanced, representative data.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'An AI grades essays unfairly for one group. Suggest TWO fixes.', answer: 'Open-ended (balance data, test groups, human review).', difficulty: 'advanced' },
  ],
});

const privacySecurity = lesson({
  title: 'Privacy and Security',
  module: M7,
  summary: 'Protect your personal data and stay safe while using AI.',
  hook: 'Apps know your location, photos and habits. Who else can see them — and how do you stay safe?',
  story: 'ARIA finds a diary with a lock. "This is your personal data," she explains, "and it deserves a lock too." The class learns to share carefully, use strong passwords, and check what apps can see.',
  layman: 'Privacy means controlling your personal information — who sees it and how it is used. Security means protecting it from theft. With AI everywhere, sharing carefully and using strong passwords matters more than ever.',
  concept: 'Data privacy is the right to control collection and use of personal data; security is protecting data from unauthorised access. Good practices: minimise sharing, strong unique passwords, check app permissions, recognise scams, and prefer consent and encryption.',
  analogies: [
    { concept: 'Privacy', analogy: 'A diary lock', explanation: 'Your data is private — share only with permission.' },
    { concept: 'Password', analogy: 'A house key', explanation: 'Strong, unique keys keep intruders out.' },
  ],
  howItWorks: [
    'Apps collect data (location, photos, habits).',
    'You choose what to share via permissions.',
    'Strong passwords protect your accounts.',
    'Data should be stored securely (encrypted).',
    'Stay alert for scams and phishing.',
  ],
  realWorld: [
    'App permission settings (camera, location).',
    'Two-factor login for accounts.',
    'Privacy controls on social media.',
    'Spotting phishing messages.',
    'Banks encrypting your data.',
  ],
  facts: [
    'Reusing the same password everywhere is risky.',
    'Many apps collect more data than they need.',
    'You can usually turn off location sharing.',
  ],
  activity: {
    title: 'Share or Not?',
    materials: ['Info cards', 'Two bins: SAFE / PRIVATE'],
    steps: [
      'Sort info into "okay to share" vs "keep private".',
      'Debate tricky ones (school name? birthday?).',
      'Make a class "never share" list.',
      'Design a strong-password rule.',
    ],
    expected: 'Students distinguish shareable vs private info and define safe habits.',
  },
  miniChallenge: 'Create the strongest password you can remember — but never share it!',
  project: {
    title: 'Digital Safety Guide',
    description: 'Make a privacy & security guide for kids.',
    materials: ['Paper', 'Markers'],
    steps: [
      'List 5 "keep private" items.',
      'Write 3 password rules.',
      'Add how to spot a scam.',
      'Add one "ask an adult" rule.',
    ],
    expectedOutput: 'A clear digital-safety guide with privacy, passwords and scam tips.',
    extensions: ['Check one app\'s permissions with an adult.', 'Add a "what to do if hacked" step.'],
  },
  logic: 'Risk thinking: weighing what to share against possible harm is essential judgement for a safe digital citizen.',
  discussion: [
    'What personal info should you NEVER share online?',
    'Why might a free app still "cost" you your data?',
    'How do you decide if a message is a scam?',
  ],
  careers: [
    'Cybersecurity Analyst.',
    'Privacy Officer.',
    'Ethical Hacker (finds weaknesses to fix them).',
  ],
  homework: [
    'With an adult, review one app\'s permissions.',
    'Make a strong, unique password and a memory trick for it.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'Protecting your personal information is called…', options: ['Privacy', 'Pixels', 'Prompting', 'Plotting'], answer: 'Privacy', explanation: 'Privacy protects personal data.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A strong password should be…', options: ['Long, unique and secret', 'The same everywhere', 'Your name', '1234'], answer: 'Long, unique and secret', explanation: 'Strong, unique keys are safest.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one thing you should never share online.', answer: 'Open-ended (password, home address, etc.).', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A "free" game asks for your contacts and location. Should you give it? Why?', answer: 'Be cautious — it may not need them; check permissions.', difficulty: 'intermediate' },
  ],
});

const fakeNews = lesson({
  title: 'Fake News',
  module: M7,
  summary: 'Become a fact-checker who can spot false information online.',
  hook: 'A shocking headline spreads to millions in minutes — but is it even TRUE? How do you know?',
  story: 'ARIA reads a scary headline and almost panics. Then she remembers: check the source, look for evidence, see who else reports it. The "news" turns out to be fake. ARIA becomes a calm, careful fact-checker.',
  layman: 'Fake news is false or misleading information made to look real. AI can create and spread it fast. To stay smart, check the source, look for evidence, and see if trusted outlets report the same thing.',
  concept: 'Misinformation (false) and disinformation (deliberately false) spread rapidly online, sometimes amplified or generated by AI. Media literacy — verifying source, evidence, date and cross-checking reputable outlets — is the key defence.',
  analogies: [
    { concept: 'Fact-checking', analogy: 'A detective verifying clues', explanation: 'Do not trust one clue — confirm it from many.' },
    { concept: 'Clickbait', analogy: 'A shiny lure on a hook', explanation: 'Designed to grab you, not to inform you.' },
  ],
  howItWorks: [
    'Notice a strong emotional reaction (a warning sign).',
    'Check the source — is it trustworthy?',
    'Look for evidence and a date.',
    'See if reputable outlets report the same.',
    'If unsure, do not share it.',
  ],
  realWorld: [
    'Viral hoaxes on social media.',
    'Edited photos with false captions.',
    'AI-written fake articles.',
    'Misleading health claims.',
    'Rumours during emergencies.',
  ],
  facts: [
    'False news can spread faster than true news online.',
    'A real-looking website can still be fake.',
    'Strong emotions are used to make you share without thinking.',
  ],
  activity: {
    title: 'Real or Fake?',
    materials: ['Headline cards (mix of real/fake)'],
    steps: [
      'Read each headline.',
      'Vote real or fake and explain why.',
      'Apply the source/evidence/cross-check test.',
      'Reveal answers and discuss clues.',
    ],
    expected: 'Students apply a fact-checking checklist to judge headlines.',
  },
  miniChallenge: 'Spot the fake headline in 30 seconds using one clue.',
  project: {
    title: 'Fact-Checker Toolkit',
    description: 'Build a checklist others can use to spot fake news.',
    materials: ['Paper', 'Markers'],
    steps: [
      'Write 5 fact-checking steps.',
      'Add 3 warning signs of fake news.',
      'Add 2 trusted ways to verify.',
      'Test it on a real headline.',
    ],
    expectedOutput: 'A reusable fact-checking checklist tested on a real example.',
    extensions: ['Find one viral claim and verify it.', 'Add a "before you share" rule.'],
  },
  logic: 'Critical evaluation: separating claim from evidence and checking sources is the core skill of a smart, calm digital citizen.',
  discussion: [
    'Why do people share fake news without checking?',
    'How can AI make fake news worse — and how can it help fight it?',
    'What is your responsibility before sharing something?',
  ],
  careers: [
    'Fact-Checker / Journalist.',
    'Misinformation Researcher.',
    'Trust & Safety Specialist.',
  ],
  homework: [
    'Fact-check one thing you saw online today.',
    'Teach a family member your "before you share" rule.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Before sharing a shocking story you should…', options: ['Check the source and evidence', 'Share instantly', 'Add more drama', 'Ignore the date'], answer: 'Check the source and evidence', explanation: 'Verify before sharing.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A common trick of fake news is to…', options: ['Trigger strong emotions', 'Cite many real sources', 'Be boring and accurate', 'Show its evidence'], answer: 'Trigger strong emotions', explanation: 'Emotion drives quick sharing.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What should you do if you are unsure a story is true?', answer: 'Do not share it until you verify it.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'Only one unknown website reports a huge story. What does that suggest?', answer: 'Be suspicious — cross-check trusted outlets.', difficulty: 'intermediate' },
  ],
});

const deepfakes = lesson({
  title: 'Deepfakes',
  module: M7,
  summary: 'Learn what deepfakes are, why they are risky, and how to spot them.',
  hook: 'A video shows a famous person saying something they never said. It looks 100% real. How is that possible?',
  story: 'ARIA sees a deepfake of her own teacher saying silly things. Shocked, she learns deepfakes are AI-made fakes. She studies the tell-tale clues — odd blinking, weird edges, no reliable source — and becomes a deepfake spotter.',
  layman: 'A deepfake is an AI-made fake video, image or audio that looks or sounds real. It can be used for fun (films) but also to trick or harm people. Spotting clues and checking the source helps you stay safe.',
  concept: 'Deepfakes use generative AI (often GAN/diffusion-based) to synthesise realistic but fake media of people. Risks include fraud, harassment and misinformation. Detection relies on artefacts, provenance/source checks, and emerging watermarking and detection tools.',
  analogies: [
    { concept: 'Deepfake', analogy: 'A perfect mask', explanation: 'So realistic it can fool people — but it is still a fake.' },
    { concept: 'Detection clues', analogy: 'Spotting a forged signature', explanation: 'Tiny flaws reveal the fake.' },
  ],
  howItWorks: [
    'AI learns a person\'s face/voice from many samples.',
    'It generates new fake footage of them.',
    'The fake can look and sound convincing.',
    'Look for clues: odd blinking, blurry edges, weird audio.',
    'Check the source and look for reliable confirmation.',
  ],
  realWorld: [
    'Fun face-swap filters and movie effects.',
    'Scam calls using a cloned voice.',
    'Fake celebrity endorsement videos.',
    'Political misinformation clips.',
    'Tools that detect or watermark fakes.',
  ],
  facts: [
    'Some deepfakes have flaws like unnatural blinking.',
    'Voice can be cloned from just seconds of audio.',
    'Researchers build AI to DETECT deepfakes too.',
  ],
  activity: {
    title: 'Spot the Fake',
    materials: ['Real vs fake example sets (teacher-curated)'],
    steps: [
      'Compare real and (clearly labelled) fake examples.',
      'List the clues that reveal a fake.',
      'Make a "deepfake detector" checklist.',
      'Discuss why source-checking matters most.',
    ],
    expected: 'Students list detection clues and the value of source verification.',
  },
  miniChallenge: 'Name 3 clues you would check first to test if a video is fake.',
  project: {
    title: 'Deepfake Defence Poster',
    description: 'Create a poster teaching how to spot and respond to deepfakes.',
    materials: ['Poster paper', 'Markers'],
    steps: [
      'List 4 visual/audio clues of a fake.',
      'Add "check the source" steps.',
      'Add what to do if you find a harmful deepfake.',
      'Add a class rule for using face/voice AI kindly.',
    ],
    expectedOutput: 'A defence poster with clues, source-check steps and a kindness rule.',
    extensions: ['Research one real deepfake case.', 'Design a "consent first" rule.'],
  },
  logic: 'Evidence + provenance: judging media by its source and tell-tale artefacts is crucial reasoning in an AI-media world.',
  discussion: [
    'When is making a deepfake okay (fun/film) vs harmful?',
    'Should deepfakes be labelled by law?',
    'How would you feel if someone deepfaked you?',
  ],
  careers: [
    'Media Forensics Analyst.',
    'VFX Artist (ethical use).',
    'Trust & Safety / Policy Specialist.',
  ],
  homework: [
    'Find 2 tips to detect deepfakes and share them.',
    'Make a "consent before face/voice AI" family rule.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A deepfake is…', options: ['AI-made fake media of a person', 'A deep swimming pool', 'A real news report', 'A type of password'], answer: 'AI-made fake media of a person', explanation: 'Synthetic fake media.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A good first step to test a suspicious video is…', options: ['Check the source and look for confirmation', 'Share it widely', 'Believe it instantly', 'Ignore the audio'], answer: 'Check the source and look for confirmation', explanation: 'Provenance matters most.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one visual clue that a video might be a deepfake.', answer: 'Open-ended (odd blinking, blurry edges, weird lip-sync).', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'List 2 harms of deepfakes and 1 way society can fight them.', answer: 'Open-ended (labels, detection tools, laws).', difficulty: 'advanced' },
  ],
});

const safeAIUsage = lesson({
  title: 'Safe AI Usage',
  module: M7,
  summary: 'Build smart, healthy habits for using AI tools responsibly.',
  hook: 'AI can be your superpower OR a crutch. How do you use it to grow smarter, not lazier?',
  story: 'ARIA offers to do all your homework. Tempting! But you choose to use her as a TUTOR, not a cheat. You ask her to explain, then do the work yourself. You grow stronger — and ARIA is proud.',
  layman: 'Safe AI usage means using AI as a helper, not a replacement for your own thinking. Check its answers, protect your privacy, be honest about using it, and keep learning real skills.',
  concept: 'Responsible AI use combines verification (fact-check outputs), privacy (do not overshare), academic honesty (disclose AI help), healthy balance (AI augments, not replaces, learning), and critical thinking. The user stays the decision-maker.',
  analogies: [
    { concept: 'AI as a tool', analogy: 'A calculator', explanation: 'Great helper, but you still must understand the maths.' },
    { concept: 'AI tutor vs cheat', analogy: 'Training wheels vs a tow rope', explanation: 'One helps you learn to ride; the other never lets you ride yourself.' },
  ],
  howItWorks: [
    'Use AI to learn and assist, not to replace thinking.',
    'Always fact-check important outputs.',
    'Protect your privacy — share carefully.',
    'Disclose when AI helped your work.',
    'Keep building your own real skills.',
  ],
  realWorld: [
    'Using AI to explain a tricky concept, then practising it.',
    'Drafting with AI, then editing and verifying.',
    'Asking AI for study questions.',
    'Disclosing AI help on a project.',
    'Choosing NOT to share private info with a bot.',
  ],
  facts: [
    'AI can be confidently wrong — verify it.',
    'Honesty about AI help builds trust.',
    'Over-relying on AI can weaken your own skills.',
  ],
  activity: {
    title: 'Helper or Cheat?',
    materials: ['Scenario cards'],
    steps: [
      'Sort uses into "smart helper" vs "unfair shortcut".',
      'Debate the tricky middle cases.',
      'Write 5 "good AI use" rules.',
      'Add one honesty rule.',
    ],
    expected: 'Students define responsible vs irresponsible AI use.',
  },
  miniChallenge: 'Rewrite "do my essay" into a fair, learning-focused AI request.',
  project: {
    title: 'My AI-Use Pledge',
    description: 'Write a personal pledge for using AI responsibly.',
    materials: ['Pledge card', 'Pens'],
    steps: [
      'List 5 promises (verify, disclose, protect privacy…).',
      'Add one "I will still learn ___ myself".',
      'Decorate and sign it.',
      'Share one promise with the class.',
    ],
    expectedOutput: 'A signed personal "AI for Good" pledge.',
    extensions: ['Make a family AI-use agreement.', 'Add a weekly self-check.'],
  },
  logic: 'Metacognition + ethics: deciding HOW and WHEN to use a tool — and staying the thinker — is the wisest use of technology.',
  discussion: [
    'When does using AI help you learn vs stop you learning?',
    'Should you tell a teacher you used AI? Why?',
    'What skills do you want to keep strong yourself?',
  ],
  careers: [
    'AI Literacy Educator.',
    'Digital Wellbeing Specialist.',
    'Responsible AI Advocate.',
  ],
  homework: [
    'Use AI as a tutor for one topic, then self-test without it.',
    'Write one AI-use rule for your home.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Safe AI use means treating AI as a…', options: ['Helper you still check', 'Replacement for thinking', 'Secret cheat', 'Magic truth machine'], answer: 'Helper you still check', explanation: 'Verify and stay in charge.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'If AI helped your project, you should…', options: ['Disclose it honestly', 'Hide it', 'Claim you did it all', 'Delete the project'], answer: 'Disclose it honestly', explanation: 'Honesty builds trust.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Why fact-check AI before trusting it?', answer: 'It can be confidently wrong.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Give one AI use that helps learning and one that harms it.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const RESPONSIBLE = [aiEthics, biasInAI, privacySecurity, fakeNews, deepfakes, safeAIUsage];

// =====================================================================
//  MODULE 8 · AI TOOLS
// =====================================================================
const M8 = 'AI Tools';

const chatGPT = lesson({
  title: 'ChatGPT & AI Chatbots',
  module: M8,
  summary: 'Use AI chat assistants well — to learn, create and solve problems.',
  hook: 'You can chat with an AI that answers almost anything in seconds. How do you get the BEST out of it?',
  story: 'ARIA opens a chat window. At first the answers are so-so. Then you teach her to ask clearly, give context, and check facts. Suddenly the chatbot becomes a brilliant study buddy.',
  layman: 'AI chatbots like ChatGPT understand your questions and reply in natural language. They can explain, brainstorm, summarise and help with tasks — but they can be wrong, so check important answers.',
  concept: 'Conversational AI assistants use large language models to interpret prompts and generate helpful replies. They excel at explanation, drafting, brainstorming and Q&A. Best practice: give clear prompts and context, iterate, and verify facts (they can hallucinate).',
  analogies: [
    { concept: 'Chatbot', analogy: 'A knowledgeable friend on call', explanation: 'Helpful and fast — but double-check big claims.' },
    { concept: 'Context', analogy: 'Telling a tutor your level', explanation: 'More context = a better-fitting answer.' },
  ],
  howItWorks: [
    'You type a prompt (question or task).',
    'The model interprets your intent.',
    'It generates a reply word by word.',
    'You refine with follow-ups and context.',
    'You verify any important facts.',
  ],
  realWorld: [
    'Explaining a tricky concept simply.',
    'Brainstorming ideas for a project.',
    'Summarising a long text.',
    'Drafting an email or plan.',
    'Practising a language by chatting.',
  ],
  facts: [
    'ChatGPT reached 100 million users faster than any app before it.',
    'Chatbots can hold context across a conversation.',
    'They can be confidently wrong — always verify.',
  ],
  activity: {
    title: 'Prompt & Improve',
    materials: ['Worksheet (teacher-guided tool optional)'],
    steps: [
      'Write a vague question and a clear one.',
      'Compare the quality (predict or test).',
      'Add a follow-up to go deeper.',
      'Fact-check one answer.',
    ],
    expected: 'Students use clear prompts, follow-ups and verification.',
  },
  miniChallenge: 'Get a chatbot to explain a hard topic to a 5-year-old in one prompt.',
  project: {
    title: 'My AI Study Buddy Session',
    description: 'Plan a learning session using an AI chatbot responsibly.',
    materials: ['Worksheet', 'AI Diary'],
    steps: [
      'Pick a topic to understand better.',
      'Write 3 strong prompts (explain, quiz, examples).',
      'Note one answer you verified.',
      'Reflect on what helped you learn.',
    ],
    expectedOutput: 'A planned, verified study session with 3 prompts and a reflection.',
    extensions: ['Add a "simplify this" follow-up.', 'Catch one hallucination.'],
  },
  logic: 'Clear questioning + verification: framing prompts well and checking outputs turns a chatbot into a powerful, trustworthy tool.',
  discussion: [
    'When is it okay to use a chatbot for schoolwork?',
    'How do you know if a chatbot answer is reliable?',
    'What can a chatbot NOT do for you?',
  ],
  careers: [
    'Prompt Engineer.',
    'AI Support Specialist.',
    'Conversation Designer.',
  ],
  homework: [
    'Ask a chatbot to quiz you, then verify its answers.',
    'Write your 3 favourite prompt templates.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'To get a better chatbot answer, you should…', options: ['Give clear prompts and context', 'Type one vague word', 'Never follow up', 'Trust everything'], answer: 'Give clear prompts and context', explanation: 'Clarity improves replies.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Chatbots can sometimes be…', options: ['Confidently wrong', 'Always perfect', 'Unable to talk', 'A calculator only'], answer: 'Confidently wrong', explanation: 'Verify important facts.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What should you do with important chatbot facts?', answer: 'Verify them from a trusted source.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write a prompt that asks for 5 quiz questions on a topic you like.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const imageGenerators = lesson({
  title: 'Image Generators',
  module: M8,
  summary: 'Explore popular AI image tools and how to create great visuals responsibly.',
  hook: 'Designers now make a poster in minutes using AI image tools. Want to try — the smart way?',
  story: 'ARIA opens an image studio. With a vague prompt she gets a mess; with a detailed one she gets a masterpiece. She learns to credit AI and respect real artists\' styles.',
  layman: 'AI image generators turn text prompts into pictures. To use them well: write detailed prompts, iterate, pick the best, and always credit AI and respect artists. They are tools for ideas and design.',
  concept: 'Text-to-image tools generate visuals from prompts using learned patterns. Effective use needs descriptive prompts (subject, style, mood, composition), iteration and selection. Responsible use includes disclosure, copyright awareness and respecting artists.',
  analogies: [
    { concept: 'Image tool', analogy: 'A magic art studio', explanation: 'Describe it well and it paints your idea.' },
    { concept: 'Iteration', analogy: 'Rough sketch to final', explanation: 'Refine the prompt like refining a sketch.' },
  ],
  howItWorks: [
    'Write a detailed prompt.',
    'Generate several options.',
    'Pick the closest and refine the prompt.',
    'Edit or upscale if needed.',
    'Credit AI and check usage rights.',
  ],
  realWorld: [
    'Posters and social graphics.',
    'Story and game illustrations.',
    'Mood boards and concept art.',
    'Custom emojis and avatars.',
    'Product design mockups.',
  ],
  facts: [
    'A tiny prompt change can transform the image.',
    'Some tools let you edit only part of an image.',
    'Always check who owns the rights to use an image.',
  ],
  activity: {
    title: 'Prompt Lab',
    materials: ['Prompt sheet (teacher-guided tool optional)'],
    steps: [
      'Write subject + style + mood + colours.',
      'Generate or sketch the result.',
      'Improve with one detail change.',
      'Add a credit line.',
    ],
    expected: 'Students craft detailed prompts and credit AI use.',
  },
  miniChallenge: 'Describe your dream invention so well an artist could draw it from words alone.',
  project: {
    title: 'AI Poster Project',
    description: 'Design a poster for a good cause using an AI image tool (or sketch).',
    materials: ['Tool or paper', 'AI Diary'],
    steps: [
      'Pick a cause (kindness, recycling).',
      'Write a detailed prompt and generate.',
      'Add a slogan and AI credit.',
      'Note what you changed to improve it.',
    ],
    expectedOutput: 'A purposeful poster with a detailed prompt and AI credit.',
    extensions: ['Try two styles.', 'Make a matching social-media version.'],
  },
  logic: 'Specification + iteration: describing precisely and refining is the same loop used across engineering and design.',
  discussion: [
    'Should AI images mimic a living artist\'s style?',
    'How do we credit AI fairly?',
    'When is an AI image "yours"?',
  ],
  careers: [
    'Graphic Designer (AI-assisted).',
    'Brand / Marketing Creative.',
    'Illustrator / Concept Artist.',
  ],
  homework: [
    'Write 3 detailed image prompts.',
    'Find an AI image online and discuss its credit/ethics.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'For a better AI image, your prompt should be…', options: ['Detailed (subject, style, mood)', 'One vague word', 'Empty', 'A password'], answer: 'Detailed (subject, style, mood)', explanation: 'Detail steers the image.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Responsible image-AI use includes…', options: ['Crediting AI and checking rights', 'Hiding that AI made it', 'Copying living artists', 'Ignoring copyright'], answer: 'Crediting AI and checking rights', explanation: 'Disclosure and rights matter.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do you do if the first image is not quite right?', answer: 'Refine the prompt and generate again.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Add style + mood + colour to: "a robot".', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const voiceAI = lesson({
  title: 'Voice AI',
  module: M8,
  summary: 'Discover speech-to-text, text-to-speech and voice cloning tools.',
  hook: 'AI can type out everything you say, read text aloud in any voice, and even copy a voice. Helpful — and a little spooky!',
  story: 'ARIA learns to speak and listen. She transcribes a speech instantly, reads a story aloud in a cheerful voice, and learns that copying someone\'s voice needs their permission.',
  layman: 'Voice AI includes turning speech into text (transcription), text into speech (reading aloud), and copying voices (cloning). It powers captions, audiobooks and assistants — but voice cloning must be used with consent.',
  concept: 'Voice AI covers automatic speech recognition (speech→text), text-to-speech synthesis (text→natural speech), and voice cloning. Applications include accessibility, captions and narration. Ethics: consent for cloning, and labelling synthetic voices.',
  analogies: [
    { concept: 'Speech-to-text', analogy: 'A super-fast note-taker', explanation: 'It writes down every word you say.' },
    { concept: 'Voice cloning', analogy: 'A vocal costume', explanation: 'Powerful — only wear it with permission.' },
  ],
  howItWorks: [
    'A mic captures audio.',
    'Speech-to-text turns it into words.',
    'Text-to-speech turns text into a natural voice.',
    'Voice cloning learns a voice from samples.',
    'Ethical use needs consent and labelling.',
  ],
  realWorld: [
    'Live captions for videos and calls.',
    'Audiobooks read by AI voices.',
    'Voice typing on phones.',
    'Accessibility for people who cannot type.',
    'Dubbing videos into other languages.',
  ],
  facts: [
    'A voice can be cloned from just seconds of audio.',
    'Captions help people who are deaf or hard of hearing.',
    'Synthetic voices should be disclosed.',
  ],
  activity: {
    title: 'Voice Tech Round-Up',
    materials: ['Scenario cards'],
    steps: [
      'Match each scenario to: speech-to-text, text-to-speech, or cloning.',
      'Decide which need consent.',
      'List one helpful and one risky use of cloning.',
      'Write a consent rule.',
    ],
    expected: 'Students classify voice tech and identify consent needs.',
  },
  miniChallenge: 'Write a kind rule for when voice cloning is and is not allowed.',
  project: {
    title: 'Accessible Audio Plan',
    description: 'Design how voice AI could make something more accessible.',
    materials: ['Worksheet'],
    steps: [
      'Pick a use (captions, read-aloud).',
      'Describe who it helps.',
      'List the voice tech needed.',
      'Add an ethics/consent note.',
    ],
    expectedOutput: 'An accessibility plan using voice AI with an ethics note.',
    extensions: ['Add multi-language support.', 'Add a "label synthetic voice" rule.'],
  },
  logic: 'Mapping problems to tools: matching the right voice technology to a need is practical systems thinking with an ethics check.',
  discussion: [
    'When is voice cloning helpful? When is it dangerous?',
    'Should AI voices always be labelled?',
    'How does voice AI help accessibility?',
  ],
  careers: [
    'Speech AI Engineer.',
    'Accessibility Specialist.',
    'Audio/Localization Producer.',
  ],
  homework: [
    'Turn on captions and notice errors the AI makes.',
    'Discuss a fair voice-cloning rule with family.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Turning speech into written words is…', options: ['Speech-to-text', 'Text-to-speech', 'Voice cloning', 'Encryption'], answer: 'Speech-to-text', explanation: 'ASR transcribes audio.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Copying someone\'s voice requires…', options: ['Their consent', 'Nothing', 'A password', 'A camera'], answer: 'Their consent', explanation: 'Consent is essential.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one accessibility use of voice AI.', answer: 'Captions or read-aloud for those who need it.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A scam call uses a cloned voice of a parent. Why is this dangerous and what helps?', answer: 'It can trick people; verify via a known number/safe word.', difficulty: 'advanced' },
  ],
});

const codingAssistants = lesson({
  title: 'Coding Assistants',
  module: M8,
  summary: 'See how AI helps people write, explain and fix computer code.',
  hook: 'Imagine a helper that writes code with you, explains errors, and suggests the next line. Programmers already have one!',
  story: 'ARIA pairs up with a young coder. When they get stuck, ARIA suggests a line, explains a bug, and offers ideas. The coder still decides what to keep — and learns faster than ever.',
  layman: 'AI coding assistants suggest code, explain errors, and help fix bugs. They speed up programming and help beginners learn — but you must understand and check the code, not just paste it.',
  concept: 'AI pair-programmers use code-trained language models to autocomplete code, explain snippets, generate functions and help debug. They boost productivity and learning, but require human understanding, testing and review — generated code can contain bugs or insecurity.',
  analogies: [
    { concept: 'Coding assistant', analogy: 'A spell-checker for code', explanation: 'Suggests and catches issues — but you decide.' },
    { concept: 'Pair programming', analogy: 'A study partner', explanation: 'Two minds catch more bugs than one.' },
  ],
  howItWorks: [
    'You start typing code or describe a task.',
    'The assistant suggests code or fixes.',
    'You read and understand the suggestion.',
    'You test that it actually works.',
    'You keep, edit or reject it.',
  ],
  realWorld: [
    'Autocompleting a function as you type.',
    'Explaining a confusing error message.',
    'Suggesting how to fix a bug.',
    'Writing boilerplate quickly.',
    'Helping beginners learn a language.',
  ],
  facts: [
    'AI suggestions can speed coding a lot — but can be wrong.',
    'You should always test AI-written code.',
    'Understanding the code matters more than copying it.',
  ],
  activity: {
    title: 'Read the Code',
    materials: ['Code snippet handout'],
    steps: [
      'Read a short snippet (with a hidden bug).',
      'Explain what each line does.',
      'Find and fix the bug.',
      'Discuss how an assistant could help.',
    ],
    expected: 'Students read, explain and debug a small snippet.',
  },
  miniChallenge: 'Spot the bug in a 5-line snippet in under a minute.',
  project: {
    title: 'Mini Code Helper Plan',
    description: 'Plan how you would use a coding assistant for a tiny program.',
    materials: ['Worksheet'],
    steps: [
      'Pick a tiny task (e.g. add two numbers).',
      'Write what you would ask the assistant.',
      'Note how you would TEST the result.',
      'Add a "I must understand it" rule.',
    ],
    expectedOutput: 'A plan showing responsible, tested use of a coding assistant.',
    extensions: ['Add an error you would ask it to explain.', 'Add a comment to each line.'],
  },
  code: {
    language: 'python',
    code: '# A coding assistant might suggest this — but ALWAYS test it!\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))   # expect 5',
    note: 'You do not need to memorise this — notice you must still check it gives 5.',
  },
  logic: 'Comprehension + testing: AI can suggest code, but understanding and verifying it is what makes you a real problem-solver.',
  discussion: [
    'Does using a coding assistant help or hurt learning to code?',
    'Why must you test AI-written code?',
    'Should you say AI helped write your program?',
  ],
  careers: [
    'Software Developer.',
    'AI Tools Engineer.',
    'Computer Science Teacher.',
  ],
  homework: [
    'Read any short code and explain it line by line.',
    'List 3 rules for using a coding assistant responsibly.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A coding assistant mainly helps you…', options: ['Write, explain and fix code', 'Cook food', 'Drive a car', 'Paint walls'], answer: 'Write, explain and fix code', explanation: 'It assists programming.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Before using AI-suggested code you should…', options: ['Understand and test it', 'Paste it blindly', 'Hide it', 'Delete your work'], answer: 'Understand and test it', explanation: 'Generated code can have bugs.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What matters more than copying code?', answer: 'Understanding it.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write what you would ASK an assistant to make a program that greets a user.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const productivityTools = lesson({
  title: 'AI Productivity Tools',
  module: M8,
  summary: 'Use AI to summarise, organise, plan and save time — wisely.',
  hook: 'What if AI could summarise a long article, plan your week, and tidy your notes in seconds? It can.',
  story: 'ARIA becomes a personal organiser. She summarises a long chapter, builds a study plan, and turns messy notes into neat ones. With time saved, you do more of what you love.',
  layman: 'AI productivity tools help you work smarter: summarising long text, organising notes, drafting plans, and automating repetitive tasks. Use them to save time — but stay in control and check results.',
  concept: 'AI productivity tools apply language and automation models to summarisation, note organisation, scheduling, drafting and task automation. They amplify output and free time for higher-value work, with human review for accuracy and judgement.',
  analogies: [
    { concept: 'AI assistant', analogy: 'A helpful secretary', explanation: 'Handles the busywork so you focus on big things.' },
    { concept: 'Summarisation', analogy: 'A movie trailer', explanation: 'The key points in a fraction of the time.' },
  ],
  howItWorks: [
    'Give the tool your content or goal.',
    'It summarises, organises or drafts.',
    'You review and adjust the output.',
    'You automate repetitive steps.',
    'You reclaim time for deeper work.',
  ],
  realWorld: [
    'Summarising a long article or PDF.',
    'Turning notes into study flashcards.',
    'Drafting a project plan or schedule.',
    'Auto-sorting emails or files.',
    'Generating meeting notes.',
  ],
  facts: [
    'Summaries save time but can miss nuance — skim the source too.',
    'Automation works best for repetitive, rule-based tasks.',
    'Saved time is only useful if you spend it well.',
  ],
  activity: {
    title: 'Summarise & Plan',
    materials: ['A short article', 'Worksheet'],
    steps: [
      'Read a short article.',
      'Write a 3-bullet summary (you, then compare to AI).',
      'Turn it into a 3-step action plan.',
      'List one task you could automate.',
    ],
    expected: 'Students practise summarising and planning, judging AI help.',
  },
  miniChallenge: 'Summarise a whole page into ONE clear sentence.',
  project: {
    title: 'My Productivity System',
    description: 'Design a simple AI-assisted system to manage your study/week.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'List your weekly tasks.',
      'Mark which AI could help (summarise, plan, remind).',
      'Build a simple weekly plan.',
      'Add a "review what AI did" step.',
    ],
    expectedOutput: 'A weekly productivity plan that uses AI wisely with human review.',
    extensions: ['Add a focus/break schedule.', 'Track time saved for one week.'],
  },
  logic: 'Prioritisation + automation: deciding what to automate vs do yourself is a core efficiency and self-management skill.',
  discussion: [
    'Can relying on summaries make you miss important details?',
    'Which tasks should you NEVER fully automate?',
    'How would you spend time AI saves you?',
  ],
  careers: [
    'Operations / Productivity Analyst.',
    'Knowledge Manager.',
    'Automation Specialist.',
  ],
  homework: [
    'Summarise one chapter into 5 bullets.',
    'Automate or simplify one repetitive home task.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'AI productivity tools help mainly by…', options: ['Saving time on busywork', 'Making decisions for you forever', 'Doing nothing', 'Replacing your judgement'], answer: 'Saving time on busywork', explanation: 'They amplify your work.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A risk of AI summaries is that they…', options: ['Can miss important nuance', 'Are always perfect', 'Cannot be read', 'Cost nothing ever'], answer: 'Can miss important nuance', explanation: 'Skim the source too.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What kind of tasks are best to automate?', answer: 'Repetitive, rule-based tasks.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'List 3 of your weekly tasks AI could help with.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const AI_TOOLS = [chatGPT, imageGenerators, voiceAI, codingAssistants, productivityTools];

// =====================================================================
//  MODULE 9 · AI AND CODING
// =====================================================================
const M9 = 'AI and Coding';

const scratchAI = lesson({
  title: 'Scratch AI Projects',
  module: M9,
  summary: 'Build AI-powered projects in Scratch using blocks — no typing code!',
  hook: 'Want to make a game that recognises your hand waves or talks back to you — without writing a single line of code?',
  story: 'ARIA jumps into Scratch. By snapping colourful blocks together, you teach a sprite to listen, see and react. No typing — just creativity. ARIA dances when you wave. You built AI with blocks!',
  layman: 'Scratch is a drag-and-drop coding tool. With AI extensions, you can add video sensing, speech and even trained models to your projects — all by snapping blocks together. Perfect for first AI builds.',
  concept: 'Scratch enables block-based programming with extensions (video sensing, text-to-speech, and integrations with trained models like Teachable Machine). Learners build interactive AI projects without syntax, focusing on logic, events and creativity.',
  analogies: [
    { concept: 'Block coding', analogy: 'Building with LEGO', explanation: 'Snap blocks together to build big things, no typing.' },
    { concept: 'AI extension', analogy: 'Adding superpowers', explanation: 'Plug in sensing/speech to give your sprite AI abilities.' },
  ],
  howItWorks: [
    'Open Scratch and add an AI extension.',
    'Drag blocks to set events (when clicked, when seen).',
    'Connect sensing/speech blocks.',
    'Add logic (IF-THEN) for reactions.',
    'Run, test and remix.',
  ],
  realWorld: [
    'A game controlled by waving your hand.',
    'A sprite that talks (text-to-speech).',
    'A quiz that reads questions aloud.',
    'An app that reacts to colours on camera.',
    'A story that responds to your choices.',
  ],
  facts: [
    'Scratch is used by millions of young creators worldwide.',
    'You can connect Teachable Machine models to Scratch.',
    'Block coding teaches the same logic as text code.',
  ],
  activity: {
    title: 'Snap-a-Sprite',
    materials: ['Scratch (or printed block cards)'],
    steps: [
      'Plan a simple interactive idea.',
      'Lay out the blocks: event → sensing → action.',
      'Add one IF-THEN reaction.',
      'Test and tweak.',
    ],
    expected: 'Students plan/build a simple interactive (AI) Scratch behaviour.',
  },
  miniChallenge: 'Design a 3-block sequence that makes a sprite react to a wave.',
  project: {
    title: 'My First AI Scratch Project',
    description: 'Build (or storyboard) a Scratch project with an AI-like behaviour.',
    materials: ['Scratch or block cards', 'AI Diary'],
    steps: [
      'Pick an idea (wave-to-jump, talk-back).',
      'Build the block script.',
      'Add at least one decision.',
      'Demo it and note one improvement.',
    ],
    expectedOutput: 'A working/storyboarded Scratch project with an interactive AI behaviour.',
    extensions: ['Add a second reaction.', 'Connect a Teachable Machine model.'],
  },
  logic: 'Events + conditionals: block coding makes core programming logic visible and playful — the same ideas power real AI apps.',
  discussion: [
    'Is block coding "real" coding? Why?',
    'What AI behaviour would you add to a game?',
    'What did blocks make easy that typing might make hard?',
  ],
  careers: [
    'Creative Technologist.',
    'Game Developer.',
    'STEM Educator.',
  ],
  homework: [
    'Sketch a Scratch project idea with one AI behaviour.',
    'Remix an existing Scratch project and note what you changed.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Scratch is a ____ coding tool.', options: ['Block-based (drag-and-drop)', 'Voice-only', 'Paper-only', 'Number-only'], answer: 'Block-based (drag-and-drop)', explanation: 'Snap blocks, no syntax.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'AI extensions in Scratch can add…', options: ['Video sensing and speech', 'New furniture', 'Real electricity', 'Food'], answer: 'Video sensing and speech', explanation: 'They add AI-like abilities.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What block type makes a sprite decide between actions?', answer: 'An IF-THEN (conditional) block.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Describe a Scratch project that reacts to the camera.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const blockProgramming = lesson({
  title: 'Block Programming',
  module: M9,
  summary: 'Master loops, events and conditionals using visual code blocks.',
  hook: 'How do you make a character repeat a dance 10 times without copying the block 10 times? Loops!',
  story: 'ARIA wants to clap 100 times. Snapping 100 blocks is silly. You show her a LOOP block: "repeat 100". One block, big power. ARIA learns the building blocks of all programs.',
  layman: 'Block programming uses visual blocks for core coding ideas: sequences (order), loops (repeat), events (when something happens), and conditionals (IF-THEN). These same ideas exist in every programming language.',
  concept: 'Block-based programming teaches fundamental constructs: sequence, iteration (loops), events/triggers, conditionals (selection), variables and simple functions — all transferable to text languages. It lowers the barrier by removing syntax errors.',
  analogies: [
    { concept: 'Loop', analogy: 'A chorus that repeats', explanation: 'Say "repeat" instead of writing it out many times.' },
    { concept: 'Event', analogy: 'A doorbell trigger', explanation: 'When X happens, do Y.' },
  ],
  howItWorks: [
    'Sequence: blocks run top to bottom.',
    'Events start a script (when clicked).',
    'Loops repeat blocks.',
    'Conditionals choose what runs (IF-THEN).',
    'Variables remember values.',
  ],
  realWorld: [
    'Repeating animations with loops.',
    'A button that triggers an action (event).',
    'A score variable in a game.',
    'A character choosing a path (conditional).',
    'A countdown timer.',
  ],
  facts: [
    'Loops can save you from copying code hundreds of times.',
    'Variables are like labelled boxes that store values.',
    'These four ideas appear in EVERY programming language.',
  ],
  activity: {
    title: 'Loop It!',
    materials: ['Block cards or Scratch'],
    steps: [
      'Make a sprite do an action 5 times WITHOUT a loop.',
      'Now do it WITH a "repeat 5" loop.',
      'Add an event trigger and a variable (score).',
      'Add an IF-THEN reaction.',
    ],
    expected: 'Students use loops, events, variables and conditionals together.',
  },
  miniChallenge: 'Use the FEWEST blocks to make a sprite jump 8 times.',
  project: {
    title: 'Block Mini-Game',
    description: 'Build a tiny game using all four core block ideas.',
    materials: ['Scratch or block cards', 'AI Diary'],
    steps: [
      'Add an event to start the game.',
      'Use a loop for movement/animation.',
      'Track a score with a variable.',
      'Use IF-THEN for win/lose.',
    ],
    expectedOutput: 'A mini-game using sequence, loop, event, variable and conditional.',
    extensions: ['Add a timer.', 'Add a second level.'],
  },
  logic: 'These constructs (sequence, loop, event, conditional, variable) are the universal grammar of programming and AI logic.',
  discussion: [
    'Why are loops so powerful?',
    'How is an event like a real-life trigger?',
    'What would coding be like with NO variables?',
  ],
  careers: [
    'Software Developer.',
    'Game Programmer.',
    'Robotics Programmer.',
  ],
  homework: [
    'Find a repeating action and write it as a loop in words.',
    'List 3 variables a game might need.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A loop is used to…', options: ['Repeat actions', 'Delete code', 'Change colours only', 'Charge a device'], answer: 'Repeat actions', explanation: 'Loops repeat blocks.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A variable is like a…', options: ['Labelled box that stores a value', 'A type of loop', 'A picture', 'A wire'], answer: 'Labelled box that stores a value', explanation: 'Variables hold data.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What starts a script when something happens?', answer: 'An event (trigger).', difficulty: 'beginner' },
    { qtype: 'computational', prompt: 'A loop runs "repeat 4" and prints a star each time. How many stars?', options: ['4', '1', '8', '0'], answer: '4', explanation: 'Repeat 4 = 4 stars.', difficulty: 'beginner' },
  ],
});

const pythonBasics = lesson({
  title: 'Python Basics',
  module: M9,
  difficulty: 'intermediate',
  summary: 'Take your first steps in Python — the favourite language of AI.',
  hook: 'Most AI in the world is built with Python. Want to write your first real lines of it today?',
  story: 'ARIA graduates from blocks to typing. Her first line — print("Hello!") — makes the screen talk. Then variables, a loop, and an IF. She is now writing the same language top AI engineers use.',
  layman: 'Python is a popular, friendly programming language used to build most AI. It is easy to read. You can store data in variables, repeat with loops, and make decisions with IF — just like blocks, but typed.',
  concept: 'Python is a high-level, readable language widely used in AI/ML. Core basics: variables, data types, print/input, arithmetic, loops (for/while), conditionals (if/elif/else), lists and functions. Its simplicity and libraries make it ideal for AI.',
  analogies: [
    { concept: 'Python', analogy: 'Talking to the computer in near-English', explanation: 'Its readable style feels close to plain language.' },
    { concept: 'Variable', analogy: 'A labelled jar', explanation: 'name = "Aria" stores a value you can reuse.' },
  ],
  howItWorks: [
    'Write a line; Python runs it.',
    'Store data in variables.',
    'Use print() to show output, input() to ask.',
    'Repeat with for/while loops.',
    'Decide with if/elif/else.',
  ],
  realWorld: [
    'Building machine-learning models.',
    'Automating boring tasks.',
    'Data analysis and charts.',
    'Web apps and games.',
    'Controlling robots.',
  ],
  facts: [
    'Python is named after a comedy group, not the snake!',
    'Indentation (spaces) is part of Python\'s rules.',
    'Most popular AI libraries are written for Python.',
  ],
  code: {
    language: 'python',
    code: '# Your first Python program\nname = input("What is your name? ")   # store input in a variable\nprint("Hello, " + name + "! Welcome to AI.")\n\nfor i in range(3):                    # a loop that repeats 3 times\n    print("AI is fun!", i + 1)\n\nage = 10\nif age < 13:                          # a decision\n    print("You are an AI Explorer!")\nelse:\n    print("You are an AI Innovator!")',
    note: 'Try changing the name, the number 3, or the age and see what happens.',
  },
  activity: {
    title: 'Trace the Code',
    materials: ['Code handout', 'Worksheet'],
    steps: [
      'Read the sample program line by line.',
      'Predict the output before running.',
      'Change one value and predict again.',
      'Run it (or check) and compare.',
    ],
    expected: 'Students predict program output and understand variables, loops and IF.',
  },
  miniChallenge: 'Write (on paper) a Python line that prints your favourite food.',
  project: {
    title: 'My First Python Program',
    description: 'Write a small Python program that greets and reacts to the user.',
    materials: ['Computer with Python/online editor (or paper)', 'AI Diary'],
    steps: [
      'Ask the user for their name.',
      'Greet them by name.',
      'Use a loop to print something 3 times.',
      'Add one IF-THEN decision.',
    ],
    expectedOutput: 'A short program using a variable, a loop and a decision.',
    extensions: ['Ask for a number and double it.', 'Add an elif branch.'],
  },
  logic: 'Translating logic into precise syntax — and predicting output by "tracing" code — is the core skill of programming and AI building.',
  discussion: [
    'Why do you think Python is so popular for AI?',
    'How is typed code like and unlike block code?',
    'What small program would be useful to you?',
  ],
  careers: [
    'Python Developer.',
    'Machine Learning Engineer.',
    'Data Scientist.',
  ],
  homework: [
    'Write 3 lines of Python (on paper or online) that greet a friend.',
    'Trace a short program and predict its output.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Which prints text in Python?', options: ['print()', 'show()', 'say()', 'echo[]'], answer: 'print()', explanation: 'print() outputs to screen.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'for i in range(3) repeats the loop…', options: ['3 times', '1 time', 'forever', '0 times'], answer: '3 times', explanation: 'range(3) → 0,1,2.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What stores a value you can reuse in code?', answer: 'A variable.', difficulty: 'beginner' },
    { qtype: 'computational', prompt: 'What does print(2 + 3 * 2) output?', options: ['8', '10', '12', '7'], answer: '8', explanation: 'Multiplication first: 2 + 6 = 8.', difficulty: 'advanced' },
  ],
});

const aiMiniApps = lesson({
  title: 'AI Mini Apps',
  module: M9,
  difficulty: 'intermediate',
  summary: 'Combine your skills to build small, useful AI-powered apps.',
  hook: 'You have learned the pieces — now snap them together into a real little app that DOES something smart.',
  story: 'ARIA helps you build a tiny app: it asks a question, thinks, and gives a smart answer. Small but real! You realise big apps are just many small parts combined.',
  layman: 'An AI mini app is a small program that uses AI ideas to do something useful — like a number-guesser, a mood checker, or a simple recommender. You build it by combining input, logic and output.',
  concept: 'Mini AI apps integrate input → processing (rules or a model) → output into a small working program. They teach the full build cycle: define the task, design logic/data, implement, test and improve — scaled down to a beginner project.',
  analogies: [
    { concept: 'Mini app', analogy: 'A small machine', explanation: 'Input goes in, something smart happens, output comes out.' },
    { concept: 'Combining parts', analogy: 'A LEGO vehicle', explanation: 'Small bricks (skills) combine into something that works.' },
  ],
  howItWorks: [
    'Define what the app should do.',
    'Plan the input, the logic and the output.',
    'Build it (Scratch, Python, or paper).',
    'Test with real examples.',
    'Improve based on what fails.',
  ],
  realWorld: [
    'A "guess the number" game.',
    'A mood-to-music suggester.',
    'A simple study-tip recommender.',
    'A rock-paper-scissors bot.',
    'A tiny quiz app.',
  ],
  facts: [
    'Most big apps started as a tiny prototype.',
    'Testing early catches problems fast.',
    'A small working app beats a big broken one.',
  ],
  code: {
    language: 'python',
    code: '# A tiny "AI" mini app: a smart number guesser reaction\nimport random\nsecret = random.randint(1, 10)\nguess = int(input("Guess my number (1-10): "))\nif guess == secret:\n    print("Amazing! You read my mind!")\nelif abs(guess - secret) <= 2:\n    print("So close! I was thinking", secret)\nelse:\n    print("Not quite — I picked", secret)',
    note: 'Notice: input → logic (compare) → output. That is the shape of every app.',
  },
  activity: {
    title: 'App in a Box',
    materials: ['Worksheet'],
    steps: [
      'Pick a tiny app idea.',
      'Draw 3 boxes: input, logic, output.',
      'Fill each box with details.',
      'Trade and "run" a partner\'s app on paper.',
    ],
    expected: 'Students design a complete input→logic→output mini app.',
  },
  miniChallenge: 'Design an app in 3 boxes (input/logic/output) in 3 minutes.',
  project: {
    title: 'Build a Mini App',
    description: 'Create a small working AI-style app (Scratch/Python/paper).',
    materials: ['Tool of choice', 'AI Diary'],
    steps: [
      'Define the task and users.',
      'Plan input, logic, output.',
      'Build a first version.',
      'Test and improve once.',
    ],
    expectedOutput: 'A small working (or storyboarded) app with input, logic and output.',
    extensions: ['Add a second feature.', 'Add a friendly error message.'],
  },
  logic: 'Integration: combining input, logic and output into a working whole is the essence of building real software and AI tools.',
  discussion: [
    'What tiny app would make your day easier?',
    'Why test with real examples early?',
    'How do small apps grow into big ones?',
  ],
  careers: [
    'App Developer.',
    'AI Product Builder.',
    'Indie Game/Tool Maker.',
  ],
  homework: [
    'Sketch the input/logic/output of an app you wish existed.',
    'Improve your mini app with one new feature.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Every app generally has…', options: ['Input, logic and output', 'Only colours', 'No logic', 'Only a title'], answer: 'Input, logic and output', explanation: 'The core app shape.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A smart way to start building is to…', options: ['Make a small working version first', 'Build everything at once', 'Never test', 'Skip planning'], answer: 'Make a small working version first', explanation: 'Prototype small, then grow.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Why test with real examples early?', answer: 'To catch problems quickly and improve.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Describe the input, logic and output of a mood-to-music app.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const chatbotsCoding = lesson({
  title: 'Chatbots',
  module: M9,
  difficulty: 'intermediate',
  summary: 'Build your own rule-based chatbot that understands and replies.',
  hook: 'You type "i feel sad" and a bot replies kindly. It never met you — so how does it know what to say?',
  story: 'ARIA learns to chat. You teach her to spot what the user MEANS (the intent), then pick a good reply — and always have a friendly fallback for the unknown. ARIA becomes the class\'s favourite chatbot.',
  layman: 'A chatbot reads your message, figures out what you want (the intent), and gives a fitting reply. A good chatbot always has a friendly fallback for messages it does not understand.',
  concept: 'Rule-based chatbots map user input to intents and select responses; a fallback handles unknown inputs. Advanced bots use NLP/ML to detect intent and even generate replies. Key ideas: tokenising, intent matching, response selection and graceful fallback.',
  analogies: [
    { concept: 'Intent', analogy: 'A waiter understanding your order', explanation: 'Different words, same meaning — the bot finds the intent.' },
    { concept: 'Fallback', analogy: 'A polite "could you repeat that?"', explanation: 'Handle the unknown gracefully.' },
  ],
  howItWorks: [
    'Take the user\'s message.',
    'Find keywords / detect the intent.',
    'Pick the matching reply.',
    'If none matches, use a fallback.',
    'Keep the conversation going.',
  ],
  realWorld: [
    'Website help/support bots.',
    'FAQ bots for schools.',
    'Order-tracking bots.',
    'Friendly companion bots.',
    'Booking and reminder bots.',
  ],
  facts: [
    'The first chatbot, ELIZA, fooled people in 1966.',
    'A fallback reply is what separates good bots from frustrating ones.',
    'Intent matching is the heart of a chatbot.',
  ],
  code: {
    language: 'python',
    code: '# A tiny rule-based chatbot (intent matching + fallback)\nrules = {\n  "hi": "Hello! I am ARIA. How can I help?",\n  "name": "I am ARIA, your class AI!",\n  "sad": "I am sorry you feel sad. I am here for you.",\n  "bye": "Goodbye! Keep being curious."\n}\n\ndef reply(text):\n    text = text.lower()\n    for key, answer in rules.items():\n        if key in text:\n            return answer\n    return "I am still learning that. Can you ask differently?"  # fallback\n\nprint(reply("hi"))\nprint(reply("what is your name"))\nprint(reply("i feel sad"))',
    note: 'Notice the LAST line of reply() — that is the all-important fallback.',
  },
  activity: {
    title: 'Design-a-Chatbot',
    materials: ['Worksheet / Scratch / Python'],
    steps: [
      'List 6 things users might say.',
      'Write a good reply for each (give it a personality).',
      'Add a friendly fallback.',
      'Test with a friend and improve weak replies.',
    ],
    expected: 'Students build intent→reply pairs with a fallback.',
  },
  miniChallenge: 'Write the BEST fallback reply that keeps users happy when the bot is confused.',
  project: {
    title: 'Build ARIA the Chatbot',
    description: 'Build a rule-based chatbot (Scratch or Python) with a personality.',
    materials: ['Scratch/Python or cards', 'AI Diary'],
    steps: [
      'Name your bot and give it a personality.',
      'Add at least 6 intent→reply pairs.',
      'Always include a friendly fallback.',
      'Test with classmates and fix confusing replies.',
    ],
    expectedOutput: 'A working chatbot with 6+ intents, personality and a fallback.',
    extensions: ['Add emotion-aware replies.', 'Add a second-language greeting.'],
  },
  logic: 'Pattern-matching + handling the unknown: mapping inputs to outputs and gracefully managing the unexpected is core computational thinking.',
  discussion: [
    'Why is a fallback reply so important?',
    'Should a chatbot pretend to be human?',
    'How would you make a bot kind and safe?',
  ],
  careers: [
    'Conversation Designer.',
    'Chatbot / NLP Developer.',
    'Customer Experience Engineer.',
  ],
  homework: [
    'Write 8 intent→reply pairs for a bot of your choice.',
    'Improve your fallback reply.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'The user\'s purpose behind a message is the…', options: ['Intent', 'Pixel', 'Token jar', 'Battery'], answer: 'Intent', explanation: 'Intent = what they want.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Every good chatbot should have a…', options: ['Fallback reply for unknown input', 'Loud alarm', 'Secret password', 'Camera'], answer: 'Fallback reply for unknown input', explanation: 'Handle the unknown gracefully.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What is the first chatbot\'s name (1966)?', answer: 'ELIZA.', difficulty: 'intermediate' },
    { qtype: 'tinkering', prompt: 'Write one intent→reply pair for a homework-help bot.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const AI_CODING = [scratchAI, blockProgramming, pythonBasics, aiMiniApps, chatbotsCoding];

// =====================================================================
//  MODULE 10 · ROBOTICS AND AI
// =====================================================================
const M10 = 'Robotics and AI';

const sensors = lesson({
  title: 'Sensors',
  module: M10,
  summary: 'Discover the "senses" that let robots feel the world around them.',
  hook: 'How does a robot vacuum know there is a wall ahead, or a phone know to rotate the screen? Sensors!',
  story: 'ARIA gets her first body. At first she bumps into everything — she cannot feel! You give her sensors: eyes (camera), touch (bumper), distance (ultrasonic). Now she senses the world and moves safely.',
  layman: 'Sensors are a robot\'s senses. They measure things like light, distance, temperature, motion and touch, turning the real world into data the robot can use to decide what to do.',
  concept: 'Sensors convert physical phenomena (light, sound, distance, temperature, motion, touch) into electrical/data signals a system can process. They are the input stage of the sense → decide → act loop in robotics and IoT. AI interprets sensor data to make decisions.',
  analogies: [
    { concept: 'Sensors', analogy: 'Human five senses', explanation: 'Eyes, ears, skin → camera, mic, touch sensor.' },
    { concept: 'Sensor data', analogy: 'Messages to the brain', explanation: 'Senses send signals the brain (AI) reads.' },
  ],
  howItWorks: [
    'A sensor detects something in the world.',
    'It converts it into a signal/number.',
    'The data goes to the robot\'s "brain".',
    'AI/logic interprets the data.',
    'The robot decides and acts.',
  ],
  realWorld: [
    'Ultrasonic distance sensors on robot vacuums.',
    'Cameras for vision in self-driving cars.',
    'Motion sensors in automatic doors.',
    'Temperature sensors in thermostats.',
    'Touch sensors in phone screens.',
  ],
  facts: [
    'Your phone has many sensors (light, motion, proximity).',
    'Ultrasonic sensors measure distance using sound, like bats.',
    'More sensors usually mean a smarter, safer robot.',
  ],
  activity: {
    title: 'Sense the Room',
    materials: ['Sensor cards', 'Blindfold (optional)'],
    steps: [
      'Match each sensor to the sense it mimics.',
      'Blindfold a "robot" and guide them using only "sensor" calls.',
      'Discuss which sensor was most useful.',
      'List sensors a delivery robot would need.',
    ],
    expected: 'Students match sensors to senses and choose sensors for a task.',
  },
  miniChallenge: 'Pick the 3 best sensors for a robot that finds and waters plants.',
  project: {
    title: 'Design a Sensing Robot',
    description: 'Plan a robot and the sensors it needs for a real job.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Choose a robot job (cleaning, guarding).',
      'List 3 sensors it needs and why.',
      'Show the sense → decide → act loop.',
      'Add one safety sensor.',
    ],
    expectedOutput: 'A robot design with 3 justified sensors and a sense-decide-act loop.',
    extensions: ['Add what happens if a sensor fails.', 'Add a sensor for night-time.'],
  },
  logic: 'Input thinking: identifying what data a system needs to sense is the first step of designing any robot or smart device.',
  discussion: [
    'Which human sense is hardest to give a robot?',
    'What happens if a sensor gives wrong data?',
    'How many sensors are in things around you?',
  ],
  careers: [
    'Robotics Engineer.',
    'Sensor / Hardware Designer.',
    'IoT Developer.',
  ],
  homework: [
    'Count the sensors in one device at home.',
    'Pick a chore robot and list its sensors.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'Sensors are a robot\'s…', options: ['Senses (input)', 'Wheels', 'Battery only', 'Paint'], answer: 'Senses (input)', explanation: 'They detect the world.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'An ultrasonic sensor measures distance using…', options: ['Sound', 'Smell', 'Taste', 'Colour only'], answer: 'Sound', explanation: 'Like a bat\'s echolocation.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Sensors are which stage of sense-decide-act?', answer: 'Sense (input).', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A robot vacuum keeps falling down stairs. Which sensor would fix it?', answer: 'A cliff/drop (edge) sensor.', difficulty: 'intermediate' },
  ],
});

const automation = lesson({
  title: 'Automation',
  module: M10,
  summary: 'Learn how machines do repetitive tasks automatically — and what that means for work.',
  hook: 'A factory makes thousands of identical bottles a day with almost no humans. How — and is that a good thing?',
  story: 'ARIA visits a factory where robot arms work day and night, never tired. She sees boring, dangerous jobs done by machines — freeing humans for creative, caring work. But she also wonders about jobs that change.',
  layman: 'Automation means machines doing tasks automatically, especially repetitive or dangerous ones. It boosts speed and safety, but also changes jobs — so people must learn new skills.',
  concept: 'Automation uses machines, software and robots to perform tasks with minimal human intervention, ideal for repetitive, precise or hazardous work. It increases productivity and safety but reshapes the workforce, raising the need for reskilling and human oversight.',
  analogies: [
    { concept: 'Automation', analogy: 'A dishwasher', explanation: 'It does the repetitive chore so you do not have to.' },
    { concept: 'Reskilling', analogy: 'Learning a new game', explanation: 'When the rules change, you learn new moves.' },
  ],
  howItWorks: [
    'Identify a repetitive/dangerous task.',
    'Define exact steps (an algorithm).',
    'Machines/robots perform the steps.',
    'Sensors check quality.',
    'Humans supervise and improve the system.',
  ],
  realWorld: [
    'Robot arms assembling cars.',
    'Automatic bottle-filling lines.',
    'Self-checkout machines.',
    'Email auto-sorting.',
    'Warehouse robots moving packages.',
  ],
  facts: [
    'Automation is best for repetitive, rule-based tasks.',
    'It can do dangerous jobs to keep humans safe.',
    'New tech also creates brand-new kinds of jobs.',
  ],
  activity: {
    title: 'Automate It (or Not)?',
    materials: ['Task cards'],
    steps: [
      'Sort tasks into "good to automate" vs "keep human".',
      'Explain each choice.',
      'Pick one task and write its automation steps.',
      'List a new job the automation might create.',
    ],
    expected: 'Students judge which tasks suit automation and why.',
  },
  miniChallenge: 'Find a daily chore that SHOULD be automated and one that should NOT.',
  project: {
    title: 'Automation Blueprint',
    description: 'Design an automated solution for a repetitive task.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a repetitive task.',
      'Write the exact steps to automate.',
      'Add a quality-check sensor.',
      'Note the human\'s new supervising role.',
    ],
    expectedOutput: 'An automation plan with steps, a quality check and a human role.',
    extensions: ['List jobs it creates and changes.', 'Add a safety stop.'],
  },
  logic: 'Process design + ethics: turning a task into reliable automated steps, while considering people, is real-world systems thinking.',
  discussion: [
    'Is automation good or bad for workers? Both?',
    'Which jobs should stay human?',
    'How can people prepare for automation?',
  ],
  careers: [
    'Automation Engineer.',
    'Industrial Robotics Technician.',
    'Process Improvement Analyst.',
  ],
  homework: [
    'Spot 3 automated systems you used this week.',
    'List one skill that automation cannot replace.',
  ],
  diagram: 'gear',
  questions: [
    { qtype: 'mcq', prompt: 'Automation is best for tasks that are…', options: ['Repetitive or dangerous', 'Highly creative', 'Emotional', 'One-of-a-kind'], answer: 'Repetitive or dangerous', explanation: 'Repetitive/hazardous suits machines.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A downside of automation is…', options: ['Some jobs change, needing reskilling', 'Nothing ever changes', 'It is always slower', 'It needs no steps'], answer: 'Some jobs change, needing reskilling', explanation: 'Workforce shifts.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do humans still do in an automated system?', answer: 'Supervise, improve and handle exceptions.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Name one task to automate and one new job it might create.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const selfDrivingCars = lesson({
  title: 'Self-Driving Cars',
  module: M10,
  difficulty: 'intermediate',
  summary: 'See how cars learn to see, decide and drive themselves.',
  hook: 'A car with no driver stops at a red light and avoids a cyclist. How does it "see" and decide safely?',
  story: 'ARIA gets behind the wheel — except there is no wheel. She uses cameras and radar to SEE, AI to DECIDE, and motors to ACT. She stops for a child chasing a ball. Sense → decide → act, at highway speed.',
  layman: 'Self-driving cars use sensors (cameras, radar, lidar) to see the road, AI to decide what to do, and controls to steer, accelerate and brake. Safety and ethics are huge challenges.',
  concept: 'Autonomous vehicles fuse data from cameras, radar and lidar to perceive surroundings, use AI (perception, prediction, planning) to decide actions, and control steering/throttle/brakes. Levels of autonomy range 0–5; safety, edge cases and ethics are central challenges.',
  analogies: [
    { concept: 'Sensor fusion', analogy: 'Using all your senses to cross a road', explanation: 'Eyes + ears together give a safer picture.' },
    { concept: 'Autonomy levels', analogy: 'Training wheels to solo riding', explanation: 'From driver-assist up to fully self-driving.' },
  ],
  howItWorks: [
    'Sensors perceive the road, signs and objects.',
    'AI identifies and predicts what others will do.',
    'It plans a safe path.',
    'Controls steer, accelerate and brake.',
    'It repeats many times every second.',
  ],
  realWorld: [
    'Lane-keeping and adaptive cruise control.',
    'Automatic emergency braking.',
    'Self-parking features.',
    'Robotaxi pilots in some cities.',
    'Self-driving delivery bots.',
  ],
  facts: [
    'Lidar maps the world in 3D using laser pulses.',
    'There are 6 levels of driving autonomy (0–5).',
    'Rare "edge cases" are the hardest safety challenge.',
  ],
  activity: {
    title: 'Drive the Decision',
    materials: ['Scenario cards'],
    steps: [
      'Read a driving scenario (child runs out, light turns yellow).',
      'Decide the safest action.',
      'Identify which sensors helped.',
      'Discuss tricky ethical cases.',
    ],
    expected: 'Students reason through perception → decision for driving scenarios.',
  },
  miniChallenge: 'Name the 3 sensors you would trust most in heavy fog and why.',
  project: {
    title: 'Self-Driving Safety Plan',
    description: 'Design the sense-decide-act plan for one tricky driving situation.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a tricky scenario.',
      'List sensors used to perceive it.',
      'Describe the safe decision.',
      'Add one ethics consideration.',
    ],
    expectedOutput: 'A scenario plan covering perception, decision and ethics.',
    extensions: ['Add a sensor-failure backup.', 'Compare day vs night handling.'],
  },
  logic: 'Sensor fusion + real-time decisions under uncertainty is one of AI\'s hardest, highest-stakes problem-solving challenges.',
  discussion: [
    'Should a self-driving car ever choose between two harms? Who decides?',
    'Would you trust a self-driving car? What would convince you?',
    'Who is responsible if it crashes?',
  ],
  careers: [
    'Autonomous Vehicle Engineer.',
    'Computer Vision Specialist.',
    'Safety / Ethics Engineer.',
  ],
  homework: [
    'List driver-assist features in cars you know.',
    'Discuss one self-driving ethics question with family.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'Self-driving cars perceive the world using…', options: ['Cameras, radar and lidar', 'Only a horn', 'Just GPS alone', 'Paint'], answer: 'Cameras, radar and lidar', explanation: 'Sensor fusion.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Lidar builds a 3D map using…', options: ['Laser pulses', 'Sound only', 'Smell', 'Wi-Fi colour'], answer: 'Laser pulses', explanation: 'Light Detection And Ranging.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What is the hardest kind of situation for self-driving AI?', answer: 'Rare "edge cases".', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'Why is a human-in-the-loop still valued in self-driving today?', answer: 'Open-ended (safety, edge cases, responsibility).', difficulty: 'advanced' },
  ],
});

const drones = lesson({
  title: 'Drones',
  module: M10,
  summary: 'Explore flying robots that map, deliver, film and rescue.',
  hook: 'A flying robot delivers medicine to a remote village in minutes. How do drones fly themselves?',
  story: 'ARIA takes to the sky. With propellers, a stabiliser sensor and GPS, she hovers steadily, follows a flight plan, and films from above. She even helps find a lost hiker. Eyes in the sky!',
  layman: 'Drones are flying robots. They use sensors to stay stable, GPS to navigate, and cameras to see. AI helps them fly routes, avoid obstacles, and do jobs like mapping, delivery and rescue.',
  concept: 'Drones (UAVs) use motors, an IMU/gyroscope for stabilisation, GPS for navigation and cameras/sensors for perception. AI enables autonomous flight paths, obstacle avoidance and tasks like aerial mapping, inspection, delivery and search-and-rescue, within safety regulations.',
  analogies: [
    { concept: 'Stabilisation', analogy: 'Balancing on a bike', explanation: 'Constant tiny corrections keep it steady.' },
    { concept: 'Drone\'s view', analogy: 'An eagle\'s eye', explanation: 'A bird\'s-eye view reveals what we cannot see from the ground.' },
  ],
  howItWorks: [
    'Motors spin propellers for lift.',
    'A gyro/IMU keeps it balanced.',
    'GPS guides it along a route.',
    'Sensors/cameras avoid obstacles.',
    'AI flies the plan and completes the task.',
  ],
  realWorld: [
    'Aerial photography and film.',
    'Mapping farms and counting crops.',
    'Delivering medicine to remote areas.',
    'Search-and-rescue in disasters.',
    'Inspecting bridges and power lines.',
  ],
  facts: [
    'Drones help replant forests by dropping seeds.',
    'Most drones balance using a gyroscope.',
    'Many places have rules about where drones can fly.',
  ],
  activity: {
    title: 'Plan a Flight',
    materials: ['Map grid', 'Pens'],
    steps: [
      'Plan a drone mission (map a field).',
      'Draw the flight path on a grid.',
      'Mark obstacles to avoid.',
      'List the sensors needed.',
    ],
    expected: 'Students plan a safe drone route with obstacle avoidance.',
  },
  miniChallenge: 'Design the safest drone delivery route avoiding 3 obstacles.',
  project: {
    title: 'Drone for Good',
    description: 'Design a drone mission that helps your community.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a helpful mission (delivery, rescue, mapping).',
      'List sensors and the flight plan.',
      'Add an obstacle-avoidance rule.',
      'Add a safety/privacy rule.',
    ],
    expectedOutput: 'A drone mission plan with sensors, route and safety rules.',
    extensions: ['Add a low-battery return rule.', 'Add a no-fly zone.'],
  },
  logic: 'Path planning + control: keeping a flying robot stable and on-route blends physics, sensors and AI decision-making.',
  discussion: [
    'What are good and worrying uses of drones?',
    'Should there be no-fly zones? Where?',
    'How do drones affect privacy?',
  ],
  careers: [
    'Drone Pilot / Operator.',
    'Aerial Robotics Engineer.',
    'GIS / Mapping Specialist.',
  ],
  homework: [
    'Find one helpful drone use and one concern.',
    'Sketch a drone flight path with obstacles.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'Drones stay balanced mainly using a…', options: ['Gyroscope/IMU', 'Speaker', 'Printer', 'Keyboard'], answer: 'Gyroscope/IMU', explanation: 'It senses orientation for stability.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Drones navigate routes using…', options: ['GPS', 'Smell', 'Taste', 'Guesswork only'], answer: 'GPS', explanation: 'GPS guides the path.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one life-saving use of drones.', answer: 'Search-and-rescue or medicine delivery.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A delivery drone\'s battery drops to 10%. What rule should it follow?', answer: 'Return to base safely (low-battery return).', difficulty: 'intermediate' },
  ],
});

const smartRobots = lesson({
  title: 'Smart Robots',
  module: M10,
  difficulty: 'intermediate',
  summary: 'Put it all together: robots that sense, think, act and even learn.',
  hook: 'Some robots can walk, talk, recognise you, and learn new tricks. What makes a robot truly "smart"?',
  story: 'ARIA finally becomes a full robot: she senses with cameras, thinks with AI, acts with motors, and LEARNS from feedback. She greets you by name and improves every day. A complete AI robot — built by you.',
  layman: 'A smart robot combines sensors (to sense), AI (to think and decide), and actuators like motors (to act) — and it can learn to improve. The smartest robots adapt to new situations.',
  concept: 'Intelligent robots integrate perception (sensors), cognition (AI for decision-making and learning) and action (actuators) in a continuous loop. Adding machine learning lets them adapt and improve. They combine robotics, computer vision, NLP and control systems.',
  analogies: [
    { concept: 'Smart robot', analogy: 'A living creature', explanation: 'Senses (eyes), brain (AI), muscles (motors) working together.' },
    { concept: 'Learning robot', analogy: 'A child practising', explanation: 'It gets better with feedback and practice.' },
  ],
  howItWorks: [
    'Sense the environment with sensors.',
    'Think: AI interprets and decides.',
    'Act: motors/actuators carry it out.',
    'Get feedback on the result.',
    'Learn and improve over time.',
  ],
  realWorld: [
    'Warehouse robots that learn efficient routes.',
    'Robot pets and companions.',
    'Surgical assistant robots.',
    'Humanoid robots that walk and talk.',
    'Farm robots that pick ripe fruit.',
  ],
  facts: [
    'Some robots learn to walk using reinforcement learning.',
    'A smart robot = sense + think + act + learn.',
    'Robots are great at dull, dirty and dangerous jobs.',
  ],
  activity: {
    title: 'Build-a-Robot (on paper)',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Design a robot for a chosen job.',
      'Add sensors (sense), AI (think), motors (act).',
      'Show how it learns from feedback.',
      'Present your robot to the class.',
    ],
    expected: 'Students design a complete sense-think-act-learn robot.',
  },
  miniChallenge: 'Give your robot ONE superpower and the sensor + AI it needs for it.',
  project: {
    title: 'My Smart Robot',
    description: 'Design a full smart robot with the complete AI loop.',
    materials: ['Poster paper', 'Markers'],
    steps: [
      'Pick the robot\'s purpose and users.',
      'Map sense → think → act → learn.',
      'Add one ethics/safety rule.',
      'Draw it and write a slogan.',
    ],
    expectedOutput: 'A robot design poster showing the full AI loop and a safety rule.',
    extensions: ['Add how it improves over a month.', 'Add a "human override" button.'],
  },
  logic: 'Systems integration: combining perception, cognition, action and learning into one loop is the pinnacle of applied AI and robotics.',
  discussion: [
    'What makes a robot "smart" vs just automatic?',
    'Should smart robots have an off switch they cannot override?',
    'What job would you build a robot for?',
  ],
  careers: [
    'Robotics Engineer.',
    'AI/ML Engineer for robots.',
    'Human-Robot Interaction Designer.',
  ],
  homework: [
    'Design a robot for a chore and label its AI loop.',
    'List one rule to keep robots safe around people.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'A smart robot combines…', options: ['Sense, think, act and learn', 'Only wheels', 'Only a screen', 'Only a battery'], answer: 'Sense, think, act and learn', explanation: 'The full AI loop.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'The "act" part of a robot uses…', options: ['Motors/actuators', 'Sensors only', 'The cloud only', 'Paint'], answer: 'Motors/actuators', explanation: 'Actuators perform actions.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What lets a robot improve over time?', answer: 'Learning from feedback.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Design a sense-think-act-learn loop for a plant-watering robot.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const ROBOTICS = [sensors, automation, selfDrivingCars, drones, smartRobots];

// =====================================================================
//  MODULE 11 · FUTURE TECHNOLOGIES
// =====================================================================
const M11 = 'Future Technologies';

const metaverse = lesson({
  title: 'Metaverse',
  module: M11,
  summary: 'Peek into shared 3D virtual worlds where people meet, play and create.',
  hook: 'Imagine attending school, meeting friends and building a city — all inside a 3D world you enter with a headset. Welcome to the metaverse.',
  story: 'ARIA puts on a headset and steps into a virtual classroom on the moon! She meets friends as avatars, builds a rocket together, and learns by doing. The metaverse turns "watching" into "being there".',
  layman: 'The metaverse is a network of shared 3D virtual worlds where people use avatars to meet, play, learn and create. AI helps build these worlds and the characters in them. It is still early and evolving.',
  concept: 'The metaverse is an interconnected set of persistent, shared 3D virtual environments accessed via AR/VR and devices, where users interact as avatars. AI powers world generation, NPCs, moderation and personalisation. It raises new questions of identity, safety and digital ownership.',
  analogies: [
    { concept: 'Metaverse', analogy: 'A 3D internet you step inside', explanation: 'Instead of viewing pages, you walk around them.' },
    { concept: 'Avatar', analogy: 'Your game character', explanation: 'A digital "you" that represents you in the world.' },
  ],
  howItWorks: [
    'You enter via a headset, phone or computer.',
    'You appear as an avatar.',
    'Shared 3D worlds persist and connect.',
    'AI generates content and characters.',
    'You meet, create and play with others.',
  ],
  realWorld: [
    'Virtual concerts and events.',
    'Online 3D classrooms and labs.',
    '3D social hangout spaces.',
    'Virtual shops and showrooms.',
    'Collaborative design in 3D.',
  ],
  facts: [
    'Virtual concerts have drawn millions of attendees.',
    'AI can generate whole 3D worlds and characters.',
    'Digital safety and identity matter a lot here.',
  ],
  activity: {
    title: 'Design a Virtual World',
    materials: ['Paper', 'Colours'],
    steps: [
      'Sketch a virtual world for learning or play.',
      'Design your avatar.',
      'List 3 things people could DO there.',
      'Add one safety rule.',
    ],
    expected: 'Students design a purposeful virtual world with a safety rule.',
  },
  miniChallenge: 'Invent a metaverse classroom feature that real classrooms cannot have.',
  project: {
    title: 'My Metaverse Space',
    description: 'Design a metaverse space for a real purpose.',
    materials: ['Poster paper', 'Markers'],
    steps: [
      'Pick a purpose (school, museum, game).',
      'Design the space and avatars.',
      'List how AI helps build/run it.',
      'Add safety and inclusion rules.',
    ],
    expectedOutput: 'A metaverse space design with AI roles and safety rules.',
    extensions: ['Add accessibility features.', 'Add a "report a problem" button.'],
  },
  logic: 'Systems + design thinking: imagining shared digital spaces requires combining technology, creativity and rules for people.',
  discussion: [
    'What are the upsides and risks of spending time in the metaverse?',
    'Should your avatar look like the real you?',
    'How do we keep virtual worlds safe and kind?',
  ],
  careers: [
    'Metaverse / 3D World Designer.',
    'AR/VR Developer.',
    'Trust & Safety Specialist.',
  ],
  homework: [
    'Design an avatar and explain your choices.',
    'List 2 good and 2 risky uses of the metaverse.',
  ],
  diagram: 'cube3d',
  questions: [
    { qtype: 'mcq', prompt: 'The metaverse is best described as…', options: ['Shared 3D virtual worlds', 'A single web page', 'A type of battery', 'A printer'], answer: 'Shared 3D virtual worlds', explanation: 'Interconnected 3D spaces.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'In the metaverse you appear as a(n)…', options: ['Avatar', 'Pixel', 'Token', 'Sensor'], answer: 'Avatar', explanation: 'An avatar represents you.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one way AI helps build the metaverse.', answer: 'Generating worlds/characters (or moderation).', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Describe one rule to keep a kids\' virtual world safe.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const arVr = lesson({
  title: 'AR / VR',
  module: M11,
  summary: 'Compare Augmented Reality (add to the world) and Virtual Reality (replace it).',
  hook: 'One tech puts a dragon on your real desk; another takes you inside a volcano. What is the difference between AR and VR?',
  story: 'ARIA tries two magic glasses. The first (AR) shows a dinosaur standing in her real classroom. The second (VR) whisks her fully inside a coral reef. "AR adds; VR replaces," she explains.',
  layman: 'Augmented Reality (AR) adds digital things to the real world (like a filter or a game character on your desk). Virtual Reality (VR) replaces the real world with a fully digital one you step into. AI powers both.',
  concept: 'AR overlays digital content onto the real world (via phones/glasses), while VR immerses users in a fully simulated environment (via headsets). Both use sensors, tracking and AI for object recognition, placement and interaction. Mixed Reality blends them.',
  analogies: [
    { concept: 'AR', analogy: 'A clear window with stickers', explanation: 'You still see the real world, with digital extras on top.' },
    { concept: 'VR', analogy: 'A door to another world', explanation: 'You leave the real room and enter a digital one.' },
  ],
  howItWorks: [
    'Cameras/sensors track your position and surroundings.',
    'AR places digital objects into the real scene.',
    'VR renders a full 3D world around you.',
    'AI recognises surfaces, objects and gestures.',
    'You interact in real time.',
  ],
  realWorld: [
    'AR filters on social media.',
    'AR apps placing furniture in your room.',
    'VR games and roller-coasters.',
    'VR training for surgeons and pilots.',
    'AR navigation arrows on the street.',
  ],
  facts: [
    'Surgeons train in VR before real operations.',
    'AR can show you where furniture fits before buying.',
    'Mixed Reality blends AR and VR together.',
  ],
  activity: {
    title: 'AR or VR?',
    materials: ['Scenario cards'],
    steps: [
      'Sort scenarios into AR vs VR.',
      'Explain each choice.',
      'Invent one new AR idea and one VR idea.',
      'Share with the class.',
    ],
    expected: 'Students correctly distinguish AR and VR and invent uses.',
  },
  miniChallenge: 'Invent an AR feature that would help you study.',
  project: {
    title: 'AR/VR Experience Design',
    description: 'Design an AR or VR experience for learning or helping people.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Choose AR or VR and a purpose.',
      'Describe what the user sees and does.',
      'List the sensors and AI needed.',
      'Add a safety/comfort note.',
    ],
    expectedOutput: 'An AR/VR experience design with purpose, tech and safety.',
    extensions: ['Make an AR and a VR version of the same idea.', 'Add accessibility.'],
  },
  logic: 'Comparison + design: distinguishing "augment vs replace" and matching it to a goal is clear, applied design thinking.',
  discussion: [
    'When is AR better than VR, and vice versa?',
    'Could too much VR be unhealthy? How?',
    'What would you build in AR or VR?',
  ],
  careers: [
    'AR/VR Developer.',
    '3D / Experience Designer.',
    'Simulation & Training Engineer.',
  ],
  homework: [
    'Try an AR filter and describe how it tracks you.',
    'List one AR and one VR use for school.',
  ],
  diagram: 'cube3d',
  questions: [
    { qtype: 'mcq', prompt: 'AR (Augmented Reality)…', options: ['Adds digital things to the real world', 'Replaces the world entirely', 'Is only audio', 'Is a battery'], answer: 'Adds digital things to the real world', explanation: 'AR augments reality.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'VR (Virtual Reality)…', options: ['Immerses you in a fully digital world', 'Adds stickers to the real world', 'Only prints text', 'Charges phones'], answer: 'Immerses you in a fully digital world', explanation: 'VR replaces reality.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What blends AR and VR together?', answer: 'Mixed Reality (MR).', difficulty: 'intermediate' },
    { qtype: 'logical', prompt: 'You want to "place" a sofa in your living room before buying. AR or VR?', answer: 'AR — it adds the sofa to your real room.', difficulty: 'intermediate' },
  ],
});

const digitalTwins = lesson({
  title: 'Digital Twins',
  module: M11,
  difficulty: 'intermediate',
  summary: 'Discover virtual copies of real things used to test and predict.',
  hook: 'What if you had a perfect virtual copy of a jet engine — so you could test it without ever risking the real one?',
  story: 'ARIA builds a virtual twin of the school building. When she tests "what if there is a fire?" in the twin, nobody is in danger. She finds the safest exits, then improves the real building. Test safely, then act.',
  layman: 'A digital twin is a live virtual copy of a real object or system (a machine, a building, even a city). It uses real data to mirror the real thing, so you can test ideas and predict problems safely.',
  concept: 'A digital twin is a dynamic virtual model of a physical asset, updated with real-time sensor data, used for simulation, monitoring, prediction (e.g. predictive maintenance) and optimisation — testing changes virtually before applying them physically.',
  analogies: [
    { concept: 'Digital twin', analogy: 'A flight simulator for a real plane', explanation: 'Practise and test safely on a faithful copy.' },
    { concept: 'Live updates', analogy: 'A mirror that moves with you', explanation: 'The twin reflects the real thing in real time.' },
  ],
  howItWorks: [
    'Build a virtual model of the real object.',
    'Feed it real-time sensor data.',
    'The twin mirrors the real thing.',
    'Run "what-if" tests on the twin.',
    'Predict issues and improve the real one.',
  ],
  realWorld: [
    'Testing jet engines virtually.',
    'Predicting machine maintenance before breakdown.',
    'Simulating traffic for smart cities.',
    'Modelling buildings for energy savings.',
    'Planning factory changes safely.',
  ],
  facts: [
    'Digital twins help predict failures BEFORE they happen.',
    'Whole cities can have digital twins.',
    'They save money by testing virtually first.',
  ],
  activity: {
    title: 'Twin It',
    materials: ['Worksheet'],
    steps: [
      'Pick a real object (bike, classroom).',
      'List the data its twin would need.',
      'Write a "what-if" test you would run.',
      'Say what decision it would help make.',
    ],
    expected: 'Students design a digital twin and a useful simulation test.',
  },
  miniChallenge: 'Pick something and name the ONE "what-if" test a twin would let you do safely.',
  project: {
    title: 'Digital Twin Plan',
    description: 'Design a digital twin to test and improve a real system.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Choose a real system.',
      'List the sensors/data feeding the twin.',
      'Design 2 "what-if" tests.',
      'Explain a decision it improves.',
    ],
    expectedOutput: 'A digital-twin plan with data sources, tests and a decision.',
    extensions: ['Add predictive maintenance.', 'Add a cost-saving estimate.'],
  },
  logic: 'Modelling + simulation: testing changes on a faithful virtual model before reality is powerful, safe engineering thinking.',
  discussion: [
    'Why test on a twin instead of the real thing?',
    'What real systems would benefit most from a twin?',
    'What are the limits of a digital twin?',
  ],
  careers: [
    'Simulation Engineer.',
    'Digital Twin / IoT Specialist.',
    'Industrial Data Scientist.',
  ],
  homework: [
    'Pick an object and list what data its twin needs.',
    'Describe one problem a twin could predict.',
  ],
  diagram: 'iot',
  questions: [
    { qtype: 'mcq', prompt: 'A digital twin is a…', options: ['Live virtual copy of a real thing', 'A real second machine', 'A type of password', 'A drawing only'], answer: 'Live virtual copy of a real thing', explanation: 'It mirrors the real asset with data.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A key use of digital twins is…', options: ['Predicting failures before they happen', 'Cooking food', 'Charging phones', 'Painting'], answer: 'Predicting failures before they happen', explanation: 'Predictive maintenance.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What keeps a digital twin in sync with reality?', answer: 'Real-time sensor data.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Design a "what-if" test you could safely run on a school\'s digital twin.', answer: 'Open-ended (fire exit, energy use).', difficulty: 'advanced' },
  ],
});

const quantumComputing = lesson({
  title: 'Quantum Computing',
  module: M11,
  difficulty: 'advanced',
  summary: 'Get a friendly first taste of computers that use quantum physics.',
  hook: 'What if a computer could explore many answers at once instead of one at a time? Quantum computers aim to do just that.',
  story: 'ARIA meets a strange new computer. Instead of bits that are 0 OR 1, it uses "qubits" that can be both at once! It tries many paths through a maze simultaneously. ARIA\'s mind is blown — the future is weird and wonderful.',
  layman: 'Regular computers use bits (0 or 1). Quantum computers use qubits, which can be 0 and 1 at the same time. This could let them solve certain huge problems much faster. They are very new and still being built.',
  concept: 'Quantum computers use qubits exploiting superposition (0 and 1 simultaneously) and entanglement to process many possibilities together. For specific problems (factoring, simulation, optimisation) they promise massive speedups. They are experimental, fragile and complement — not replace — classical computers.',
  analogies: [
    { concept: 'Qubit', analogy: 'A spinning coin', explanation: 'While spinning it is "both" heads and tails until it lands.' },
    { concept: 'Quantum speedup', analogy: 'Trying every maze path at once', explanation: 'Explore many routes together instead of one by one.' },
  ],
  howItWorks: [
    'Information is stored in qubits.',
    'Superposition lets qubits be 0 and 1 at once.',
    'Entanglement links qubits together.',
    'Special algorithms explore many states.',
    'Measuring collapses it to an answer.',
  ],
  realWorld: [
    'Simulating molecules for new medicines.',
    'Optimising complex schedules and routes.',
    'Advancing materials science.',
    'Strengthening (and challenging) encryption.',
    'Speeding up certain AI calculations.',
  ],
  facts: [
    'Qubits are so delicate they often need extreme cold.',
    'Quantum computers will not replace your laptop.',
    'They excel only at certain special problems.',
  ],
  activity: {
    title: 'Coin Qubits',
    materials: ['Coins'],
    steps: [
      'A still coin = a bit (0 or 1).',
      'A spinning coin = a qubit (both until it lands).',
      'Spin several and discuss "many states at once".',
      'List a problem quantum might help with.',
    ],
    expected: 'Students intuitively grasp bit vs qubit and superposition.',
  },
  miniChallenge: 'Explain superposition to a friend using only a spinning coin.',
  project: {
    title: 'Quantum Explainer',
    description: 'Create a simple poster explaining qubits to beginners.',
    materials: ['Poster paper', 'Markers'],
    steps: [
      'Explain bit vs qubit with a picture.',
      'Show superposition with the coin analogy.',
      'List 2 real problems quantum could help.',
      'Add "why it will not replace normal computers".',
    ],
    expectedOutput: 'A beginner-friendly quantum poster with analogy and uses.',
    extensions: ['Add entanglement in simple words.', 'Research one quantum company.'],
  },
  logic: 'Abstraction at the frontier: grasping a powerful idea through analogy (even before the maths) builds curiosity and conceptual courage.',
  discussion: [
    'Why might quantum computers be both exciting and risky (e.g. encryption)?',
    'Why will they not replace everyday computers?',
    'What problem would you want to solve with one?',
  ],
  careers: [
    'Quantum Computing Researcher.',
    'Quantum Software Developer.',
    'Physicist / Materials Scientist.',
  ],
  homework: [
    'Explain bit vs qubit to a family member.',
    'Find one real-world problem quantum could help solve.',
  ],
  diagram: 'circuit',
  questions: [
    { qtype: 'mcq', prompt: 'A qubit can be…', options: ['0 and 1 at the same time', 'Only 0', 'Only 1', 'A colour'], answer: '0 and 1 at the same time', explanation: 'Superposition.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'Quantum computers are best at…', options: ['Certain special problems', 'Everything, replacing laptops', 'Only painting', 'Nothing'], answer: 'Certain special problems', explanation: 'They complement classical computers.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'A normal computer uses bits; a quantum one uses…', answer: 'Qubits.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Use the spinning-coin analogy to explain superposition in one sentence.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const aiAgents = lesson({
  title: 'AI Agents',
  module: M11,
  difficulty: 'advanced',
  summary: 'Meet AI that can plan and take actions to reach a goal — not just answer.',
  hook: 'What if an AI could not just answer "how to plan a trip" but actually plan it — step by step, using tools, on its own?',
  story: 'ARIA levels up. Instead of waiting for each instruction, she takes a GOAL ("organise the class party"), breaks it into steps, uses tools, checks her progress, and adjusts. She becomes an AI agent — but you stay in charge.',
  layman: 'An AI agent is AI that can take a goal, plan steps, use tools (like search or apps), and act to achieve it — checking and adjusting as it goes. It is more independent than a chatbot, so human oversight is essential.',
  concept: 'AI agents combine a language model with planning, memory and tool use to autonomously pursue goals: they decompose tasks, take actions, observe results and iterate. Powerful but risky — they need guardrails, oversight and clear limits to stay safe and aligned.',
  analogies: [
    { concept: 'AI agent', analogy: 'A capable personal assistant', explanation: 'Give a goal; it plans and acts, reporting back.' },
    { concept: 'Tool use', analogy: 'A worker with a toolbox', explanation: 'It picks the right tool for each step.' },
  ],
  howItWorks: [
    'You give a goal.',
    'The agent breaks it into steps (plans).',
    'It uses tools/apps to act.',
    'It observes results and adjusts.',
    'It reports back; a human supervises.',
  ],
  realWorld: [
    'Agents that research and summarise a topic.',
    'Assistants that book and organise tasks.',
    'Coding agents that build and test programs.',
    'Customer-service agents that resolve issues.',
    'Workflow agents that automate multi-step jobs.',
  ],
  facts: [
    'Agents can chain many steps without asking each time.',
    'More autonomy means more need for guardrails.',
    'A human should always be able to stop an agent.',
  ],
  activity: {
    title: 'Be the Agent',
    materials: ['Goal cards', 'Tool cards'],
    steps: [
      'Get a goal (plan a picnic).',
      'Break it into steps.',
      'Pick the "tool" for each step.',
      'Add a check and an adjust step.',
    ],
    expected: 'Students plan a goal into tool-using steps with checks.',
  },
  miniChallenge: 'Turn a goal into 4 agent steps, each using a different "tool".',
  project: {
    title: 'Design an AI Agent',
    description: 'Plan an AI agent for a helpful goal, with safety guardrails.',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Choose a goal and who it helps.',
      'List the steps and tools it would use.',
      'Add checks so it stays on track.',
      'Add guardrails and a human-override rule.',
    ],
    expectedOutput: 'An AI agent design with steps, tools, checks and safety guardrails.',
    extensions: ['Add a "ask permission" step for risky actions.', 'Add a stop button.'],
  },
  logic: 'Goal decomposition + tool use + monitoring: planning and adjusting toward a goal is the highest form of computational problem-solving — kept safe by human oversight.',
  discussion: [
    'How much should we let an AI agent do on its own?',
    'What actions should ALWAYS need human approval?',
    'How do we keep powerful agents safe and aligned?',
  ],
  careers: [
    'AI Agent Engineer.',
    'AI Safety / Alignment Researcher.',
    'Automation Architect.',
  ],
  homework: [
    'Break one of your goals into agent-style steps and tools.',
    'List 2 actions an agent should never do without asking.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'An AI agent is different from a chatbot because it…', options: ['Plans and takes actions toward a goal', 'Only says hello', 'Cannot use tools', 'Never changes'], answer: 'Plans and takes actions toward a goal', explanation: 'Agents act, not just chat.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'As agents get more autonomous, we need more…', options: ['Guardrails and oversight', 'Noise', 'Colours', 'Speed only'], answer: 'Guardrails and oversight', explanation: 'Safety scales with autonomy.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What should a human always be able to do to an agent?', answer: 'Stop/override it.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'List 2 actions an AI agent should require human approval for.', answer: 'Open-ended (spending money, sending messages).', difficulty: 'advanced' },
  ],
});

const FUTURE_TECH = [metaverse, arVr, digitalTwins, quantumComputing, aiAgents];

// =====================================================================
//  MODULE 12 · HANDS-ON PROJECTS (Beginner → Advanced)
//  The 10 mandatory build-it projects that tie the whole course together.
// =====================================================================
const MP = 'Hands-On Projects';

const projStoryGenerator = lesson({
  title: 'Project: AI Story Generator',
  module: MP,
  summary: 'Build a tool that creates fun stories from a few words you choose.',
  hook: 'Pick a hero, a place and a problem — and watch a brand-new story appear. Let us build the story machine!',
  story: 'ARIA loves bedtime tales. Together you build a Story Generator: choose ingredients, mix them with templates (or AI), and out comes an adventure. Every run is different — pure magic you built yourself.',
  layman: 'A story generator takes inputs (characters, setting, problem) and combines them — using templates or generative AI — to produce a story. It teaches input → logic → output and creative prompting.',
  concept: 'This project applies text generation and prompt design (or template/randomisation logic) to produce stories from structured inputs. It demonstrates the input→processing→output pattern, with fact/appropriateness checks on AI output.',
  analogies: [
    { concept: 'Story generator', analogy: 'A pizza builder', explanation: 'Pick toppings (inputs); get a custom result (story).' },
    { concept: 'Templates', analogy: 'Mad Libs', explanation: 'Fill the blanks to make endless stories.' },
  ],
  howItWorks: [
    'Collect inputs: hero, place, problem.',
    'Pick a method: template/randomiser or AI prompt.',
    'Combine inputs into a story.',
    'Show the story (and let user regenerate).',
    'Check it is sensible and appropriate.',
  ],
  realWorld: [
    'Kids\' interactive story apps.',
    'Game quest/dialogue generators.',
    'Writing-prompt tools for authors.',
    'Personalised bedtime story apps.',
    'Ad/marketing copy helpers.',
  ],
  facts: [
    'The same inputs can make different stories each time.',
    'Templates work even with no internet.',
    'Always review AI stories before sharing.',
  ],
  activity: {
    title: 'Story Recipe',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'List 5 heroes, 5 places, 5 problems.',
      'Write a template with blanks.',
      'Fill it randomly to make a story.',
      'Try AI prompting for one version.',
    ],
    expected: 'Students produce at least 2 different stories from their inputs.',
  },
  miniChallenge: 'Make the funniest story by mixing the most unexpected ingredients.',
  project: {
    title: 'Build the AI Story Generator',
    description: 'Create a working story generator (Scratch, Python, or paper templates).',
    time: '25 minutes',
    materials: ['Scratch/Python or cards', 'AI Diary'],
    steps: [
      'Design the inputs (hero, place, problem).',
      'Build template logic OR an AI prompt.',
      'Generate 3 different stories.',
      'Add a "regenerate" option and a content check.',
    ],
    expectedOutput: 'A story generator that produces at least 3 varied, appropriate stories.',
    extensions: ['Add a genre selector.', 'Add illustrations (AI or hand-drawn).'],
  },
  logic: 'Input → logic → output with creativity: structured inputs plus combination logic produce endless varied results.',
  discussion: [
    'What makes a generated story feel "good"?',
    'How do you keep generated stories appropriate?',
    'Should you say a story was AI-made?',
  ],
  careers: [
    'Game Narrative Designer.',
    'Creative Technologist.',
    'Content Tool Developer.',
  ],
  homework: [
    'Add 5 more ingredients to your generator.',
    'Generate a story and edit it to make it yours.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A story generator turns inputs into a…', options: ['Story (output)', 'Battery', 'Password', 'Map'], answer: 'Story (output)', explanation: 'Input→logic→output.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Templates with blanks to fill are like…', options: ['Mad Libs', 'A calculator', 'A camera', 'A wire'], answer: 'Mad Libs', explanation: 'Fill blanks for variety.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Why review an AI-generated story before sharing?', answer: 'To check it is sensible and appropriate.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write a story template with 3 blanks.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const projChatbot = lesson({
  title: 'Project: AI Chatbot',
  module: MP,
  summary: 'Build a friendly chatbot that understands intents and replies — with a fallback.',
  hook: 'Time to build YOUR own chatbot — one with a name, a personality, and an answer for almost anything.',
  story: 'ARIA helps you build a class FAQ bot. You list what people ask, write great replies, and add a kind fallback. Soon classmates are chatting with a bot you built from scratch.',
  layman: 'In this project you build a rule-based chatbot: list user intents, write replies, and always include a fallback for unknown messages. You can build it in Scratch, Python or even on cards.',
  concept: 'A capstone of NLP basics: map user inputs to intents and responses, include a graceful fallback, and give the bot a consistent personality. Optionally extend with keyword matching or a simple ML intent classifier.',
  analogies: [
    { concept: 'Chatbot build', analogy: 'A switchboard operator', explanation: 'Match each message to the right reply line.' },
    { concept: 'Fallback', analogy: 'A polite "please rephrase"', explanation: 'Always have a graceful default.' },
  ],
  howItWorks: [
    'List 8+ likely user messages (intents).',
    'Write a great reply for each.',
    'Add a friendly fallback.',
    'Give the bot a name and personality.',
    'Test with users and fix weak replies.',
  ],
  realWorld: [
    'School FAQ bots.',
    'Website support bots.',
    'Booking and reminder bots.',
    'Study-helper bots.',
    'Companion/wellbeing bots.',
  ],
  facts: [
    'A good fallback is what users remember most.',
    'Personality makes bots feel friendly.',
    'Real bots add ML to detect intents.',
  ],
  activity: {
    title: 'Intent Map',
    materials: ['Sticky notes'],
    steps: [
      'Brainstorm what users will ask.',
      'Group similar messages into intents.',
      'Write one reply per intent.',
      'Design the fallback.',
    ],
    expected: 'Students produce an intent→reply map with a fallback.',
  },
  miniChallenge: 'Write the most helpful fallback reply in the class.',
  project: {
    title: 'Build Your Chatbot',
    description: 'Build a working rule-based chatbot with personality and fallback.',
    time: '25 minutes',
    materials: ['Scratch/Python or cards', 'AI Diary'],
    steps: [
      'Add 8+ intent→reply pairs.',
      'Include a friendly fallback.',
      'Give it a clear personality.',
      'Test with 2 classmates and improve.',
    ],
    expectedOutput: 'A working chatbot handling 8+ intents with personality and fallback.',
    extensions: ['Add emotion-aware replies.', 'Add a second language greeting.'],
  },
  code: {
    language: 'python',
    code: 'rules = {"hi": "Hi! I am your class bot.", "homework": "Check the planner tab!", "bye": "Bye! Study well."}\n\ndef reply(t):\n    t = t.lower()\n    for k, a in rules.items():\n        if k in t:\n            return a\n    return "Hmm, I did not get that. Try asking differently!"  # fallback',
    note: 'Add more intents to rules{} to make your bot smarter.',
  },
  logic: 'Mapping + graceful failure: matching inputs to outputs and handling the unknown is the core of conversational AI.',
  discussion: [
    'How do you decide a bot\'s personality?',
    'When should a bot pass you to a human?',
    'How do you keep a bot safe and kind?',
  ],
  careers: [
    'Conversation Designer.',
    'Chatbot Developer.',
    'Customer Experience Engineer.',
  ],
  homework: [
    'Add 5 more intents to your bot.',
    'Improve your fallback reply.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'Every chatbot must have a…', options: ['Fallback for unknown input', 'Camera', 'Battery', 'Wheel'], answer: 'Fallback for unknown input', explanation: 'Handle the unknown.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'The user\'s purpose behind a message is the…', options: ['Intent', 'Pixel', 'Token', 'Watt'], answer: 'Intent', explanation: 'Intent = goal.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'Name one thing that gives a bot character.', answer: 'Its personality/tone in replies.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write 2 intent→reply pairs for a library bot.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const projDrawingAssistant = lesson({
  title: 'Project: AI Drawing Assistant',
  module: MP,
  summary: 'Create a tool that turns prompts (or doodles) into art ideas and images.',
  hook: 'Describe a picture in words and get art back — or sketch a doodle and get suggestions. Let us build a drawing buddy!',
  story: 'ARIA loves to doodle. You build a Drawing Assistant: type a prompt, get an image (AI) or guided sketch steps. ARIA\'s wobbly circles become a masterpiece with the assistant\'s help.',
  layman: 'A drawing assistant helps you create art — by turning text prompts into images (image-generation) or by giving step-by-step drawing guidance. This project mixes prompting, creativity and responsible AI use.',
  concept: 'This project applies text-to-image generation and/or guided-drawing logic. Learners practise prompt crafting, iteration, selection and ethical use (crediting AI, respecting artists). A no-AI version uses step-by-step shape guidance.',
  analogies: [
    { concept: 'Drawing assistant', analogy: 'An art teacher on demand', explanation: 'Guides each stroke or paints your idea.' },
    { concept: 'Prompting art', analogy: 'Ordering a custom cake', explanation: 'Detailed requests get closer to your vision.' },
  ],
  howItWorks: [
    'User gives a prompt or doodle.',
    'AI generates an image OR suggests steps.',
    'User refines the prompt/steps.',
    'Pick the best result.',
    'Credit AI and respect artists.',
  ],
  realWorld: [
    'AI art apps.',
    'Logo and poster helpers.',
    'Coloring and sketch guides.',
    'Concept art for games.',
    'Greeting-card makers.',
  ],
  facts: [
    'Detailed prompts make far better art.',
    'A no-internet version can use shape-by-shape guides.',
    'Always credit AI-made art.',
  ],
  activity: {
    title: 'Prompt-to-Art Plan',
    materials: ['Worksheet (tool optional)'],
    steps: [
      'Write a vague vs a detailed art prompt.',
      'Predict/generate both.',
      'Pick the best and add one detail.',
      'Write a credit line.',
    ],
    expected: 'Students craft strong art prompts and credit AI.',
  },
  miniChallenge: 'Describe your dream pet so vividly it could be drawn from words alone.',
  project: {
    title: 'Build the Drawing Assistant',
    description: 'Build a drawing assistant (AI image tool or guided-sketch version).',
    time: '25 minutes',
    materials: ['Tool or paper', 'AI Diary'],
    steps: [
      'Choose AI-image or guided-sketch mode.',
      'Create the prompt/steps interface.',
      'Produce 2 artworks.',
      'Add AI credit and one improvement.',
    ],
    expectedOutput: 'A drawing assistant that produces 2 artworks with AI credit.',
    extensions: ['Add a style picker.', 'Add a "step-by-step" mode.'],
  },
  logic: 'Specification + iteration + ethics: precise prompting, refining and crediting combine creativity with responsible AI.',
  discussion: [
    'Who is the artist when AI makes the image?',
    'How do we respect human artists?',
    'When is AI art "yours"?',
  ],
  careers: [
    'Digital Artist (AI-assisted).',
    'Designer.',
    'Creative Technologist.',
  ],
  homework: [
    'Write 3 detailed art prompts.',
    'Create one artwork and add a credit line.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'Better AI art comes from…', options: ['Detailed prompts', 'Empty prompts', 'Random clicks', 'No input'], answer: 'Detailed prompts', explanation: 'Detail steers art.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Responsible AI art means…', options: ['Crediting AI', 'Hiding AI use', 'Copying living artists', 'Ignoring rights'], answer: 'Crediting AI', explanation: 'Disclosure matters.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do you do if the first image is wrong?', answer: 'Refine the prompt and regenerate.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Add style and mood to: "a house".', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const projAttendance = lesson({
  title: 'Project: Smart Attendance System',
  module: MP,
  difficulty: 'intermediate',
  summary: 'Design a system that marks attendance automatically using AI recognition.',
  hook: 'What if attendance marked itself the moment students walked in? Let us design a smart attendance system.',
  story: 'ARIA is tired of roll call. She designs a system: a camera recognises each student (with consent!), marks them present, and saves time. She thinks carefully about privacy and fairness too.',
  layman: 'A smart attendance system uses recognition (face, QR or card) to mark who is present automatically. This project covers data, recognition, a simple database, and — very importantly — privacy and consent.',
  concept: 'This applied project combines recognition (face/QR/RFID), a data store (who/when), and a simple interface. It foregrounds responsible AI: consent, privacy, bias testing across all students, and a manual override.',
  analogies: [
    { concept: 'Smart attendance', analogy: 'A doorman who knows everyone', explanation: 'Recognises you and notes you arrived.' },
    { concept: 'Consent', analogy: 'Asking before taking a photo', explanation: 'People must agree to be recognised.' },
  ],
  howItWorks: [
    'Enrol students (with consent).',
    'At entry, recognise each person.',
    'Mark them present with a timestamp.',
    'Store records securely.',
    'Allow manual correction and respect privacy.',
  ],
  realWorld: [
    'School/office attendance.',
    'Event check-ins.',
    'Gym member entry.',
    'Library access.',
    'Secure building access.',
  ],
  facts: [
    'Face recognition can be biased if trained on narrow data.',
    'Consent and privacy are legally important.',
    'A manual override is essential for fairness.',
  ],
  activity: {
    title: 'System Map',
    materials: ['Worksheet'],
    steps: [
      'Draw the flow: enrol → recognise → record.',
      'Choose a method (face, QR, card).',
      'List the data stored.',
      'Add a privacy and override rule.',
    ],
    expected: 'Students map a complete attendance system with privacy safeguards.',
  },
  miniChallenge: 'Add the ONE safeguard you think this system most needs.',
  project: {
    title: 'Design the Attendance System',
    description: 'Design (or prototype) a smart attendance system with ethics built in.',
    time: '25 minutes',
    materials: ['Worksheet / Teachable Machine (optional)'],
    steps: [
      'Choose the recognition method.',
      'Design the data flow and storage.',
      'Add consent, privacy and override.',
      'Test the flow with a few "students".',
    ],
    expectedOutput: 'An attendance system design with recognition, storage and ethics safeguards.',
    extensions: ['Prototype face match in Teachable Machine.', 'Add a "late" status.'],
  },
  logic: 'End-to-end system design + ethics: combining recognition, data and safeguards is real applied-AI engineering.',
  discussion: [
    'What are the privacy risks, and how do we reduce them?',
    'Should attendance ever be face-only? Why or why not?',
    'Who can see the attendance data?',
  ],
  careers: [
    'Computer Vision Engineer.',
    'Systems / Backend Developer.',
    'Privacy / Compliance Officer.',
  ],
  homework: [
    'List 3 privacy rules for the system.',
    'Design a non-face (QR/card) alternative.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A must-have for a face attendance system is…', options: ['Consent and privacy safeguards', 'Loud music', 'A printer', 'A game'], answer: 'Consent and privacy safeguards', explanation: 'Ethics first.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Face recognition can be unfair if trained on…', options: ['Narrow, non-diverse data', 'Balanced data', 'Lots of varied faces', 'Nothing'], answer: 'Narrow, non-diverse data', explanation: 'Bias from data.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Why include a manual override?', answer: 'To fix recognition errors fairly.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Give 2 privacy safeguards for an attendance system.', answer: 'Open-ended (consent, secure storage, limited access).', difficulty: 'advanced' },
  ],
});

const projFaceRecognition = lesson({
  title: 'Project: Face Recognition Demo',
  module: MP,
  difficulty: 'intermediate',
  summary: 'Train and test a simple face/object recogniser with Teachable Machine.',
  hook: 'In 15 minutes you can train an AI to recognise YOU (or an object) — and see how it can be fooled.',
  story: 'ARIA opens her camera-eyes. You show her examples, press Train, and she recognises a thumbs-up vs thumbs-down. Then you try to trick her — and learn how data variety makes her stronger.',
  layman: 'This project trains a recognition model using Teachable Machine (drag-and-drop, no code). You collect examples, train, test on new inputs, and improve it — while respecting consent and privacy.',
  concept: 'A hands-on computer-vision project: collect labelled images, train a classifier (Teachable Machine), evaluate accuracy on unseen inputs, and iterate. It teaches the train→test→improve loop, overfitting, bias and consent.',
  analogies: [
    { concept: 'Training recognition', analogy: 'Practising to recognise a friend', explanation: 'More varied looks → better recognition.' },
    { concept: 'Accuracy', analogy: 'A test score', explanation: '9/10 correct on new inputs = 90%.' },
  ],
  howItWorks: [
    'Create classes (e.g. thumbs up/down) with consent.',
    'Add varied examples (angles, lighting).',
    'Press Train.',
    'Test on NEW inputs and record accuracy.',
    'Add data to weak classes and retrain.',
  ],
  realWorld: [
    'Phone face unlock.',
    'Plant/bird identifier apps.',
    'Quality-check cameras in factories.',
    'Gesture-controlled games.',
    'Sign-language recognition.',
  ],
  facts: [
    'Teachable Machine trains in your browser, free.',
    'Testing on unseen data is the honest measure.',
    'Varied data reduces bias and boosts accuracy.',
  ],
  activity: {
    title: 'Train-Test-Improve',
    materials: ['Computer + Teachable Machine (or storyboard)'],
    steps: [
      'Create 2 classes and add examples.',
      'Train and test on 10 new inputs.',
      'Record accuracy.',
      'Add data to the weak class and retrain.',
    ],
    expected: 'A working classifier with before/after accuracy.',
  },
  miniChallenge: 'Try to "trick" your model and explain WHY it failed.',
  project: {
    title: 'Build a Face/Object Recogniser',
    description: 'Train, test and demo a 2–3 class recogniser, respecting consent.',
    time: '25 minutes',
    materials: ['Teachable Machine or storyboard', 'AI Diary'],
    steps: [
      'Pick classes (objects/gestures preferred for privacy).',
      'Collect balanced, varied examples.',
      'Train, test and record accuracy.',
      'Improve once and note the change.',
    ],
    expectedOutput: 'A demoable recogniser with two recorded accuracy scores.',
    extensions: ['Add a third class.', 'Test in low light and report results.'],
  },
  logic: 'The train→test→improve loop with honest evaluation is the engine of all machine learning.',
  discussion: [
    'When is face recognition okay, and when is it risky?',
    'Why prefer objects/gestures over faces for a class demo?',
    'How does data variety affect fairness?',
  ],
  careers: [
    'Computer Vision Engineer.',
    'ML Engineer.',
    'AI Ethics Specialist.',
  ],
  homework: [
    'List 3 ways to make your dataset more varied.',
    'Find one place face recognition raises privacy concerns.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'After training, test on…', options: ['New, unseen inputs', 'The same training data', 'No data', 'A calculator'], answer: 'New, unseen inputs', explanation: 'Honest evaluation.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: '"8 of 10 correct" is an accuracy of…', options: ['80%', '8%', '100%', '18%'], answer: '80%', explanation: '8/10 = 80%.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What loop do AI builders repeat to improve a model?', answer: 'Train → Test → Improve.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Your model confuses two classes. Name 2 data fixes.', answer: 'Open-ended (more varied examples, balance).', difficulty: 'intermediate' },
  ],
});

const projQuizGenerator = lesson({
  title: 'Project: AI Quiz Generator',
  module: MP,
  difficulty: 'intermediate',
  summary: 'Build a tool that creates quizzes from a topic or text — and checks answers.',
  hook: 'Turn any chapter into a quiz in seconds. Let us build a study tool that makes its own questions!',
  story: 'ARIA wants to help you study. You build a Quiz Generator: feed it a topic, it makes questions, you answer, it scores you. Studying becomes a game you built yourself.',
  layman: 'A quiz generator takes a topic or text and produces questions (with answers), then checks your responses. You can use templates or generative AI, plus logic to score answers.',
  concept: 'This project combines text understanding/generation with question templates and answer-checking logic. It demonstrates generation, evaluation and feedback loops, plus verifying AI-made questions for correctness.',
  analogies: [
    { concept: 'Quiz generator', analogy: 'A teacher making a test', explanation: 'From a topic, it writes and grades questions.' },
    { concept: 'Answer checking', analogy: 'A self-marking worksheet', explanation: 'It compares your answer to the key.' },
  ],
  howItWorks: [
    'Input a topic or text.',
    'Generate questions (templates or AI).',
    'Store the correct answers.',
    'Ask the user and collect answers.',
    'Score and give feedback.',
  ],
  realWorld: [
    'Study and revision apps.',
    'Teacher quiz tools.',
    'Onboarding/training tests.',
    'Trivia game makers.',
    'Language-practice apps.',
  ],
  facts: [
    'AI-made questions must be checked for correctness.',
    'Good quizzes mix easy and hard questions.',
    'Instant feedback helps you learn faster.',
  ],
  activity: {
    title: 'Question Factory',
    materials: ['A short text', 'Worksheet'],
    steps: [
      'Read a short text.',
      'Write 3 MCQs with answers.',
      'Add 1 practical/open question.',
      'Swap and solve a partner\'s quiz.',
    ],
    expected: 'Students generate a small mixed quiz with an answer key.',
  },
  miniChallenge: 'Write one tricky MCQ where every wrong option is tempting.',
  project: {
    title: 'Build the Quiz Generator',
    description: 'Create a quiz generator (Scratch/Python/templates) that scores answers.',
    time: '25 minutes',
    materials: ['Tool or cards', 'AI Diary'],
    steps: [
      'Pick a topic and generate 5 questions + answers.',
      'Build answer-checking logic.',
      'Give a score and feedback.',
      'Verify all answers are correct.',
    ],
    expectedOutput: 'A quiz generator that creates 5 questions, scores them and gives feedback.',
    extensions: ['Add difficulty levels.', 'Add explanations for each answer.'],
  },
  code: {
    language: 'python',
    code: 'quiz = [("Capital of France?", "paris"), ("2+2?", "4")]\nscore = 0\nfor q, ans in quiz:\n    user = input(q + " ").strip().lower()\n    if user == ans:\n        score += 1\n        print("Correct!")\n    else:\n        print("The answer is:", ans)\nprint("Score:", score, "/", len(quiz))',
    note: 'Add more (question, answer) pairs to grow your quiz.',
  },
  logic: 'Generation + evaluation + feedback: producing questions and grading answers is a complete, useful AI workflow.',
  discussion: [
    'Why must you verify AI-generated questions?',
    'What makes a quiz fair and helpful?',
    'How should it handle "almost correct" answers?',
  ],
  careers: [
    'EdTech Developer.',
    'Assessment Designer.',
    'AI Tools Engineer.',
  ],
  homework: [
    'Generate a 5-question quiz for a topic you study.',
    'Add explanations to each answer.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A quiz generator should also…', options: ['Check answers and give feedback', 'Only show a logo', 'Never score', 'Hide answers forever'], answer: 'Check answers and give feedback', explanation: 'Evaluation + feedback.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'AI-generated questions should be…', options: ['Verified for correctness', 'Trusted blindly', 'Never read', 'Deleted'], answer: 'Verified for correctness', explanation: 'AI can be wrong.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What helps learners most right after answering?', answer: 'Instant feedback.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write one MCQ with 4 options and mark the answer.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const projVoiceAssistant = lesson({
  title: 'Project: AI Voice Assistant',
  module: MP,
  difficulty: 'intermediate',
  summary: 'Design and build a simple voice assistant that listens, understands and replies.',
  hook: 'Build your own "Hey ARIA!" — an assistant that hears a command and does something useful.',
  story: 'ARIA gets a voice. You design her wake word, the commands she knows, and her spoken replies. "Hey ARIA, tell a joke!" — and she does. You built a talking assistant!',
  layman: 'This project builds a basic voice assistant: speech-to-text to hear, intent matching to understand, an action, and text-to-speech to reply. You can build it in Scratch (speech blocks) or plan it in detail.',
  concept: 'A capstone combining speech recognition, intent matching, action execution and speech synthesis. It applies the assistant pipeline (wake → listen → understand → act → speak), including a fallback and privacy considerations.',
  analogies: [
    { concept: 'Voice assistant', analogy: 'A helpful butler', explanation: 'Hears your wish, understands it, and acts.' },
    { concept: 'Pipeline', analogy: 'An assembly line', explanation: 'Each stage passes work to the next.' },
  ],
  howItWorks: [
    'Wake word starts listening.',
    'Speech-to-text turns voice into words.',
    'Intent matching finds what you want.',
    'It performs the action.',
    'Text-to-speech replies aloud.',
  ],
  realWorld: [
    'Alexa, Siri, Google Assistant.',
    'In-car voice controls.',
    'Smart-home voice commands.',
    'Accessibility voice tools.',
    'Hands-free reminders.',
  ],
  facts: [
    'Assistants need a fallback for commands they do not know.',
    'Privacy matters — be careful what is always listening.',
    'Scratch has speech and text-to-speech blocks.',
  ],
  activity: {
    title: 'Command List',
    materials: ['Worksheet'],
    steps: [
      'Choose a wake word.',
      'List 6 commands and their replies/actions.',
      'Add a fallback.',
      'Add a privacy rule.',
    ],
    expected: 'Students define a wake word, commands, replies and a fallback.',
  },
  miniChallenge: 'Design the most useful single command for a student\'s morning.',
  project: {
    title: 'Build the Voice Assistant',
    description: 'Build (Scratch) or fully design a voice assistant pipeline.',
    time: '25 minutes',
    materials: ['Scratch or worksheet', 'AI Diary'],
    steps: [
      'Set the wake word and personality.',
      'Add 6 command→action/reply pairs.',
      'Add a fallback.',
      'Test 5 commands and improve.',
    ],
    expectedOutput: 'A voice assistant (or detailed design) handling 6 commands with a fallback.',
    extensions: ['Add a joke/fun command.', 'Add a "repeat that" command.'],
  },
  logic: 'Pipeline integration: chaining listen→understand→act→speak is multi-stage system thinking with graceful fallback.',
  discussion: [
    'What should an assistant NOT be allowed to do by voice?',
    'How do you protect privacy with an always-on mic?',
    'What command do you wish existed?',
  ],
  careers: [
    'Voice UX Designer.',
    'Speech AI Engineer.',
    'Conversation Designer.',
  ],
  homework: [
    'Write 6 commands and ideal replies.',
    'Add a privacy rule for your assistant.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: 'A voice assistant pipeline starts with…', options: ['A wake word + listening', 'Painting', 'Charging', 'Printing'], answer: 'A wake word + listening', explanation: 'Wake → listen.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Turning the reply text into speech is…', options: ['Text-to-speech', 'Speech-to-text', 'Tokenising', 'Encryption'], answer: 'Text-to-speech', explanation: 'TTS speaks the reply.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What handles a command the assistant does not know?', answer: 'A fallback reply.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write one command and the action it triggers.', answer: 'Open-ended', difficulty: 'intermediate' },
  ],
});

const projSmartHomeSim = lesson({
  title: 'Project: Smart Home Simulation',
  module: MP,
  difficulty: 'intermediate',
  summary: 'Simulate a smart home with sensors, automation rules and a dashboard.',
  hook: 'Build a virtual smart home where lights, doors and alarms respond to rules YOU design.',
  story: 'ARIA moves into a simulated house. You write the rules: dark + motion → light on; smoke → alarm. You "walk" through and watch the house respond. A whole home, controlled by your logic.',
  layman: 'This project simulates a smart home (in Scratch, on paper, or in code). You set up virtual sensors, write IF-THEN automation rules, and watch the home react to different situations.',
  concept: 'A simulation project applying the sense→decide→act loop and conditional logic across multiple connected devices (IoT). Learners design rules, test scenarios, handle conflicts/edge cases, and consider energy, safety and privacy.',
  analogies: [
    { concept: 'Simulation', analogy: 'A dollhouse with rules', explanation: 'Play out situations safely before building real devices.' },
    { concept: 'Automation rules', analogy: 'House reflexes', explanation: 'The home reacts automatically to triggers.' },
  ],
  howItWorks: [
    'Place virtual sensors (motion, smoke, light).',
    'Write IF-THEN rules for each device.',
    'Simulate scenarios (night, intruder, fire).',
    'Watch devices respond.',
    'Fix conflicts and add safety rules.',
  ],
  realWorld: [
    'Smart lighting and climate control.',
    'Security and fire-alarm systems.',
    'Energy-saving automations.',
    'Elderly-care monitoring.',
    'Voice/app-controlled homes.',
  ],
  facts: [
    'Simulations let you test safely before building.',
    'Conflicting rules can cause bugs.',
    'Good homes balance convenience, energy and privacy.',
  ],
  activity: {
    title: 'Rule the House',
    materials: ['House grid', 'Rule cards'],
    steps: [
      'Draw a house with 4 devices.',
      'Write an IF-THEN rule per device.',
      'Run 3 scenarios.',
      'Find a rule conflict and fix it.',
    ],
    expected: 'Students build and debug a small set of automation rules.',
  },
  miniChallenge: 'Create the smartest energy-saving rule for an empty house.',
  project: {
    title: 'Build the Smart Home Sim',
    description: 'Simulate a smart home (Scratch/paper/code) with rules and a dashboard.',
    time: '25 minutes',
    materials: ['Scratch or paper', 'AI Diary'],
    steps: [
      'Add 4+ devices and sensors.',
      'Write IF-THEN automation rules.',
      'Test night/intruder/fire scenarios.',
      'Add safety + energy rules; fix conflicts.',
    ],
    expectedOutput: 'A working smart-home simulation responding to at least 3 scenarios.',
    extensions: ['Add a "guest mode".', 'Add a power-cut behaviour.'],
  },
  logic: 'Conditional logic + system simulation: coordinating many IF-THEN rules and resolving conflicts is core automation engineering.',
  discussion: [
    'What happens when two rules conflict?',
    'How do you balance convenience and privacy?',
    'Which automation would help your family most?',
  ],
  careers: [
    'IoT / Automation Engineer.',
    'Smart-Home Solutions Designer.',
    'Embedded Systems Developer.',
  ],
  homework: [
    'Write 4 automation rules for your real home.',
    'Find one rule conflict and resolve it.',
  ],
  diagram: 'sensor',
  questions: [
    { qtype: 'mcq', prompt: 'Smart-home automation is built mostly from…', options: ['IF-THEN rules', 'Random actions', 'Paintings', 'Songs'], answer: 'IF-THEN rules', explanation: 'Conditional logic.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Why simulate before building real devices?', options: ['Test safely and cheaply', 'To waste time', 'To avoid learning', 'No reason'], answer: 'Test safely and cheaply', explanation: 'Simulation reduces risk.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What can happen if two rules disagree?', answer: 'A conflict/bug that needs fixing.', difficulty: 'intermediate' },
    { qtype: 'tinkering', prompt: 'Write an IF-THEN rule for a smoke alarm.', answer: 'Open-ended (IF smoke THEN alarm + unlock doors).', difficulty: 'intermediate' },
  ],
});

const projRecommendation = lesson({
  title: 'Project: Recommendation System',
  module: MP,
  difficulty: 'advanced',
  summary: 'Build a recommender that suggests items using likes and similarity.',
  hook: 'Build your own "Up Next" engine that gives each user their own perfect suggestions.',
  story: 'ARIA opens a movie club. She records what each member likes, finds taste-twins, and suggests new films. Members love it. You just built a recommendation system!',
  layman: 'This project builds a recommender using content-based rules (similar items) and collaborative rules (similar people). You collect likes, compute similarity, and rank suggestions.',
  concept: 'A capstone applying recommendation techniques: content-based filtering (item similarity via tags) and collaborative filtering (user similarity), with ranking and a cold-start strategy. Learners build, test on profiles, and add diversity.',
  analogies: [
    { concept: 'Content-based', analogy: 'More like what you liked', explanation: 'Same tags/genre as your favourites.' },
    { concept: 'Collaborative', analogy: 'Taste-twins\' picks', explanation: 'People like you loved it.' },
  ],
  howItWorks: [
    'Collect items with tags and user likes.',
    'For a user, find similar items (content-based).',
    'Find similar users (collaborative).',
    'Score and rank candidates.',
    'Handle new users (cold start) and add variety.',
  ],
  realWorld: [
    'Video/music suggestions.',
    'Shopping recommendations.',
    'Friend suggestions.',
    'News feeds.',
    'Book recommendations.',
  ],
  facts: [
    'Most watched/bought items come from recommendations.',
    'Cold start is the new-user challenge.',
    'A little variety keeps users from getting bored.',
  ],
  activity: {
    title: 'Recommender Rules',
    materials: ['Item cards with tags', 'Worksheet'],
    steps: [
      'Create 10 items with tags.',
      'Write a content-based rule.',
      'Write a collaborative rule.',
      'Recommend to 2 different users.',
    ],
    expected: 'Students build a two-strategy recommender and test it.',
  },
  miniChallenge: 'Solve the cold start: recommend to a user with zero history.',
  project: {
    title: 'Build a Recommendation System',
    description: 'Build a recommender combining content-based and collaborative logic.',
    time: '25 minutes',
    materials: ['Cards or code', 'AI Diary'],
    steps: [
      'Build a small item+likes dataset.',
      'Implement content-based and collaborative rules.',
      'Rank and show top picks for 3 users.',
      'Add a cold-start and a diversity rule.',
    ],
    expectedOutput: 'A recommender that suggests ranked items for 3 user profiles.',
    extensions: ['Add a "surprise me".', 'Avoid recommending repeats.'],
  },
  logic: 'Similarity + ranking + edge cases: combining strategies and handling cold start is a complete, professional ML pattern.',
  discussion: [
    'Could your recommender trap users in a bubble?',
    'How would you measure if recommendations are "good"?',
    'Should users control their recommendations?',
  ],
  careers: [
    'Recommender Systems Engineer.',
    'Data Scientist.',
    'Personalisation Product Manager.',
  ],
  homework: [
    'Add 5 more items and test again.',
    'Design a "good recommendation" success metric.',
  ],
  diagram: 'flow',
  questions: [
    { qtype: 'mcq', prompt: '"People like you also liked…" is…', options: ['Collaborative filtering', 'Content-based filtering', 'Overfitting', 'Cleaning'], answer: 'Collaborative filtering', explanation: 'Based on similar users.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'The "cold start" problem is about…', options: ['New users with no history', 'Cold weather', 'Dead batteries', 'Slow internet'], answer: 'New users with no history', explanation: 'No data to personalise yet.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Why add some variety to recommendations?', answer: 'So users do not get bored/trapped in a bubble.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Recommend to a brand-new user with no data. How?', answer: 'Open-ended (popular items, ask preferences).', difficulty: 'advanced' },
  ],
});

const projSchoolAssistant = lesson({
  title: 'Project: AI-Powered School Assistant (Capstone)',
  module: MP,
  difficulty: 'advanced',
  summary: 'Combine everything into one helpful school assistant — the grand capstone.',
  hook: 'One assistant that answers questions, makes quizzes, gives reminders and helps everyone at school. This is your masterpiece.',
  story: 'ARIA has grown up — she can see, talk, recommend, create and act fairly. For the finale, you combine her powers into a School Assistant that truly helps students and teachers. ARIA is now YOURS.',
  layman: 'The capstone combines many skills: a chatbot for questions, a quiz generator for study, reminders/planning, and maybe recommendations — all in one school assistant. You design, build, test, and check ethics, then demo it.',
  concept: 'A synthesis capstone integrating NLP (chatbot/Q&A), generation (quizzes/summaries), recommendation/planning, and responsible-AI practices into one product. It follows the full pipeline: define → design → build → test → evaluate fairness → demo.',
  analogies: [
    { concept: 'Capstone', analogy: 'The final dish of a cooking course', explanation: 'Use every technique to make one impressive result.' },
    { concept: 'Integration', analogy: 'Assembling a super-team', explanation: 'Each skill plays its role in one system.' },
  ],
  howItWorks: [
    'Define the problem and users (students/teachers).',
    'Choose 2–3 features (Q&A, quiz, reminders).',
    'Build each feature and connect them.',
    'Test with real users; record accuracy/feedback.',
    'Check fairness/privacy and prepare a demo.',
  ],
  realWorld: [
    'School helpdesk assistants.',
    'Study companion apps.',
    'Timetable and reminder bots.',
    'Homework Q&A helpers.',
    'Accessibility school tools.',
  ],
  facts: [
    'Real AI teams follow this same build pipeline.',
    'A clear problem statement is half the solution.',
    'Demoing and explaining your work is a vital skill.',
  ],
  activity: {
    title: 'Capstone Canvas',
    materials: ['Project canvas worksheet'],
    steps: [
      'Fill: problem, users, features, data, ethics, demo.',
      'Pick 2–3 features to build.',
      'Assign roles in your team.',
      'Plan your 2-minute demo.',
    ],
    expected: 'A complete project plan ready to build.',
  },
  miniChallenge: 'Name the ONE feature that would help your school the most — defend it.',
  project: {
    title: 'Build the School Assistant',
    description: 'Build a multi-feature school assistant and demo it, with ethics checked.',
    time: '40 minutes',
    materials: ['Any tools from the course', 'Project canvas', 'AI Diary'],
    steps: [
      'Finalise the problem and 2–3 features.',
      'Build and connect the features.',
      'Test with users; record feedback/accuracy.',
      'Run a fairness/privacy check and rehearse a demo.',
    ],
    expectedOutput: 'A working multi-feature school assistant with a 2-minute demo and an ethics check.',
    extensions: ['Add a new feature.', 'Collect feedback and plan version 2.'],
  },
  logic: 'Synthesis: integrating multiple AI skills into one tested, ethical, demoable product is the pinnacle of project-based AI learning.',
  discussion: [
    'Which features matter most to students vs teachers?',
    'How do you keep the assistant fair and private?',
    'What would version 2 add?',
  ],
  careers: [
    'AI Product Manager.',
    'Full-Stack / AI Engineer.',
    'EdTech Founder / Entrepreneur.',
  ],
  homework: [
    'Write your capstone\'s problem statement and success goal.',
    'List 3 ways to improve your assistant after the demo.',
  ],
  diagram: 'design_thinking',
  questions: [
    { qtype: 'mcq', prompt: 'The FIRST step of the capstone is to…', options: ['Define the problem & users', 'Build a logo', 'Buy a server', 'Pick a colour'], answer: 'Define the problem & users', explanation: 'Clarity first.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Before the demo you should check accuracy AND…', options: ['Fairness/privacy', 'The weather', 'Your shoe size', 'Wi-Fi colour'], answer: 'Fairness/privacy', explanation: 'Ethics matters.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What brings all your skills into one project?', answer: 'The capstone.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Your assistant is only 60% accurate. List TWO ways to improve it.', answer: 'Open-ended (more/varied data, better features, retrain).', difficulty: 'advanced' },
  ],
});

const PROJECTS = [
  projStoryGenerator, projChatbot, projDrawingAssistant, projAttendance, projFaceRecognition,
  projQuizGenerator, projVoiceAssistant, projSmartHomeSim, projRecommendation, projSchoolAssistant,
];

// =====================================================================
//  COURSE ASSEMBLY
// =====================================================================
const ALL_CHAPTERS: ChapterSpec[] = [
  ...FOUNDATION,
  ...DAILY_LIFE,
  ...COMPUTATIONAL,
  ...MACHINE_LEARNING,
  ...DATA_SCIENCE,
  ...GENERATIVE,
  ...RESPONSIBLE,
  ...AI_TOOLS,
  ...AI_CODING,
  ...ROBOTICS,
  ...FUTURE_TECH,
  ...PROJECTS,
];

/** The standalone "AI for Everyone" course as a single module spec. */
export function aiForEveryoneCourse(): ModuleSpec {
  return {
    title: 'AI for Everyone',
    slug: 'ai-for-everyone',
    icon: '🌍',
    color: '#7c3aed',
    description:
      'A fun, hands-on, project-based AI course for absolutely everyone — kids, teens, parents and curious beginners. ' +
      '71 engaging lessons across 12 modules (Foundation AI, AI in Daily Life, Computational Thinking, Machine Learning, ' +
      'Data Science, Generative AI, Responsible AI, AI Tools, AI & Coding, Robotics, Future Tech) plus 10 build-it ' +
      'projects. Every lesson follows Hook → Story → Concept → Real-Life Examples → Activity → Quiz → Project → Reflection.',
    chapters: ALL_CHAPTERS,
  };
}
