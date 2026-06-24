// =====================================================================
//  Rich Chapter Overrides — Book-quality content for Grade 9 exemplars
//  These patch the lightweight stubs in grade9to12.ts with full
//  educational content: story, analogies, activities, troubleshooting,
//  industry scenarios, mini-projects and revision notes.
//  Module coverage: Advanced Electronics (8 ch) + Autonomous Robotics (8 ch)
//                   + IoT Pipelines (8 ch) + AI/ML Foundations (8 ch)
// =====================================================================
import { ChapterSpec } from './curriculum';

// ─────────────────────────────────────────────────────────────────────
//  MODULE 1: ADVANCED ELECTRONICS — Grade 9
// ─────────────────────────────────────────────────────────────────────
export const richElectronicsChapters: ChapterSpec[] = [
  // ─── CHAPTER 1 ──────────────────────────────────────────────────
  {
    title: 'NPN Transistor as a Switch',
    difficulty: 'intermediate', est: 45,
    summary: 'Use NPN transistors to switch loads 100× heavier than a microcontroller signal.',
    hook: 'Your Arduino can deliver only 40mA from a digital pin — barely enough for an LED. But your robot motor needs 2000mA. How do you bridge this gap? A single cheap ₹2 transistor is the answer — and understanding it unlocks the entire world of electronics.',
    objectives: [
      'Explain what a transistor does using the water-tap analogy',
      'Calculate the correct base resistor (Rb) for any NPN switching circuit',
      'Wire a transistor switch on a breadboard and test it with an Arduino',
      'Distinguish between transistor saturation and cut-off states',
      'Design a circuit where an Arduino controls a 12V motor via transistor',
    ],
    story: `Imagine you are the manager of a large water dam. You need to control a massive gate that releases millions of litres of water. But you are tiny — you can only push a small button. That button activates a powerful hydraulic system that actually moves the gate.

In electronics, YOUR Arduino pin is like you — small and limited. The transistor is the hydraulic system — it uses your tiny signal to control a massive current.

In 1947, three scientists at Bell Labs in New Jersey were trying to build an amplifier from a tiny piece of germanium. When John Bardeen pushed a small voltage to one terminal, a much larger current flowed through another terminal. They had accidentally discovered the transistor — and it changed the world forever.

Today, the shirt you are wearing has a QR code that was printed by machines controlled by billions of transistors. The phone in your pocket has 15 billion transistors. Every single transistor does exactly what you are about to learn: use a small signal to control a big one.`,
    layman: 'Think of a transistor as a water tap. The tap handle is the "base" — you apply a small force (your Arduino signal). The water pipe is the "collector-emitter" path — it carries huge current for your motor or high-power LED. Tiny input force → huge output flow. That is a transistor.',
    analogies: [
      {
        concept: 'Base current controlling collector current',
        analogy: 'Security guard at a gate',
        explanation: 'The base current is like a security guard\'s badge scanner. Even though the guard is small, their badge approval lets hundreds of people (collector current) pass through the heavy gate (collector-emitter junction). Remove the badge signal → gate closes → no one passes.',
      },
      {
        concept: 'Current gain (hFE)',
        analogy: 'Microphone and speaker system',
        explanation: 'A microphone converts your quiet voice (small electrical signal) into a large signal that drives a concert speaker (huge power). The amplification factor is hFE. hFE=200 means: 1 unit of base current controls 200 units of collector current.',
      },
      {
        concept: 'Saturation vs Cut-off',
        analogy: 'Light switch ON/OFF',
        explanation: 'Saturation = switch fully ON (maximum current flows). Cut-off = switch fully OFF (no current). Unlike a dimmer (which is analogue), a digital transistor switch lives only in these two states — just like a boolean: TRUE or FALSE.',
      },
    ],
    concept: 'NPN BJT transistor: when base-emitter voltage Vbe ≥ 0.7V, collector-emitter path conducts (saturation). Current gain hFE = Ic / Ib (typically 100–500). Design formula: Rb = (Vcc − 0.7V) / Ib_min, where Ib_min = Ic / hFE. Over-driving the base (using Ib > Ic/hFE) is intentional in digital switching to guarantee full saturation.',
    didYouKnow: [
      'The transistor was invented on 23 December 1947 — this date is celebrated as Transistor Day by electronics engineers worldwide',
      'A single transistor costs less than ₹1, yet the Nobel Prize in Physics 1956 was awarded for its invention',
      'A modern CPU (like Intel 13th Gen) has 25 billion transistors in an area smaller than a fingernail',
      'The first transistor was the size of your palm. Today, individual transistors are just 3 nanometres wide — 25,000× thinner than a human hair',
    ],
    howItWorks: [
      'STEP 1 — APPLY BASE VOLTAGE: Connect base to Arduino digital pin through resistor Rb (typically 1kΩ). When Arduino sends HIGH (5V), current flows through Rb into the base.',
      'STEP 2 — FORWARD BIAS: Base-emitter junction is a diode — it needs ≥0.7V to conduct. Once 0.7V is reached, base current Ib starts flowing.',
      'STEP 3 — AMPLIFICATION: The transistor amplifies: Ic = hFE × Ib. With hFE=200 and Ib=0.5mA, collector current can reach 100mA.',
      'STEP 4 — SATURATION: Transistor is now "fully ON" — collector-emitter voltage drops to ~0.2V. The load (motor/LED) receives nearly full supply voltage.',
      'STEP 5 — SWITCHING OFF: Arduino sends LOW (0V) → Vbe drops below 0.7V → no base current → transistor enters cut-off → collector current = 0 → load turns off.',
      'STEP 6 — PROTECTION DIODE: For inductive loads (motors, relays), always add a flyback diode (1N4007) across the load, cathode towards positive supply. This prevents voltage spikes from destroying the transistor when current is suddenly cut off.',
    ],
    realWorld: [
      'Arduino controlling a relay coil (relay then controls mains 230V AC appliances)',
      'Mobile phone speaker amplifier — transistor amplifies microphone signal to drive speaker',
      'Automatic garden watering system — soil moisture sensor triggers transistor → solenoid valve opens',
      'Every logic gate (AND, OR, NOT) in a digital circuit is made from transistors',
      'EV charging stations use power transistors (IGBTs) to control 400V at 100A+',
    ],
    industryScenarios: [
      {
        company: 'Tesla',
        useCase: 'Electric vehicle motor drive: IGBT transistors (power BJTs) switch 400V DC bus to control 3-phase AC motors. Each switch fires 10,000 times per second.',
        impact: 'Controls a 400kW motor with digital signals from a microcontroller — exact same principle you are learning, but at 100,000× higher power',
      },
      {
        company: 'ISRO (Indian Space Research Organisation)',
        useCase: 'Satellite attitude control — transistors switch thruster solenoids using signals from onboard computer. Precision: <1ms switching time.',
        impact: 'A ₹2 transistor switch helps keep a ₹500 crore satellite pointed correctly in orbit',
      },
      {
        company: 'Samsung',
        useCase: 'LED TV backlight control — millions of tiny transistors switch individual LED segments creating 4K HDR displays with 1000+ nit brightness',
        impact: 'Without transistor switching at nanosecond speeds, modern flat-panel displays would be impossible',
      },
    ],
    activities: [
      {
        title: 'Activity 1: LED Blink via Transistor Switch',
        duration: '20 minutes',
        materials: ['Arduino Uno', 'BC547 NPN transistor', '1kΩ resistor (base)', '470Ω resistor (LED)', 'LED (any colour)', 'Breadboard', 'Jumper wires'],
        steps: [
          'Place BC547 transistor on breadboard. Identify Base (B), Collector (C), Emitter (E) — hold flat side towards you: left=Collector, middle=Base, right=Emitter for BC547',
          'Connect Emitter directly to GND rail',
          'Connect 470Ω resistor from Collector to positive rail (+5V)',
          'Connect LED: anode to +5V, cathode to Collector',
          'Connect 1kΩ resistor from Arduino digital pin 9 to Base',
          'Upload blink sketch: digitalWrite(9, HIGH) turns LED ON, LOW turns OFF',
          'Measure Vbe with multimeter when ON — expect ~0.65-0.7V',
          'Now measure Vce when ON — expect ~0.2V (saturation)',
        ],
        expected: 'LED blinks controlled by Arduino through transistor. When you measure Vbe ≈ 0.7V ON, Vce ≈ 0.2V — you have confirmed saturation switching.',
      },
      {
        title: 'Activity 2: Control a 9V Motor with Transistor',
        duration: '25 minutes',
        materials: ['Arduino Uno', 'TIP120 Darlington transistor (for higher current)', '1kΩ resistor', '1N4007 flyback diode', 'Small DC motor (9V)', '9V battery + clip', 'Breadboard', 'Jumpers'],
        steps: [
          'IMPORTANT: 9V motor circuit is SEPARATE from Arduino 5V. Arduino only provides the control signal.',
          'Connect TIP120 Emitter to GND (common with Arduino GND)',
          'Connect motor: one terminal to 9V battery positive, other terminal to Collector',
          'Connect flyback diode: anode to Collector, cathode to 9V positive (protects from back-EMF)',
          'Connect 1kΩ from Arduino pin 9 to Base',
          'Upload: analogWrite(9, 128) = 50% speed, analogWrite(9, 255) = full speed',
          'Touch motor shaft carefully — observe speed change',
          'Try analogWrite values 0, 64, 128, 192, 255 and note speed difference',
        ],
        expected: 'Motor speed varies smoothly with analogWrite value, demonstrating PWM speed control via transistor. The flyback diode keeps the transistor safe.',
      },
    ],
    code: {
      language: 'cpp',
      note: 'This code demonstrates basic switching AND PWM speed control. Read every comment carefully before uploading.',
      code: `// NPN Transistor Switch + PWM Motor Speed Control
// Connect: Arduino pin 9 → 1kΩ → Base of transistor
// Motor/LED connected at Collector, Emitter to GND

const int CONTROL_PIN = 9;

void setup() {
  pinMode(CONTROL_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Transistor Switch Demo Started");
}

void loop() {
  // DEMO 1: Simple ON/OFF switching
  Serial.println("--- Simple Switch: ON ---");
  digitalWrite(CONTROL_PIN, HIGH);  // Transistor saturates → load ON
  delay(2000);
  
  Serial.println("--- Simple Switch: OFF ---");
  digitalWrite(CONTROL_PIN, LOW);   // Transistor cuts off → load OFF
  delay(2000);
  
  // DEMO 2: PWM speed / brightness control
  Serial.println("--- PWM Ramp UP ---");
  for (int speed = 0; speed <= 255; speed += 5) {
    analogWrite(CONTROL_PIN, speed);  // 0=off, 128=50%, 255=full
    Serial.print("Duty cycle: ");
    Serial.print(map(speed, 0, 255, 0, 100));
    Serial.println("%");
    delay(50);
  }
  
  Serial.println("--- PWM Ramp DOWN ---");
  for (int speed = 255; speed >= 0; speed -= 5) {
    analogWrite(CONTROL_PIN, speed);
    delay(50);
  }
  delay(1000);
}`,
    },
    commonMistakes: [
      {
        mistake: 'Connecting the transistor backwards (collector and emitter swapped)',
        why: 'BC547 pin order is Collector-Base-Emitter when flat side faces you. BC557 (PNP) has different pin order. Confusion is very common.',
        fix: 'Always check the datasheet for the specific transistor you are using. Google "[transistor part number] datasheet pinout" before wiring.',
      },
      {
        mistake: 'Forgetting the flyback diode when driving a motor or relay',
        why: 'When you cut current to a motor, the motor\'s inductance generates a large reverse voltage spike (back-EMF) that can instantly destroy the transistor',
        fix: 'Always add 1N4007 diode across any inductive load (motor, relay coil, solenoid). Cathode (+) towards power supply, Anode (-) towards collector.',
      },
      {
        mistake: 'Using the same ground for Arduino and high-power circuit WITHOUT connecting them',
        why: 'Without a common ground, the transistor base voltage has no reference point and the circuit does not work',
        fix: 'Connect Arduino GND to the GND rail of the motor/relay circuit. This is mandatory — without it, nothing works.',
      },
      {
        mistake: 'Making Rb too large (underdiving the base)',
        why: 'If Ib is too small, the transistor never reaches saturation. It operates in the linear region — it partially conducts, wastes power as heat, and the load barely works',
        fix: 'Always calculate Rb = (Vcc - 0.7) / (Ic/hFE). Use a slightly smaller resistor than calculated to ensure full saturation.',
      },
    ],
    troubleshooting: [
      {
        problem: 'Motor/LED does not turn ON when Arduino sends HIGH',
        cause: 'Most common causes: transistor is backwards, missing common GND, or no base resistor',
        fix: '1) Check transistor orientation with datasheet. 2) Verify GND of Arduino and GND of load circuit are connected. 3) Confirm base resistor is in place. 4) Measure Vbe with multimeter — should be ~0.7V when ON.',
      },
      {
        problem: 'Transistor gets very hot within seconds',
        cause: 'Transistor is in linear region (not fully saturated), dissipating power as heat. Usually means Rb is too large or transistor is wrong type for the load current.',
        fix: 'Reduce Rb value (try 470Ω instead of 1kΩ). If load current exceeds transistor specs, upgrade to TIP120, TIP122, or MOSFET (IRLZ44N for Arduino-compatible).',
      },
      {
        problem: 'Motor runs but transistor burns out frequently',
        cause: 'Flyback diode missing — back-EMF spikes are killing the transistor on each switch-off',
        fix: 'Add 1N4007 flyback diode across motor terminals. For faster switching, use 1N5819 Schottky diode (lower forward voltage = faster response).',
      },
      {
        problem: 'PWM speed control does not work — motor is either fully ON or fully OFF',
        cause: 'Motor inductance is filtering out the PWM pulses at low frequencies',
        fix: 'Increase PWM frequency (change Arduino timer settings) or use MOSFET instead of BJT (MOSFETs switch much faster). Alternatively add a small capacitor across motor terminals.',
      },
    ],
    miniProject: {
      title: 'Mini Project: Automatic Fan Speed Controller',
      description: 'Build a temperature-controlled fan where an NTC thermistor reads ambient temperature and automatically adjusts fan speed through a transistor. Fan runs faster when room is hotter.',
      time: '45 minutes',
      materials: ['Arduino Uno', 'TIP120 transistor', '10kΩ NTC thermistor', '10kΩ resistor (voltage divider)', '1kΩ base resistor', '1N4007 diode', 'Small 5V or 9V DC fan', 'Power supply matching fan voltage', 'Breadboard', 'Jumper wires'],
      steps: [
        'Build thermistor voltage divider: 10kΩ from +5V to A0, thermistor from A0 to GND',
        'Build transistor switch: 1kΩ from pin 9 to Base, fan from supply voltage to Collector, Emitter to GND, flyback diode across fan',
        'Upload code: read analogRead(A0), map temperature range to 0-255 for analogWrite',
        'Test: warm thermistor with finger — fan should speed up',
        'Calibrate: determine actual temperature vs resistance using datasheet or by measuring with thermometer',
        'Add LCD display showing temperature and fan speed %',
        'Add threshold: below 25°C fan OFF, 25-35°C partial speed, above 35°C full speed',
        'Document with Serial Monitor output showing temperature and PWM value',
      ],
      expectedOutput: 'Fan speed automatically adjusts with temperature. Serial Monitor shows real-time temperature and PWM duty cycle. Fan is off when cool, full speed when warm.',
      extensions: [
        'Add OLED display for temperature and speed gauge',
        'Log temperature vs time data to SD card',
        'Add over-temperature alarm with buzzer at >40°C',
        'Send temperature data to ThingSpeak dashboard via WiFi (ESP8266)',
      ],
    },
    logic: 'Transistor switching is binary logic implemented in hardware: base HIGH = output ON (boolean TRUE), base LOW = output OFF (boolean FALSE). This is exactly how digital computers work at the transistor level. Every AND gate, OR gate, and NOT gate in a CPU is built from transistors doing exactly what you just learned. Understanding the transistor switch means understanding the physical foundation of all digital technology.',
    revisionNotes: [
      'NPN transistor: 3 terminals — Base (input signal), Collector (load side), Emitter (ground side)',
      'Activation threshold: Vbe ≥ 0.7V for silicon BJT transistors',
      'Current gain: Ic = hFE × Ib (hFE typically 100-500 for BC547)',
      'Base resistor formula: Rb = (Vcc − 0.7) / Ib_min',
      'Saturation: Vce ≈ 0.2V (switch fully ON) | Cut-off: Ic = 0 (switch fully OFF)',
      'Flyback diode: ALWAYS required for inductive loads (motors, relays, solenoids)',
      'Common GND: Arduino GND and load circuit GND MUST be connected',
      'PWM via analogWrite(pin, 0-255) enables speed/brightness control through transistor',
    ],
    diagram: 'circuit',
    facts: [
      'BC547 transistor costs ₹2. The Nobel Prize awarded for its invention in 1956 is priceless.',
      'The first transistor amplified audio frequencies. Today\'s transistors switch 100 billion times per second.',
      'If automobiles improved as fast as transistors, a car today would cost 1 paisa and travel at the speed of light.',
    ],
    questions: [
      { qtype: 'mcq', prompt: 'What voltage must appear at the base-emitter junction to turn ON an NPN silicon transistor?', options: ['0.3V', '0.7V', '1.2V', '5V'], answer: '0.7V', explanation: 'Silicon PN junctions require ~0.7V forward bias to conduct. Germanium transistors (older) need only 0.3V.', difficulty: 'intermediate' },
      { qtype: 'computational', prompt: 'NPN transistor: hFE=200, load current required=100mA. Calculate minimum base current needed.', options: ['0.5mA', '5mA', '20mA', '200mA'], answer: '0.5mA', explanation: 'Ib_min = Ic/hFE = 100mA/200 = 0.5mA', difficulty: 'intermediate' },
      { qtype: 'brain_teaser', prompt: 'You remove the flyback diode from a motor circuit and switch the motor ON then OFF rapidly. What happens to the transistor?', options: ['Nothing changes', 'It heats up slightly', 'It likely gets destroyed by voltage spike', 'The motor spins faster'], answer: 'It likely gets destroyed by voltage spike', explanation: 'Motor inductance produces back-EMF spike (can be 10-50V) when current is cut. Without flyback diode, this spike hits the transistor collector and destroys it.', difficulty: 'advanced' },
      { qtype: 'logical', prompt: 'If hFE=200 and you want to ensure full saturation when switching a 500mA relay coil, what base current should you use and why?', answer: 'At minimum 2.5mA (500mA/200), but use 5mA (overdrive by 2×) to guarantee saturation despite component tolerance', difficulty: 'advanced' },
      { qtype: 'tinkering', prompt: 'Predict: if you increase Rb from 1kΩ to 10kΩ with a 5V Arduino and BC547 (hFE=200), what happens to a 100mA load? Show calculation.', answer: 'Ib=(5-0.7)/10000=0.43mA → Ic_max=0.43×200=86mA. Load only gets 86mA, not 100mA. Transistor may not fully saturate.', difficulty: 'advanced' },
    ],
  },

  // ─── CHAPTER 2 ──────────────────────────────────────────────────
  {
    title: 'Op-Amp Comparators',
    difficulty: 'advanced', est: 50,
    summary: 'Use LM358 op-amp in open-loop mode to compare voltages and make automatic switching decisions.',
    hook: 'Your room\'s thermostat knows EXACTLY when the room reached 24°C and turns off the AC without you touching it. How does electronics "know" when a value has been reached? The answer is an op-amp comparator — the simplest analog decision-making circuit.',
    objectives: [
      'Explain how an op-amp comparator makes a binary voltage decision',
      'Design a light-sensing circuit using LDR + comparator',
      'Calculate the reference voltage using a resistor voltage divider',
      'Describe what "open-loop gain" means and why it makes an op-amp a comparator',
      'Build a functional automatic night-light circuit',
    ],
    story: `In 1941, scientists needed a circuit that could accurately compare two voltages and decide which was larger. They needed this for radar systems — to decide if a received signal was above the noise threshold. They built the first operational amplifier (op-amp) from vacuum tubes the size of your fist.

The key discovery was this: if you amplify the DIFFERENCE between two signals by 100,000 times, even the tiniest difference (0.00001V) produces a massive output swing. When V+ is just slightly above V-, the output immediately slams to the maximum voltage. When V+ is just slightly below V-, the output immediately falls to zero.

This "slams fully" behaviour is called open-loop operation, and it makes an op-amp a perfect voltage comparator — a circuit that answers YES (output HIGH) or NO (output LOW) to the question: "Is V+ greater than V-?"

Today, this same principle controls the thermostat in your room, the charging circuit in your phone, and the fire detection system in your school.`,
    layman: 'An op-amp comparator is like a referee in a tug-of-war. V+ is one team, V- is the other. The referee (op-amp) has one job: raise the green flag (output HIGH) if V+ is winning, raise the red flag (output LOW) if V- is winning. The MOMENT either team gains even slightly, the referee immediately raises the appropriate flag. No middle ground — all or nothing.',
    analogies: [
      {
        concept: 'Open-loop gain of 100,000',
        analogy: 'Whispering in a stadium PA system',
        explanation: 'If you amplify a tiny whisper (0.00001V difference) by 100,000×, you get a booming sound that fills the whole stadium (full output voltage). This is why even 1μV of difference at the op-amp inputs produces full rail-to-rail output swing.',
      },
      {
        concept: 'V+ > V- → output HIGH',
        analogy: 'See-saw balance',
        explanation: 'Imagine a see-saw perfectly balanced. If V+ side adds even one gram of weight, the see-saw tilts completely to that side and stays there (output HIGH). Remove that gram and it tilts the other way instantly (output LOW). No middle position.',
      },
    ],
    concept: 'Op-amp open-loop mode: output = Aol × (V+ − V−) where Aol ≈ 100,000. Even 0.01mV difference produces 1V output. Since output is clamped to supply rails (0 to Vcc), V+ > V− → output = Vcc. V+ < V− → output = 0V. Reference voltage set by voltage divider: Vref = Vcc × R2/(R1+R2).',
    didYouKnow: [
      'The LM358 op-amp costs ₹5 and is one of the most sold electronic components of all time — over 1 billion units sold per year',
      'Op-amps were originally built from vacuum tubes and filled a 1-foot-tall metal chassis. Today, 4 op-amps fit in a package smaller than a fingernail (LM324)',
      'The "741" op-amp chip from 1968 is still in production today and still used in millions of circuits',
      'An ideal op-amp draws ZERO current at its input terminals — making measurement possible without disturbing the circuit being measured',
    ],
    howItWorks: [
      'STEP 1 — SET REFERENCE: Build a voltage divider using two resistors between Vcc and GND. The midpoint gives your reference voltage (Vref). This connects to V− (inverting input).',
      'STEP 2 — CONNECT SENSOR: Connect your sensor (LDR, thermistor, potentiometer) to V+ (non-inverting input). As conditions change, voltage at V+ changes.',
      'STEP 3 — COMPARE: Inside the op-amp, the difference (V+ − V−) is amplified 100,000×. If V+ > Vref, output = Vcc (HIGH). If V+ < Vref, output = 0V (LOW).',
      'STEP 4 — DRIVE OUTPUT: Output can drive LEDs, small buzzers, transistor bases. Cannot drive motors directly (add transistor for heavy loads).',
      'STEP 5 — ADJUST SENSITIVITY: Replace one fixed resistor in the divider with a potentiometer to create an adjustable reference — making your comparator circuit programmable without code.',
    ],
    realWorld: [
      'Room thermostat: comparator compares thermistor voltage to reference → drives relay for heater',
      'Automatic street lights: LDR comparator activates LED flood lights at dusk',
      'Phone battery charger: comparator monitors battery voltage, stops charging when full',
      'Fire alarm: thermistor comparator triggers siren when temperature exceeds threshold',
      'Water level indicator: electrode probes connect to comparator inputs — buzzer activates when tank full',
    ],
    industryScenarios: [
      {
        company: 'Honeywell',
        useCase: 'Industrial temperature controller: op-amp comparator inside thermostat chip compares thermocouple voltage to reference, switching industrial heaters in factories',
        impact: 'Thousands of industrial processes maintained at precise temperatures ±0.5°C using comparator circuits',
      },
      {
        company: 'Texas Instruments (TI)',
        useCase: 'Battery management IC (BQ2000): comparator monitors cell voltage to detect overcharge/overdischarge and disconnects battery pack',
        impact: 'Protects lithium batteries in every laptop, power tool, and EV from fire-causing overcharge conditions',
      },
    ],
    activities: [
      {
        title: 'Activity 1: Light-Activated Comparator Circuit',
        duration: '25 minutes',
        materials: ['LM358 op-amp IC', 'LDR (Light Dependent Resistor)', '10kΩ resistor (LDR voltage divider)', '10kΩ potentiometer (reference adjustment)', 'LED + 470Ω resistor', '5V power supply (Arduino 5V pin)', 'Breadboard', 'Jumper wires'],
        steps: [
          'Place LM358 on breadboard. Pin 8=V+supply, Pin 4=GND. We use only 1 of its 2 op-amps.',
          'REFERENCE side (Pin 2, inverting −): Connect 10kΩ pot between +5V and GND. Wiper (middle pin) to Pin 2.',
          'SENSOR side (Pin 3, non-inverting +): Connect 10kΩ fixed resistor from +5V to Pin 3, then LDR from Pin 3 to GND.',
          'OUTPUT (Pin 1): Connect to LED anode through 470Ω, then to GND.',
          'Power up. In normal light: V+ < V− (LDR has low resistance, V+ pulled down) → output LOW → LED off.',
          'Cover LDR with your hand: LDR resistance increases → V+ rises above Vref → output HIGH → LED on.',
          'Adjust pot to set the exact light level at which LED switches.',
        ],
        expected: 'LED turns on automatically in darkness and off in bright light. Potentiometer allows adjusting the threshold. No Arduino required — pure analog intelligence.',
      },
    ],
    code: {
      language: 'cpp',
      note: 'For Arduino-based comparator: read sensor on analog pin, compare to threshold in code. This is software implementation of the hardware comparator concept.',
      code: `// Software comparator: Arduino reads LDR and makes threshold decision
// Note: LM358 does this in hardware without ANY code — but this 
// shows the exact same logical operation in software

const int LDR_PIN = A0;
const int LED_PIN = 9;
const int THRESHOLD = 512;  // Vcc/2 = 2.5V = 512 in 10-bit ADC

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Comparator Demo");
  Serial.println("Cover the LDR with your hand to trigger the LED");
}

void loop() {
  int ldrValue = analogRead(LDR_PIN);  // 0-1023 (0V-5V)
  float voltage = (ldrValue / 1023.0) * 5.0;  // Convert to volts
  
  // This IF-ELSE IS exactly what an op-amp comparator does!
  if (ldrValue < THRESHOLD) {  // V+ < V- (dark condition)
    digitalWrite(LED_PIN, HIGH);  // Output HIGH = LED ON
    Serial.print("DARK: "); 
  } else {
    digitalWrite(LED_PIN, LOW);   // Output LOW = LED OFF
    Serial.print("BRIGHT: ");
  }
  
  Serial.print("ADC=");
  Serial.print(ldrValue);
  Serial.print(" Voltage=");
  Serial.print(voltage, 2);
  Serial.println("V");
  delay(200);
}`,
    },
    commonMistakes: [
      {
        mistake: 'Swapping V+ (non-inverting) and V− (inverting) inputs',
        why: 'If inputs are swapped, the output logic is inverted — LED turns ON in bright light and OFF in dark. The circuit works but does the opposite of what you want.',
        fix: 'LM358 Pin 3 = V+ (non-inverting), Pin 2 = V− (inverting). Check the IC datasheet. If the circuit does the opposite of expected, swap your two sensor connections.',
      },
      {
        mistake: 'Trying to use output to directly drive a large load',
        why: 'LM358 output can source/sink only 20-40mA. A motor or high-power LED will damage the IC.',
        fix: 'Use comparator output to drive the base of a transistor or the input of a relay driver. The comparator makes the decision; the transistor provides the power.',
      },
    ],
    troubleshooting: [
      {
        problem: 'Output is always HIGH regardless of light conditions',
        cause: 'V+ is always greater than V−. Either sensor wiring is wrong or reference is set too low.',
        fix: 'Measure V+ and V− with multimeter. Adjust potentiometer so Vref is BETWEEN the sensor voltages for dark and light conditions.',
      },
      {
        problem: 'Output oscillates/flickers at threshold point',
        cause: 'No hysteresis — tiny noise causes rapid switching. Very common with comparators at exact threshold.',
        fix: 'Add small positive feedback resistor (100kΩ) from output back to V+ input. This creates a Schmitt trigger — slight hysteresis prevents oscillation.',
      },
      {
        problem: 'IC gets hot immediately',
        cause: 'Power supply connected backwards or exceeds maximum (32V for LM358)',
        fix: 'Check polarity. Ensure Vcc is on Pin 8 and GND on Pin 4. Maximum supply is 32V; use 5V from Arduino.',
      },
    ],
    miniProject: {
      title: 'Mini Project: Smart Night-Light with Adjustable Threshold',
      description: 'Build a complete automatic night-light using LDR + LM358 comparator + transistor to drive an LED array. The sensitivity is adjustable with a potentiometer. No microcontroller needed — pure analog intelligence.',
      time: '50 minutes',
      materials: ['LM358 op-amp', 'LDR', '10kΩ pot (sensitivity control)', '10kΩ fixed resistor', 'BC547 transistor', '470Ω base resistor', '3× LEDs + 3×470Ω resistors', '9V battery', 'Breadboard'],
      steps: [
        'Build reference divider: 10kΩ pot between 9V and GND, wiper to Pin 2 of LM358',
        'Build LDR divider: 10kΩ from 9V to Pin 3, LDR from Pin 3 to GND',
        'Connect Pin 1 (output) through 470Ω to BC547 base',
        'Wire 3 LEDs in series with 3×470Ω (for 9V supply) from Collector to 9V, Emitter to GND',
        'Power up and test: cover LDR → comparator output HIGH → transistor ON → 3 LEDs ON',
        'Adjust pot to set desired sensitivity (what light level triggers the LEDs)',
        'Test in different lighting conditions: direct sunlight, indoor light, phone flashlight, total darkness',
        'Calculate: what is the Vref you set? What LDR resistance corresponds to your trigger point?',
      ],
      expectedOutput: '3 LEDs turn on automatically when room gets dark, off when light returns. Sensitivity adjustable with potentiometer. Complete automatic night-light with no code.',
      extensions: [
        'Replace LED array with relay to control mains lamp (have teacher supervise)',
        'Add time delay using RC circuit so light stays on for 30 seconds after darkness detected',
        'Add second comparator for different threshold (two-zone lighting)',
      ],
    },
    logic: 'The comparator is the simplest possible decision circuit — a 1-bit analog-to-digital converter. It converts a continuous analog voltage into a binary 1 or 0. This is the fundamental operation at the boundary between the analog and digital worlds. Every ADC (Analog-to-Digital Converter) in your microcontroller is essentially a bank of comparators operating simultaneously to measure voltage with precision.',
    revisionNotes: [
      'LM358 in open-loop mode: output = Vcc when V+ > V−, output = 0V when V+ < V−',
      'Open-loop gain: ~100,000× (even 0.01mV difference → full swing)',
      'Reference voltage: Vref = Vcc × R2/(R1+R2) using voltage divider',
      'LM358 pinout: Pin1=out1, Pin2=in1−, Pin3=in1+, Pin4=GND, Pin5=in2+, Pin6=in2−, Pin7=out2, Pin8=Vcc',
      'Output can source ~20mA — use transistor for loads > 20mA',
      'Schmitt trigger = comparator + positive feedback resistor → eliminates oscillation at threshold',
    ],
    diagram: 'ohm',
    facts: [
      'LM358 was designed in 1972 and is still manufactured and sold 50 years later — one of the most enduring electronic components ever created',
      'The entire auto-exposure system in early film cameras was controlled by a single op-amp comparator comparing photo-sensor voltage to a reference',
    ],
    questions: [
      { qtype: 'mcq', prompt: 'In LM358 comparator mode, what is the typical open-loop voltage gain?', options: ['100', '1,000', '100,000', 'Infinity'], answer: '100,000', difficulty: 'advanced' },
      { qtype: 'computational', prompt: 'Voltage divider reference: R1=10kΩ (top), R2=10kΩ (bottom), Vcc=5V. What is Vref?', options: ['1V', '2.5V', '3.3V', '5V'], answer: '2.5V', explanation: 'Vref = 5 × 10/(10+10) = 5 × 0.5 = 2.5V', difficulty: 'intermediate' },
      { qtype: 'brain_teaser', prompt: 'You build a thermostat but the heater turns ON when room is hot and OFF when cold — the opposite of what you want. What single change fixes this?', options: ['Swap Vcc and GND', 'Swap V+ and V− inputs', 'Change resistor values', 'Replace LM358 with LM741'], answer: 'Swap V+ and V− inputs', difficulty: 'intermediate' },
      { qtype: 'logical', prompt: 'Why does the comparator output "flicker" at exactly the threshold? What circuit modification prevents this?', answer: 'At threshold, tiny noise causes V+ and V- to alternate above/below each other rapidly. Fix: add hysteresis with small positive feedback resistor from output to V+ (Schmitt trigger).', difficulty: 'advanced' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────
//  MODULE 2: AUTONOMOUS ROBOTICS — Grade 9 (Chapter 1 exemplar)
// ─────────────────────────────────────────────────────────────────────
export const richRoboticsChapters: ChapterSpec[] = [
  {
    title: 'Wheel Encoders and Odometry',
    difficulty: 'advanced', est: 55,
    summary: 'Use quadrature encoders to measure exact wheel rotation and calculate robot position and distance.',
    hook: 'You set your robot to drive forward for exactly 1 metre and stop. Without encoders, it might travel 0.8m or 1.3m depending on battery level and surface friction. This unreliability makes autonomous robots useless. Encoders solve this completely — your robot will hit within 2mm of target, every time.',
    objectives: [
      'Explain how an optical encoder converts rotation into countable electrical pulses',
      'Calculate distance travelled from encoder pulse count and wheel circumference',
      'Implement an interrupt-driven encoder counter on Arduino',
      'Understand quadrature encoding and how direction is determined',
      'Use encoder feedback to make a robot drive a precise distance',
    ],
    story: `In 1962, NASA engineers faced a problem. They were building the first robotic rover for the Moon. The rover had to navigate rough terrain and return to a landing site — without GPS, without landmarks, without human guidance.

Their solution: attach a shaft encoder to each wheel. Count the rotations. Multiply by circumference. You know exactly how far the rover has travelled. This technique is called odometry (from Greek: "odos" = road, "metron" = measure).

The same principle that helped early NASA rovers find their way on the Moon is what you are about to put in your robot today. Modern Mars rovers use the same concept, just with more sophisticated computer processing.

Every robot vacuum cleaner (Roomba), every autonomous warehouse robot, and every self-driving car uses encoders for position tracking. When your robot returns to exactly its starting point after a complex journey, it is doing odometry — the same mathematics used in space exploration.`,
    layman: 'Imagine you are blindfolded in an empty room. To track where you are, you count your steps (each step = ~75cm). After 20 steps, you know you are ~15m from your starting point. A wheel encoder does exactly this for your robot: each click = a tiny known distance. Count the clicks, and you know exactly how far the wheel has turned.',
    analogies: [
      {
        concept: 'Pulse counting for distance measurement',
        analogy: 'Bicycle odometer (speedometer)',
        explanation: 'A bicycle odometer has a small magnet on the wheel and a sensor on the fork. Each time the magnet passes the sensor (one full rotation), the odometer counts +1. Odometer reading × wheel circumference = total distance. Your encoder does the same thing, just 200-500 times per revolution for much higher precision.',
      },
      {
        concept: 'PPR (Pulses Per Revolution)',
        analogy: 'Clock minute hand ticks',
        explanation: 'A clock second hand ticks 60 times per revolution. If you want to know the angle, count the ticks (30 ticks = 180°). Higher resolution = more ticks per revolution. An encoder with 200 PPR is like a clock with 200 second marks — 4× more precise than a normal clock.',
      },
    ],
    concept: 'Optical encoder: LED shines through slots in a rotating disc. Photodetector counts light pulses. PPR = Pulses Per Revolution (typically 100-500 for hobby encoders, up to 10,000 for industrial). Distance per pulse = wheel_circumference / PPR. Quadrature: 2 sensors A and B offset by 90° determine direction (A leads B = forward; B leads A = backward).',
    didYouKnow: [
      'The Mars Curiosity rover used 6 wheel encoders to track position with centimetre accuracy while navigating for years across Mars terrain',
      'High-precision industrial encoders (for CNC machines) have 10,000 pulses per revolution — they can measure rotation of just 0.036° (1/10,000th of a full circle)',
      'The computer mouse you may have used as a child had a rubber ball encoder inside — the ball turned two encoder wheels (X and Y) to track cursor position',
      'Modern phone cameras use optical encoders for lens autofocus positioning — your camera focus is essentially odometry at microscale',
    ],
    howItWorks: [
      'DISC: Encoder disc with evenly spaced slots/holes is attached to the wheel axle or motor shaft. The disc spins as the wheel rotates.',
      'DETECTION: An LED shines through the slots. A photodetector on the other side sees light pulses (slot = light passes = logic HIGH, spoke = light blocked = logic LOW).',
      'INTERRUPT: Each rising edge of the pulse signal triggers a hardware interrupt on Arduino. The interrupt service routine (ISR) increments a pulse counter.',
      'CALCULATION: Distance = (pulse_count / PPR) × wheel_circumference. Robot moves this distance every time it reads and resets the counter.',
      'DIRECTION (quadrature): Two sensors (A, B) placed 90° apart on the disc. When moving forward: A triggers BEFORE B. Backward: B triggers BEFORE A. Check B state when A fires to determine direction.',
      'POSITION TRACKING: For full 2D tracking, use two encoders (left and right wheels). Difference in counts = rotation. Average = forward translation. This is basic differential drive odometry.',
    ],
    realWorld: [
      'Roomba robot vacuum: encoders on both wheels for complete room mapping',
      'CNC milling machine: encoders on all 3 axes for sub-millimetre positioning',
      'Electric wheelchair: encoders prevent drift and maintain straight path',
      'Elevator floor detection: encoder on motor shaft counts cable movement to reach exact floor',
      'Industrial pick-and-place robot arms: joint encoders for precise part placement',
    ],
    industryScenarios: [
      {
        company: 'Amazon Robotics',
        useCase: 'Kiva warehouse robots use wheel encoders for precise shelf retrieval. 800,000 robots navigate 3 million square metre warehouses using odometry combined with floor QR codes.',
        impact: 'Amazon ships 3.5 million packages daily — encoder-based robots make this possible at this scale without human picking',
      },
      {
        company: 'Haidilao (Chinese Restaurant Chain)',
        useCase: 'Robot waiters serve food using wheel encoders for navigation. Path programmed once; encoder ensures robot follows exact path every time regardless of surface conditions.',
        impact: 'First demonstration that encoder odometry can achieve restaurant-quality service reliability in dynamic human environments',
      },
    ],
    activities: [
      {
        title: 'Activity 1: Count Encoder Pulses on Serial Monitor',
        duration: '20 minutes',
        materials: ['Arduino Uno', 'HC-020K wheel encoder module (or manual photointerrupter + disc)', 'Robot chassis with motors (or just spin the encoder disc by hand)', 'USB cable', 'Arduino IDE'],
        steps: [
          'Connect encoder: VCC to 5V, GND to GND, OUT to Arduino digital pin 2 (interrupt-capable)',
          'Upload pulse counter code (see code section below)',
          'Open Serial Monitor at 9600 baud',
          'Slowly turn the encoder disc by hand — watch pulse count increment on Serial Monitor',
          'Mark a start position on the disc. Turn it exactly one full revolution. Record PPR (pulses per revolution).',
          'Now multiply: PPR × wheel circumference = distance per revolution (verify matches your wheel size)',
          'Drive the robot 1 metre: predict how many pulses needed. Then drive and measure actual count.',
        ],
        expected: 'Serial Monitor shows incrementing pulse count. You discover the PPR of your encoder. You can predict distance from pulse count with <5% error.',
      },
      {
        title: 'Activity 2: Drive Precise Distance Using Encoder Feedback',
        duration: '25 minutes',
        materials: ['Same robot as Activity 1', 'Ruler or tape measure', 'Masking tape (to mark start/stop)', 'Notebook to record accuracy results'],
        steps: [
          'Measure wheel circumference: wheel_circ = π × diameter (measure with ruler)',
          'Calculate target pulses: pulses = (distance_cm / wheel_circ_cm) × PPR',
          'For 50cm: if wheel circ = 20cm and PPR = 200 → 50/20 × 200 = 500 pulses',
          'Upload encoder-controlled drive code (motor on until pulse count reached, then stop)',
          'Mark start line with tape. Command robot to drive exactly 50cm.',
          'Measure actual distance from start line to robot front. Record error in mm.',
          'Repeat 5 times and record average error. (Good result: < ±1cm error)',
          'Try 100cm, 150cm. Does error scale proportionally?',
        ],
        expected: 'Robot reliably stops within 1-2cm of target distance. You have built a closed-loop position controller — one of the most fundamental skills in robotics.',
      },
    ],
    code: {
      language: 'cpp',
      note: 'Use hardware interrupts (not polling) for encoder counting. Polling misses pulses at high speed. Interrupt-driven counting works perfectly even at maximum robot speed.',
      code: `// Encoder-Controlled Distance Drive
// Encoder OUT pin connected to Arduino Pin 2 (INT0 - hardware interrupt)
// Motor driver: L298N or L293D connected to pins 5 (PWM speed) and 6,7 (direction)

const int ENCODER_PIN = 2;   // Must be interrupt-capable pin (2 or 3 on Uno)
const int MOTOR_PWM = 5;
const int MOTOR_DIR1 = 6;
const int MOTOR_DIR2 = 7;

// ⚠️ CHANGE THESE VALUES TO MATCH YOUR ROBOT
const float PPR = 200.0;           // Pulses per revolution (measure empirically)
const float WHEEL_CIRC_CM = 20.4;  // Wheel circumference in cm (π × diameter)

volatile long pulseCount = 0;     // volatile: modified in ISR, read in main loop

// Interrupt Service Routine - called on every rising edge from encoder
void encoderISR() {
  pulseCount++;  // Increment counter atomically
}

void driveDistance(float targetCm, int speed) {
  float targetPulses = (targetCm / WHEEL_CIRC_CM) * PPR;
  
  // Reset counter
  pulseCount = 0;
  
  // Drive forward
  digitalWrite(MOTOR_DIR1, HIGH);
  digitalWrite(MOTOR_DIR2, LOW);
  analogWrite(MOTOR_PWM, speed);  // 0-255
  
  Serial.print("Driving ");
  Serial.print(targetCm);
  Serial.print("cm (target pulses: ");
  Serial.print(targetPulses);
  Serial.println(")");
  
  // Wait until target pulses reached
  while (pulseCount < targetPulses) {
    // Slow down in last 20 pulses to reduce overshoot
    if (targetPulses - pulseCount < 20) {
      analogWrite(MOTOR_PWM, 100);  // Slow down near target
    }
    delay(1);
  }
  
  // Stop motor
  analogWrite(MOTOR_PWM, 0);
  
  float actualCm = (pulseCount / PPR) * WHEEL_CIRC_CM;
  Serial.print("Stopped at ");
  Serial.print(actualCm);
  Serial.print("cm (");
  Serial.print(pulseCount);
  Serial.println(" pulses)");
}

void setup() {
  Serial.begin(9600);
  pinMode(ENCODER_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ENCODER_PIN), encoderISR, RISING);
  
  pinMode(MOTOR_PWM, OUTPUT);
  pinMode(MOTOR_DIR1, OUTPUT);
  pinMode(MOTOR_DIR2, OUTPUT);
  
  delay(2000);  // Wait for Serial Monitor to open
  
  // Drive 50cm, wait 2s, drive back 50cm
  driveDistance(50.0, 180);
  delay(2000);
  // Reverse direction for return
  digitalWrite(MOTOR_DIR1, LOW); digitalWrite(MOTOR_DIR2, HIGH);
  driveDistance(50.0, 180);
}

void loop() {}  // Everything done in setup for this demo`,
    },
    commonMistakes: [
      {
        mistake: 'Using digitalRead() in a loop to count encoder pulses instead of hardware interrupts',
        why: 'At typical robot speed, encoder generates 500-2000 pulses/second. A loop() iteration takes 1-10ms. You will miss most pulses. Your distance calculations will be wildly inaccurate.',
        fix: 'Always use attachInterrupt() for encoder counting. Connect encoder to pin 2 or 3 (Uno interrupt pins). Use volatile keyword for the counter variable.',
      },
      {
        mistake: 'Not using volatile keyword for the pulse counter variable',
        why: 'The compiler may cache the variable in a register, and the ISR-updated value in memory never gets reflected in the main loop. Your counter reads stale data.',
        fix: 'Declare: volatile long pulseCount = 0; The volatile keyword tells the compiler: "always read this from memory, never cache it."',
      },
      {
        mistake: 'Not measuring PPR experimentally — using estimated or catalogue values',
        why: 'Cheap encoder modules often have actual PPR different from labelled value. Using wrong PPR causes systematic distance error in every measurement.',
        fix: 'Measure PPR empirically: count pulses for exactly one wheel revolution (mark starting position). Use this measured value in code.',
      },
    ],
    troubleshooting: [
      {
        problem: 'Pulse count stays at zero even when wheel is turning',
        cause: 'Most common: encoder not powered, signal wire not on interrupt pin, or pullup resistor missing',
        fix: '1) Verify encoder VCC connected to 5V. 2) Confirm OUT wire is on pin 2 or 3 (Uno). 3) Add INPUT_PULLUP or external 10kΩ pullup to 5V on signal wire.',
      },
      {
        problem: 'Robot consistently overshoots or undershoots the target distance',
        cause: 'PPR value in code does not match actual encoder PPR, or wheel diameter measured incorrectly',
        fix: 'Re-measure PPR experimentally. Re-measure wheel diameter carefully (include tyre deformation under weight). Also ensure robot drives on same surface as calibrated.',
      },
      {
        problem: 'Count increments erratically, sometimes jumping by multiple pulses',
        cause: 'Switch bounce or noise on the encoder signal line',
        fix: 'Add small capacitor (100nF) between signal line and GND to filter noise. Or use encoder module with built-in comparator (HC-020K has this).',
      },
    ],
    miniProject: {
      title: 'Mini Project: Square Path Navigator',
      description: 'Program your robot to drive a perfect 1-metre × 1-metre square using only encoder feedback. The robot starts, drives 4 equal sides, and stops exactly at its starting point.',
      time: '60 minutes',
      materials: ['2-wheel differential drive robot', 'Two wheel encoders (one per drive wheel)', 'L298N motor driver', 'Arduino Uno', 'USB cable', 'Tape measure', 'Coloured tape to mark the square corners'],
      steps: [
        'Measure and mark a 100cm × 100cm square on the floor with tape',
        'Calibrate left and right wheel PPR independently (they may differ slightly)',
        'Write driveDistance(cm) function using left encoder',
        'Write turnDegrees(deg) function using both encoders: right forward + left backward for in-place turn',
        'For 90° turn: measure experimentally — run turnDegrees(90) and measure actual angle, then correct',
        'Combine: driveDistance(100) + turn(90) × 4 = one complete square',
        'Mark the robot front with tape. Run the program and measure how far the robot ends from its start position.',
        'Target: < 5cm final position error. Achieve < 2cm for excellence.',
      ],
      expectedOutput: 'Robot drives a visible square and stops within 5cm of starting point. No straight lines or 90° angles are drawn in code — they emerge purely from encoder measurement.',
      extensions: [
        'Add second encoder to right wheel and average both for better accuracy',
        'Programme a triangle (120° turns) and a pentagon (72° turns)',
        'Add a pen holder and draw the square on paper (2D plotter!)',
      ],
    },
    logic: 'Encoder odometry is dead reckoning — predicting current position from a known starting point + counted motion. It is the same mathematical concept as integration in calculus: summing infinitesimal distance increments to get total displacement. Errors accumulate over time (drift), which is why long-distance robots combine odometry with GPS or laser landmarks for correction. The interplay between integration (odometry) and absolute references (GPS) is a fundamental problem in any estimation system.',
    revisionNotes: [
      'Encoder type: optical (LED + disc) or magnetic (magnet + Hall effect sensor)',
      'PPR = Pulses Per Revolution — the resolution of your encoder',
      'Distance per pulse = wheel_circumference / PPR',
      'Always use hardware interrupt (attachInterrupt) — never polling in a loop',
      'volatile keyword mandatory for variables modified in ISR',
      'Quadrature (2-channel): channel A and B 90° apart determine direction',
      'Measure PPR experimentally — do not trust labels on cheap encoders',
    ],
    diagram: 'flow',
    facts: [
      'The first robotic encoder odometry was used by Shakey the Robot at Stanford AI Lab in 1966 — the first mobile robot that could reason about its own actions',
      'Modern CNC machine encoders can detect shaft rotation as small as 0.0000036° — about 100 million times finer than the human eye can perceive',
    ],
    questions: [
      { qtype: 'computational', prompt: 'Encoder PPR=200, wheel diameter=6.5cm. Circumference = π×6.5=20.4cm. How many pulses for 1 metre drive?', options: ['200', '490', '980', '2000'], answer: '980', explanation: 'Target pulses = (100cm / 20.4cm) × 200 = 4.9 × 200 = 980 pulses', difficulty: 'advanced' },
      { qtype: 'mcq', prompt: 'Why must the pulse counter variable be declared volatile?', options: ['To make it faster', 'To prevent compiler from caching it, ensuring ISR updates are seen in main loop', 'To make it persist after reset', 'volatile is optional — just good practice'], answer: 'To prevent compiler from caching it, ensuring ISR updates are seen in main loop', difficulty: 'advanced' },
      { qtype: 'brain_teaser', prompt: 'Your robot drives 100cm forward but encoder reads 980 pulses when it should be 1000 for 100cm. Is the robot over-shooting or under-shooting? What is the actual distance travelled?', answer: 'Under-shooting: actual distance = (980/1000) × 100cm = 98cm. Robot stopped 2cm short of target.', difficulty: 'advanced' },
      { qtype: 'logical', prompt: 'A robot uses single-wheel odometry. After driving a 3m × 3m square, the return error is 15cm. What would reduce this error? Name 2 improvements.', answer: '1) Use two encoders (one per wheel) and average them. 2) Reduce PPR error by better calibration. 3) Use shorter segments with correction points.', difficulty: 'advanced' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────
//  MODULE 3: IOT PIPELINES — Grade 9 (Chapter 1 exemplar)
// ─────────────────────────────────────────────────────────────────────
export const richIoTChapters: ChapterSpec[] = [
  {
    title: 'MQTT: Publish-Subscribe Protocol',
    difficulty: 'intermediate', est: 45,
    summary: 'Implement MQTT publish/subscribe for reliable, lightweight IoT device messaging.',
    hook: 'In 1998, engineers at ExxonMobil had a problem: thousands of oil pipeline sensors spread across hundreds of kilometres needed to send data back to control rooms over unreliable satellite links. They needed a protocol that worked with slow, intermittent connections and tiny data packets. What they invented — MQTT — now powers Facebook Messenger, Amazon Alexa, and your future IoT projects.',
    objectives: [
      'Explain the publish-subscribe model using the newspaper analogy',
      'Describe MQTT broker, publisher, and subscriber roles',
      'Configure ESP8266 to publish sensor data to HiveMQ public broker',
      'Subscribe to a topic and trigger an action on receiving a message',
      'Explain the 3 QoS levels and when to use each',
    ],
    story: `Imagine a newspaper company in a small town. Instead of delivering newspapers to 1000 houses one by one (that would take forever and require knowing every address), the company puts newspapers on a central newsstand. Each person who WANTS the newspaper subscribes to it at the newsstand. When a new edition arrives, every subscriber gets it automatically.

This is exactly how MQTT works:
- The newsstand = the MQTT broker (running on a server)
- The printing press = the publisher (your ESP8266 sensor)
- The subscriber = any device that wants the data (your phone app, dashboard, or another ESP)

The genius of this design: the sensor does not know or care who is reading its data. It just publishes to the broker. The phone app does not know or care which sensor provides the data. It just subscribes to a topic. They are completely independent.

This independence is what makes IoT systems scalable. You can add 100 more sensors tomorrow without changing the phone app. You can add 50 more dashboards without changing the sensor code. The broker handles all the routing.`,
    layman: 'MQTT is like a WhatsApp group. Your sensor (temperature room) joins the group and posts messages. Your phone app, your laptop dashboard, and your LED display all join the same group. When the sensor posts "Temperature: 28°C", everyone in the group gets it instantly. Nobody needs each other\'s address — just the group name (topic).',
    analogies: [
      {
        concept: 'Publish-Subscribe decoupling',
        analogy: 'FM Radio broadcast',
        explanation: 'A radio station broadcasts on 98.3 FM (the topic). It does not know how many people are listening or who they are. Anyone who tunes to 98.3 FM receives the broadcast. The station and listeners are completely independent. Adding more listeners requires no changes at the radio station. MQTT topics work exactly the same way.',
      },
      {
        concept: 'QoS levels',
        analogy: 'Mail delivery reliability',
        explanation: 'QoS 0 = dropping a letter in a mailbox (fire and forget — no confirmation). QoS 1 = registered post (guaranteed delivery, but might get 2 copies if acknowledgment lost). QoS 2 = certified mail with signature (guaranteed exactly-once delivery, slowest). Choose QoS based on how critical your data is.',
      },
    ],
    concept: 'MQTT broker routes messages by topic strings (e.g., "home/kitchen/temperature"). Publisher sends: client.publish("topic", "message", QoS). Subscriber registers: client.subscribe("topic") with callback function. QoS 0: fire-forget. QoS 1: at-least-once delivery. QoS 2: exactly-once. Wildcards: + matches one level, # matches all sub-levels.',
    howItWorks: [
      'BROKER starts: HiveMQ/Mosquitto broker runs on server or cloud, manages all topic routing',
      'CONNECT: Each device connects to broker with unique ClientID, username/password (for secured brokers)',
      'SUBSCRIBE: Device registers interest: client.subscribe("home/fan", callback). Now whenever any publisher sends to "home/fan", this device callback fires.',
      'PUBLISH: Sensor sends: client.publish("home/temp", "25.4"). Broker receives and immediately delivers to all current subscribers of "home/temp".',
      'RETAIN: Optionally, broker stores the LAST message on a topic. New subscribers immediately receive the last value, even if no one has published recently.',
      'WILL: "Last Will" message — broker publishes this message if device disconnects unexpectedly. Used to detect offline devices.',
    ],
    realWorld: [
      'Facebook Messenger: uses MQTT to deliver messages to your phone (battery-efficient, handles poor connections)',
      'Amazon Alexa: MQTT for command delivery from cloud to Echo devices',
      'Philips Hue smart lights: MQTT between hub and bulbs for sub-100ms response',
      'Hospital patient monitors: MQTT for real-time vital sign streaming to nurses station',
      'Home Assistant home automation: MQTT integration for all custom DIY devices',
    ],
    activities: [
      {
        title: 'Activity 1: First MQTT Publish/Subscribe',
        duration: '30 minutes',
        materials: ['ESP8266 NodeMCU', 'DHT11 temperature sensor', 'USB cable', 'Arduino IDE with ESP8266 board support', 'Free HiveMQ public broker (broker.hivemq.com:1883)', 'MQTT Explorer app (free, for phone/PC to monitor messages)'],
        steps: [
          'Install libraries: PubSubClient by Nick O\'Leary, DHT sensor library',
          'Configure WiFi and MQTT: set SSID, password, broker=broker.hivemq.com, port=1883',
          'Create unique client ID (use your name + random number to avoid conflicts)',
          'In setup(): connect WiFi, then connect to MQTT broker',
          'In loop(): read DHT11 temperature and publish to "yourname/sensor/temperature" every 5 seconds',
          'Open MQTT Explorer on phone/PC, connect to broker.hivemq.com, subscribe to your topic',
          'Watch your temperature readings appear in real-time in MQTT Explorer from ESP8266',
          'Extension: subscribe your ESP8266 to "yourname/led" topic — control LED from MQTT Explorer',
        ],
        expected: 'Temperature readings visible in MQTT Explorer in real-time. LED toggles when you send "ON"/"OFF" messages from Explorer. You have working pub/sub IoT communication.',
      },
    ],
    code: {
      language: 'cpp',
      note: 'This code implements both publisher (DHT11 temperature) and subscriber (LED control). Study each section carefully — this is the complete bidirectional MQTT IoT pattern.',
      code: `#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// ── CONFIGURE THESE ───────────────────────────────────────────
const char* WIFI_SSID     = "Your_WiFi_Name";
const char* WIFI_PASS     = "Your_WiFi_Password";
const char* MQTT_BROKER   = "broker.hivemq.com";  // Free public broker
const int   MQTT_PORT     = 1883;
const char* CLIENT_ID     = "RoboTinker_YourName_001"; // Must be UNIQUE
const char* PUB_TEMP      = "robotinker/YourName/temperature";
const char* PUB_HUM       = "robotinker/YourName/humidity";
const char* SUB_LED       = "robotinker/YourName/led";
// ──────────────────────────────────────────────────────────────

#define DHT_PIN 4    // D2 on NodeMCU
#define LED_PIN 2    // Built-in LED (active LOW on NodeMCU)
#define DHT_TYPE DHT11

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient espClient;
PubSubClient mqtt(espClient);

// CALLBACK: runs when a subscribed message arrives
void onMessage(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) message += (char)payload[i];
  
  Serial.print("MSG received on ["); Serial.print(topic);
  Serial.print("]: "); Serial.println(message);
  
  if (String(topic) == SUB_LED) {
    if (message == "ON") {
      digitalWrite(LED_PIN, LOW);   // LOW = ON for built-in LED
      Serial.println("LED ON");
    } else if (message == "OFF") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED OFF");
    }
  }
}

void connectMQTT() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to MQTT... ");
    if (mqtt.connect(CLIENT_ID)) {
      Serial.println("Connected!");
      mqtt.subscribe(SUB_LED);  // Subscribe after (re)connecting
      mqtt.publish(PUB_TEMP, "Device Online");  // Announce online
    } else {
      Serial.print("Failed, rc="); Serial.print(mqtt.state());
      Serial.println(" Retry in 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);  // LED off initially
  dht.begin();
  
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(" Connected! IP: " + WiFi.localIP().toString());
  
  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(onMessage);
  connectMQTT();
}

unsigned long lastSend = 0;
void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();  // MUST be called every loop to process incoming messages
  
  // Publish sensor data every 10 seconds
  if (millis() - lastSend > 10000) {
    lastSend = millis();
    float temp = dht.readTemperature();
    float hum  = dht.readHumidity();
    
    if (!isnan(temp) && !isnan(hum)) {
      char buf[10];
      dtostrf(temp, 4, 1, buf);
      mqtt.publish(PUB_TEMP, buf);
      dtostrf(hum, 4, 1, buf);
      mqtt.publish(PUB_HUM, buf);
      Serial.printf("Published: T=%.1f°C  H=%.1f%%\\n", temp, hum);
    }
  }
}`,
    },
    commonMistakes: [
      {
        mistake: 'Using the same ClientID for multiple devices',
        why: 'MQTT broker requires unique ClientIDs. If two devices use the same ID, they will continuously kick each other off the broker — both devices will constantly reconnect and fail.',
        fix: 'Make ClientID unique: use your device MAC address, or add a random suffix. ESP.getChipId() gives a unique number per ESP8266.',
      },
      {
        mistake: 'Forgetting mqtt.loop() call in the main loop()',
        why: 'mqtt.loop() processes incoming messages and sends keep-alive pings to broker. Without it, you will never receive subscribed messages and the broker will disconnect your client.',
        fix: 'Always have mqtt.loop() as one of the first lines in your Arduino loop() function.',
      },
      {
        mistake: 'Not re-subscribing after reconnection',
        why: 'When connection drops and reconnects, all subscriptions are lost. Your callback will never fire for subscribed topics.',
        fix: 'In your connectMQTT() function, call mqtt.subscribe() after every successful mqtt.connect().',
      },
    ],
    troubleshooting: [
      {
        problem: 'Cannot connect to MQTT broker (rc=-2)',
        cause: 'WiFi not connected, wrong broker address, or broker port blocked by router firewall',
        fix: 'Verify WiFi is connected first (WiFi.status() == WL_CONNECTED). Try telnet broker.hivemq.com 1883 from PC to test connectivity.',
      },
      {
        problem: 'Subscribed messages never arrive',
        cause: 'Not calling mqtt.loop(), wrong topic name (case sensitive!), or not re-subscribing after reconnect',
        fix: 'Topics are case-sensitive: "home/Temp" ≠ "home/temp". Add Serial.println in callback to debug. Verify mqtt.loop() is in main loop().',
      },
    ],
    miniProject: {
      title: 'Mini Project: 2-Room IoT Temperature Monitor with Remote Fan Control',
      description: 'Use two ESP8266 boards: one publishes temperature from each "room", one subscribes and controls a fan based on received temperature. All communication via MQTT — boards do not know each other\'s IP addresses.',
      time: '60 minutes',
      materials: ['2× ESP8266 NodeMCU', '2× DHT11 sensors', '1× small 5V fan', '1× transistor (BC547)', '1× 1kΩ resistor', '1× 1N4007 diode', 'USB cables (2×)', '2× laptops or same laptop + USB hub'],
      steps: [
        'SENSOR NODE 1: Publishes to "demo/room1/temperature" every 5s',
        'SENSOR NODE 2: Publishes to "demo/room2/temperature" every 5s',
        'CONTROLLER NODE (same as Sensor Node 1 or separate): Subscribes to BOTH room topics',
        'Logic: if any room > 30°C, publish "ON" to "demo/fan/control"',
        'FAN NODE (can be Node 2): Subscribes to "demo/fan/control", drives transistor-fan circuit',
        'Test: warm up DHT11 sensor → fan turns on → fan OFF when temperature drops',
        'Add: publish fan status ("RUNNING"/"IDLE") to "demo/fan/status" topic',
        'Dashboard: use MQTT Explorer to view all 3 topics in real-time with history',
      ],
      expectedOutput: 'Temperature from 2 "rooms" visible on MQTT Explorer. Fan automatically switches based on temperature threshold. All nodes communicate without knowing each other — true IoT architecture.',
      extensions: [
        'Add ThingSpeak integration: subscribe on PC and forward data to ThingSpeak for graphing',
        'Add mobile notifications: use IFTTT or Node-RED to send WhatsApp alert when temperature > threshold',
        'Create 3rd subscriber: LCD display showing all sensor values',
      ],
    },
    logic: 'MQTT\'s publish-subscribe pattern is the same architectural principle behind React state management (event bus), database triggers, and Unix signals. Producers and consumers are decoupled — they do not need to know about each other. This separation of concerns is a fundamental software engineering principle that scales from your two-ESP project to Facebook\'s billion-user infrastructure.',
    revisionNotes: [
      'MQTT roles: Broker (router), Publisher (sends), Subscriber (receives with callback)',
      'Topic format: hierarchical with / separator: "home/kitchen/temperature"',
      'ClientID must be UNIQUE per device — use MAC address or random suffix',
      'QoS 0=fire-forget, 1=at-least-once, 2=exactly-once (slower)',
      'Always call mqtt.loop() every iteration of Arduino loop()',
      'Re-subscribe after every reconnection to broker',
      'Wildcards: + = one level, # = all sub-levels',
      'Public free broker for testing: broker.hivemq.com port 1883',
    ],
    diagram: 'iot',
    facts: [
      'Facebook Messenger uses MQTT — that is why messages arrive on your phone even in areas with very weak signal',
      'MQTT was invented in 1999 by Andy Stanford-Clark of IBM — originally for oil pipeline monitoring via satellite',
    ],
    questions: [
      { qtype: 'mcq', prompt: 'What does the MQTT broker do?', options: ['Generates sensor data', 'Routes messages from publishers to matching subscribers', 'Stores all IoT data permanently', 'Encrypts all communications'], answer: 'Routes messages from publishers to matching subscribers', difficulty: 'intermediate' },
      { qtype: 'mcq', prompt: 'QoS 1 guarantees:', options: ['Exactly one delivery', 'At-least-once delivery (may duplicate)', 'Fastest delivery', 'No delivery guarantee'], answer: 'At-least-once delivery (may duplicate)', difficulty: 'intermediate' },
      { qtype: 'brain_teaser', prompt: 'Two ESP8266 units have the same ClientID. What happens when both try to connect to the broker?', answer: 'They continuously kick each other offline. When #2 connects, broker disconnects #1. Then #1 reconnects, disconnecting #2. Infinite reconnect loop.', difficulty: 'advanced' },
      { qtype: 'logical', prompt: 'Subscribe to "home/+/temperature" — which topics does this match?', options: ['Only home/temperature', 'home/kitchen/temperature AND home/bedroom/temperature (but NOT home/floor1/room1/temperature)', 'All temperature topics anywhere', 'Nothing — invalid syntax'], answer: 'home/kitchen/temperature AND home/bedroom/temperature (but NOT home/floor1/room1/temperature)', difficulty: 'advanced' },
    ],
  },
];
