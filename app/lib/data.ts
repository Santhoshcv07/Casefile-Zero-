// ── Deterministic Case Data for CASEFILE ZERO: The Last Alibi ──

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  photo: string;
  image?: string;
  motive: string;
  alibi: string;
  personality: string;
  background: string;
  suspicionLevel: "Low" | "Medium" | "High";
  keyQuote: string;
}

export interface Clue {
  id: string;
  name: string;
  description: string;
  location: string;
  significance: string;
  icon: string;
  hotspotId: string;
}

export interface CrimeSceneHotspot {
  id: string;
  label: string;
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
  clueId: string | null;
}

export interface InterrogationTopic {
  id: string;
  suspectId: string;
  question: string;
  answer: string;
  requiredClueId?: string; // Only appears once player finds this clue
  isBreakthrough?: boolean; // Critical question confronting their alibi
}

export const caseInfo = {
  title: "The Last Alibi",
  caseNumber: "CZ-2024-0731",
  classification: "Homicide — Locked Room",
  date: "October 26, 2024",
  time: "11:47 PM",
  location: "NovaMind Technologies HQ, Floor 47, Downtown Metro City",
  victim: {
    name: "Dr. Adrian Voss",
    age: 42,
    role: "Founder & CEO, NovaMind Technologies",
    causeOfDeath: "Blunt force trauma to the occipital region (crystal paperweight)",
    description:
      "Found slumped over his desk in his private office on the 47th floor. The heavy office door was magnetically locked. Security logs show no exterior entry after 9:15 PM. Dr. Voss was last seen alive at 9:02 PM by building security. Estimated time of death is between 10:30 PM and 10:42 PM.",
  },
  summary:
    "Dr. Adrian Voss, the brilliant founder of NovaMind Technologies, was found dead in his locked office at 11:47 PM. The scene was staged to resemble an external burglary: a loosened ceiling ventilation grate, an overturned whiskey glass, and a smashed tablet. But a 12-minute camera blackout between 10:30 PM and 10:42 PM points to an inside job by someone with executive privileges. With a $4.2 billion IPO scheduled in 48 hours, billions in equity and dark corporate secrets were at stake.",
};

export const suspects: Suspect[] = [
  {
    id: "suspect-1",
    name: "Elena Marchetti",
    role: "Chief Operating Officer, NovaMind",
    age: 38,
    photo: "👩‍💼",
    image: "/images/suspect-elena.jpg",
    motive:
      "Stood to lose $504 million in vesting equity if Voss went through with his plan to cancel the IPO. Voss had uncovered that Marchetti fabricated neural benchmark figures to inflate the company's valuation.",
    alibi:
      "Claims she was at a private dinner at Ristorante Nero from 8:00 PM to 11:30 PM. While she booked the table, vehicle GPS logs show her black Mercedes was parked behind NovaMind HQ between 10:15 PM and 10:48 PM.",
    personality: "Ruthless, razor-sharp, and icy under pressure. Accustomed to manipulating narratives and deflecting blame.",
    background:
      "Former McKinsey partner. Brought into NovaMind three years ago to execute the IPO. Possessed Floor 46 executive credentials and administrative override rights.",
    suspicionLevel: "High",
    keyQuote: "Adrian was an ideologue. Ideologues build empires, but they don't have the stomach to monetize them.",
  },
  {
    id: "suspect-2",
    name: "Marcus Chen",
    role: "Lead Software Architect, NovaMind",
    age: 29,
    photo: "👨‍💻",
    image: "/images/suspect-marcus.jpg",
    motive:
      "Furious that Voss filed patents for the core neural mapping codebase listing himself as the sole inventor, cutting Chen out of millions in royalties. Screaming match overheard at 4:30 PM.",
    alibi:
      "Claims he was working in the Floor 12 server room all night. However, security footage caught a man matching his profile on the Floor 14 stairwell at 10:33 PM.",
    personality: "Intense, caffeinated, and defensive. Easily agitated when discussing intellectual property theft, but squeamish about violence.",
    background:
      "Self-taught prodigy who wrote 60% of NovaMind's core system. Has no access to Floor 47 executive overrides.",
    suspicionLevel: "Medium",
    keyQuote: "I spent three years coding his miracle in the dark. He couldn't write a single line of python without a compiler error.",
  },
  {
    id: "suspect-3",
    name: "Diana Okafor",
    role: "Head of Corporate Security, NovaMind",
    age: 45,
    photo: "🕵️‍♀️",
    image: "/images/suspect-diana.jpg",
    motive:
      "Learned that Voss had drafted a contract to outsource the entire security department to an automated surveillance firm, firing her and her team of 30 veterans.",
    alibi:
      "Stationed at the Ground Floor security console. Admitted to stepping away for 20 minutes around 10:25 PM to investigate a fire sensor alarm on Floor 32.",
    personality: "Disciplined ex-military officer. Pragmatic, stoic, and speaks in precise logistical terms.",
    background:
      "15 years in Military Intelligence before joining NovaMind. Knows the physical blueprint and HVAC systems better than anyone.",
    suspicionLevel: "Medium",
    keyQuote: "I took a bullet in Kandahar, Detective. If I wanted Dr. Voss eliminated, I wouldn't need to loosen screws on a ceiling vent to hide it.",
  },
];

export const clues: Clue[] = [
  {
    id: "clue-1",
    name: "Cracked Prototype Tablet",
    description:
      "A shattered executive tablet on Voss's desk displaying an unsent draft email addressed to the SEC and Board of Directors: '...cannot proceed with Friday's IPO. Internal audit reveals COO Marchetti manipulated neural-sync benchmark data. I am terminating her contract tonight.'",
    location: "Dr. Voss's Mahogany Desk",
    significance: "Establishes an airtight, multi-million dollar motive against Elena Marchetti. Voss was going to expose and ruin her.",
    icon: "📱",
    hotspotId: "hs-1",
  },
  {
    id: "clue-2",
    name: "Drugged Whiskey Glass",
    description:
      "An overturned crystal Glencairn glass smelling of Macallan 18. Lab test confirms high concentrations of Diazepam (Valium) mixed with the scotch. Voss had no prescription, but medical records confirm Elena Marchetti was prescribed Diazepam 10mg just three days ago.",
    location: "Floor Beside Desk",
    significance: "Proves premeditated incapacitation before the fatal blow. The killer was someone Voss trusted enough to share a private drink with.",
    icon: "🥃",
    hotspotId: "hs-2",
  },
  {
    id: "clue-3",
    name: "Security Override Terminal Log",
    description:
      "Event audit record showing the 12-minute camera blackout on Floor 47 (10:30 PM – 10:42 PM) was triggered via an administrative command prompt. The IP address resolves directly to the Floor 46 Executive Terminal assigned to Elena Marchetti.",
    location: "Wall Security Panel",
    significance: "Directly refutes Marchetti's claim that only security personnel could cut the cameras, placing the digital weapon in her office.",
    icon: "📹",
    hotspotId: "hs-3",
  },
  {
    id: "clue-4",
    name: "Staged Ceiling Vent",
    description:
      "Two mounting screws removed from the ceiling HVAC vent using a desk pen-screwdriver. However, forensic inspection reveals a thick, undisturbed layer of gray dust inside the air duct. No human body ever crawled through.",
    location: "Ceiling HVAC Grate",
    significance: "Proves the 'locked-room break-in' was completely staged by someone inside the room to mislead investigators into suspecting an agile intruder.",
    icon: "🔧",
    hotspotId: "hs-4",
  },
  {
    id: "clue-5",
    name: "Bloodstained Platinum Cufflink",
    description:
      "A luxury platinum cufflink custom engraved with initials 'E.M.' wedged behind the desk baseboard. Micro-trace analysis reveals a minute spatter of Dr. Voss's Type-A blood on the hinge clasp.",
    location: "Crevice Behind Desk",
    significance: "Physical forensic proof placing Elena Marchetti at the exact location and moment Dr. Voss was bludgeoned.",
    icon: "💎",
    hotspotId: "hs-5",
  },
  {
    id: "clue-6",
    name: "Server Room Log & Stairwell Receipt",
    description:
      "A timestamped vending machine receipt for sparkling water on Floor 14 at 10:36 PM matching Marcus Chen's debit card, along with emergency stairwell door sensors recording a locked latch on Floor 47.",
    location: "Protruding Book on Bookshelf",
    significance: "Corroborates Marcus Chen's statement: he walked up to 14 for a soda and couldn't access 47, completely exonerating him from being in Voss's office.",
    icon: "🗂️",
    hotspotId: "hs-7",
  },
];

export const crimeSceneHotspots: CrimeSceneHotspot[] = [
  {
    id: "hs-1",
    label: "Victim's Desk",
    x: 50,
    y: 62,
    description: "A wide mahogany desk scattered with IPO prospectuses. A cracked tablet lies face-up beside an open fountain pen.",
    clueId: "clue-1",
  },
  {
    id: "hs-2",
    label: "Whiskey Glass",
    x: 42,
    y: 87,
    description: "An overturned Glencairn glass on the hardwood floor. Amber liquid pooled beneath emitting a faint chemical odor.",
    clueId: "clue-2",
  },
  {
    id: "hs-3",
    label: "Security Panel",
    x: 20,
    y: 50,
    description: "A wall-mounted touchscreen terminal beside the entrance. A flashing yellow diagnostic indicator reveals an override audit log.",
    clueId: "clue-3",
  },
  {
    id: "hs-4",
    label: "Ceiling Vent",
    x: 54,
    y: 21,
    description: "A ceiling ventilation grille dangling by two loose screws. Scratches on the drywall look fresh, but the interior duct is cobwebbed.",
    clueId: "clue-4",
  },
  {
    id: "hs-5",
    label: "Behind Desk",
    x: 68,
    y: 84,
    description: "A narrow 2-inch gap between the mahogany desk and the back wall. A glint of metallic silver catches the room light.",
    clueId: "clue-5",
  },
  {
    id: "hs-6",
    label: "Panoramic Window",
    x: 88,
    y: 40,
    description: "Floor-to-ceiling soundproof glass overlooking the rainy skyline. The heavy locking latch is bolted securely from within.",
    clueId: null,
  },
  {
    id: "hs-7",
    label: "Executive Bookshelf",
    x: 28,
    y: 48,
    description: "A mahogany shelf lined with leather-bound books. One title, 'Corporate Governance & Forensics', contains a folded paper slip.",
    clueId: "clue-6",
  },
  {
    id: "hs-8",
    label: "Office Heavy Door",
    x: 11,
    y: 48,
    description: "A reinforced steel-core door with electromagnetic solenoid locks. System records verify it locked automatically upon closing at 9:15 PM.",
    clueId: null,
  },
];

export const interrogationTopics: InterrogationTopic[] = [
  // ── ELENA MARCHETTI (Culprit) ──────────────────────────────────────────
  {
    id: "em-base-1",
    suspectId: "suspect-1",
    question: "Where were you between 10:00 PM and 11:00 PM tonight?",
    answer:
      "I have already given my statement to your officers. I was having a quiet business dinner at Ristorante Nero with an investment banker from Goldman. I arrived at 8:15 PM and didn't leave until after 11:00 PM. My driver handled the transit.",
  },
  {
    id: "em-base-2",
    suspectId: "suspect-1",
    question: "How would you describe your relationship with Dr. Adrian Voss?",
    answer:
      "Professional and productive. Adrian was a brilliant theoretician, but completely naive about capital markets. We had our disagreements on execution, sure, but why would I harm the goose laying our multi-billion dollar golden egg?",
  },
  {
    id: "em-base-3",
    suspectId: "suspect-1",
    question: "What does the upcoming IPO mean for you personally?",
    answer:
      "A 12% stake vesting at opening bell. Roughly $504 million. I have spent three grueling years restructuring this firm for this moment. Killing Adrian 48 hours before launch would be financial suicide... unless you think I hate money?",
  },
  {
    id: "em-clue-1",
    suspectId: "suspect-1",
    question: "We recovered Dr. Voss's tablet. He drafted an email to cancel the IPO and expose your benchmark fraud.",
    answer:
      "(Her expression freezes, then hardens into a tight smirk) Adrian was having a manic episode. He became paranoid about every line of testing data. That draft was nonsense—a hysterical reaction to normal executive data-smoothing. He wouldn't have dared send it.",
    requiredClueId: "clue-1",
    isBreakthrough: true,
  },
  {
    id: "em-clue-2",
    suspectId: "suspect-1",
    question: "The scotch glass on his desk was laced with Diazepam. Your medical records show you were prescribed 10mg three days ago.",
    answer:
      "I have trouble sleeping before major roadshows. Thousands of executives take mild sedatives! If Adrian had Diazepam in his glass, he must have taken it himself to cope with the pre-IPO stress. You cannot tie that glass to my hands.",
    requiredClueId: "clue-2",
    isBreakthrough: true,
  },
  {
    id: "em-clue-3",
    suspectId: "suspect-1",
    question: "The Floor 47 camera blackout was executed from your private terminal on Floor 46 at 10:30 PM.",
    answer:
      "Anyone could have walked up to my terminal while I was at dinner! The Floor 46 suite isn't Fort Knox. Diana's security team leaves workstations logged in all the time. Don't frame me for IT negligence.",
    requiredClueId: "clue-3",
    isBreakthrough: true,
  },
  {
    id: "em-clue-4",
    suspectId: "suspect-1",
    question: "The ceiling vent was unscrewed, but the dust inside was untouched. It was staged from the inside.",
    answer:
      "Staged? What do I know about ventilation shafts? If someone staged a break-in, you should ask Head of Security Okafor. She served in army reconnaissance; she knows how to fake a forced entry.",
    requiredClueId: "clue-4",
    isBreakthrough: true,
  },
  {
    id: "em-clue-5",
    suspectId: "suspect-1",
    question: "We found your platinum 'E.M.' cufflink behind the desk—with Dr. Voss's blood on the clasp.",
    answer:
      "(Elena's hand instinctively clenches her left cuff. Her composure completely shatters for a split second) That... that cufflink went missing last Thursday during a board briefing. Someone must have planted it. Adrian... Adrian wasn't supposed to ruin everything! He was going to destroy three years of my life over rounding errors!",
    requiredClueId: "clue-5",
    isBreakthrough: true,
  },

  // ── MARCUS CHEN (Innocent) ─────────────────────────────────────────────
  {
    id: "mc-base-1",
    suspectId: "suspect-2",
    question: "Where were you between 10:00 PM and 11:00 PM tonight?",
    answer:
      "Down in the server labyrinth on Floor 12. Compiling deployment dependencies for the platform. It's cold, noisy, and secure. I didn't leave my terminal except to grab a drink from the 14th floor vending machine.",
  },
  {
    id: "mc-base-2",
    suspectId: "suspect-2",
    question: "Colleagues heard you screaming at Dr. Voss earlier this afternoon. What was that about?",
    answer:
      "Because he's a thief! He filed a series of USPTO patent applications for the neural weight sync algorithm—my life's work—and listed himself as sole inventor! I told him I'd retain legal counsel and freeze the IPO if he didn't credit me.",
  },
  {
    id: "mc-base-3",
    suspectId: "suspect-2",
    question: "Did you ever have admin access to the Floor 47 cameras or office lock?",
    answer:
      "No way. I'm core backend software, not corporate network infra. Diana and Elena guard executive system access like dragons. I couldn't cut a camera feed even if I wanted to.",
  },
  {
    id: "mc-clue-1",
    suspectId: "suspect-2",
    question: "Dr. Voss's draft email mentioned an algorithm audit. Was he auditing your code?",
    answer:
      "Not my core architecture—Elena's telemetry wrappers! She wanted our benchmarks to show 99.4% accuracy for Wall Street, so she forced a batch of synthetic training sets into the demo build. I warned Voss it was fraudulent, and it looks like he finally verified it.",
    requiredClueId: "clue-1",
  },
  {
    id: "mc-clue-6",
    suspectId: "suspect-2",
    question: "Security footage saw you in the stairwell on Floor 14 at 10:33 PM. Why weren't you in the server room?",
    answer:
      "Okay! Look, I'll be completely honest with you: at 10:30 PM I got so enraged thinking about the patents that I took the fire stairs up toward 47 to demand he sign an IP addendum. But when I got to the 47th floor stairwell door, the emergency bar was deadlocked from the inside! I heard shouting inside—a woman's voice. Then a heavy crash. I got terrified, went back down to 14, bought a sparkling water at 10:36 PM, and ran back to Floor 12!",
    requiredClueId: "clue-6",
    isBreakthrough: true,
  },

  // ── DIANA OKAFOR (Innocent) ────────────────────────────────────────────
  {
    id: "do-base-1",
    suspectId: "suspect-3",
    question: "Explain your movements between 10:20 PM and 10:45 PM.",
    answer:
      "I was at the main control desk on Ground Floor until 10:24 PM. An automatic fire sensor pinged from the server auxiliary on Floor 32. I took the service elevator up to verify. It was a false alarm—a cleaning cart had bumped a smoke detector. I logged the inspection and took the elevator back down by 10:44 PM.",
  },
  {
    id: "do-base-2",
    suspectId: "suspect-3",
    question: "We understand Dr. Voss planned to outsource your security division.",
    answer:
      "Yes, he wanted to replace 30 veteran guards with a private drone contractor to cut overhead for the IPO prospectus. It made me furious, but I am an intelligence professional with 15 years in service. I don't bludgeon CEOs with desk ornaments.",
  },
  {
    id: "do-base-3",
    suspectId: "suspect-3",
    question: "How did someone bypass the magnetic lock on the 47th floor door?",
    answer:
      "They didn't bypass it from the hallway. The door requires an authorized keycard or an inside motion trigger. If the killer was inside with him, they could simply let the door swing shut and auto-lock upon leaving.",
  },
  {
    id: "do-clue-3",
    suspectId: "suspect-3",
    question: "Only three people have admin override to cut Floor 47 cameras: you, Voss, and Elena.",
    answer:
      "Correct. And if you examine the system event log closely, the command prompt originated from the Executive Suite terminal on Floor 46—that is Elena Marchetti's personal desk. My console terminal on Ground Floor has an immutable keystroke audit showing I was reviewing perimeter sensors.",
    requiredClueId: "clue-3",
    isBreakthrough: true,
  },
  {
    id: "do-clue-4",
    suspectId: "suspect-3",
    question: "Could an assassin have used the ventilation shaft to reach Floor 47?",
    answer:
      "Negative. The HVAC main duct on 47 has an inline electrostatic air filtration mesh every six feet. A human being cannot crawl through without tearing the filters to shreds. Loosening the grille screws was a crude amateur staging trick.",
    requiredClueId: "clue-4",
  },
];

// Fallback keyword responses for typed queries
export const interrogationResponses: Record<string, { greeting: string; responses: Record<string, string> }> = {
  "suspect-1": {
    greeting:
      "Detective. I have back-to-back calls with investment bankers. If you're going to throw wild theories at me, make it quick.",
    responses: {
      "where were you":
        "I was at Ristorante Nero all evening from 8:15 PM until past 11 PM. You can verify the table booking with the maître d'.",
      "dinner":
        "Dinner at Ristorante Nero. I was with an institutional investor until past 11 PM.",
      "car":
        "My chauffeur handled the car. If the GPS placed the vehicle downtown, he must have been waiting nearby.",
      "gps":
        "The car GPS reflects where my driver was waiting, Detective, not my physical presence.",
      "cufflink":
        "I lost a platinum cufflink days ago in the executive boardroom. If someone found it, they must have moved it.",
      "tablet":
        "Adrian was hysterical about test numbers before the IPO. That draft email was a panic symptom, nothing more.",
      "scotch":
        "Adrian drank Macallan every night. Whatever was in his drink was his own doing.",
      "whiskey":
        "He drank heavily under stress. His scotch habits have nothing to do with me.",
      "diazepam":
        "I take mild medication for sleep. Prescriptions are confidential medical property, Detective.",
      "cameras":
        "Floor 46 terminals are accessible to anyone on the executive floor. Anyone could type an override command.",
      "override":
        "An admin command? Diana's security team is responsible for terminal security, not me.",
      "ipo":
        "The IPO would give me $504 million. I would never destroy the single greatest payday of my life.",
      "motive":
        "I had everything to gain from the IPO succeeding and everything to lose from Adrian dying.",
      "default":
        "I have answered that as far as my recollection goes. Let's stick to verifiable facts, Detective.",
    },
  },
  "suspect-2": {
    greeting:
      "Detective... look, I've got a mountain of code to push before the morning audit. I told the officers everything I know.",
    responses: {
      "where were you":
        "Server room on Floor 12. I spent the whole night compiling code and verifying dependencies.",
      "stairwell":
        "I went up the stairs to 14 for a sparkling water. I bought it at 10:36 PM—check my bank statement!",
      "voss":
        "Voss was a visionary thief. He stole credit for my algorithms, but murder? I'm an engineer, not a psychopath.",
      "argument":
        "We argued because he filed patents in his name alone. I threatened to hire an IP lawyer, not an assassin.",
      "patents":
        "The neural sync patent should have had my name on it. He took two years of my sweat and claimed it was his genius.",
      "cameras":
        "I don't have access to security overrides. That's strictly for Diana's team and the executive suite.",
      "default":
        "I'm giving you straight answers, Detective. I was in the server room, and my logs prove it.",
    },
  },
  "suspect-3": {
    greeting:
      "Detective. I run a secure facility. If someone managed to kill Dr. Voss on my watch, I want them in handcuffs as much as you do.",
    responses: {
      "where were you":
        "Ground floor monitoring station. I was inspecting a fire alarm on Floor 32 from 10:25 to 10:44 PM.",
      "floor 32":
        "A cleaner tripped an optical smoke detector. The elevator telemetry and stairwell sensors confirm my path.",
      "cameras":
        "The blackout was an admin override from Floor 46—Elena's desk. It wasn't sent from my security console.",
      "override":
        "Check the terminal IP. It came directly from the COO's computer on Floor 46 at exactly 10:30 PM.",
      "ventilation":
        "The ceiling vent was staged. The internal electrostatic filter screens are completely intact.",
      "outsourcing":
        "Voss wanted to replace my team with contract drones. I hated the decision, but murder is an amateur's reaction.",
      "default":
        "Logistics and telemetry don't lie, Detective. Ask me about the security systems and I'll give you the facts.",
    },
  },
};
