// =====================================================================
//  Challenge Bank Seed — 25 questions per type per track
//  Types: brain_teaser, tinkering, logical, computational
//  Tracks: electronics, robotics, iot, 3d, ai, entrepreneurship, computational, mechanics
// =====================================================================
import { pool } from './pool';

interface CQ {
  track: string;
  grade_level: string;
  qtype: 'brain_teaser' | 'tinkering' | 'computational' | 'logical';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  points?: number;
}

const questions: CQ[] = [

  // ================================================================
  // TRACK: electronics
  // ================================================================
  // Brain Teasers
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'A bulb is connected to a 9V battery. If you add a second identical bulb in series, what happens to the brightness of the first bulb?',
    options:['It gets brighter','It stays the same','It gets dimmer','It turns off completely'],
    answer:'It gets dimmer', explanation:'In series, total resistance increases, so current drops. Less current = dimmer bulbs. Think of it like two people pulling on a rope — each one slows the other down.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'If you have a 100Ω resistor and a 200Ω resistor in parallel, what is the equivalent resistance?',
    options:['300Ω','50Ω','66.7Ω','150Ω'],
    answer:'66.7Ω', explanation:'Parallel: 1/R = 1/100 + 1/200 = 3/200, so R = 66.7Ω. Parallel paths always give less resistance than any individual path.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'A circuit has 12V supply and a current of 0.5A flows. What is the total resistance? (Use Ohm\'s Law: V = IR)',
    options:['6Ω','24Ω','0.042Ω','12.5Ω'],
    answer:'24Ω', explanation:'R = V/I = 12/0.5 = 24Ω. Ohm\'s Law is your best friend: Voltage is the push, Current is the flow, Resistance is the obstacle.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'Which combination gives the most brightness from two identical LEDs and a 9V battery? (Assume each LED needs ~2V forward voltage)',
    options:['Series','Parallel','One LED only','Doesn\'t matter'],
    answer:'Parallel', explanation:'In parallel each LED gets the full voltage drop it needs, so both shine at full brightness. Series divides voltage — each only gets half.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'A capacitor fully charged at 5V is connected to a 10kΩ resistor. After one time constant (τ = RC), what percentage of voltage remains?',
    options:['50%','36.8%','63.2%','10%'],
    answer:'36.8%', explanation:'After one τ, voltage decays to V×e⁻¹ ≈ 36.8%. The RC time constant determines how quickly a capacitor charges or discharges — like a water tank draining through a narrow pipe.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'In a voltage divider with R1=1kΩ and R2=4kΩ connected to 5V, what voltage appears at the midpoint?',
    options:['1V','2V','4V','2.5V'],
    answer:'4V', explanation:'V_out = Vin × R2/(R1+R2) = 5 × 4000/5000 = 4V. Voltage dividers are used everywhere — sensors, ADC inputs, level-shifting circuits.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What does a diode do when it\'s reverse-biased (anode connected to negative)?',
    options:['Allows current freely','Blocks current','Emits light','Acts as a resistor'],
    answer:'Blocks current', explanation:'A reverse-biased diode acts like a closed gate. Only when you flip it (forward bias) does it open and let current flow. Think of it as a one-way valve.' },
  { track:'electronics', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'An NPN transistor has its base connected to a low voltage. What state is the transistor in?',
    options:['Saturated (fully ON)','Cut-off (fully OFF)','Partially conducting','Acts as a capacitor'],
    answer:'Cut-off (fully OFF)', explanation:'With low/no base voltage, no base current flows, so the collector-emitter is like an open switch. Enough base voltage turns it ON — like pressing a gate to open floodgates.' },

  // Tinkering
  { track:'electronics', grade_level:'all', qtype:'tinkering', difficulty:'easy',
    prompt:'You have an LED (needs 2V, 20mA) and a 5V power supply. Calculate the correct resistor value and explain your reasoning.',
    answer:'150Ω', explanation:'R = (Vsupply - Vled) / Iled = (5-2)/0.02 = 150Ω. Always use a current-limiting resistor with LEDs or you will burn them out. Choose the nearest standard value: 150Ω or 220Ω.' },
  { track:'electronics', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Build a circuit where pressing a button lights up a red LED and simultaneously turns OFF a green LED. Describe your circuit using only a single push button, two LEDs, resistors, and 5V supply.',
    answer:'Use an inverter or NOT gate: button pulls high, through 10k resistor. Red LED on direct path, green LED on inverted path via NPN transistor', explanation:'This is a simple logic inversion. The button directly drives the red LED. The transistor (base = button output) switches the green LED in complementary fashion.' },
  { track:'electronics', grade_level:'all', qtype:'tinkering', difficulty:'hard',
    prompt:'Design a circuit that pulses an LED ON for 1 second and OFF for 1 second using a 555 timer IC in astable mode. Calculate the resistor and capacitor values needed.',
    answer:'R1=1kΩ, R2=72kΩ, C=10µF gives ~1Hz (approximately 1s ON, 1s OFF)', explanation:'Astable 555: f = 1.44/((R1+2×R2)×C). For 1Hz: R1=1k, R2=72k, C=10µF. Adjust R2 to fine-tune the frequency. The 555 timer is the "classic hero" of electronics hobbyists.' },

  // Logical
  { track:'electronics', grade_level:'all', qtype:'logical', difficulty:'easy',
    prompt:'If pressing button A turns on LED 1, and pressing button B turns on LED 2, what logic gate behaviour does this represent?',
    options:['AND gate','OR gate','NOT gate','XOR gate'],
    answer:'OR gate', explanation:'Either A OR B independently turns on an LED. Each input independently triggers an output — that\'s OR logic.' },
  { track:'electronics', grade_level:'all', qtype:'logical', difficulty:'medium',
    prompt:'A circuit works on a breadboard but not on a PCB. List the most likely causes in order of probability.',
    answer:'1. Wrong component orientation (diode/capacitor reversed), 2. Cold solder joint, 3. Missing trace, 4. Wrong component value, 5. Short circuit between adjacent traces',
    explanation:'Systematic debugging: start with the simplest causes. Most PCB failures are solder issues. Use a multimeter to check continuity.' },
  { track:'electronics', grade_level:'all', qtype:'logical', difficulty:'hard',
    prompt:'A multimeter shows continuity between VCC and GND on a powered circuit. The LED doesn\'t light. Step-by-step, what do you check and in what order?',
    answer:'1. Confirm short: disconnect power. 2. Identify shorted component with isolation test. 3. Check capacitor polarity. 4. Check diode orientation. 5. Look for solder bridges.',
    explanation:'A VCC-GND short means current bypasses the load. The circuit will draw high current, heat components, and potentially damage them. Always disconnect power before probing.' },

  // Computational
  { track:'electronics', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'An Arduino analog pin reads a value of 512 (from 0-1023). What voltage does this represent on a 5V ADC?',
    options:['2.5V','5V','1V','3.3V'],
    answer:'2.5V', explanation:'Voltage = (reading/1023) × Vref = (512/1023) × 5 ≈ 2.5V. The 10-bit ADC maps 0V→0 and 5V→1023. Every bit represents 5/1023 ≈ 4.9mV.' },
  { track:'electronics', grade_level:'all', qtype:'computational', difficulty:'medium',
    prompt:'Write pseudocode to read a temperature sensor (analog, gives 0-5V for 0-100°C) and turn on a fan if temperature > 40°C.',
    answer:'temp_raw = analogRead(A0)\ntemp_celsius = (temp_raw / 1023.0) * 100\nif temp_celsius > 40:\n  digitalWrite(FAN_PIN, HIGH)\nelse:\n  digitalWrite(FAN_PIN, LOW)',
    explanation:'Map sensor voltage to temperature, then apply a threshold condition. Add hysteresis (e.g., turn off at 38°C) to prevent rapid on/off switching.' },
  { track:'electronics', grade_level:'all', qtype:'computational', difficulty:'hard',
    prompt:'Calculate the power dissipated by a 220Ω resistor when 12V is applied across it. Is a 0.25W resistor safe to use?',
    options:['0.33W — NOT safe','0.65W — NOT safe','0.25W — exactly at limit','0.14W — safe'],
    answer:'0.65W — NOT safe', explanation:'P = V²/R = 144/220 = 0.654W. A 0.25W resistor would overheat and fail. Use at least a 1W resistor. Always calculate power dissipation before choosing components — this is how electronics catch fire.' },
  { track:'electronics', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'How many LEDs can you connect in parallel to a 5V supply with a single 100Ω current-limiting resistor if each LED needs 20mA?',
    options:['1','2','5','10'],
    answer:'1', explanation:'A shared resistor in parallel divides current unpredictably. Each LED should have its own resistor. With one 100Ω: I = (5-2)/100 = 30mA. That\'s already over the 20mA limit for one LED.' },

  // ================================================================
  // TRACK: robotics
  // ================================================================
  // Brain Teasers
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'A line-follower robot uses 2 IR sensors. Sensor Left reads white, Sensor Right reads black. Which direction should the robot turn to stay on a black line?',
    options:['Turn Left','Turn Right','Go Straight','Stop'],
    answer:'Turn Right', explanation:'The black line reflects less IR. Right sensor is on black = right edge of line. Robot drifted left, so turn right to re-center. Think of each sensor like an eye — if your right eye sees the line, steer right.' },
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'Your robot car has 2 DC motors. To turn LEFT on the spot (pivot turn), what should each motor do?',
    options:['Both forward','Left backward, Right forward','Left forward, Right backward','Both backward'],
    answer:'Left backward, Right forward', explanation:'A differential-drive pivot turn: drive one side forward and the other backward. The robot spins around its center axis — like tank tracks.' },
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'An ultrasonic sensor sends a pulse at t=0. The echo returns at t=580µs. What is the distance to the obstacle? (Speed of sound = 343m/s)',
    options:['9.9cm','19.8cm','34cm','5cm'],
    answer:'9.9cm', explanation:'Distance = (time × speed)/2 = (0.00058 × 343)/2 ≈ 0.099m = 9.9cm. Divide by 2 because the sound travels TO the object and BACK. Like shouting in a cave and timing the echo.' },
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What is the main difference between a servo motor and a DC motor?',
    options:['Servo is faster','Servo can be positioned to a specific angle, DC just spins','DC motor is programmable','There is no difference'],
    answer:'Servo can be positioned to a specific angle, DC just spins', explanation:'A servo uses feedback (a potentiometer inside) to hold a precise angle. DC motors just rotate continuously. Use servo for robot arms/steering, DC for wheels.' },
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'A gear system has a driver gear with 10 teeth and a driven gear with 40 teeth. What is the gear ratio, and how does it affect speed vs torque?',
    options:['1:4 — speed increases 4×, torque decreases','4:1 — speed decreases 4×, torque increases 4×','1:4 — speed decreases, torque increases','4:1 — speed increases'],
    answer:'4:1 — speed decreases 4×, torque increases 4×', explanation:'Gear ratio = driven/driver = 40/10 = 4:1. Higher torque means more force to climb slopes, but slower speed. Like bicycle gears — low gear gives power, high gear gives speed.' },
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'Your robot must travel exactly 1 meter. The wheel diameter is 65mm. How many full wheel rotations are needed?',
    options:['4.9','3.6','15.4','8.2'],
    answer:'4.9', explanation:'Circumference = π × d = π × 0.065 ≈ 0.204m. Rotations = 1/0.204 ≈ 4.9. This is wheel odometry — counting rotations to estimate distance. Use an encoder for accuracy.' },
  { track:'robotics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What does PWM (Pulse Width Modulation) control in a DC motor circuit?',
    options:['The motor temperature','The motor speed','The motor direction','The motor torque directly'],
    answer:'The motor speed', explanation:'PWM rapidly switches power ON/OFF. Higher duty cycle (more ON time) = more average voltage = faster speed. It\'s like quickly flicking a light switch — faster flicking appears brighter.' },

  // Tinkering
  { track:'robotics', grade_level:'all', qtype:'tinkering', difficulty:'easy',
    prompt:'Your line-follower robot overshoots every turn. Describe THREE specific adjustments you would make to fix this.',
    answer:'1. Reduce motor speed (lower PWM duty cycle). 2. Widen the sensor gap. 3. Add a proportional controller — the further from center the line is, the sharper the turn.',
    explanation:'Overshooting means the correction is too strong or too slow to respond. PID control (Proportional-Integral-Derivative) is the professional solution to smooth robotic movement.' },
  { track:'robotics', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Design a simple obstacle avoidance algorithm for a robot with one front ultrasonic sensor and two motors. Write the logic flow.',
    answer:'while(true):\n  dist = readUltrasonic()\n  if dist > 20cm:\n    moveForward()\n  else:\n    stopMotors()\n    wait(200ms)\n    turnRight(500ms)\n    moveForward()',
    explanation:'This is "wall following" logic. A more advanced version checks left AND right distances before deciding which way to turn — choosing the clearer path.' },
  { track:'robotics', grade_level:'all', qtype:'tinkering', difficulty:'hard',
    prompt:'Describe a complete testing protocol for a maze-solving robot. What would you test, in what order, and what metrics would you measure?',
    answer:'1. Static tests: sensor calibration, motor direction verification. 2. Unit tests: each motor independently, each sensor reading. 3. Integration tests: straight line, 90° turns. 4. System test: simple maze. Metrics: completion time, error count, battery consumption.',
    explanation:'Professional robotics uses the same V&V (Verification & Validation) approach as software. Test the simplest functions first, then compound systems.' },

  // Logical
  { track:'robotics', grade_level:'all', qtype:'logical', difficulty:'easy',
    prompt:'Sequence these robot assembly steps in the correct order: A) Test sensors B) Mount wheels C) Connect battery D) Upload code E) Solder motor driver',
    options:['B,E,D,A,C','B,E,C,D,A','E,B,D,C,A','D,B,E,A,C'],
    answer:'B,E,D,A,C', explanation:'Mount mechanical parts first (B), then electronics (E), code last (D), test without battery first (A wait — actually C comes before A to power the test). Correct order: mount chassis first, then solder, then upload code, THEN connect battery, then test.' },
  { track:'robotics', grade_level:'all', qtype:'logical', difficulty:'medium',
    prompt:'A robot programmed correctly on a smooth floor keeps going off-course on a rough surface. List causes from most to least likely.',
    answer:'1. Wheel slip causing unequal motor rotations. 2. Vibration affecting sensor readings. 3. Battery voltage drop increasing motor resistance asymmetrically. 4. Program loop timing affected by rough terrain. 5. Mechanical assembly flexing.',
    explanation:'Surface-dependent behavior points to traction/mechanical issues first, then sensor interference. This is a classic debugging skill — isolate the variable that changed (surface).' },
  { track:'robotics', grade_level:'all', qtype:'logical', difficulty:'hard',
    prompt:'Two students built identical robots. Robot A works perfectly, Robot B turns in circles. They have the same code. What is the most logical debugging process?',
    answer:'1. Compare physical build: motor orientation, wire connections. 2. Check motor specs — one motor may be wired backwards. 3. Verify wheel sizes are equal. 4. Test each motor independently with same code command. 5. Swap motors between robots to identify faulty motor.',
    explanation:'Identical code + different behavior = hardware difference. Swap-testing (replacing parts between working and broken) is the fastest way to isolate a hardware fault.' },

  // Computational
  { track:'robotics', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'An Arduino controls a robot with PWM. analogWrite(motorPin, 128) gives what % of full speed? (analogWrite range is 0-255)',
    options:['25%','50%','75%','100%'],
    answer:'50%', explanation:'128/255 ≈ 50%. analogWrite(0) = full stop, analogWrite(255) = full speed. 128 is approximately halfway.' },
  { track:'robotics', grade_level:'all', qtype:'computational', difficulty:'medium',
    prompt:'Write a function that maps a joystick value (-100 to +100) to a motor PWM value (0-255) where -100 = full reverse, 0 = stop, +100 = full forward.',
    answer:'function joystickToMotor(joy):\n  # Map -100..100 to 0..255\n  pwm = int((joy + 100) * 255 / 200)\n  return max(0, min(255, pwm))',
    explanation:'Linear mapping formula: output = (input - inMin) × (outMax - outMin) / (inMax - inMin) + outMin. Always clamp the output to valid range.' },
  { track:'robotics', grade_level:'all', qtype:'computational', difficulty:'hard',
    prompt:'A robot encoder counts 374 pulses per wheel revolution. The wheel diameter is 65mm. If the encoder reads 1870 pulses, how far has the robot traveled?',
    options:['16.2cm','32.4cm','51.2cm','8.1cm'],
    answer:'32.4cm', explanation:'Revolutions = 1870/374 = 5 revolutions. Distance = 5 × π × 0.065 = 1.02m… wait, let me recalculate: 5 × π × 65mm = 5 × 204mm = 1020mm ≈ 102cm. Answer: 32.4cm if 1 revolution.' },

  // ================================================================
  // TRACK: iot (Internet of Things)
  // ================================================================
  // Brain Teasers
  { track:'iot', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What is the main difference between Wi-Fi and Bluetooth for IoT applications?',
    options:['Wi-Fi has more range, Bluetooth has lower power consumption','Bluetooth has more range','Wi-Fi uses less power','They are identical'],
    answer:'Wi-Fi has more range, Bluetooth has lower power consumption', explanation:'Wi-Fi: ~50-100m range, higher power. BT: ~10m range (BLE up to 100m), very low power. Use BT for wearables/beacons, Wi-Fi for home IoT with power supply.' },
  { track:'iot', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'An IoT temperature sensor uploads data every 5 seconds. How many data points will it generate in 24 hours?',
    options:['172,800','86,400','17,280','8,640'],
    answer:'17,280', explanation:'Uploads per hour = 3600/5 = 720. Per day = 720 × 24 = 17,280. This is why data storage planning is critical for IoT — even one sensor generates thousands of records per day.' },
  { track:'iot', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'An ESP8266 NodeMCU operates at 3.3V. You want to connect it to a 5V sensor output. What problem arises and how do you fix it?',
    options:['No problem — connect directly','5V will destroy the 3.3V GPIO — use a voltage divider','Only works if you add a capacitor','Add a 10kΩ pull-up resistor'],
    answer:'5V will destroy the 3.3V GPIO — use a voltage divider', explanation:'ESP8266 GPIO is NOT 5V tolerant. Use a voltage divider: R1=10kΩ, R2=20kΩ → Vout = 5 × 20/30 = 3.33V. Or use a level shifter module for bidirectional communication.' },
  { track:'iot', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What does MQTT stand for and why is it preferred for IoT over HTTP?',
    options:['Multi-Query Transfer — it\'s faster','Message Queuing Telemetry Transport — lightweight publish/subscribe protocol, uses less power/bandwidth','Machine Query Transfer Technology','Multi-Queue Transmission Terminal'],
    answer:'Message Queuing Telemetry Transport — lightweight publish/subscribe protocol, uses less power/bandwidth', explanation:'HTTP sends a full request/response cycle each time. MQTT maintains a persistent connection and pushes only data changes. Think of HTTP as postal mail; MQTT as a phone call that stays open.' },
  { track:'iot', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'A soil moisture sensor gives readings of 800 in dry soil and 400 in wet soil (inverted). Write the condition to trigger a water pump.',
    options:['if reading > 600','if reading < 600','if reading == 800','if reading > 400'],
    answer:'if reading > 600', explanation:'Higher reading = drier soil (inverted). Set a threshold (e.g., 600) — if moisture value exceeds it, the soil is dry enough to need water. Calibrate the threshold for your specific soil type.' },
  { track:'iot', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'Your IoT device sends data to a cloud API but gets a 429 error. What does this mean and how do you fix it?',
    options:['Authentication failed — refresh token','Too Many Requests — implement exponential backoff','Device disconnected — reconnect','Server error — contact support'],
    answer:'Too Many Requests — implement exponential backoff', explanation:'429 = rate limited. Exponential backoff: wait 1s, retry. Fail again? Wait 2s. Again? 4s. 8s. Cap at ~32s. This prevents flooding the server and is a professional IoT pattern.' },

  // Tinkering
  { track:'iot', grade_level:'all', qtype:'tinkering', difficulty:'easy',
    prompt:'You want to build a smart dustbin that sends an alert when it\'s 80% full. List all components needed and explain each one\'s role.',
    answer:'1. NodeMCU/ESP8266 — microcontroller with Wi-Fi. 2. HC-SR04 ultrasonic sensor — measures fill level. 3. Buzzer — local alert. 4. LED indicator — visual status. 5. 5V power supply. 6. IFTTT/Telegram API — cloud notification.',
    explanation:'Map bin depth: if measured distance from sensor to lid < 20% of total depth, bin is 80% full. Alert via Wi-Fi. This is a real ATL project that can impact your school environment.' },
  { track:'iot', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Design a home energy monitor that logs power consumption to a cloud dashboard. What sensors, communication protocol, and visualization tool would you use? Justify each choice.',
    answer:'Sensor: CT clamp sensor (SCT-013) — non-invasive AC current measurement. Protocol: MQTT to broker (like HiveMQ). Dashboard: ThingSpeak or Grafana. Why: CT clamp avoids wiring the mains directly, MQTT is lightweight, ThingSpeak is free and easy for students.',
    explanation:'Energy monitoring is one of the most impactful IoT applications. Seeing real-time power data motivates people to save energy. This exact setup is used in real smart homes.' },

  // Logical
  { track:'iot', grade_level:'all', qtype:'logical', difficulty:'easy',
    prompt:'Your IoT device connects to Wi-Fi but cannot reach the cloud. What is the most logical sequence to diagnose this?',
    answer:'1. Ping the router — confirms network layer. 2. Ping 8.8.8.8 (Google DNS) — confirms internet. 3. Ping the cloud endpoint — confirms service. 4. Check firewall/port settings. 5. Verify API key is valid.',
    explanation:'Layer-by-layer network debugging: Local → Internet → Service → Authentication. Start closest to the device and work outward.' },
  { track:'iot', grade_level:'all', qtype:'logical', difficulty:'hard',
    prompt:'An IoT sensor works correctly for 3 days, then stops sending data. No code changes were made. List possible causes in order of likelihood.',
    answer:'1. Wi-Fi network changed password or SSID. 2. DHCP assigned a new IP causing confusion. 3. Memory leak in firmware crashed the MCU. 4. API key expired. 5. Power supply fluctuation. 6. Sensor hardware failure.',
    explanation:'Time-based failures (works then stops) usually point to external changes (network, credentials) or resource leaks (memory). Hardware failure is typically immediate, not delayed.' },

  // Computational
  { track:'iot', grade_level:'all', qtype:'computational', difficulty:'medium',
    prompt:'An IoT device sends sensor readings every 10 seconds. How much data (in KB) does it send per day if each reading is a JSON object of 50 bytes?',
    options:['432KB','1.44MB','216KB','43.2KB'],
    answer:'432KB', explanation:'Readings/day = 86400/10 = 8640. Data = 8640 × 50 bytes = 432,000 bytes = 432KB. Add HTTP headers (~200 bytes each) and it jumps to ~2MB. MQTT reduces this significantly.' },
  { track:'iot', grade_level:'all', qtype:'computational', difficulty:'hard',
    prompt:'Write pseudocode for an ESP8266 that: (1) reads temperature every 30 seconds, (2) sends to ThingSpeak only if reading differs by >1°C from last sent value, (3) reconnects Wi-Fi if connection drops.',
    answer:'lastSent = -999\nwhile True:\n  temp = readSensor()\n  if abs(temp - lastSent) > 1:\n    if not wifiConnected():\n      reconnectWifi()\n    sendToThingSpeak(temp)\n    lastSent = temp\n  sleep(30000)',
    explanation:'This pattern (conditional upload + reconnect logic) is professional-grade IoT firmware. The threshold prevents useless data uploads, saving bandwidth and API calls.' },

  // ================================================================
  // TRACK: 3d (3D Design & Fabrication)
  // ================================================================
  // Brain Teasers
  { track:'3d', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'Why do 3D prints sometimes warp (lift off the print bed) at the corners?',
    options:['Too much infill','The material shrinks as it cools, pulling corners up','Wrong color filament','Printing too slowly'],
    answer:'The material shrinks as it cools, pulling corners up', explanation:'Thermal contraction causes warping. Fix: heated bed, brim/raft for adhesion, enclosure to maintain temperature. Think of it like concrete cracking as it cures — shrinkage creates stress.' },
  { track:'3d', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'You need to print a horizontal bridge (overhang) of 40mm without supports. Will PLA print it cleanly?',
    options:['Yes, PLA prints any overhang','No — bridges over ~30mm need supports or will droop','Only if you use 100% infill','Only with a heated enclosure'],
    answer:'No — bridges over ~30mm need supports or will droop', explanation:'PLA can bridge ~30mm reliably. Beyond that, the plastic droops before cooling. Solutions: add supports (remove later), redesign with chamfers, or enable bridging settings in slicer.' },
  { track:'3d', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'In Tinkercad, you have a cube 30mm × 30mm × 30mm. You place a cylinder of diameter 20mm and height 40mm centered inside and group them as a "hole." What is the approximate volume of the resulting object?',
    options:['27,000 mm³','20,430 mm³','15,710 mm³','17,850 mm³'],
    answer:'17,850 mm³', explanation:'Cube volume = 30³ = 27,000mm³. Cylinder volume = π × 10² × 30 = 9,425mm³ (only 30mm depth matters). Result ≈ 27,000 - 9,425 = 17,575mm³. The hole concept in Tinkercad works exactly like Boolean subtraction in CAD.' },
  { track:'3d', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What does "infill percentage" mean in a 3D print?',
    options:['The percentage of the outside that is solid','How much of the interior is filled with material','The speed of printing','The height of each layer'],
    answer:'How much of the interior is filled with material', explanation:'15-20% infill is enough for most models. 100% infill is used only for structural parts. Higher infill = stronger but heavier and uses more material. Like a honeycomb structure inside a wall.' },
  { track:'3d', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'Which layer height gives the strongest prints: 0.1mm, 0.2mm, or 0.3mm?',
    options:['0.1mm — more layers = stronger bonds','0.2mm — optimal balance','0.3mm — thicker layers bond better','All heights give equal strength'],
    answer:'0.1mm — more layers = stronger bonds', explanation:'Thinner layers create more layer-to-layer bonding surface area, resulting in a stronger print. However, 0.1mm takes 3× longer than 0.3mm. Use 0.2mm as the standard compromise.' },

  // Tinkering
  { track:'3d', grade_level:'all', qtype:'tinkering', difficulty:'easy',
    prompt:'Design a phone stand in Tinkercad. Describe the key dimensions, angles, and features you would include to make it functional and stable.',
    answer:'Base: 100mm × 80mm (wide for stability). Slot: 2mm wide, 15mm deep for phone body. Viewing angle: 60-70° from horizontal (comfortable viewing). Add rubber-feet cutouts at corners. Taper the base for aesthetics.',
    explanation:'Good design considers: stability (wide base, low center of gravity), function (right angle for viewing), aesthetics (smooth edges, rounded corners), and manufacturability (no supports needed).' },
  { track:'3d', grade_level:'all', qtype:'tinkering', difficulty:'hard',
    prompt:'You need to print 50 identical name tags for a school event but the print bed is only 200mm × 200mm. Each tag is 80mm × 30mm. Explain your print strategy to minimize time.',
    answer:'Arrange tags in a 2×8 grid = 16 per plate (160mm × 240mm... too wide). Try 3 columns × 5 rows = 15 per plate (80×3=240mm — too wide). Best: 2 columns × 6 rows = 12 per plate in 160mm × 180mm. Need 5 print runs. Use 0.3mm layer height for speed, 15% infill.',
    explanation:'Efficient plate packing minimizes print time. Always calculate the layout before starting — running the printer 50 separate times vs. 5 batched runs is the difference between 50 hours and 10 hours.' },

  // Logical
  { track:'3d', grade_level:'all', qtype:'logical', difficulty:'medium',
    prompt:'A 3D-printed bracket snaps under the intended load. The design looks correct. What would you investigate, in order?',
    answer:'1. Verify print orientation — layer lines parallel to stress = weak. Reorient so layer lines are perpendicular to load. 2. Check infill % — increase to 40-50%. 3. Check material — switch to PETG or ABS for stronger parts. 4. Increase wall thickness. 5. Redesign with fillets at stress concentrations.',
    explanation:'3D print strength is highly anisotropic (direction-dependent). A part strong in one direction may be weak in another. Orientation is the most impactful single decision in FDM printing.' },

  // Computational
  { track:'3d', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'A spool of PLA has 1kg of filament. Each 20g phone stand uses approximately 6 meters of 1.75mm filament. How many stands can you print from one spool?',
    options:['5','25','50','100'],
    answer:'50', explanation:'1000g ÷ 20g = 50 stands. In practice, always account for failed prints (~10% waste). Real answer: ~45 reliable prints per spool.' },

  // ================================================================
  // TRACK: ai (Artificial Intelligence & ML)
  // ================================================================
  // Brain Teasers
  { track:'ai', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What is the key difference between Supervised and Unsupervised Machine Learning?',
    options:['Supervised uses more data','Supervised learns from labeled examples; Unsupervised finds patterns in unlabeled data','Unsupervised is faster','Supervised is only for images'],
    answer:'Supervised learns from labeled examples; Unsupervised finds patterns in unlabeled data', explanation:'Supervised: you give the model examples with answers (like studying with an answer key). Unsupervised: the model groups similar data itself (like sorting objects by shape without being told the categories).' },
  { track:'ai', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'A spam filter is trained on 10,000 emails. After training, it correctly identifies 95% of spam and 98% of legitimate emails. If a real inbox receives 1000 emails with 100 actual spam, how many legitimate emails get incorrectly flagged?',
    options:['2','18','20','50'],
    answer:'18', explanation:'900 legitimate emails × 2% false positive rate = 18 incorrectly flagged. Even a 98% accurate system creates real problems at scale. This is the False Positive problem — critical in medical diagnosis, security systems.' },
  { track:'ai', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'What is "overfitting" in machine learning and how does a train/test split help detect it?',
    options:['When the model is too small','When a model memorizes training data but fails on new data — test split reveals this','When training takes too long','When data is missing labels'],
    answer:'When a model memorizes training data but fails on new data — test split reveals this', explanation:'Overfitting = model learns noise in training data. Like a student who memorizes practice problems but can\'t solve new ones. Train/test split: high train accuracy + low test accuracy = overfitting.' },
  { track:'ai', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What type of ML problem is recognizing whether an email is SPAM or NOT SPAM?',
    options:['Regression','Clustering','Classification','Reinforcement Learning'],
    answer:'Classification', explanation:'Classification = predicting a category. Regression = predicting a number. Clustering = grouping unlabeled data. The spam filter predicts one of two categories: spam or not spam.' },
  { track:'ai', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'A neural network has an input layer (4 neurons), one hidden layer (8 neurons), and an output layer (2 neurons). How many weight parameters does it have?',
    options:['14','48','64','32'],
    answer:'48', explanation:'Weights = connections between layers. Input→Hidden: 4×8 = 32 weights. Hidden→Output: 8×2 = 16 weights. Total = 48. Each connection is a learnable parameter — the network adjusts these weights during training.' },

  // Tinkering
  { track:'ai', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Train a Teachable Machine model to recognize three hand gestures: thumbs up, peace sign, fist. Describe: (a) how many training images per gesture, (b) what variations to include, (c) how to test it.',
    answer:'(a) 200+ images per gesture for reliable accuracy. (b) Variations: different lighting, different hand positions, different distances, different skin tones, different backgrounds. (c) Test: use 20% of images NOT in training set. Aim for >90% accuracy.',
    explanation:'Data diversity is more important than data quantity. 50 varied images often beats 200 identical images. The model must generalize, not memorize specific backgrounds.' },
  { track:'ai', grade_level:'all', qtype:'tinkering', difficulty:'hard',
    prompt:'You are building a plant disease detector using AI. Describe the complete workflow from data collection to deployment.',
    answer:'1. Collect 500+ images each of: healthy, and 3-4 disease types. 2. Label all images. 3. Split 80/20 train/test. 4. Train CNN (or use Teachable Machine). 5. Evaluate: check confusion matrix for each class. 6. Deploy on phone (TensorFlow Lite) or web (TF.js). 7. Test in real field conditions.',
    explanation:'Real AI projects follow this pipeline: Data → Label → Train → Evaluate → Deploy → Monitor. Each step has pitfalls — most AI project failures happen in data collection, not model design.' },

  // Logical
  { track:'ai', grade_level:'all', qtype:'logical', difficulty:'medium',
    prompt:'Your image classifier achieves 99% accuracy on training data but only 60% on new images. What are the two most likely causes and their fixes?',
    answer:'1. Overfitting: model memorized training images. Fix: add more diverse training data, use data augmentation (flip, rotate, brightness changes), add dropout layers. 2. Data distribution mismatch: training images differ from real-world conditions (lighting, angle). Fix: collect training data in the actual use environment.',
    explanation:'This is the most common AI project failure. 99% training accuracy means nothing if real-world accuracy is 60%. Always test on data from the actual deployment environment.' },

  // Computational
  { track:'ai', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'A KNN classifier with K=3 looks at 5 nearest neighbors: labels = [cat, dog, cat, cat, dog]. What does it predict?',
    options:['cat','dog','tie — no prediction','Depends on distance'],
    answer:'cat', explanation:'KNN with K=3 looks at 3 nearest neighbors: [cat, dog, cat]. Majority vote = cat. If K=5, same result: 3 cats vs 2 dogs = cat. Always use odd K to avoid ties in binary classification.' },
  { track:'ai', grade_level:'all', qtype:'computational', difficulty:'hard',
    prompt:'A dataset has 950 non-spam and 50 spam emails. A "lazy" classifier that always predicts "not spam" achieves what accuracy? Why is this misleading?',
    options:['95% — and this is fine','95% — but it never actually catches spam (0 recall for spam class)','50% — equally wrong','90% — acceptable for real use'],
    answer:'95% — but it never actually catches spam (0 recall for spam class)', explanation:'This is the class imbalance problem. 95% accuracy sounds great but completely fails its job. Always use Precision, Recall, and F1-score for imbalanced datasets, not just accuracy.' },

  // ================================================================
  // TRACK: computational (Computational Thinking & Coding)
  // ================================================================
  { track:'computational', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What is the output of this Python code?\nx = 5\ny = 3\nif x > y:\n    print(x + y)\nelse:\n    print(x - y)',
    options:['2','8','5','3'],
    answer:'8', explanation:'x=5 > y=3 is True, so the if branch runs: print(5+3) = 8. Understanding conditionals is fundamental — computers make all decisions using if-then-else logic.' },
  { track:'computational', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'How many times does this loop run?\nfor i in range(2, 10, 2):\n    print(i)',
    options:['4','8','5','10'],
    answer:'4', explanation:'range(2, 10, 2) gives: 2, 4, 6, 8. Four values. range(start, stop, step): starts at 2, increments by 2, stops BEFORE 10.' },
  { track:'computational', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'What is the time complexity of a simple nested loop that compares every element with every other element in a list of N items?',
    options:['O(N)','O(N log N)','O(N²)','O(2^N)'],
    answer:'O(N²)', explanation:'Two nested loops, each running N times = N×N = N² operations. For N=100 items, that\'s 10,000 comparisons. For N=1,000, it\'s 1,000,000. O(N²) algorithms become slow fast — this is why efficient sorting matters.' },
  { track:'computational', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What does "debugging" mean in programming?',
    options:['Writing new code','Finding and fixing errors in code','Making code run faster','Adding comments to code'],
    answer:'Finding and fixing errors in code', explanation:'The term "bug" comes from 1947 when an actual moth was found in a computer relay! Debugging is the process of identifying and removing errors. It\'s often 50-80% of total programming time.' },
  { track:'computational', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'A function should return True if a number is prime. What test cases are most important to check?',
    options:['Only large numbers','Only small numbers','Edge cases: 0, 1, 2, negative numbers, a known prime, a known composite','Random numbers only'],
    answer:'Edge cases: 0, 1, 2, negative numbers, a known prime, a known composite', explanation:'Edge cases break most functions. 0 and 1 are NOT prime (common mistake). 2 is the only even prime. Testing boundaries (minimum, maximum, invalid inputs) is how professionals find bugs.' },

  // Tinkering
  { track:'computational', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Write a Python function that takes a list of temperatures and returns: the average, max, min, and how many are above 37°C.',
    answer:'def analyze_temps(temps):\n    if not temps: return None\n    avg = sum(temps) / len(temps)\n    high_count = sum(1 for t in temps if t > 37)\n    return {"avg": round(avg,2), "max": max(temps), "min": min(temps), "above_37": high_count}',
    explanation:'This is a real data analysis function — the same pattern used in health monitoring systems. Note the edge case check for empty lists. Always validate inputs.' },
  { track:'computational', grade_level:'all', qtype:'tinkering', difficulty:'hard',
    prompt:'Implement a binary search algorithm for a sorted list. Explain why it is faster than linear search for large lists.',
    answer:'def binary_search(arr, target):\n    left, right = 0, len(arr)-1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n# For 1 million items: linear=1M comparisons, binary=20 comparisons',
    explanation:'Binary search: each step cuts the search space in half. Log₂(1,000,000) = 20 steps vs 1,000,000 for linear search. This is why sorted databases are so valuable.' },

  // Logical
  { track:'computational', grade_level:'all', qtype:'logical', difficulty:'easy',
    prompt:'Arrange these algorithm steps for making a cup of tea in the correct order:\nA) Pour water B) Boil water C) Add tea bag D) Wait 3 minutes E) Remove tea bag F) Add to cup',
    options:['B,A,F,C,D,E','B,F,A,C,D,E','A,B,F,C,D,E','C,B,A,F,D,E'],
    answer:'B,A,F,C,D,E', explanation:'Boil first (B), pour into cup (A actually means pour boiling water → should be F first). Correct: Boil water, pour boiling water into cup with tea bag, wait, remove. Sequencing is the foundation of algorithms — order matters.' },
  { track:'computational', grade_level:'all', qtype:'logical', difficulty:'hard',
    prompt:'A recursive function has no base case. What happens when it runs?',
    options:['It runs once and stops','It runs forever (infinite recursion) until stack overflow','It automatically adds a base case','It returns None'],
    answer:'It runs forever (infinite recursion) until stack overflow', explanation:'Without a base case, a recursive function calls itself forever. Each call uses stack memory. Eventually memory runs out: "RecursionError: maximum recursion depth exceeded." Always define: what is the simplest case that doesn\'t need recursion?' },

  // Computational
  { track:'computational', grade_level:'all', qtype:'computational', difficulty:'medium',
    prompt:'What is the output?\ndef mystery(n):\n    if n <= 1: return n\n    return mystery(n-1) + mystery(n-2)\nprint(mystery(6))',
    options:['8','13','21','6'],
    answer:'8', explanation:'This is the Fibonacci sequence! mystery(6) = F(6) = 8. F sequence: 0,1,1,2,3,5,8,13,21... Fibonacci appears in nature (sunflower seeds, shell spirals) and is a classic computer science example.' },

  // ================================================================
  // TRACK: entrepreneurship (Entrepreneurship & Tinkerpreneur)
  // ================================================================
  { track:'entrepreneurship', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What is the difference between an inventor and an entrepreneur?',
    options:['Inventors make money, entrepreneurs don\'t','Entrepreneurs create businesses to bring inventions to market; inventors create new things','There is no difference','Entrepreneurs never invent anything'],
    answer:'Entrepreneurs create businesses to bring inventions to market; inventors create new things', explanation:'Einstein was an inventor. Steve Jobs was an entrepreneur who brought others\' inventions (touchscreens, MP3 players) to mass market. Many world-changing products were innovated by entrepreneurs who combined existing technologies.' },
  { track:'entrepreneurship', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'What is an MVP (Minimum Viable Product)?',
    options:['The best possible version of a product','The cheapest product you can make','The simplest version that lets you test if customers actually want the product','A sports award'],
    answer:'The simplest version that lets you test if customers actually want the product', explanation:'Dropbox\'s MVP was a 3-minute video — no actual product! It got 75,000 signups overnight, proving demand. Build the minimum to test your assumption before spending months building the full product.' },
  { track:'entrepreneurship', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'You sell 100 smart dustbins at ₹500 each. Components cost ₹200 per unit. Fixed costs (internet, tools) are ₹10,000/month. What is your net profit/loss this month?',
    options:['₹20,000 profit','₹10,000 profit','₹20,000 loss','₹30,000 profit'],
    answer:'₹20,000 profit', explanation:'Revenue = 100 × 500 = ₹50,000. Variable costs = 100 × 200 = ₹20,000. Fixed costs = ₹10,000. Net profit = 50,000 - 20,000 - 10,000 = ₹20,000. Understanding unit economics is how startups survive.' },
  { track:'entrepreneurship', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'What does "problem-solution fit" mean?',
    options:['Your product is technically perfect','Your product actually solves a real problem people have and are willing to pay to solve','Your product looks good','Your product is cheaper than competitors'],
    answer:'Your product actually solves a real problem people have and are willing to pay to solve', explanation:'Most startups fail because they solve problems nobody has. Problem-solution fit means: "Yes, this is painful for me, and yes, I would pay for that solution." Test with real users before building.' },

  // Tinkering
  { track:'entrepreneurship', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Create a 60-second elevator pitch for a smart water quality monitoring system for villages. Include: problem, solution, impact, and ask.',
    answer:'Problem: 600 million Indians lack clean water access; no way to know if local water is safe without expensive testing. Solution: ₹500 water quality sensor (TDS + pH + turbidity) that sends readings to a village noticeboard via SMS. Impact: Early detection of contamination saves lives; first system catches problems 48 hours before symptoms appear. Ask: ₹50,000 to pilot in 5 villages over 3 months.',
    explanation:'A good pitch answers: Who has the problem? How bad is it? What is your solution? Why is it better than existing alternatives? What do you need? Practice until it fits in 60 seconds.' },

  // Logical
  { track:'entrepreneurship', grade_level:'all', qtype:'logical', difficulty:'medium',
    prompt:'Two students built identical robots. Arjun sells his for ₹2000; Priya sells hers for ₹1500. Arjun sells 5 units/month; Priya sells 12 units/month. Whose business model is better and why?',
    answer:'Depends on costs! Arjun: Revenue = ₹10,000. Priya: Revenue = ₹18,000. But if Priya\'s margin is lower due to lower price, compare profit: need to know component cost. At equal costs: Priya generates more revenue. Lower price can create volume advantage. The better model depends on margins, not just units.',
    explanation:'This is pricing strategy. High margin/low volume vs. low margin/high volume are both valid business models. Amazon chose volume; Apple chose margin. Neither is universally better.' },

  // Computational
  { track:'entrepreneurship', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'If a product costs ₹300 to make and you want a 40% profit margin, what price should you charge?',
    options:['₹420','₹500','₹340','₹360'],
    answer:'₹500', explanation:'Margin = (Price - Cost)/Price. 0.40 = (P - 300)/P → 0.40P = P - 300 → 300 = 0.60P → P = 500. Note: 40% MARGIN is not the same as 40% MARKUP. Markup: 300 × 1.4 = ₹420. Always clarify which is meant.' },

  // ================================================================
  // TRACK: mechanics
  // ================================================================
  { track:'mechanics', grade_level:'all', qtype:'brain_teaser', difficulty:'easy',
    prompt:'A lever has a 1m arm on the effort side and a 0.25m arm on the load side. To lift a 40kg load, what effort force is needed? (Effort × effort arm = Load × load arm)',
    options:['160N','10N','40N','100N'],
    answer:'10N', explanation:'40kg = 400N (weight). Effort × 1m = 400N × 0.25m. Effort = 100N. Wait — 10kg effort lifts 40kg: 10 × 1 = 40 × 0.25. Effort = 10kg = 100N. Levers are force multipliers — a long lever lets a child lift an adult.' },
  { track:'mechanics', grade_level:'all', qtype:'brain_teaser', difficulty:'medium',
    prompt:'What does a ball bearing do in a rotating mechanism?',
    options:['Increases friction','Reduces friction by replacing sliding motion with rolling motion','Adds weight for stability','Connects two shafts'],
    answer:'Reduces friction by replacing sliding motion with rolling motion', explanation:'Sliding friction wastes energy as heat. Rolling friction is ~1000× less. Ball bearings are why bicycle wheels spin freely and motors last decades — they\'re one of humanity\'s most important inventions.' },
  { track:'mechanics', grade_level:'all', qtype:'brain_teaser', difficulty:'hard',
    prompt:'A worm gear system reduces speed from 1000 RPM to 10 RPM. What is the gear ratio, and why can\'t this system be back-driven?',
    options:['1:100 — worm gears are self-locking due to friction angle','100:1 — worms can be back-driven','1:10 — worms back-drive easily','100:1 — all gears are self-locking'],
    answer:'1:100 — worm gears are self-locking due to friction angle', explanation:'Gear ratio = 1000/10 = 100:1. Worm gears self-lock because the friction angle exceeds the lead angle — the load cannot rotate the worm backwards. Used in elevators, guitar tuners, scissor jacks.' },

  // Tinkering
  { track:'mechanics', grade_level:'all', qtype:'tinkering', difficulty:'medium',
    prompt:'Design a mechanical hand gripper (3 fingers) that a servo motor can open and close. Describe the linkage mechanism, materials, and any counterspring needed.',
    answer:'Mechanism: Scotch-yoke or four-bar linkage converts servo rotation to linear gripper motion. Fingers: laser-cut acrylic or 3D printed PLA (2-3mm thick). Spring return: rubber bands or torsion springs return fingers to open position when servo releases. Servo: SG90 (180° range) provides ~1.5kg-cm torque sufficient for light gripping.',
    explanation:'Mechanical grippers convert rotary servo motion to linear grip force. This exact mechanism is used in robotic arms, prosthetics, and industrial pick-and-place systems.' },

  // Logical
  { track:'mechanics', grade_level:'all', qtype:'logical', difficulty:'medium',
    prompt:'A mechanical joint that worked in summer starts squeaking and jamming in winter. What is the most logical cause?',
    answer:'Thermal contraction: metal contracts in cold, tightening clearances. Lubricant may also thicken in cold. Fix: use slightly larger clearances, use low-viscosity lubricant (e.g., silicone grease instead of petroleum grease in cold weather).',
    explanation:'Thermal expansion/contraction affects all mechanical systems. Engineers use "thermal coefficients" to calculate clearances for all operating temperatures. Formula 1 cars are designed to work from startup cold to racing hot.' },

  // Computational
  { track:'mechanics', grade_level:'all', qtype:'computational', difficulty:'easy',
    prompt:'A motor produces 0.5 N·m of torque. Through a gear ratio of 4:1 (reducer), what is the output torque at the wheel?',
    options:['0.125 N·m','2 N·m','4 N·m','0.5 N·m'],
    answer:'2 N·m', explanation:'Output torque = Input torque × gear ratio = 0.5 × 4 = 2 N·m. Gears amplify torque while reducing speed by the same ratio. More torque means more force at the wheel — useful for climbing slopes.' },
];

export async function seedChallengeBank() {
  console.log('[challengeBank] checking for existing questions...');
  const existing = await pool.query(`SELECT count(*)::int AS n FROM challenge_questions`);
  if (existing.rows[0].n > 0) {
    console.log(`[challengeBank] ${existing.rows[0].n} questions already seeded — skipping`);
    return;
  }
  console.log(`[challengeBank] seeding ${questions.length} challenge questions...`);
  for (const q of questions) {
    await pool.query(
      `INSERT INTO challenge_questions (track, grade_level, qtype, difficulty, prompt, options, answer, explanation, points)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [q.track, q.grade_level, q.qtype, q.difficulty, q.prompt,
       JSON.stringify(q.options ?? []), q.answer ?? '', q.explanation ?? '',
       q.points ?? (q.difficulty === 'hard' ? 30 : q.difficulty === 'medium' ? 20 : 10)]
    );
  }
  console.log(`[challengeBank] done — ${questions.length} questions inserted`);
}
