// Shared program catalogue — used by the Landing page cards and the
// dedicated Programs detail page. Each program has rich detail used on
// its own deep-dive page (/programs/:slug).

export interface ProgramModule {
  t: string;
  d: string;
}

export interface Program {
  slug: string;
  title: string;
  tag: string;
  short: string;       // one-liner for the card
  img: string;         // unsplash photo id
  accent: string;      // theme accent colour
  classes: string;
  duration: string;
  level: string;
  tagline: string;     // hero subtitle on the detail page
  overview: string;    // long intro paragraph
  outcomes: string[];  // what learners achieve
  modules: ProgramModule[];
  tools: string[];
  projects: string[];
}

export const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

export const PROGRAMS: Program[] = [
  {
    slug: 'robotics',
    title: 'Robotics & Autonomous Systems',
    tag: 'Robotics',
    short: 'Design line-followers, robotic arms and intelligent autonomous machines.',
    img: '1485827404703-89b55fcc595e',
    accent: '#1e88e5',
    classes: 'Class 6–8',
    duration: '12 weeks',
    level: 'Beginner → Advanced',
    tagline: 'Build machines that sense, decide and move on their own.',
    overview:
      'From your first motor circuit to a fully autonomous robot, this track teaches the mechanical, electronic and software foundations of modern robotics. Learners progress from basic actuation to closed-loop control, building line-followers, obstacle-avoiders and robotic arms that react to the real world in real time.',
    outcomes: [
      'Understand actuators, motor drivers and chassis design',
      'Wire and program sensor-driven feedback loops',
      'Build a working line-follower and obstacle-avoider robot',
      'Apply PID-style control intuition to keep robots on track',
      'Debug mechanical, electrical and code issues systematically',
    ],
    modules: [
      { t: 'Mechanics & Motion', d: 'Chassis, wheels, gears and DC/servo motors — how robots physically move.' },
      { t: 'Motor Control', d: 'H-bridges, motor drivers and speed control with PWM.' },
      { t: 'Sensing the World', d: 'IR, ultrasonic and line sensors for perception.' },
      { t: 'Line-Follower Bot', d: 'Combine sensing + control to track a path autonomously.' },
      { t: 'Obstacle Avoider', d: 'React to surroundings and navigate around barriers.' },
      { t: 'Capstone Robot', d: 'Design, build and present an autonomous robot of your own.' },
    ],
    tools: ['Arduino', 'DC & Servo Motors', 'L298N Driver', 'IR / Ultrasonic Sensors', 'Chassis Kit'],
    projects: ['Line-follower racer', 'Obstacle-avoiding rover', '2-DOF robotic arm'],
  },
  {
    slug: 'stem-labs',
    title: 'STEM Labs & Innovation',
    tag: 'STEM',
    short: 'World-class hands-on labs for inquiry, experimentation and engineering.',
    img: '1581091226825-a6a2a5aee158',
    accent: '#7c3aed',
    classes: 'Class 6–8',
    duration: '10 weeks',
    level: 'Beginner',
    tagline: 'Learn science and engineering by building, testing and iterating.',
    overview:
      'A hands-on, inquiry-driven lab experience aligned to the Atal Tinkering Lab model. Learners frame problems, form hypotheses, design experiments and engineer solutions — developing the scientific temperament and maker mindset that underpins every other track.',
    outcomes: [
      'Apply the design-thinking and engineering-design cycle',
      'Frame real problems and define measurable success',
      'Prototype rapidly with low-cost materials',
      'Document, present and iterate on solutions',
    ],
    modules: [
      { t: 'Design Thinking', d: 'Empathise, define, ideate, prototype and test.' },
      { t: 'Problem Framing', d: 'Turn fuzzy challenges into clear, solvable problems.' },
      { t: 'Rapid Prototyping', d: 'Build quick, testable models from everyday materials.' },
      { t: 'Experiment & Measure', d: 'Collect data and let evidence guide decisions.' },
      { t: 'Innovation Showcase', d: 'Pitch and present your engineered solution.' },
    ],
    tools: ['Design-thinking canvas', 'Prototyping kits', 'Measurement tools', 'Lab notebook'],
    projects: ['Problem-solution prototype', 'Science fair exhibit', 'Innovation pitch deck'],
  },
  {
    slug: 'iot-aiot',
    title: 'IoT & AIoT Integration',
    tag: 'IoT',
    short: 'Connect devices to the cloud, add edge intelligence and build smart systems.',
    img: '1518770660439-4636190af475',
    accent: '#0891b2',
    classes: 'Class 7–8',
    duration: '10 weeks',
    level: 'Intermediate',
    tagline: 'Make everyday objects sense, connect and think.',
    overview:
      'Learn how the Internet of Things turns ordinary devices into connected, data-driven systems — then add a layer of intelligence with AIoT. Learners build sensor nodes, stream data to the cloud, create live dashboards and add on-device smarts for smart-home and smart-city style projects.',
    outcomes: [
      'Wire sensor nodes and read environmental data',
      'Connect devices to cloud services over Wi-Fi/MQTT',
      'Build live dashboards that visualise device data',
      'Add edge intelligence for automated decisions',
    ],
    modules: [
      { t: 'IoT Foundations', d: 'Sensors, microcontrollers and connectivity basics.' },
      { t: 'Talking to the Cloud', d: 'Wi-Fi, MQTT and REST to move data off-device.' },
      { t: 'Live Dashboards', d: 'Visualise and monitor your devices in real time.' },
      { t: 'Edge Intelligence (AIoT)', d: 'On-device logic and ML for smart automation.' },
      { t: 'Smart System Project', d: 'Build a connected smart-home or smart-city node.' },
    ],
    tools: ['ESP32 / NodeMCU', 'DHT & Gas Sensors', 'MQTT', 'Cloud Dashboard', 'Relays'],
    projects: ['Smart weather station', 'Connected home automation', 'Air-quality monitor'],
  },
  {
    slug: 'electronics',
    title: 'Electronics & Breadboarding',
    tag: 'Electronics',
    short: 'Build live circuits and master current, voltage and components from scratch.',
    img: '1597852074816-d933c7d2b988',
    accent: '#16a34a',
    classes: 'Class 6–8',
    duration: '8 weeks',
    level: 'Beginner',
    tagline: 'Understand electricity by building real, working circuits.',
    overview:
      'The foundation of every electronic project. Learners go from understanding voltage, current and resistance to building functional circuits on a breadboard — LEDs, sensors, transistors and more — gaining the confidence to bring any hardware idea to life.',
    outcomes: [
      'Read schematics and build circuits on a breadboard',
      'Apply Ohm’s law and understand series/parallel circuits',
      'Use resistors, capacitors, LEDs, transistors and ICs',
      'Measure and debug circuits with a multimeter',
    ],
    modules: [
      { t: 'Electricity Basics', d: 'Voltage, current, resistance and Ohm’s law.' },
      { t: 'Breadboarding 101', d: 'Build and modify circuits without soldering.' },
      { t: 'Core Components', d: 'Resistors, capacitors, diodes, LEDs and transistors.' },
      { t: 'Measure & Debug', d: 'Use a multimeter to test and troubleshoot.' },
      { t: 'Circuit Project', d: 'Design a useful gadget from scratch.' },
    ],
    tools: ['Breadboard', 'Multimeter', 'Resistors & Capacitors', 'LEDs', 'Transistors'],
    projects: ['LED light show', 'Touch / darkness sensor', 'Mini alarm circuit'],
  },
  {
    slug: 'embedded',
    title: 'Sensors, Arduino & Microcontrollers',
    tag: 'Embedded',
    short: 'Program the brains of machines to sense and react to the real world.',
    img: '1553406830-ef2513450d76',
    accent: '#ea580c',
    classes: 'Class 6–8',
    duration: '10 weeks',
    level: 'Beginner → Intermediate',
    tagline: 'Give your projects a brain that reads the world and reacts.',
    overview:
      'Microcontrollers are the brains behind robots, IoT devices and smart gadgets. Learners master the Arduino platform — reading sensors, driving outputs and writing clean embedded code — the skill that powers nearly every other track on the platform.',
    outcomes: [
      'Write, upload and debug Arduino sketches',
      'Read analog and digital sensors',
      'Drive LEDs, motors, buzzers and displays',
      'Combine inputs and outputs into interactive devices',
    ],
    modules: [
      { t: 'Meet the Arduino', d: 'Pins, the IDE and your first blink sketch.' },
      { t: 'Digital & Analog I/O', d: 'Read buttons and sensors, drive outputs.' },
      { t: 'Sensors Deep-Dive', d: 'Temperature, light, distance and motion.' },
      { t: 'Code Logic', d: 'Variables, loops, conditions and functions.' },
      { t: 'Interactive Device', d: 'Build a sensor-driven gadget of your own.' },
    ],
    tools: ['Arduino Uno', 'Sensor Kit', 'Arduino IDE', 'Jumper Wires', 'OLED Display'],
    projects: ['Smart night-lamp', 'Distance-alert parking sensor', 'Reaction-time game'],
  },
  {
    slug: '3d-modelling',
    title: '3D Modelling & Fabrication',
    tag: 'Fabrication',
    short: 'Turn ideas into printable physical objects with Tinkercad & CollabCAD.',
    img: '1635070041078-e363dbe005cb',
    accent: '#db2777',
    classes: 'Class 6–8',
    duration: '8 weeks',
    level: 'Beginner',
    tagline: 'Design in 3D, then hold your creation in your hands.',
    overview:
      'From digital design to a physical object. Learners model parts in Tinkercad and CollabCAD, understand how 3D printers work, and fabricate their own designs — bridging the gap between imagination and a real, manufactured product.',
    outcomes: [
      'Model 3D objects in Tinkercad and CollabCAD',
      'Understand 3D-printing workflows and slicing',
      'Design printable, functional parts',
      'Fabricate and refine your own physical creations',
    ],
    modules: [
      { t: 'Intro to CAD', d: 'Shapes, grouping and the 3D workspace.' },
      { t: 'Tinkercad & CollabCAD', d: 'Model real objects with precision.' },
      { t: 'Designing for Print', d: 'Tolerances, supports and printability.' },
      { t: 'Slicing & Printing', d: 'Turn a model into printer instructions.' },
      { t: 'Fabrication Project', d: 'Design, print and present a custom object.' },
    ],
    tools: ['Tinkercad', 'CollabCAD', 'FDM 3D Printer', 'Slicer Software'],
    projects: ['Custom keychain / nameplate', 'Functional phone stand', 'Mechanical part replica'],
  },
  {
    slug: 'ai-ml',
    title: 'AI / ML Foundations',
    tag: 'AI',
    short: 'Teach machines to learn, classify and see — with industry-grade tooling.',
    img: '1620712943543-bcc4688e7485',
    accent: '#2563eb',
    classes: 'Class 7–8',
    duration: '10 weeks',
    level: 'Intermediate',
    tagline: 'Train machines to recognise, predict and understand.',
    overview:
      'Demystify Artificial Intelligence and Machine Learning through hands-on projects. Learners explore how machines learn from data, build simple classifiers, train computer-vision models with no-code tools, and understand the ethics and impact of AI in the real world.',
    outcomes: [
      'Explain how machine learning learns from data',
      'Train an image classifier with no-code tools',
      'Build a simple computer-vision starter project',
      'Discuss AI ethics, bias and responsible use',
    ],
    modules: [
      { t: 'What is AI/ML?', d: 'Data, models and how machines “learn”.' },
      { t: 'Teachable Machines', d: 'Train a classifier with your own examples.' },
      { t: 'Computer Vision Starters', d: 'Recognise images, objects and gestures.' },
      { t: 'Data & Ethics', d: 'Bias, fairness and responsible AI.' },
      { t: 'AI Mini-Project', d: 'Build and present a working AI demo.' },
    ],
    tools: ['Teachable Machine', 'Python (intro)', 'Computer Vision tools', 'Datasets'],
    projects: ['Image classifier app', 'Gesture-controlled demo', 'Smart sorting model'],
  },
  {
    slug: 'entrepreneurship',
    title: 'Entrepreneurship & Tinkerpreneur',
    tag: 'Startup',
    short: 'Take innovation to market: pitch, prototype and present like a founder.',
    img: '1556761175-5973dc0f32e7',
    accent: '#d97706',
    classes: 'Class 6–8',
    duration: '8 weeks',
    level: 'Beginner',
    tagline: 'Turn your tinkering into a real, pitchable venture.',
    overview:
      'Innovation matters most when it reaches people. In the Tinkerpreneur track, learners take a prototype and build a venture around it — identifying customers, crafting a value proposition, costing a product and delivering a confident investor-style pitch.',
    outcomes: [
      'Identify a real problem and target customer',
      'Shape a value proposition and business model',
      'Prototype a minimum viable product',
      'Deliver a compelling investor-style pitch',
    ],
    modules: [
      { t: 'Founder Mindset', d: 'Spot problems worth solving.' },
      { t: 'Customer & Value', d: 'Who is it for and why do they care?' },
      { t: 'Business Model', d: 'Cost, pricing and how value is delivered.' },
      { t: 'MVP & Branding', d: 'Build a minimum viable product and identity.' },
      { t: 'The Pitch', d: 'Tell your story and present to a panel.' },
    ],
    tools: ['Business Model Canvas', 'Pitch-deck templates', 'Prototype kit', 'Costing sheet'],
    projects: ['Venture pitch deck', 'MVP prototype', 'Tinkerpreneur showcase'],
  },
];

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);
