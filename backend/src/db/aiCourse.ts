// =====================================================================
//  ARTIFICIAL INTELLIGENCE — 3-month (12-week) course for Classes 3–10
//  ---------------------------------------------------------------------
//  A single "Artificial Intelligence" innovation track that spans 8
//  classes. Content is authored in three age bands so it stays
//  age-appropriate while following ONE 12-week roadmap:
//
//    Band A · Classes 3-4  → "AI Explorers"   (unplugged + storytelling)
//    Band B · Classes 5-7  → "AI Creators"    (Scratch + Teachable Machine)
//    Band C · Classes 8-10 → "AI Innovators"  (Python + real ML + ethics)
//
//  Each weekly chapter is CBSE/NEP aligned and includes: a story, hook,
//  analogies, core concept, activities, a project, quizzes, plus a full
//  teaching pack (session plan, visual & video requirements, worksheet,
//  assessment rubric, teacher notes and parent-engagement activities).
// =====================================================================
import { ChapterSpec, GradeSpec, ModuleSpec } from './curriculum';

type Band = 'A' | 'B' | 'C';

// ---------------------------------------------------------------------
// Shared helpers — reduce boilerplate for the repetitive teaching pack.
// ---------------------------------------------------------------------
function rubric(skill: string): string[] {
  return [
    `Understanding of "${skill}" — Beginning: recalls with help · Proficient: explains in own words · Advanced: explains AND gives a fresh real-life example.`,
    `Participation — Beginning: watches · Proficient: joins the activity · Advanced: leads/helps teammates.`,
    `Hands-on task — Beginning: incomplete · Proficient: working result · Advanced: working result + a creative twist.`,
    `Communication — Beginning: one-word answers · Proficient: clear explanation · Advanced: confident demo or presentation.`,
    `AI mindset (curiosity + ethics) — Beginning: follows steps · Proficient: asks "why" · Advanced: questions fairness/impact of the AI.`,
  ];
}

function parentPack(topic: string, homeTask: string): string[] {
  return [
    `Dinner-table talk: ask your child "Where did you spot ${topic} today?" and share one example of your own.`,
    `Together at home: ${homeTask}`,
    `Praise the thinking, not just the answer — ask "How did you figure that out?"`,
    `Screen-time swap: turn 15 minutes of watching into 15 minutes of making/observing AI.`,
  ];
}

// Band-specific phrasing used throughout.
const TOOL: Record<Band, string> = {
  A: 'unplugged games, drawings and storytelling (no computer needed)',
  B: 'Scratch and Google Teachable Machine (drag-and-drop, no typing code)',
  C: 'Python in Google Colab plus Teachable Machine for fast prototyping',
};
const LEARNER: Record<Band, string> = { A: 'AI Explorer', B: 'AI Creator', C: 'AI Innovator' };
const DIFF: Record<Band, ChapterSpec['difficulty']> = { A: 'beginner', B: 'beginner', C: 'intermediate' };
const EST: Record<Band, number> = { A: 45, B: 60, C: 75 };

// ---------------------------------------------------------------------
// THE 12-WEEK ROADMAP. Each entry is a function (band) => ChapterSpec.
// ---------------------------------------------------------------------
type WeekBuilder = (band: Band) => ChapterSpec;

const week1: WeekBuilder = (band) => ({
  title: 'Week 1 · Meet AI — The Smart Helper All Around Us',
  weekLabel: 'Week 1 · Sessions 1–2 · AI Awareness',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Discover what Artificial Intelligence is, where it already lives in our daily life, and how it is different from an ordinary machine.',
  hook: 'When you say "Hey Google, play a song" and music starts — who understood you? No human was listening. A machine did. How can a machine understand a human?',
  story: 'Meet ARIA, a curious little robot who just woke up in your classroom. ARIA cannot do anything yet — she has no knowledge. Every week of this course, YOU will teach ARIA a new super-power: to see, to listen, to talk, to create and to be fair. By Week 12, ARIA will be your team\'s very own AI. Today, ARIA only wants to know one thing: "What am I?"',
  layman: 'Artificial Intelligence (AI) means making machines smart enough to do things that normally need human thinking — like recognising a face, understanding speech, or suggesting the next video. A normal machine (like a fan) only does ONE fixed job. An AI machine can learn and make choices.',
  analogies: [
    { concept: 'AI vs ordinary machine', analogy: 'A calculator vs a coach', explanation: 'A calculator always gives the same answer to 2+2. A coach watches you, learns your weak spots, and changes the plan — that "learning and deciding" is what AI adds.' },
    { concept: 'What "intelligence" means', analogy: 'A baby learning words', explanation: 'A baby is not born knowing "dog"; it learns by seeing many dogs. AI learns the same way — from lots of examples.' },
  ],
  concept: 'AI is the science of building machines that can perform tasks that usually require human intelligence: perceiving (seeing/hearing), reasoning, learning from data, and making decisions. The key idea is LEARNING FROM EXAMPLES rather than following only fixed instructions.',
  didYouKnow: [
    'The phrase "Artificial Intelligence" was first used in 1956 at a meeting in Dartmouth College.',
    'Your phone uses AI dozens of times a day — unlocking with your face, predicting the next word you type, sorting your photos.',
    'AI does NOT think or feel like a human — it finds patterns in data very, very fast.',
  ],
  howItWorks: [
    'A human gives the machine lots of examples (this is called DATA).',
    'The machine looks for patterns inside the examples.',
    'It builds a "rule of thumb" called a MODEL.',
    'When it sees something new, it uses the model to make a guess (a PREDICTION).',
    'We check the guess and give feedback so it can improve.',
  ],
  realWorld: [
    'Voice assistants (Alexa, Google Assistant, Siri) understanding what you say.',
    'YouTube/Netflix recommending what to watch next.',
    'Google Maps predicting traffic and the fastest route.',
    'Cameras that put a box around faces.',
  ],
  industryScenarios: [
    { company: 'Google', useCase: 'Gmail suggests "Smart Replies" by predicting how you might answer an email.', impact: 'Saves users billions of typed words every year.' },
    { company: 'ISRO / weather agencies', useCase: 'AI models help predict cyclone paths from satellite data.', impact: 'Early warnings save lives and crops.' },
  ],
  activities: [{
    title: band === 'A' ? 'AI Detective Hunt' : 'AI Spotting Challenge',
    duration: '20 minutes',
    materials: ['Worksheet / notebook', 'Pencil', band === 'A' ? 'Picture cards of gadgets' : 'A phone or tablet (teacher-controlled) to demo'],
    steps: [
      'In teams, list 10 machines you used or saw today.',
      'Sort them into two columns: "Just follows fixed rules" vs "Seems to learn / decide".',
      'For each AI one, write WHAT it does that feels smart.',
      'Share with the class and build one big "AI all around us" wall.',
    ],
    expected: 'Each team can name at least 5 real AI examples and explain why they are AI and not ordinary machines.',
  }],
  miniProject: {
    title: 'My AI Diary — Day 1',
    description: 'Start a personal "AI Diary" you will add to every week. Today, record where AI shows up in your own life.',
    time: '15 minutes',
    materials: ['A notebook or digital doc', 'Coloured pens'],
    steps: [
      'Draw your daily routine from morning to night.',
      'Put a 🤖 sticker/star next to every moment AI helped you.',
      'Write one sentence: "AI helped me by ___".',
      'Decorate the cover and name your diary.',
    ],
    expectedOutput: 'A decorated AI Diary with at least 5 marked AI moments — the first entry of a 12-week journey.',
    extensions: ['Interview a family member about AI they use.', 'Add a "robot of the future" sketch you wish existed.'],
  },
  logic: 'Computational thinking starts with PATTERN RECOGNITION. Sorting machines into "fixed-rule" vs "learning" trains your brain to spot the single most important AI idea: learning from examples.',
  sessionPlan: [
    'Hook (5 min): Play a short voice-assistant clip / do the "Hey Google" demo and ask "who understood you?"',
    'Story (5 min): Introduce ARIA the classroom robot and the 12-week mission.',
    'Concept (10 min): AI vs ordinary machine using the calculator-vs-coach analogy.',
    'Activity (20 min): AI Detective Hunt in teams + class AI wall.',
    'Project kick-off (10 min): Start the AI Diary.',
    'Wrap & quiz (5 min): Quick oral quiz + exit ticket "AI is ___".',
  ],
  visualRequirements: [
    'A bright "AI all around us" poster (phone, car, TV, hospital, farm).',
    'Two-column chart: "Fixed-rule machine" vs "Learning machine".',
    'A friendly robot mascot (ARIA) printed for the class wall.',
  ],
  videoRequirements: [
    'A 2–3 min kid-friendly "What is AI?" explainer (teacher-previewed).',
    'A short clip of a voice assistant answering questions.',
  ],
  worksheet: [
    'Circle the pictures that use AI (mix of fan, smart-watch, bicycle, voice speaker, etc.).',
    'Match the AI to its job (Maps → finds routes, Camera → finds faces…).',
    'Fill in: "AI is a machine that can ____ and ____."',
    'Draw one AI helper you wish you had and label what it does.',
  ],
  assessmentRubric: rubric('What is AI'),
  teacherNotes: [
    `This band uses ${TOOL[band]}.`,
    'Keep it concrete — always start from a gadget the child already knows.',
    'Common misconception: "AI is a robot body". Clarify AI is the smart brain/software; it may have no body.',
    'Differentiation: struggling learners describe AI orally; advanced learners explain "learning from examples".',
  ],
  parentEngagement: parentPack('AI', 'spot 3 AI features on the family phone and let your child explain each one'),
  diagram: 'flow',
  facts: [
    'There are more connected smart devices on Earth than there are people.',
    'AI can read a medical scan in seconds — but a doctor still makes the final decision.',
    'The first chatbot, ELIZA, was built in 1966 and pretended to be a therapist.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'Which of these is the BEST example of AI?', options: ['A ceiling fan', 'A voice assistant that answers questions', 'A bicycle', 'A pencil'], answer: 'A voice assistant that answers questions', explanation: 'It understands speech and decides a reply — that needs intelligence.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'How does AI mainly become smart?', options: ['By magic', 'By learning from many examples (data)', 'By being painted', 'By being heavy'], answer: 'By learning from many examples (data)', explanation: 'AI finds patterns in data.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'In one line, how is an AI machine different from a normal machine?', answer: 'An AI machine can learn and decide; a normal machine only follows fixed steps.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'A toaster always toasts for the same time. Is it AI? Why?', options: ['Yes', 'No'], answer: 'No', explanation: 'It follows one fixed rule and never learns.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Name one job you would love an AI to do for you and one job you would NEVER give to an AI. Explain.', answer: 'Open-ended', explanation: 'Builds early judgement about where AI should and should not be used.', difficulty: 'intermediate' },
  ],
});

const week2: WeekBuilder = (band) => ({
  title: 'Week 2 · Data — The Food That Makes AI Smart',
  weekLabel: 'Week 2 · Sessions 3–4 · Data Literacy',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Understand what data is, why AI needs lots of good examples, and how messy or unfair data leads to a "confused" AI.',
  hook: 'If you only ever saw photos of golden dogs, would you recognise a black dog? AI has the exact same problem — it only knows what it has seen.',
  story: 'ARIA wants to recognise fruits. You show her 50 apples — and she gets great at apples! Then you show her a banana and she shouts "APPLE!". ARIA did not fail because she is dumb; she failed because she was only ever FED apples. Today we learn the most important AI rule: AI is only as good as the data it eats.',
  layman: 'Data is information — pictures, numbers, sounds, words. AI learns from data the way you learn from examples. Good, varied, fair data → a smart AI. Too little or one-sided data → a confused, unfair AI.',
  analogies: [
    { concept: 'Data is food', analogy: 'Healthy diet vs junk food', explanation: 'Feed AI a balanced "diet" of varied examples and it grows strong and fair. Feed it junk (one-sided data) and it gets unhealthy guesses.' },
    { concept: 'Labels', analogy: 'Name tags at a party', explanation: 'A label tells the AI what each example IS ("this is a cat"). Without name tags, it cannot learn who is who.' },
  ],
  concept: 'Data is the raw information AI learns from. Labelled data (each example tagged with the right answer) is used to TRAIN models. The quantity, quality, variety and fairness of data directly decide how good — and how fair — the AI becomes. "Garbage in, garbage out."',
  didYouKnow: [
    'Big AI models learn from billions of examples.',
    'Cleaning and labelling data is one of the most important AI jobs in the world.',
    'If data is one-sided, the AI becomes biased — even though it was not "trying" to be unfair.',
  ],
  howItWorks: [
    'Collect examples (images, text, numbers, sound).',
    'Clean them — remove mistakes, duplicates and blurry data.',
    'Label them — tag each example with the correct answer.',
    'Split them — most for training, some kept aside for testing.',
    'Feed the training data to the model so it can find patterns.',
  ],
  realWorld: [
    'Spam filters learn from millions of "spam" vs "not spam" emails.',
    'Self-driving cars learn from millions of road images.',
    'A music app learns your taste from the songs you play and skip.',
  ],
  activities: [{
    title: 'Sort the Data Game',
    duration: '20 minutes',
    materials: ['Picture/word cards (animals, fruits, vehicles)', 'Two boxes/labels', 'Worksheet'],
    steps: [
      'As a class, agree on two labels (e.g. "Cat" vs "Not Cat").',
      'Each student gets cards and places them under the correct label — this is LABELLING.',
      'Teacher sneaks in tricky cards (a tiger, a toy cat) to spark debate.',
      'Discuss: which cards were hard? That is exactly where AI gets confused.',
    ],
    expected: 'Students can label a small dataset and explain why varied examples make AI smarter.',
  }],
  miniProject: {
    title: 'Build a Tiny Dataset',
    description: band === 'C'
      ? 'Collect and label your own 20-image dataset of two classes (e.g. "thumbs-up" vs "thumbs-down") ready for training next week.'
      : 'Create a labelled picture-set of two things you want ARIA to tell apart.',
    time: '20 minutes',
    materials: ['Camera/phone or magazine cut-outs', 'Folders or envelopes labelled by class', 'Notebook'],
    steps: [
      'Choose two clear categories that are easy to tell apart.',
      'Collect at least 10 varied examples of each (different angles, colours, backgrounds).',
      'Label every example correctly.',
      'Spot and remove any blurry or wrong examples.',
      'Write why variety in your examples will help ARIA.',
    ],
    expectedOutput: 'A clean, labelled mini-dataset of two categories, saved for training in Week 4.',
    extensions: ['Add a tricky "edge case" and predict if AI will struggle.', 'Count how balanced your two classes are.'],
  },
  logic: 'Decomposition + classification: breaking the world into labelled categories is how both humans and AI organise knowledge. Balanced data = fair patterns; this is the seed of AI ethics.',
  sessionPlan: [
    'Hook (5 min): Apple-only ARIA story → why did she fail?',
    'Concept (10 min): Data as food; labels as name tags.',
    'Activity (20 min): Sort the Data Game with tricky cards.',
    'Project (20 min): Build a Tiny Dataset in pairs.',
    'Reflect & quiz (10 min): "Good data is ___, ___ and ___." + exit ticket.',
  ],
  visualRequirements: [
    'Poster: "Data → Train → Model → Predict" pipeline.',
    'Balanced vs unbalanced dataset cartoon (lots of apples, one banana).',
    'A "label = name tag" graphic.',
  ],
  videoRequirements: [
    'Short clip on how spam filters learn from examples.',
    '1-min explainer on data labelling jobs.',
  ],
  worksheet: [
    'Label these 8 examples with the correct category.',
    'Tick the dataset that is "fair/varied" and cross the one that is one-sided.',
    'Why might an AI trained only on sunny-day photos fail at night? Write 1–2 lines.',
    'Design a balanced dataset: list how many examples of each class you would collect.',
  ],
  assessmentRubric: rubric('Data and labels'),
  teacherNotes: [
    `Hands-on tool for this band: ${TOOL[band]}.`,
    'Anchor "bias" gently: one-sided data → unfair guesses (full ethics in Week 8).',
    'Emphasise variety over volume for young learners.',
    'Differentiation: Band A labels pictures; Band C discusses train/test split and balance.',
  ],
  parentEngagement: parentPack('data', 'help your child collect 10 varied photos of one object and talk about why variety matters'),
  diagram: 'flow',
  facts: [
    'A single self-driving car can generate terabytes of data in one day.',
    'Wikipedia and millions of books are used as text data to train language AIs.',
    '"Data cleaning" can take up to 80% of an AI project\'s time.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'What does AI learn from?', options: ['Data (examples)', 'Sunlight', 'Electric shocks', 'Nothing'], answer: 'Data (examples)', explanation: 'Examples = data.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A label in a dataset is like…', options: ['A name tag telling the right answer', 'A price', 'A password', 'A song'], answer: 'A name tag telling the right answer', explanation: 'Labels give the correct answer for each example.', difficulty: 'beginner' },
    { qtype: 'logical', prompt: 'You train a fruit AI ONLY on apples. What happens with a banana?', options: ['It says "banana"', 'It may wrongly say "apple"', 'It explodes', 'Nothing'], answer: 'It may wrongly say "apple"', explanation: 'It only knows what it has seen.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Complete the famous AI saying: "Garbage in, ____ out."', answer: 'garbage', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'You want an AI to recognise YOUR pet. List 3 ways to make your dataset varied and fair.', answer: 'Open-ended (different angles, lighting, backgrounds)', explanation: 'Variety reduces bias and improves accuracy.', difficulty: 'advanced' },
  ],
});

const week3: WeekBuilder = (band) => ({
  title: 'Week 3 · Machine Learning — Teaching by Example',
  weekLabel: 'Week 3 · Sessions 5–6 · ML Foundations',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Learn how machines "learn" patterns from data and the three big styles: supervised, unsupervised and learning-by-reward.',
  hook: 'Nobody wrote a rule "a cat has pointy ears AND whiskers AND…". So how does an app know a cat from a dog? It learned the pattern itself.',
  story: 'ARIA looks at 100 photos of cats and 100 of dogs. Slowly she notices: cats and dogs differ in ear shape, face length, the way they sit. Nobody told her these rules — she discovered the PATTERN. That discovery is Machine Learning, and today you become ARIA\'s teacher.',
  layman: 'Machine Learning (ML) is the part of AI where the machine learns patterns from examples instead of being given every rule. Show it labelled examples and it figures out the rule by itself.',
  analogies: [
    { concept: 'Supervised learning', analogy: 'Learning with flashcards and answers', explanation: 'You see the question AND the right answer many times, then you can answer new ones.' },
    { concept: 'Unsupervised learning', analogy: 'Sorting a mixed Lego box into groups', explanation: 'No labels given — you group similar pieces by yourself.' },
    { concept: 'Reinforcement learning', analogy: 'Training a puppy with treats', explanation: 'Good move → treat (reward); bad move → no treat. It learns to repeat what earns rewards.' },
  ],
  concept: 'Machine Learning: algorithms that improve at a task by learning patterns from data. Three main types — (1) Supervised: learns from labelled examples to predict; (2) Unsupervised: finds hidden groups in unlabelled data; (3) Reinforcement: learns by trial-and-error using rewards.',
  didYouKnow: [
    'The term "Machine Learning" was coined by Arthur Samuel in 1959 while teaching a computer to play checkers.',
    'Reinforcement learning taught a computer to beat world champions at the game Go.',
    'Most AI you use daily is supervised learning.',
  ],
  howItWorks: [
    'Pick a task (e.g. tell cats from dogs).',
    'Feed labelled examples (supervised) to the algorithm.',
    'The algorithm adjusts itself to reduce mistakes — this is TRAINING.',
    'It forms a MODEL that captures the pattern.',
    'Test on new, unseen examples to measure accuracy.',
  ],
  realWorld: [
    'Supervised: email spam detection, handwriting recognition.',
    'Unsupervised: grouping customers with similar shopping habits.',
    'Reinforcement: game-playing bots, robots learning to walk.',
  ],
  industryScenarios: [
    { company: 'Netflix', useCase: 'Groups viewers with similar taste (unsupervised) to recommend shows.', impact: 'Drives most of what people choose to watch.' },
    { company: 'DeepMind (Google)', useCase: 'Used reinforcement learning so an AI mastered the game of Go.', impact: 'A landmark moment in AI history.' },
  ],
  activities: [{
    title: band === 'A' ? 'Be the Robot: Pattern Game' : 'Human Machine-Learning Game',
    duration: '20 minutes',
    materials: ['Flashcards with shapes/animals + labels', 'Mystery cards', 'Worksheet'],
    steps: [
      'One student is the "model". Show them 10 labelled cards (this is training).',
      'Hide the labels and show new cards — the "model" must predict.',
      'Class checks each prediction and gives feedback.',
      'Discuss what made predictions better — more/varied training cards!',
    ],
    expected: 'Students physically experience training → predicting → improving with feedback.',
  }],
  miniProject: {
    title: 'Design an ML Recipe',
    description: 'Plan (on paper) how you would teach a machine to do a task of your choice — choosing the right ML type.',
    time: '20 minutes',
    materials: ['Worksheet', 'Pens'],
    steps: [
      'Pick a task (e.g. "sort recyclables", "win a maze game").',
      'Decide which ML type fits: supervised, unsupervised or reinforcement.',
      'List the data you would need.',
      'Describe how the machine would learn and how you would test it.',
      'Present your "ML recipe" to the class.',
    ],
    expectedOutput: 'A one-page ML plan with the correct learning type and a clear data + testing idea.',
    extensions: ['Find a real product that uses your chosen ML type.', 'Predict one way it could go wrong.'],
  },
  logic: 'Abstraction: ML replaces hand-written rules with learned patterns. Choosing supervised vs unsupervised vs reinforcement is a decision-making skill — match the method to the problem.',
  sessionPlan: [
    'Hook (5 min): "Who wrote the cat rule?" puzzle.',
    'Concept (12 min): Three ML types with flashcards / Lego / puppy analogies.',
    'Activity (20 min): Human Machine-Learning Game.',
    'Project (18 min): Design an ML Recipe + share.',
    'Quiz & wrap (5 min): Match ML type to example.',
  ],
  visualRequirements: [
    'Triptych poster: Supervised | Unsupervised | Reinforcement with icons.',
    'Flowchart: Train → Model → Predict → Feedback loop.',
  ],
  videoRequirements: [
    'Short clip of a robot learning to walk via reinforcement.',
    '2-min "supervised vs unsupervised" kid explainer.',
  ],
  worksheet: [
    'Match each example to its ML type (3 examples each).',
    'Circle which type uses labels.',
    'Fill the loop: Train → ____ → Predict → ____.',
    'Write your own example for each of the three ML types.',
  ],
  assessmentRubric: rubric('Machine Learning types'),
  teacherNotes: [
    `Tooling for this band: ${TOOL[band]}.`,
    'Keep "reinforcement" playful (puppy + treats) for younger learners.',
    'Stress: ML = learning patterns, not memorising every case.',
    'Differentiation: Band C can sketch a simple decision boundary; Band A stays with the physical game.',
  ],
  parentEngagement: parentPack('learning by example', 'teach your child a small skill (folding, a card trick) and discuss how examples + feedback = learning, just like ML'),
  diagram: 'design_thinking',
  facts: [
    'A checkers program in 1959 was one of the first programs to "learn".',
    'AlphaGo studied millions of moves, then improved by playing itself.',
    'Spam filters get better every time you mark an email as spam.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'Machine Learning means the machine…', options: ['Is given every rule by a human', 'Learns patterns from examples', 'Never changes', 'Only adds numbers'], answer: 'Learns patterns from examples', explanation: 'It learns rather than being fully programmed.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Learning from labelled examples is called…', options: ['Supervised learning', 'Unsupervised learning', 'Sleeping', 'Reinforcement learning'], answer: 'Supervised learning', explanation: 'Labels = supervision.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Training a puppy with treats is most like…', options: ['Reinforcement learning', 'Supervised learning', 'Unsupervised learning', 'No learning'], answer: 'Reinforcement learning', explanation: 'Rewards guide behaviour.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What do we call the pattern an ML algorithm learns?', answer: 'A model.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'You have lots of customer data but NO labels and want to find shopper "groups". Which ML type fits and why?', answer: 'Unsupervised learning', explanation: 'It finds groups without labels.', difficulty: 'advanced' },
  ],
});

const week4: WeekBuilder = (band) => ({
  title: 'Week 4 · Train Your First Model',
  weekLabel: 'Week 4 · Sessions 7–8 · First Model (Hands-on)',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Use your Week-2 dataset to actually train a working image/sound classifier and test how accurate it is.',
  hook: 'Today you stop just learning ABOUT AI — you BUILD one. In 15 minutes you will have a working AI that recognises something YOU chose.',
  story: 'ARIA is ready. You feed her the labelled dataset you built in Week 2. You press "Train". A progress bar fills… and then ARIA opens her camera-eyes, looks at you and says "Thumbs UP!" — correctly. You just trained your first AI model. The class erupts.',
  layman: band === 'C'
    ? 'You will train a model with Google Teachable Machine (drag-and-drop) and also peek at a few lines of Python that do the same thing, so you see what is happening under the hood.'
    : 'You will train a model with Google Teachable Machine — show examples to the computer\'s camera, press Train, then test it live. No coding needed.',
  analogies: [
    { concept: 'Training', analogy: 'Practising free-throws', explanation: 'The more good practice shots (examples), the better your aim (accuracy).' },
    { concept: 'Accuracy', analogy: 'A test score', explanation: 'If the model gets 9/10 new examples right, its accuracy is 90%.' },
  ],
  concept: 'Training a model means feeding labelled data so the algorithm tunes itself to map inputs → correct outputs. We then evaluate on UNSEEN data and report ACCURACY (correct predictions ÷ total). More balanced, varied data usually raises accuracy.',
  didYouKnow: [
    'Teachable Machine, made by Google, lets anyone train an AI in a web browser for free.',
    'A model can look perfect on training data yet fail on new data — that is called overfitting.',
    'Testing on data the model never saw is the only honest way to judge it.',
  ],
  howItWorks: [
    'Load your labelled classes (e.g. "Thumbs Up", "Thumbs Down").',
    'Add examples for each class (webcam or images).',
    'Press Train — the model learns the patterns.',
    'Test live with NEW inputs it never saw.',
    'Check accuracy; add more/better data to improve, then retrain.',
  ],
  realWorld: [
    'Quality-check cameras on factory lines spotting defective parts.',
    'Apps that identify plants or birds from a photo.',
    'Sign-language to text translators.',
  ],
  industryScenarios: [
    { company: 'PlantVillage / agritech', useCase: 'Farmers photograph a leaf; a trained model flags the disease.', impact: 'Protects crops and incomes for small farmers.' },
  ],
  code: band === 'C' ? {
    language: 'python',
    code: '# A tiny taste of what Teachable Machine does under the hood\n# (run in Google Colab after exporting your model)\nfrom keras.models import load_model\nimport numpy as np\n\nmodel = load_model("keras_model.h5")          # your trained model\nlabels = ["Thumbs Up", "Thumbs Down"]\n\nprediction = model.predict(image_array)        # image -> probabilities\nbest = int(np.argmax(prediction))\nprint("AI says:", labels[best], round(float(prediction[0][best])*100), "% sure")',
    note: 'You do NOT need to memorise this — just see that "predict" turns an image into probabilities for each class.',
  } : undefined,
  activities: [{
    title: 'Train-Test-Improve Sprint',
    duration: '30 minutes',
    materials: ['Computer/tablet with internet', 'Google Teachable Machine (browser)', 'Your Week-2 dataset', 'Worksheet'],
    steps: [
      'Open Teachable Machine → Image (or Audio) project.',
      'Create your classes and add your examples.',
      'Press Train and wait for it to finish.',
      'Test with 10 NEW inputs; record how many it got right.',
      'Add more varied examples to the weak class and retrain — note the new score.',
    ],
    expected: 'A working classifier and a before/after accuracy comparison showing improvement after adding data.',
  }],
  miniProject: {
    title: 'My First AI Classifier',
    description: 'Build, test and demo a 2–3 class classifier of your choice and write down its accuracy.',
    time: '25 minutes',
    materials: ['Teachable Machine', 'Your dataset', 'AI Diary'],
    steps: [
      'Choose a fun, clear task (emotions, hand signs, objects).',
      'Train the model with balanced data.',
      'Test and record accuracy in your AI Diary.',
      'Improve it once and record the new accuracy.',
      'Demo it to a classmate and note one thing that confused it.',
    ],
    expectedOutput: 'A demoable AI classifier plus an AI-Diary entry with two accuracy scores and one "confusion" note.',
    extensions: band === 'C'
      ? ['Export the model and run the Python snippet in Colab.', 'Add a third class and see how accuracy changes.']
      : ['Add a third class.', 'Try to "trick" your model and explain why it failed.'],
  },
  logic: 'The train → test → improve loop is the engine of all AI engineering. Measuring accuracy on unseen data teaches honest evaluation and iteration.',
  sessionPlan: [
    'Recap (5 min): your Week-2 dataset is the fuel.',
    'Demo (8 min): teacher trains a quick model live.',
    'Build (30 min): Train-Test-Improve sprint in pairs.',
    'Project (20 min): My First AI Classifier + AI Diary entry.',
    'Showcase & quiz (12 min): two demos + accuracy quiz.',
  ],
  visualRequirements: [
    'Step poster: Add examples → Train → Test → Improve.',
    'Accuracy meter graphic (e.g. 70% → 90%).',
    'Screenshot guide of Teachable Machine buttons.',
  ],
  videoRequirements: [
    'Official 2-min "Teachable Machine in 2 minutes" walkthrough.',
    'Short clip of an AI plant/bird identifier in action.',
  ],
  worksheet: [
    'Write your two/three class names.',
    'Record accuracy BEFORE and AFTER adding data.',
    'What is overfitting in your own words?',
    'List two ways to improve a weak model.',
  ],
  assessmentRubric: rubric('Training and testing a model'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Pre-test internet + Teachable Machine on classroom devices.',
    'Encourage balanced examples per class to avoid bias toward the bigger class.',
    'Differentiation: Band A trains with teacher support; Band C inspects the exported model/code.',
    'No internet? Use the Week-3 "Be the Robot" game as an unplugged fallback.',
  ],
  parentEngagement: parentPack('training an AI', 'watch your child demo their classifier at home and try to find one input that fools it'),
  diagram: 'sensor',
  facts: [
    'Teachable Machine has been used to build hundreds of accessibility tools.',
    'Adding just a few hard examples can fix a stubborn mistake.',
    'A model trained on 50 balanced images can already be surprisingly good.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'After training, you must test the model on…', options: ['The same training data', 'New, unseen data', 'No data', 'A calculator'], answer: 'New, unseen data', explanation: 'Only unseen data gives an honest score.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Accuracy of "8 out of 10 correct" is…', options: ['80%', '8%', '100%', '18%'], answer: '80%', explanation: '8/10 = 80%.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A model perfect on training data but bad on new data is…', options: ['Overfitting', 'Perfect', 'Unsupervised', 'A robot'], answer: 'Overfitting', explanation: 'It memorised instead of learning the pattern.', difficulty: 'intermediate' },
    { qtype: 'tinkering', prompt: 'Your model confuses "thumbs up" with "thumbs down". Describe TWO data changes to fix it.', answer: 'Open-ended (add varied examples, different hands/lighting)', difficulty: 'advanced' },
    { qtype: 'oneliner', prompt: 'What loop do AI builders repeat to improve a model?', answer: 'Train → Test → Improve.', difficulty: 'beginner' },
  ],
});

const week5: WeekBuilder = (band) => ({
  title: 'Week 5 · Talking Machines — AI & Language (NLP)',
  weekLabel: 'Week 5 · Sessions 9–10 · Natural Language',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Explore how AI understands and generates human language, and build a simple chatbot.',
  hook: 'You type "i feel sad" and the app replies kindly. It has never met you. How does a machine understand feelings in words?',
  story: 'ARIA can now see. But she stays silent. You decide to teach her to talk. You show her how words carry meaning, how "happy" and "joyful" are cousins, and how to pick a good reply. Soon ARIA is chatting with the whole class — your first conversation with the AI you built.',
  layman: 'Natural Language Processing (NLP) is how AI works with human language — understanding what we say/type and replying. It breaks sentences into words, finds meaning and patterns, and chooses or generates a response.',
  analogies: [
    { concept: 'Tokenisation', analogy: 'Cutting a sentence into LEGO words', explanation: 'AI first chops text into small pieces (tokens) it can handle.' },
    { concept: 'Word meaning', analogy: 'A map of words', explanation: 'AI places similar-meaning words close together, so "king" and "queen" are near each other.' },
  ],
  concept: 'NLP lets machines process text and speech: tokenising (splitting into words), understanding meaning via patterns, classifying intent (what the user wants), and generating responses. Chatbots match user intent to suitable replies.',
  didYouKnow: [
    'Autocomplete and "next word" prediction are everyday NLP.',
    'Translation apps switch between 100+ languages using NLP.',
    'AI can detect the EMOTION (sentiment) behind a sentence.',
  ],
  howItWorks: [
    'Take the user\'s text.',
    'Tokenise it into words/pieces.',
    'Detect the intent (greeting, question, complaint…).',
    'Pick or generate a fitting reply.',
    'Send the reply and keep the conversation going.',
  ],
  realWorld: [
    'Customer-support chatbots on websites.',
    'Google Translate and live captions.',
    'Spam detection and email Smart Reply.',
  ],
  industryScenarios: [
    { company: 'Banks & telecoms', useCase: 'Chatbots answer common questions 24/7, routing hard ones to humans.', impact: 'Faster help and shorter queues for customers.' },
  ],
  code: band === 'C' ? {
    language: 'python',
    code: '# A tiny rule-based chatbot (intent matching)\nrules = {\n  "hi": "Hello! I am ARIA. How can I help?",\n  "your name": "I am ARIA, your class AI!",\n  "bye": "Goodbye! Keep being curious."\n}\n\ndef reply(text):\n    text = text.lower()\n    for key, answer in rules.items():\n        if key in text:\n            return answer\n    return "I am still learning that. Can you ask differently?"\n\nprint(reply("hi"))\nprint(reply("what is your name"))',
    note: 'Real chatbots learn replies from data, but this shows the core idea: match what the user means, then answer.',
  } : undefined,
  activities: [{
    title: band === 'A' ? 'Human Chatbot Role-Play' : 'Design-a-Chatbot Flow',
    duration: '25 minutes',
    materials: ['Cards with user messages', 'Worksheet / Scratch (Band B/C)', 'Sticky notes'],
    steps: [
      'List 6 things users might say to your bot.',
      'Write a good reply for each (define the bot\'s personality).',
      'Add one "I don\'t understand" fallback reply.',
      'Test by having a friend "chat" — improve weak replies.',
    ],
    expected: 'A small but coherent set of intent→reply pairs that handle real user messages, including a fallback.',
  }],
  miniProject: {
    title: 'Build ARIA the Chatbot',
    description: band === 'A'
      ? 'Make a paper/flip-card chatbot, or a simple Scratch talking sprite with at least 5 replies.'
      : band === 'B'
      ? 'Build a Scratch chatbot sprite that answers at least 6 questions and has a personality.'
      : 'Build a rule-based chatbot in Scratch or Python that handles 8+ intents and a fallback.',
    time: '25 minutes',
    materials: ['Scratch / Python / cards', 'Your intent list', 'AI Diary'],
    steps: [
      'Give your bot a name and personality.',
      'Add your intent→reply pairs.',
      'Always include a friendly fallback for unknown input.',
      'Test with classmates and fix confusing replies.',
      'Record in your AI Diary what it handled well and badly.',
    ],
    expectedOutput: 'A working chatbot that answers several questions, has personality, and fails gracefully.',
    extensions: ['Add emotion-aware replies.', 'Add a second language greeting.'],
  },
  logic: 'Pattern-matching + decision trees: mapping many inputs to suitable outputs is core computational thinking, and the fallback teaches handling the unknown.',
  sessionPlan: [
    'Hook (5 min): "i feel sad" reply demo.',
    'Concept (12 min): tokens, meaning map, intent → reply.',
    'Activity (25 min): Design-a-Chatbot flow.',
    'Project (25 min): Build ARIA the Chatbot.',
    'Demo & quiz (8 min): two live chats + quiz.',
  ],
  visualRequirements: [
    'Poster: Text → Tokens → Intent → Reply.',
    'Word-map graphic (similar words clustered).',
    'Chatbot conversation mock-up bubbles.',
  ],
  videoRequirements: [
    'Short clip of a translation app working live.',
    '2-min "how chatbots work" kid explainer.',
  ],
  worksheet: [
    'Split this sentence into tokens (words).',
    'Match each user message to the best reply.',
    'Write a fallback reply in your bot\'s voice.',
    'Design 3 new intent→reply pairs.',
  ],
  assessmentRubric: rubric('Language AI and chatbots'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Highlight that chatbots can be wrong/confident — keep humans in the loop.',
    'Keep replies kind and safe; discuss respectful language.',
    'Differentiation: Band A role-plays/Scratch; Band C codes intents + fallback.',
  ],
  parentEngagement: parentPack('language AI', 'use a translation app together and let your child explain how the AI guesses meaning'),
  diagram: 'flow',
  facts: [
    'The first chatbot ELIZA fooled people in 1966 with simple word tricks.',
    'Modern language models read more text than a person could in 1,000 lifetimes.',
    'AI can now caption videos live for people who are deaf or hard of hearing.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'NLP helps AI work with…', options: ['Human language', 'Only numbers', 'Only images', 'Electricity'], answer: 'Human language', explanation: 'NLP = Natural Language Processing.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Splitting a sentence into words is called…', options: ['Tokenising', 'Painting', 'Charging', 'Booting'], answer: 'Tokenising', explanation: 'Tokens are the pieces of text.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'A good chatbot should ALWAYS have a…', options: ['Fallback reply for unknown input', 'Loud alarm', 'Secret password', 'Camera'], answer: 'Fallback reply for unknown input', explanation: 'It must handle messages it does not understand.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do we call the user\'s purpose behind a message?', answer: 'The intent.', difficulty: 'intermediate' },
    { qtype: 'tinkering', prompt: 'Give your chatbot a personality in one line and write a matching greeting.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const week6: WeekBuilder = (band) => ({
  title: 'Week 6 · Eyes for AI — Computer Vision',
  weekLabel: 'Week 6 · Sessions 11–12 · Computer Vision',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Understand how AI "sees" images as numbers, and build a vision project like a face/object detector.',
  hook: 'Your camera draws a box around every face in a photo. But a photo is just coloured dots to a computer — so how does it find a face in the dots?',
  story: 'ARIA stares at a picture of your class. To her it is a giant grid of numbers — brightness values for tiny dots called pixels. You teach her to spot patterns of edges, then shapes, then faces. Suddenly ARIA points and says "I see 5 friends!" — and she is right.',
  layman: 'Computer Vision is how AI understands images and video. To a computer, an image is a grid of numbers (pixels). AI learns patterns — edges, shapes, textures — to recognise objects, faces and actions.',
  analogies: [
    { concept: 'Pixels', analogy: 'A mosaic made of tiny tiles', explanation: 'Zoom in and a photo is just many coloured tiles (pixels) — each is a number to the computer.' },
    { concept: 'Feature detection', analogy: 'Recognising a friend by their features', explanation: 'You spot eyes, nose, smile; AI spots edges and shapes that build up to "face".' },
  ],
  concept: 'Computer Vision turns images (grids of pixel numbers) into understanding. Models learn hierarchical features — edges → shapes → objects — to classify images, detect objects (boxes), and recognise faces or actions.',
  didYouKnow: [
    'A normal photo can have millions of pixels.',
    'Self-driving cars use vision to read signs and spot pedestrians.',
    'Doctors use vision AI to help spot problems in X-rays and scans.',
  ],
  howItWorks: [
    'The image becomes a grid of pixel numbers.',
    'Early layers detect simple edges and colours.',
    'Deeper layers combine them into shapes and parts.',
    'Final layers recognise whole objects/faces.',
    'The model outputs labels and/or boxes around what it finds.',
  ],
  realWorld: [
    'Face unlock on phones.',
    'Self-checkout that recognises products.',
    'Wildlife cameras counting animals automatically.',
  ],
  industryScenarios: [
    { company: 'Hospitals / med-tech', useCase: 'Vision models highlight suspicious regions in medical scans for doctors to review.', impact: 'Faster, earlier detection — with a human making the call.' },
  ],
  activities: [{
    title: band === 'A' ? 'Pixel Grid Colouring' : 'Become a Pixel Camera',
    duration: '25 minutes',
    materials: ['Grid worksheet (graph paper)', 'Coloured pencils', 'Camera/Teachable Machine (Band B/C)'],
    steps: [
      'Colour a small picture on a number grid — each square is a pixel.',
      'Swap with a friend and "decode" their grid back into the picture.',
      'Discuss: this is exactly how a computer stores an image.',
      'Band B/C: train a Teachable Machine image model to detect 2 objects.',
    ],
    expected: 'Students understand images = pixel grids and (B/C) build a small object detector.',
  }],
  miniProject: {
    title: 'AI Vision Spotter',
    description: band === 'A'
      ? 'Create a pixel-art object and a "spotting chart" of features ARIA should look for.'
      : 'Train and demo an image classifier/detector that recognises 2–3 objects or hand gestures.',
    time: '25 minutes',
    materials: ['Teachable Machine / grid paper', 'Objects to detect', 'AI Diary'],
    steps: [
      'Pick objects/gestures with clear differences.',
      'Collect varied images (angles, lighting, backgrounds).',
      'Train and test on new views.',
      'Note which object was hardest and why.',
      'Record accuracy in your AI Diary.',
    ],
    expectedOutput: 'A working vision project plus a note on its hardest case and accuracy.',
    extensions: ['Add a "nothing detected" class.', 'Test in low light and report results.'],
  },
  logic: 'Hierarchy & abstraction: simple features combine into complex understanding. Seeing an image as numbers is a powerful abstraction skill.',
  sessionPlan: [
    'Hook (5 min): face-box photo demo.',
    'Concept (12 min): pixels → edges → shapes → objects.',
    'Activity (25 min): Pixel grid / Become a Pixel Camera.',
    'Project (25 min): AI Vision Spotter.',
    'Demo & quiz (8 min): show detectors + quiz.',
  ],
  visualRequirements: [
    'Zoom-in poster showing a photo made of pixels.',
    'Layer diagram: edges → shapes → object.',
    'Bounding-box example image.',
  ],
  videoRequirements: [
    'Short clip of object detection drawing live boxes.',
    '2-min "how computers see" explainer.',
  ],
  worksheet: [
    'Decode a small pixel grid into a picture.',
    'Label the layers: edges, shapes, object.',
    'List 3 places face/vision AI is used.',
    'Why might vision AI fail in the dark? Write 1–2 lines.',
  ],
  assessmentRubric: rubric('Computer Vision'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Privacy: get consent before using students\' faces; offer object/gesture alternatives.',
    'Connect to bias: vision AI can be unfair if trained on narrow data (links to Week 8).',
    'Differentiation: Band A stays unplugged; Band C trains + discusses features.',
  ],
  parentEngagement: parentPack('computer vision', 'use a photo app that groups faces/objects and let your child explain how it might work'),
  diagram: 'chart',
  facts: [
    'The human eye inspired the design of vision AI "layers".',
    'Vision AI helps farmers count fruit on trees from drone photos.',
    'Some apps translate sign language using computer vision.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'To a computer, an image is a grid of…', options: ['Pixels (numbers)', 'Smells', 'Sounds', 'Magnets'], answer: 'Pixels (numbers)', explanation: 'Each pixel is a number.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Drawing a box around an object in an image is called…', options: ['Object detection', 'Tokenising', 'Charging', 'Sorting'], answer: 'Object detection', explanation: 'Detection locates objects with boxes.', difficulty: 'intermediate' },
    { qtype: 'mcq', prompt: 'Which is a Computer Vision use?', options: ['Face unlock', 'Adding two numbers', 'Boiling water', 'Ringing a bell'], answer: 'Face unlock', explanation: 'It recognises a face from an image.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What is the tiny dot that makes up an image called?', answer: 'A pixel.', difficulty: 'beginner' },
    { qtype: 'brain_teaser', prompt: 'Your face-AI works in daylight but fails at night. Suggest TWO data fixes.', answer: 'Open-ended (add low-light images, varied lighting)', difficulty: 'advanced' },
  ],
});

const week7: WeekBuilder = (band) => ({
  title: 'Week 7 · Creative AI — Generative AI',
  weekLabel: 'Week 7 · Sessions 13–14 · Generative AI',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Discover how AI can create new text, images, music and ideas — and how to "prompt" it well and responsibly.',
  hook: 'Type "a cat astronaut riding a bicycle on the moon" and an image appears that never existed before. The AI did not copy it — it imagined it. How?',
  story: 'ARIA has learned to see, listen and talk. Now she wants to CREATE. You give her a few words and she paints a picture; you give her a theme and she writes a poem. ARIA has become a creative partner — but you learn she sometimes makes things up, so you must always check her work.',
  layman: 'Generative AI creates new content — text, pictures, music, code — by learning patterns from huge amounts of examples and then producing something new in that style. You guide it with instructions called PROMPTS.',
  analogies: [
    { concept: 'Generation', analogy: 'A jazz musician improvising', explanation: 'After hearing thousands of songs, a musician can create new tunes in that style — generative AI does the same with data.' },
    { concept: 'Prompting', analogy: 'Ordering at a restaurant', explanation: 'The clearer your order (prompt), the closer the dish (output) is to what you wanted.' },
  ],
  concept: 'Generative AI learns the patterns of a domain from massive data and produces novel outputs (text, images, audio, code). It is steered by PROMPTS. It can be creative and helpful but may "hallucinate" (state confident but false things), so outputs must be verified.',
  didYouKnow: [
    'Generative image tools can make a picture in seconds from a sentence.',
    'AI can write stories, but it sometimes invents fake "facts" — always check.',
    'Good prompting is becoming a real, paid skill.',
  ],
  howItWorks: [
    'The model learns patterns/style from huge datasets.',
    'You give a prompt describing what you want.',
    'The model predicts, piece by piece, a fitting new output.',
    'You refine the prompt to improve the result.',
    'You FACT-CHECK and edit before using it.',
  ],
  realWorld: [
    'Drafting emails, stories, and study notes.',
    'Creating artwork, logos and game assets.',
    'Helping write and explain code.',
  ],
  industryScenarios: [
    { company: 'Design & media studios', useCase: 'Artists generate quick concept images, then refine the best by hand.', impact: 'Speeds up brainstorming dramatically.' },
  ],
  activities: [{
    title: 'Prompt Engineering Lab',
    duration: '25 minutes',
    materials: ['Teacher-controlled generative tool OR prompt cards', 'Worksheet'],
    steps: [
      'Write a vague prompt and a detailed prompt for the same idea.',
      'Compare results (or predict them for Band A).',
      'Add details: style, mood, colours, length.',
      'Pick the best prompt and explain WHY it worked.',
    ],
    expected: 'Students can turn a vague request into a clear, detailed prompt and judge output quality.',
  }],
  miniProject: {
    title: 'Create with AI — Responsibly',
    description: 'Use (or storyboard) generative AI to create a short story + matching illustration on a chosen theme, then fact-check and credit it.',
    time: '25 minutes',
    materials: ['Generative tool (teacher-guided) or paper', 'AI Diary'],
    steps: [
      'Pick a theme (e.g. "a kind robot saves a forest").',
      'Write a detailed prompt; generate or draw the result.',
      'Improve it with one better prompt.',
      'Fact-check anything that claims to be true.',
      'Add a note: "Made with AI help" + what you changed.',
    ],
    expectedOutput: 'An AI-assisted creative piece WITH a fact-check note and honest "made with AI" credit.',
    extensions: ['Generate two styles and compare.', 'Find one "hallucination" and correct it.'],
  },
  logic: 'Iteration & critical thinking: refining prompts is a feedback loop, and verifying outputs builds healthy scepticism toward confident-sounding AI.',
  sessionPlan: [
    'Hook (5 min): "cat astronaut" image demo.',
    'Concept (12 min): generation + prompting + hallucination.',
    'Activity (25 min): Prompt Engineering Lab.',
    'Project (25 min): Create with AI — Responsibly.',
    'Share & quiz (8 min): gallery walk + quiz.',
  ],
  visualRequirements: [
    'Before/after poster: vague prompt vs detailed prompt outputs.',
    '"Always fact-check AI" warning poster.',
    'Prompt-recipe card (subject + style + details).',
  ],
  videoRequirements: [
    'Short, school-safe clip of text-to-image generation.',
    '2-min "what is generative AI / hallucination" explainer.',
  ],
  worksheet: [
    'Rewrite a vague prompt into a detailed one.',
    'Spot the "hallucination" in a given AI answer.',
    'List 3 things to add to improve a prompt.',
    'Write a "made with AI" credit line for your work.',
  ],
  assessmentRubric: rubric('Generative AI and prompting'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}; keep generative tools teacher-controlled for younger bands.`,
    'Stress honesty: always disclose AI help and verify facts.',
    'Discuss copyright/originality at an age-appropriate level.',
    'Differentiation: Band A storyboards prompts; Band C compares prompt strategies.',
  ],
  parentEngagement: parentPack('creative AI', 'co-create a short story with an AI tool and talk about what to fact-check'),
  diagram: 'design_thinking',
  facts: [
    'Generative AI can compose music in the style of famous artists.',
    '"Hallucination" is the word for when AI confidently makes things up.',
    'The same prompt can give different results each time.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'Generative AI mainly…', options: ['Creates new content', 'Only deletes files', 'Only adds numbers', 'Charges phones'], answer: 'Creates new content', explanation: 'It generates text, images, audio, etc.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'The instruction you give a generative AI is called a…', options: ['Prompt', 'Pixel', 'Token jar', 'Battery'], answer: 'Prompt', explanation: 'Prompts steer the output.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'When AI confidently states something false, it is called a…', options: ['Hallucination', 'Promotion', 'Reflection', 'Connection'], answer: 'Hallucination', explanation: 'Always verify AI outputs.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Why should you fact-check generative AI?', answer: 'Because it can make things up (hallucinate).', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write a detailed prompt for an image of your dream classroom (include style, colours, mood).', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const week8: WeekBuilder = (band) => ({
  title: 'Week 8 · Fair & Safe AI — Ethics and Bias',
  weekLabel: 'Week 8 · Sessions 15–16 · AI Ethics',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Learn how AI can be unfair, why privacy matters, and how to build and use AI responsibly.',
  hook: 'An AI hiring tool quietly rejected many women — nobody told it to. Where did the unfairness come from?',
  story: 'ARIA is powerful now. But one day she makes an unfair call — she learned it from one-sided data. The class holds a "Council of Fairness". You write ARIA\'s rules: be fair, respect privacy, be honest, keep a human in charge. ARIA becomes not just smart, but GOOD.',
  layman: 'AI ethics is about using AI in fair, safe and honest ways. AI learns from data, so if the data is biased, the AI becomes biased too. We must protect privacy, avoid harm, be transparent, and keep humans responsible.',
  analogies: [
    { concept: 'Bias from data', analogy: 'A mirror', explanation: 'AI reflects the data it is shown. A crooked mirror (biased data) gives a crooked picture.' },
    { concept: 'Privacy', analogy: 'A diary lock', explanation: 'Your personal data is like a private diary — it should not be shared or used without permission.' },
  ],
  concept: 'AI ethics covers fairness (avoiding bias), privacy (protecting personal data), transparency (explaining decisions), accountability (humans remain responsible) and safety. Bias usually enters through unbalanced or unfair training data.',
  didYouKnow: [
    'AI has wrongly identified people because it was trained on narrow data.',
    'Many countries are writing laws to keep AI fair and safe.',
    'Removing bias starts with collecting balanced, representative data.',
  ],
  howItWorks: [
    'Check the data: is it balanced and representative?',
    'Test the model across different groups for fairness.',
    'Protect personal data — collect only what you need, with consent.',
    'Make decisions explainable.',
    'Keep a human reviewing important AI decisions.',
  ],
  realWorld: [
    'Fair vs unfair loan/job screening tools.',
    'Privacy settings that control your data.',
    'Deepfakes — and why we must spot and label them.',
  ],
  industryScenarios: [
    { company: 'Global tech companies', useCase: 'Set up AI ethics boards to review risky AI before release.', impact: 'Reduces harm and builds public trust.' },
  ],
  activities: [{
    title: 'The Fairness Council',
    duration: '25 minutes',
    materials: ['Scenario cards (biased AI cases)', 'Worksheet', 'Sticky notes'],
    steps: [
      'In groups, read a real-ish biased-AI scenario.',
      'Find WHERE the unfairness came from (often the data).',
      'Propose a fix (better data, testing, human check).',
      'Add one rule to the class "AI Bill of Rights".',
    ],
    expected: 'Students can trace bias to its source and propose a concrete fix, contributing to a class ethics charter.',
  }],
  miniProject: {
    title: 'Our Classroom AI Charter',
    description: 'Co-write a poster of rules for fair, safe, honest AI that your capstone project must follow.',
    time: '20 minutes',
    materials: ['Chart paper / doc', 'Markers', 'AI Diary'],
    steps: [
      'Brainstorm rules under: Fairness, Privacy, Honesty, Human-in-charge.',
      'Pick the top 5–7 rules.',
      'Design a poster and have everyone "sign" it.',
      'Note in your AI Diary how it will guide your Week 11 project.',
    ],
    expectedOutput: 'A signed classroom AI Charter that will govern the capstone projects.',
    extensions: ['Audit your Week-4 model for bias.', 'Find a news story about AI fairness.'],
  },
  logic: 'Critical thinking + responsibility: tracing an outcome back to its cause (data) and designing safeguards is high-order reasoning every AI builder needs.',
  sessionPlan: [
    'Hook (5 min): biased hiring-AI story.',
    'Concept (12 min): fairness, privacy, transparency, accountability.',
    'Activity (25 min): The Fairness Council.',
    'Project (20 min): Our Classroom AI Charter.',
    'Reflect & quiz (8 min): "Bias usually comes from ___." + quiz.',
  ],
  visualRequirements: [
    'Poster of the 5 ethics pillars with icons.',
    'Biased vs balanced data cartoon.',
    'A blank "AI Bill of Rights" chart to fill.',
  ],
  videoRequirements: [
    'Age-appropriate clip on AI bias with a clear example.',
    'Short clip on data privacy basics.',
  ],
  worksheet: [
    'Read the scenario and mark where bias entered.',
    'Match each ethics word to its meaning.',
    'Write 2 rules for fair AI.',
    'List one thing you should NEVER share with an AI.',
  ],
  assessmentRubric: rubric('AI ethics, bias and privacy'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Keep examples relatable and non-frightening; focus on solutions.',
    'Reinforce: AI is a tool — humans stay responsible.',
    'Differentiation: Band A discusses fairness in stories; Band C audits a real model.',
  ],
  parentEngagement: parentPack('AI fairness & privacy', 'review one app\'s privacy settings together and decide what to share or keep private'),
  diagram: 'design_thinking',
  facts: [
    'Bias in AI almost always traces back to the data it learned from.',
    '"Deepfakes" are AI-made fake videos — spotting them is a new life skill.',
    'Transparency means an AI should be able to explain its decision.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'AI bias usually comes from…', options: ['Unfair/one-sided data', 'Too much sunlight', 'Slow internet', 'Loud noise'], answer: 'Unfair/one-sided data', explanation: 'AI reflects its data.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Protecting personal information is called…', options: ['Privacy', 'Pixels', 'Prompting', 'Plotting'], answer: 'Privacy', explanation: 'Privacy protects personal data.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Who stays responsible for an AI\'s decisions?', options: ['Humans', 'Nobody', 'The internet', 'The weather'], answer: 'Humans', explanation: 'Accountability stays with people.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What is an AI-made fake video called?', answer: 'A deepfake.', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'An AI grades essays unfairly for one group. Suggest TWO fixes.', answer: 'Open-ended (balance data, test across groups, human review)', difficulty: 'advanced' },
  ],
});

const week9: WeekBuilder = (band) => ({
  title: 'Week 9 · AI at Work — Industry, Jobs & Future Careers',
  weekLabel: 'Week 9 · Sessions 17–18 · AI in the Real World',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Explore how AI transforms healthcare, farming, transport, space and more — and the exciting careers it is creating.',
  hook: 'A farmer in a village, a doctor in a city and an astronaut in space all used AI today — for completely different jobs. What can AI NOT touch?',
  story: 'ARIA takes the class on a tour. In a hospital she helps read scans; on a farm she spots sick crops from a drone; in a factory she catches faulty parts; in space she helps a rover pick a safe path. The class realises: every field they love already needs people who understand AI — maybe them.',
  layman: 'AI is used in almost every industry to help people work faster and smarter. It does not replace human values, creativity and judgement — it works WITH people. This is creating brand-new careers.',
  analogies: [
    { concept: 'AI as a tool', analogy: 'A power tool', explanation: 'A drill makes a carpenter faster but the carpenter still designs and decides. AI is a power tool for the mind.' },
  ],
  concept: 'AI is a general-purpose technology applied across sectors: healthcare, agriculture, transport, finance, education, entertainment and space. It augments human work and creates careers like AI engineer, data scientist, prompt designer, robotics engineer and AI ethicist.',
  didYouKnow: [
    'AI helps predict crop yields and water needs for farmers.',
    'AI assists doctors but does not replace them.',
    'Many of the AI jobs of 2035 do not even have names yet.',
  ],
  howItWorks: [
    'A real problem is identified in an industry.',
    'Relevant data is collected and cleaned.',
    'A model is trained and tested for that task.',
    'It is deployed to assist human experts.',
    'Humans monitor, correct and improve it over time.',
  ],
  realWorld: [
    'Healthcare: scan analysis, drug discovery.',
    'Agriculture: crop disease detection, smart irrigation.',
    'Transport: route optimisation, driver-assist.',
    'Space: rover navigation, satellite image analysis.',
  ],
  industryScenarios: [
    { company: 'Indian Railways / logistics', useCase: 'AI optimises schedules and predicts maintenance needs.', impact: 'Fewer delays and breakdowns.' },
    { company: 'ISRO', useCase: 'AI analyses satellite images for floods, crops and urban growth.', impact: 'Better planning and disaster response.' },
  ],
  activities: [{
    title: 'AI Career Fair',
    duration: '25 minutes',
    materials: ['Industry/career cards', 'Poster paper', 'Worksheet'],
    steps: [
      'Each group picks an industry they love.',
      'Find 3 ways AI helps it and 1 problem it could solve next.',
      'Invent a future AI job title and describe a day in that job.',
      'Present as a mini "career stall".',
    ],
    expected: 'Students connect AI to a personal interest and articulate a future career path.',
  }],
  miniProject: {
    title: 'AI for My Community',
    description: 'Identify a real problem in your school/town and pitch an AI idea to help solve it (with data + ethics).',
    time: '25 minutes',
    materials: ['Worksheet', 'AI Diary'],
    steps: [
      'Spot a real local problem (traffic, waste, water, learning).',
      'Describe an AI solution and the data it needs.',
      'Name who it helps and who must be protected (ethics).',
      'Sketch the idea and write a 3-line pitch.',
      'Save it as a possible Week-11 capstone.',
    ],
    expectedOutput: 'A community-focused AI pitch with data and ethics considered — a strong capstone candidate.',
    extensions: ['Interview someone who would use it.', 'Estimate the impact.'],
  },
  logic: 'Problem-finding + transfer: applying AI ideas to YOUR world is the highest form of understanding and the heart of innovation/entrepreneurship.',
  sessionPlan: [
    'Hook (5 min): farmer/doctor/astronaut tour.',
    'Concept (10 min): AI across industries + careers.',
    'Activity (25 min): AI Career Fair.',
    'Project (25 min): AI for My Community pitch.',
    'Share & quiz (8 min): stall presentations + quiz.',
  ],
  visualRequirements: [
    'Industry wheel poster (health, farm, transport, space…).',
    'Future AI careers gallery.',
    'A "problem → AI idea" template.',
  ],
  videoRequirements: [
    'Short clips of AI in farming and healthcare.',
    'A young person talking about an AI career.',
  ],
  worksheet: [
    'Match each industry to an AI use.',
    'Invent a future AI job and describe it.',
    'Write a 3-line "AI for my community" pitch.',
    'List 2 human skills AI cannot replace.',
  ],
  assessmentRubric: rubric('AI in industry and careers'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Emphasise human-AI teamwork, not replacement fears.',
    'Invite a guest (parent/alumni) in an AI-touched job if possible.',
    'Differentiation: Band A focuses on "AI helps people"; Band C analyses data + ethics of solutions.',
  ],
  parentEngagement: parentPack('AI at work', 'share how AI shows up in your own job or daily work and brainstorm a local problem AI could help'),
  diagram: 'iot',
  facts: [
    'AI helps map and protect endangered animals.',
    'Weather AI gives farmers days of advance warning.',
    'Curiosity and ethics are as important as coding in AI careers.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'AI in industry mostly works…', options: ['With humans, helping them', 'Alone, replacing all humans', 'Only in games', 'Only at night'], answer: 'With humans, helping them', explanation: 'AI augments human work.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Which is an AI career?', options: ['Data scientist', 'Cloud (the sky) painter', 'Time traveller', 'Dream seller'], answer: 'Data scientist', explanation: 'A real, growing AI job.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'AI helps farmers by…', options: ['Spotting crop disease early', 'Eating crops', 'Stopping rain', 'Hiding tractors'], answer: 'Spotting crop disease early', explanation: 'Vision AI detects disease.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'Name one human skill AI cannot replace.', answer: 'Open-ended (creativity, empathy, ethics, judgement).', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Pitch in 2 lines an AI that solves a problem in YOUR school.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const week10: WeekBuilder = (band) => ({
  title: 'Week 10 · Think Like AI — Data, Algorithms & Logic',
  weekLabel: 'Week 10 · Sessions 19–20 · Computational Thinking',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Sharpen the computational-thinking skills behind AI: algorithms, decomposition, patterns and reading simple data charts.',
  hook: 'Before AI can be smart, someone must break a big problem into tiny clear steps. Can you write steps so exact that a "robot" follows them perfectly?',
  story: 'ARIA freezes on a tricky task. The class realises ARIA needs a clear ALGORITHM — exact steps. They break the problem into small parts, find the pattern, write the steps, and test them. ARIA unfreezes. The team learns the secret skill behind ALL AI: thinking in clear, logical steps.',
  layman: 'Computational thinking is solving problems the way AI/computers need: break it down (decomposition), spot patterns, ignore the unimportant (abstraction), and write exact steps (algorithm). Reading data charts helps you find patterns fast.',
  analogies: [
    { concept: 'Algorithm', analogy: 'A recipe', explanation: 'Exact ordered steps that anyone (or any machine) can follow to get the same result.' },
    { concept: 'Decomposition', analogy: 'Eating an elephant one bite at a time', explanation: 'Big problems become easy when split into small parts.' },
  ],
  concept: 'Computational thinking = decomposition + pattern recognition + abstraction + algorithms. AI pipelines rely on all four, plus DATA INTERPRETATION (reading charts/graphs to find trends an algorithm can use).',
  didYouKnow: [
    'Every app you use is built from algorithms — ordered steps.',
    'A graph can reveal a pattern that a table of numbers hides.',
    'The word "algorithm" comes from the mathematician Al-Khwarizmi.',
  ],
  howItWorks: [
    'Decompose: split the problem into small parts.',
    'Find patterns across the parts.',
    'Abstract: keep only what matters.',
    'Write the algorithm: exact ordered steps.',
    'Test, find bugs, and fix the steps.',
  ],
  realWorld: [
    'Recipes, assembly instructions, game rules.',
    'Sorting and searching huge lists instantly.',
    'Reading a line graph to spot a rising trend.',
  ],
  code: band === 'C' ? {
    language: 'python',
    code: '# A simple algorithm: find the average score (a tiny "data" task)\nscores = [8, 6, 9, 7, 10]\ntotal = 0\nfor s in scores:        # step through the data\n    total = total + s\naverage = total / len(scores)\nprint("Average:", average)   # AI uses averages everywhere!',
    note: 'Loops + simple math are the building blocks AI uses to crunch data.',
  } : undefined,
  activities: [{
    title: band === 'A' ? 'Robot Says: Exact Steps' : 'Unplugged Algorithm + Chart Read',
    duration: '25 minutes',
    materials: ['Grid/maze worksheet', 'Sample bar/line chart', 'Pencils'],
    steps: [
      'Write step-by-step instructions to move a "robot" through a maze.',
      'A partner follows EXACTLY — find where the steps fail and fix them (debug).',
      'Then read a simple chart and write the trend in one sentence.',
      'Discuss: clear steps + reading data = thinking like AI.',
    ],
    expected: 'Students write a working step-by-step algorithm, debug it, and correctly interpret a chart.',
  }],
  miniProject: {
    title: 'Algorithm Designer',
    description: 'Write a clear algorithm for an everyday task and a small data chart that supports a decision.',
    time: '20 minutes',
    materials: ['Worksheet', 'Graph paper', 'AI Diary'],
    steps: [
      'Pick a task (make tea, sort the bag, plan a route).',
      'Write numbered, exact steps (include a decision/IF).',
      'Collect 5 small data points and draw a simple chart.',
      'State one decision your chart supports.',
      'Test your algorithm on a friend and refine.',
    ],
    expectedOutput: 'A debugged everyday algorithm plus a small chart used to justify a decision.',
    extensions: ['Add a loop ("repeat until…").', 'Find the average of your data.'],
  },
  logic: 'This week IS the logic core: decomposition, patterns, abstraction, algorithms and data interpretation — the mental toolkit that powers every AI system.',
  sessionPlan: [
    'Hook (5 min): "freeze the robot" exact-steps challenge.',
    'Concept (12 min): the 4 pillars + reading charts.',
    'Activity (25 min): unplugged algorithm + chart read.',
    'Project (20 min): Algorithm Designer.',
    'Debug share & quiz (8 min): fix a buggy algorithm + quiz.',
  ],
  visualRequirements: [
    'Poster of the 4 computational-thinking pillars.',
    'Sample bar and line charts to interpret.',
    'A maze/grid for the unplugged activity.',
  ],
  videoRequirements: [
    'Short "what is an algorithm" kid explainer.',
    'A clip on reading graphs to find trends.',
  ],
  worksheet: [
    'Number these jumbled steps into a correct algorithm.',
    'Find and fix the bug in a given algorithm.',
    'Read the chart and write the trend in one line.',
    'Write an algorithm with one IF-decision.',
  ],
  assessmentRubric: rubric('Computational thinking & data'),
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Debugging is success, not failure — celebrate finding bugs.',
    'Link every pillar back to AI from earlier weeks.',
    'Differentiation: Band A does maze steps; Band C writes a loop/average in code.',
  ],
  parentEngagement: parentPack('algorithms', 'cook a recipe together and rewrite it as a precise step-by-step "algorithm"'),
  diagram: 'flow',
  facts: [
    'Sorting algorithms let computers order millions of items in a blink.',
    'Reading charts well is a top skill for data scientists.',
    'A tiny bug can change an algorithm\'s whole result.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'An algorithm is…', options: ['Exact ordered steps to solve a problem', 'A type of pixel', 'A robot body', 'A prompt'], answer: 'Exact ordered steps to solve a problem', explanation: 'Like a recipe.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Breaking a big problem into small parts is…', options: ['Decomposition', 'Charging', 'Hallucination', 'Painting'], answer: 'Decomposition', explanation: 'A key CT pillar.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'A line graph going up shows…', options: ['A rising trend', 'A falling trend', 'No data', 'A picture'], answer: 'A rising trend', explanation: 'Up = increasing.', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What do we call fixing mistakes in steps/code?', answer: 'Debugging.', difficulty: 'beginner' },
    { qtype: 'computational', prompt: 'Average of 4, 6, 8?', options: ['6', '18', '8', '4'], answer: '6', explanation: '(4+6+8)/3 = 6.', difficulty: 'intermediate' },
  ],
});

const week11: WeekBuilder = (band) => ({
  title: 'Week 11 · Capstone — Build Your Own AI Solution',
  weekLabel: 'Week 11 · Sessions 21–22 · Capstone Build',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Combine everything — data, training, language/vision, ethics — to design and build a complete AI project that solves a real problem.',
  hook: 'For 10 weeks you learned AI super-powers. This week you become the inventor: pick a real problem and build YOUR AI to solve it.',
  story: 'ARIA is fully grown — she can see, listen, talk, create and act fairly. Now she turns to the class: "What should we build together?" Teams choose real problems and, using everything from Weeks 1–10, build their very own AI solutions. ARIA is no longer the teacher\'s robot — she is YOURS.',
  layman: 'A capstone is a project that brings all your skills together. You will follow the design process: understand the problem, gather data, build & test a model, check ethics, and prepare a demo.',
  analogies: [
    { concept: 'Capstone', analogy: 'The final dish in a cooking course', explanation: 'You use every technique you practised to cook one impressive meal.' },
  ],
  concept: 'An AI project pipeline: (1) Define the problem & users, (2) Collect & label data, (3) Train & test a model, (4) Evaluate accuracy & fairness, (5) Build a simple interface/demo, (6) Document and plan improvements.',
  didYouKnow: [
    'Real AI teams follow this same pipeline.',
    'A clear problem statement is half the solution.',
    'Demoing and explaining your project is a vital skill.',
  ],
  howItWorks: [
    'Choose a real problem and the people it helps.',
    'Plan the data you need and collect/label it.',
    'Train and test your model (Teachable Machine / Scratch / Python).',
    'Check accuracy AND fairness against your Charter.',
    'Build a simple demo and prepare your story.',
  ],
  realWorld: [
    'Waste-sorting helper (vision).',
    'Friendly study/FAQ chatbot (language).',
    'Mood or gesture recogniser (vision/audio).',
  ],
  industryScenarios: [
    { company: 'Startups & hackathons', useCase: 'Small teams build an AI prototype in days, then pitch it.', impact: 'Exactly the skill you are practising now.' },
  ],
  activities: [{
    title: 'Capstone Sprint (Plan & Build)',
    duration: '40 minutes',
    materials: ['Chosen AI tool', 'Your dataset', 'Project canvas worksheet', 'AI Diary'],
    steps: [
      'Fill a project canvas: problem, users, data, model, ethics, demo.',
      'Collect/label balanced data.',
      'Train and test; record accuracy.',
      'Run a fairness check against the class Charter.',
      'Build a simple demo and rehearse your 2-minute story.',
    ],
    expected: 'A working (even if simple) AI prototype with documented accuracy and a fairness check.',
  }],
  miniProject: {
    title: 'My AI Capstone',
    description: 'Build a complete, demoable AI project that solves a real problem and respects the class AI Charter.',
    time: '40 minutes',
    materials: ['AI tool of your band', 'Dataset', 'Canvas + AI Diary'],
    steps: [
      'Finalise your problem and success goal.',
      'Build and improve your model at least once.',
      'Test on new inputs and note accuracy.',
      'Write how it is fair, private and honest.',
      'Prepare slides/poster + a live demo for Week 12.',
    ],
    expectedOutput: 'A working AI capstone + a one-page project document ready for the Week-12 showcase.',
    extensions: ['Add a second feature.', 'Collect feedback and list version 2 ideas.'],
  },
  logic: 'Synthesis: integrating data, modelling, evaluation and ethics into one solution is the pinnacle of the course — true project-based, real-world AI creation.',
  sessionPlan: [
    'Kick-off (5 min): mission + pick problem.',
    'Plan (10 min): fill the project canvas.',
    'Build (40 min): Capstone Sprint.',
    'Fairness check (10 min): test against Charter.',
    'Rehearse (10 min): prep the Week-12 demo.',
  ],
  visualRequirements: [
    'Project canvas template poster (problem→demo).',
    'AI pipeline poster (6 steps).',
    'A demo-day checklist.',
  ],
  videoRequirements: [
    'A short student-AI-project showcase for inspiration.',
    'A 1-min "how to demo your project" tips clip.',
  ],
  worksheet: [
    'Project canvas: problem, users, data, model, ethics, demo.',
    'Accuracy log: before vs after improvement.',
    'Fairness check against each Charter rule.',
    'Your 2-minute demo script outline.',
  ],
  assessmentRubric: [
    'Problem clarity — Beginning: vague · Proficient: clear problem & users · Advanced: clear + measurable goal.',
    'Data & model — Beginning: incomplete · Proficient: trained & tested · Advanced: improved with evidence.',
    'Ethics — Beginning: not considered · Proficient: follows Charter · Advanced: identifies & fixes a fairness risk.',
    'Demo & communication — Beginning: unclear · Proficient: clear demo · Advanced: confident, engaging story.',
    'Teamwork & iteration — Beginning: little · Proficient: shared roles · Advanced: led and improved across versions.',
  ],
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Scaffold tightly: provide the project canvas and time-box each phase.',
    'Encourage "small but working" over "big but broken".',
    'Differentiation: offer ready problem options for Band A; let Band C scope their own.',
  ],
  parentEngagement: parentPack('the AI capstone', 'be the first test-user of your child\'s AI demo and give kind, specific feedback'),
  diagram: 'design_thinking',
  facts: [
    'Many famous products started as a simple working prototype.',
    'Documenting your project doubles its value.',
    'A fairness check is now standard in professional AI teams.',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'The FIRST step of an AI project is to…', options: ['Define the problem & users', 'Build a robot body', 'Buy a server', 'Make a logo'], answer: 'Define the problem & users', explanation: 'Clarity first.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Before demo, you should check accuracy AND…', options: ['Fairness', 'The weather', 'Your shoe size', 'Wi-Fi colour'], answer: 'Fairness', explanation: 'Ethics matters too.', difficulty: 'intermediate' },
    { qtype: 'oneliner', prompt: 'What document brings all your skills into one project?', answer: 'The capstone (project).', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write your capstone\'s problem statement and success goal in 2 lines.', answer: 'Open-ended', difficulty: 'advanced' },
    { qtype: 'brain_teaser', prompt: 'Your capstone is only 60% accurate. List TWO concrete ways to improve it.', answer: 'Open-ended (more/varied data, better classes, retrain)', difficulty: 'advanced' },
  ],
});

const week12: WeekBuilder = (band) => ({
  title: 'Week 12 · Showcase & The Future of AI',
  weekLabel: 'Week 12 · Sessions 23–24 · Demo Day + Future',
  difficulty: DIFF[band], est: EST[band],
  summary: 'Present your AI capstone, reflect on the 12-week journey, and imagine — and commit to — a responsible AI future.',
  hook: 'Today you stand up not as a student of AI, but as a CREATOR of AI. Time to show the world what ARIA — and you — can do.',
  story: 'It is Demo Day. One by one, teams present the AI they built. ARIA watches proudly. At the end, the class makes a promise: to use AI to help people, to be fair, and to keep learning. ARIA waves goodbye to the course — but she will keep growing, just like you.',
  layman: 'This week you present your project clearly, celebrate what you learned, give and receive feedback, and look ahead at where AI is going and your place in it.',
  analogies: [
    { concept: 'Showcase', analogy: 'A science-fair stall', explanation: 'You explain, demo and answer questions — turning your work into a story others understand.' },
  ],
  concept: 'Communicating AI: a strong showcase explains the PROBLEM, the SOLUTION (with a live demo), the DATA & ACCURACY, the ETHICS, and the FUTURE plan. Reflection turns a project into lasting learning.',
  didYouKnow: [
    'Explaining your work clearly is as valued as building it.',
    'AI keeps changing — being a lifelong learner is the real super-power.',
    'You are now part of the small group of kids who have actually BUILT AI.',
  ],
  howItWorks: [
    'Open with the problem and who it helps.',
    'Give a live demo of your AI.',
    'Share accuracy and your fairness check.',
    'Tell what was hard and what you would improve.',
    'End with your vision for AI\'s future.',
  ],
  realWorld: [
    'Demo days at startups and science fairs.',
    'Pitch competitions and hackathons.',
    'Portfolios that show real projects.',
  ],
  activities: [{
    title: 'AI Demo Day',
    duration: '40 minutes',
    materials: ['Projects & demos', 'Feedback cards', 'Certificates', 'AI Diary'],
    steps: [
      'Each team gives a 2–3 minute demo + Q&A.',
      'Audience fills kind, specific feedback cards ("I liked… I wonder…").',
      'Vote for fun awards (Most Creative, Most Helpful, Fairest AI).',
      'Each learner writes a final AI-Diary reflection.',
    ],
    expected: 'Every learner presents confidently and gives/receives constructive feedback.',
  }],
  miniProject: {
    title: 'My AI Future Pledge',
    description: 'Create a final reflection + pledge: what you learned, what you will build next, and how you will use AI responsibly.',
    time: '20 minutes',
    materials: ['AI Diary', 'Pledge card', 'Pens'],
    steps: [
      'Review your AI Diary from Week 1 to now.',
      'Write your 3 proudest moments.',
      'Write one AI idea you want to build next.',
      'Sign an "AI for Good" pledge.',
      'Share one line with the class.',
    ],
    expectedOutput: 'A completed AI Diary, a future idea, and a signed "AI for Good" pledge.',
    extensions: ['Make a portfolio page of your projects.', 'Plan a mini AI club.'],
  },
  logic: 'Metacognition + communication: reflecting on HOW you learned and sharing it clearly cements skills and builds confidence and identity as a creator.',
  sessionPlan: [
    'Set-up (5 min): arrange demo stalls.',
    'Demos (40 min): team presentations + Q&A.',
    'Awards (10 min): fun categories + applause.',
    'Reflection (15 min): AI Future Pledge + diary.',
    'Close (5 min): certificates + group photo.',
  ],
  visualRequirements: [
    'Demo-day banner and stall signs.',
    'Feedback cards ("I liked… I wonder…").',
    'Course completion certificates.',
    '"Future of AI" inspiration wall.',
  ],
  videoRequirements: [
    'An inspiring "future of AI" clip (positive, age-appropriate).',
    'Optional: record student demos to share with parents.',
  ],
  worksheet: [
    'My 2-minute demo script.',
    'Feedback I gave / feedback I received.',
    'My 3 proudest moments.',
    'My "AI for Good" pledge.',
  ],
  assessmentRubric: [
    'Demo clarity — Beginning: unclear · Proficient: clear problem+demo · Advanced: engaging story with results.',
    'Knowledge — Beginning: recalls little · Proficient: explains key ideas · Advanced: connects ideas across weeks.',
    'Feedback skills — Beginning: vague · Proficient: kind & specific · Advanced: actionable suggestions.',
    'Reflection — Beginning: minimal · Proficient: thoughtful · Advanced: deep insight + future plan.',
    'Responsibility — Beginning: unaware · Proficient: states ethics · Advanced: commits to concrete responsible actions.',
  ],
  teacherNotes: [
    `Tooling: ${TOOL[band]}.`,
    'Invite parents/other classes — authentic audiences boost pride.',
    'Celebrate effort and growth, not just polish.',
    'Award certificates; encourage continuing (AI club, next project).',
  ],
  parentEngagement: [
    'Attend (or watch a recording of) the AI Demo Day and ask your child to walk you through their project.',
    'Help your child pick ONE next AI idea to explore over the holidays.',
    'Celebrate completion — display the certificate at home.',
    'Talk about one rule from the family for using AI responsibly together.',
  ],
  diagram: 'design_thinking',
  facts: [
    'Presenting builds confidence that lasts far beyond AI.',
    'The best AI creators never stop learning.',
    'You completed a full 12-week AI journey — congratulations, Innovator!',
  ],
  questions: [
    { qtype: 'mcq', prompt: 'A great AI demo should include a…', options: ['Live demo + the problem it solves', 'Only your name', 'A magic trick', 'A long silence'], answer: 'Live demo + the problem it solves', explanation: 'Show and explain.', difficulty: 'beginner' },
    { qtype: 'mcq', prompt: 'Good feedback is…', options: ['Kind and specific', 'Mean and vague', 'Silent', 'Copied'], answer: 'Kind and specific', explanation: '"I liked… I wonder…".', difficulty: 'beginner' },
    { qtype: 'oneliner', prompt: 'What promise did the class make about using AI?', answer: 'To use AI for good — fairly and responsibly.', difficulty: 'beginner' },
    { qtype: 'tinkering', prompt: 'Write the opening line of your demo to grab the audience.', answer: 'Open-ended', difficulty: 'intermediate' },
    { qtype: 'brain_teaser', prompt: 'Describe one AI you will build next and one rule you will follow to keep it responsible.', answer: 'Open-ended', difficulty: 'advanced' },
  ],
});

const ROADMAP: WeekBuilder[] = [
  week1, week2, week3, week4, week5, week6,
  week7, week8, week9, week10, week11, week12,
];

// ---------------------------------------------------------------------
// Per-class fine-tuning layer.
// Each class in the same band shares the roadmap structure, but gets
// class-specific titles, projects, summaries and activities to ensure
// every class feels individually authored.
// ---------------------------------------------------------------------
interface ClassOverride {
  titleSuffix: string;           // appended to each chapter title
  levelLabel: string;
  description: string;
  projectTheme: string;          // theme used in capstone hint
  extraActivity: string;         // one extra activity line per chapter
  diffAdjust: 'beginner' | 'intermediate' | 'advanced';
  estAdjust: number;             // minutes offset from band default
}

const CLASS_OVERRIDES: Record<number, ClassOverride> = {
  3: {
    titleSuffix: ' — Class 3',
    levelLabel: 'AI Sprouts',
    description: 'Class 3 · AI Sprouts — story-first, draw-and-discuss, fully unplugged. No screen required.',
    projectTheme: 'a friendly classroom helper robot',
    extraActivity: 'Draw, colour and label your idea — no computer needed.',
    diffAdjust: 'beginner', estAdjust: -5,
  },
  4: {
    titleSuffix: ' — Class 4',
    levelLabel: 'AI Explorers',
    description: 'Class 4 · AI Explorers — story + sorting games + paper prototyping. Light screen use.',
    projectTheme: 'an AI that helps sort the school library',
    extraActivity: 'Create a mini poster or cut-and-stick collage to show your idea.',
    diffAdjust: 'beginner', estAdjust: 0,
  },
  5: {
    titleSuffix: ' — Class 5',
    levelLabel: 'AI Beginners',
    description: 'Class 5 · AI Beginners — guided Scratch + Teachable Machine with structured scaffolding.',
    projectTheme: 'a Scratch chatbot that answers class FAQs',
    extraActivity: 'Use Scratch\'s block palette to prototype one feature before coding.',
    diffAdjust: 'beginner', estAdjust: 0,
  },
  6: {
    titleSuffix: ' — Class 6',
    levelLabel: 'AI Builders',
    description: 'Class 6 · AI Builders — Teachable Machine classifiers + Scratch chatbot with 10+ intents.',
    projectTheme: 'an AI gesture-based quiz game in Scratch',
    extraActivity: 'Build a working prototype in Scratch/Teachable Machine before documenting.',
    diffAdjust: 'beginner', estAdjust: 5,
  },
  7: {
    titleSuffix: ' — Class 7',
    levelLabel: 'AI Designers',
    description: 'Class 7 · AI Designers — design thinking + intermediate Teachable Machine + data ethics.',
    projectTheme: 'an AI that detects emotions to customise study music',
    extraActivity: 'Run a fairness audit on your model before presenting.',
    diffAdjust: 'intermediate', estAdjust: 5,
  },
  8: {
    titleSuffix: ' — Class 8',
    levelLabel: 'AI Coders',
    description: 'Class 8 · AI Coders — Python basics + Teachable Machine export + beginner ML with Colab.',
    projectTheme: 'a Python script that classifies your dataset and reports accuracy',
    extraActivity: 'Write and run one Python snippet that demonstrates the concept.',
    diffAdjust: 'intermediate', estAdjust: 0,
  },
  9: {
    titleSuffix: ' — Class 9',
    levelLabel: 'AI Analysts',
    description: 'Class 9 · AI Analysts — ML pipeline in Python, data visualisation, bias analysis, ethics deep-dive.',
    projectTheme: 'an ML pipeline with data visualisation and a bias report',
    extraActivity: 'Plot a confusion matrix or bar chart in Python/Colab to show results.',
    diffAdjust: 'intermediate', estAdjust: 10,
  },
  10: {
    titleSuffix: ' — Class 10',
    levelLabel: 'AI Innovators',
    description: 'Class 10 · AI Innovators — end-to-end AI project: research, data, modelling, evaluation, pitch.',
    projectTheme: 'a fully documented end-to-end AI solution with a public pitch',
    extraActivity: 'Prepare a 2-slide research brief citing a real dataset or paper.',
    diffAdjust: 'advanced', estAdjust: 15,
  },
};

function bandForClass(n: number): Band {
  if (n <= 4) return 'A';
  if (n <= 7) return 'B';
  return 'C';
}

// Apply per-class overrides on top of the base chapter spec.
function applyClassOverride(base: ChapterSpec, classNum: number): ChapterSpec {
  const ov = CLASS_OVERRIDES[classNum];
  if (!ov) return base;
  return {
    ...base,
    // Titles stay clean (the class is already known from context); the
    // per-class differentiation lives in difficulty, time, notes & projects.
    title: base.title,
    difficulty: ov.diffAdjust,
    est: base.est + ov.estAdjust,
    teacherNotes: [
      ...(base.teacherNotes ?? []),
      `Class ${classNum} focus: ${ov.description}`,
      `Class project theme for this chapter: ${ov.projectTheme}.`,
    ],
    activities: base.activities?.map((act) => ({
      ...act,
      steps: [...act.steps, ov.extraActivity],
    })),
    miniProject: base.miniProject ? {
      ...base.miniProject,
      extensions: [
        ...(base.miniProject.extensions ?? []),
        `Class ${classNum} challenge: ${ov.projectTheme} — apply this week's concept to that project.`,
      ],
    } : base.miniProject,
  };
}

const BAND_DESC: Record<Band, string> = {
  A: 'AI Explorers — a story-driven, fully hands-on (mostly unplugged) introduction to Artificial Intelligence.',
  B: 'AI Creators — build real AI with Scratch and Google Teachable Machine, no typing code required.',
  C: 'AI Innovators — design, train and evaluate AI with Python and Teachable Machine, including ethics and a capstone.',
};

export function aiModuleForClass(n: number): ModuleSpec {
  const band = bandForClass(n);
  const ov = CLASS_OVERRIDES[n];
  return {
    title: 'Artificial Intelligence',
    slug: `artificial-intelligence-${n}`,
    icon: '🤖',
    color: '#6a4c93',
    description: ov?.description ?? `3-month (12-week) AI course · ${LEARNER[band]} level (Class ${n}). ${BAND_DESC[band]}`,
    chapters: ROADMAP.map((build) => applyClassOverride(build(band), n)),
  };
}

// A full grade spec carrying ONLY the AI module — used to attach the AI
// course to classes that have no other curriculum yet (3, 4, 5).
export function aiGradeSpec(n: number): GradeSpec {
  const band = bandForClass(n);
  const ov = CLASS_OVERRIDES[n];
  return {
    number: n,
    name: `Class ${n}`,
    level_label: ov?.levelLabel ?? `AI ${LEARNER[band].replace('AI ', '')}`,
    description: ov?.description ?? `Class ${n} Artificial Intelligence course — ${BAND_DESC[band]}`,
    modules: [aiModuleForClass(n)],
  };
}
