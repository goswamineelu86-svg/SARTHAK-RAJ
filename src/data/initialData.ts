import {
  SourceDocument,
  AudioOverviewData,
  MindMapData,
  SlideDeckData,
  QuizData,
  TimelineData,
  TableFaqData,
  QuizAttempt,
} from '../types';

export const initialSources: SourceDocument[] = [
  {
    id: 'src-1',
    title: 'Cellular Respiration & Mitochondria.pdf',
    type: 'pdf',
    wordCount: 4658,
    uploadedAt: 'Today, 08:30 AM',
    selected: true,
    content: `CELLULAR RESPIRATION & BIOENERGETICS (ADVANCED BIOCHEMISTRY LECTURE NOTES)

1. Executive Overview
Cellular respiration is the biochemical catabolism of organic macromolecules into inorganic metabolic end-products accompanied by the synthesis of adenosine triphosphate (ATP). In eukaryotic cells, aerobic oxidation of one glucose molecule yields approximately 30 to 32 ATP under standard physiological conditions.

2. Stage I: Glycolysis (Cytosolic Phase)
Glycolysis converts glucose (C6H12O6) into two molecules of pyruvate (CH3COCOO-) through 10 sequential enzymatic steps.
- Investment Phase: 2 ATP invested (Hexokinase / Glucokinase and Phosphofructokinase-1).
- Rate-Limiting Control: Phosphofructokinase-1 (PFK-1) catalyzes the phosphorylation of Fructose-6-Phosphate to Fructose-1,6-Bisphosphate. It is allosterically inhibited by high ATP/AMP ratios and citrate, and activated by Fructose-2,6-Bisphosphate and high AMP.
- Net Yield: 2 net ATP (substrate-level phosphorylation), 2 NADH, and 2 Pyruvate.

3. Stage II: Pyruvate Dehydrogenase Complex (PDC)
Pyruvate translocates across the mitochondrial outer and inner membranes via mitochondrial pyruvate carriers (MPC). The PDC decarboxylates pyruvate into Acetyl-CoA, producing 1 NADH and 1 CO2 per pyruvate (2 NADH per glucose). PDC is inhibited by kinase phosphorylation under high ATP/NADH ratios.

4. Stage III: Citric Acid (Krebs) Cycle
Inside the mitochondrial matrix, Acetyl-CoA combines with oxaloacetate via citrate synthase to form citrate.
- Two turns per glucose produce 6 NADH, 2 FADH2, 2 GTP (or ATP), and 4 CO2.
- Key enzymes: Isocitrate dehydrogenase (rate-limiting), Alpha-ketoglutarate dehydrogenase, and Succinate dehydrogenase. Succinate dehydrogenase (Complex II) is uniquely bound directly to the inner mitochondrial membrane.

5. Stage IV: Oxidative Phosphorylation & Chemiosmosis
Peter Mitchell's chemiosmotic hypothesis proved that electron transport creates an electrochemical proton-motive force (Δp) across the inner mitochondrial membrane.
- Complex I (NADH-Q oxidoreductase): Pumps 4 H+ per electron pair from NADH.
- Complex II (Succinate-Q reductase): Transfers electrons from FADH2 to ubiquinone without proton translocation.
- Complex III (Q-cytochrome c oxidoreductase): Pumps 4 H+ via the Q-cycle.
- Complex IV (Cytochrome c oxidase): Pumps 2 H+ and reduces terminal O2 to H2O.
- Complex V (ATP Synthase): F0-F1 rotary catalysis. Protons re-enter the matrix via the c-ring rotor, inducing conformational changes in the catalytic beta subunits of F1 to synthesize ATP from ADP and Pi (~3-4 H+ per ATP synthesized).`,
    keyTakeaways: [
      '30-32 ATP produced per glucose molecule via aerobic oxidation.',
      'PFK-1 serves as the primary allosteric rate-limiting valve in glycolysis.',
      'Peter Mitchell chemiosmosis: electrochemical proton gradient (Δp) drives rotary ATP synthase.',
      'Complex II (Succinate Dehydrogenase) does NOT pump protons, explaining why FADH2 produces ~1.5 ATP vs ~2.5 for NADH.'
    ]
  },
  {
    id: 'src-2',
    title: 'Quantum Computing Foundations.md',
    type: 'md',
    wordCount: 5248,
    uploadedAt: 'Today, 08:35 AM',
    selected: true,
    content: `QUANTUM COMPUTING: PRINCIPLES, ARCHITECTURE & ALGORITHMS

1. The Qubit and the Bloch Sphere
While a classical bit exists strictly in state 0 or 1, a quantum bit (qubit) exists in a normalized linear superposition:
|ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ ℂ and |α|² + |β|² = 1.
Geometrically, a pure single qubit state corresponds to a unit vector on the surface of the Bloch sphere parameterized by spherical angles θ and φ:
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩.

2. Quantum Entanglement & Bell States
Entanglement is a non-separable composite state where the physical state of individual subsystems cannot be described independently.
The four maximally entangled two-qubit Bell states are:
|Φ+⟩ = (|00⟩ + |11⟩)/√2
|Φ-⟩ = (|00⟩ - |11⟩)/√2
|Ψ+⟩ = (|01⟩ + |10⟩)/√2
|Ψ-⟩ = (|01⟩ - |10⟩)/√2
Entanglement enables superdense coding, quantum teleportation, and quantum computational speedup.

3. Quantum Gates & Unitary Operators
All quantum logic gates are represented by unitary matrices (U†U = I) to ensure conservation of probability.
- Hadamard Gate (H): Transforms computational basis states into balanced superpositions H|0⟩ = |+⟩, H|1⟩ = |-⟩.
- Pauli-X (NOT), Pauli-Y, and Pauli-Z (Phase Flip).
- Controlled-NOT (CNOT): Flips target qubit if control qubit is |1⟩, acting as the foundational entanglement gate.

4. Quantum Algorithms
- Shor's Algorithm: Solves discrete logarithms and prime factorization in polynomial time O((log N)³), rendering 2048-bit RSA vulnerable.
- Grover's Algorithm: Provides quadratic speedup O(√N) for unstructured database search.
- Quantum Phase Estimation (QPE): Foundational subroutine for quantum chemistry simulation and Hamiltonian ground-state calculation.

5. Physical Challenges: Decoherence and Quantum Error Correction
Physical qubits suffer from thermal relaxation (T1) and dephasing (T2). In the current NISQ (Noisy Intermediate-Scale Quantum) era, fault-tolerant computation requires surface codes, encoding one logical qubit across hundreds or thousands of physical error-prone qubits.`,
    keyTakeaways: [
      'Qubit superposition spans continuous state vector coordinates |ψ⟩ = α|0⟩ + β|1⟩.',
      'Unitary reversible transformations preserve total probability amplitudes across gate depths.',
      'Shor algorithm utilizes Quantum Fourier Transform (QFT) to achieve exponential factorization speedup.',
      'Decoherence times (T1/T2) mandate surface code quantum error correction (QEC).'
    ]
  },
  {
    id: 'src-3',
    title: 'Macroeconomics: Monetary Policy & Balance Sheet Dynamics.docx',
    type: 'docx',
    wordCount: 4730,
    uploadedAt: 'Today, 08:42 AM',
    selected: true,
    content: `MACROECONOMICS: CENTRAL BANKING & MONETARY TRANSMISSION CHANNELS

1. Central Bank Dual Mandate & Policy Framework
Modern monetary policy balances price stability (anchored to a 2.0% personal consumption expenditures headline index) and maximum sustainable employment.
The Federal Open Market Committee (FOMC) adjusts the target federal funds rate to manage credit conditions and long-run aggregate demand.

2. The Taylor Rule Framework
Developed by John B. Taylor (1993), this mathematical model specifies the target nominal interest rate based on inflation gaps and output slack:
i = r* + π + 0.5(π - π*) + 0.5(y - y*)
- The Taylor Principle: To stabilize inflation, the central bank must increase nominal rates by MORE than 1:1 against increases in inflation, thereby raising real interest rates (r = i - π).

3. Transmission Channels of Monetary Policy
- Interest Rate Channel: Higher policy rates increase borrowing costs for commercial mortgages, corporate debt, and consumer loans, depressing capital expenditures.
- Asset Price / Wealth Channel: Tightening depresses equity and real estate valuations, decreasing household perceived net worth and curtailing discretionary consumption.
- Exchange Rate Channel: Relative rate differentials attract foreign capital inflows, appreciating the domestic currency and reducing import inflation while weighing on export competitiveness.

4. Unconventional Monetary Tools: QE and Quantitative Tightening (QT)
- Quantitative Easing (QE): Central bank purchases long-duration sovereign bonds to inject excess liquidity and compress term premiums when policy rates reach the Zero Lower Bound (ZLB).
- Quantitative Tightening (QT): Passive run-off or active disposal of central bank balance sheet assets, draining commercial bank reserves to tighten liquidity conditions.

5. Yield Curve Signals & Inversion
The slope of the Treasury yield curve (notably the 2-year / 10-year spread) acts as a leading macroeconomic indicator. An inverted yield curve (where short rates exceed long rates) reflects market expectations of impending economic deceleration and subsequent rate cuts.`,
    keyTakeaways: [
      'Taylor Principle: Nominal interest rates must adjust >1:1 relative to inflation to alter real borrowing costs.',
      'Three main transmission channels: Interest Rate, Asset Price/Wealth, and Exchange Rate.',
      'Quantitative Tightening drains commercial bank reserves without moving the benchmark corridor.',
      'Yield curve inversion (2Y/10Y spread) historically signals macroeconomic contraction risk.'
    ]
  }
];

export const initialAudioOverview: AudioOverviewData = {
  title: "Deep Dive: Cellular Bioenergetics",
  topic: "Bioenergetics & Systems Synthesis",
  durationSeconds: 215,
  summary: "Dr. Evelyn Vance and Leo Miller deconstruct how microscopic proton gradients in mitochondria mirror state representations in quantum systems and macroeconomic equilibrium.",
  segments: [
    {
      speaker: "Host A: Dr. Evelyn Vance",
      text: "Welcome back to the StudyApex Deep Dive. Today we're tackling three foundational topics that, on the surface, seem worlds apart: cellular bioenergetics, quantum computing superposition, and monetary policy mechanisms.",
      timestamp: "0:00",
      emotion: "Analytical",
      keyTakeaway: "Introduction to interdisciplinary systemic equilibrium."
    },
    {
      speaker: "Host B: Leo Miller",
      text: "Right! And what blew my mind when reading these source documents is how both a cell synthesizing ATP and a central bank executing quantitative tightening are essentially managing tight potential gradients to prevent total breakdown.",
      timestamp: "0:22",
      emotion: "Curious",
      keyTakeaway: "Analogy between cellular gradient and economic liquidity."
    },
    {
      speaker: "Host A: Dr. Evelyn Vance",
      text: "Exactly, Leo. In cellular respiration, Peter Mitchell's chemiosmotic hypothesis proved that energy isn't transferred via some mystical chemical intermediate. It's stored as an electrochemical proton gradient—literally pumping H+ ions into the intermembrane space to turn the rotor of ATP synthase like a hydroelectric dam turbine.",
      timestamp: "0:48",
      emotion: "Insightful",
      keyTakeaway: "Chemiosmotic proton-motive force as a molecular turbine."
    },
    {
      speaker: "Host B: Leo Miller",
      text: "And that turbine generates about 30 to 32 ATP per glucose! But wait—when we cross over to quantum mechanics in Source 2, we see a whole different game. A classical bit is either 0 or 1, like an off/on switch, but a qubit sits anywhere on the Bloch sphere.",
      timestamp: "1:18",
      emotion: "Astonished",
      keyTakeaway: "Qubit superposition vs classical binary states."
    },
    {
      speaker: "Host A: Dr. Evelyn Vance",
      text: "Precisely. The superposition |ψ⟩ = α|0⟩ + β|1⟩ allows algorithms like Shor's to explore exponentially large solution spaces in polynomial time. However, the Achilles heel is decoherence—environmental thermal noise destroying that delicate phase before computation completes.",
      timestamp: "1:44",
      emotion: "Analytical",
      keyTakeaway: "Superposition power constrained by environmental decoherence."
    },
    {
      speaker: "Host B: Leo Miller",
      text: "Which sounds uncomfortably close to central bankers in Source 3 trying to curb inflation without triggering a recessionary liquidity trap! If rates spike too fast, market confidence decoheres completely.",
      timestamp: "2:12",
      emotion: "Curious",
      keyTakeaway: "Macroeconomic interest rate sensitivity."
    },
    {
      speaker: "Host A: Dr. Evelyn Vance",
      text: "A sharp comparison. The yield curve inversion serves as the market's diagnostic sensor, warning that short-term funding pressure has exceeded equilibrium capacity.",
      timestamp: "2:38",
      emotion: "Insightful",
      keyTakeaway: "Yield curve as macroeconomic diagnostic sensor."
    }
  ]
};

export const initialMindMap: MindMapData = {
  root: {
    id: "root-core",
    name: "StudyApex Core Curriculum Matrix",
    description: "Synthesized conceptual hierarchy across active educational domains",
    children: [
      {
        id: "cat-bio",
        name: "1. Bioenergetics & Cellular Respiration",
        badge: "Essential",
        summary: "Pathways transforming glucose carbon bonds into usable ATP currency",
        children: [
          {
            id: "sub-glyc",
            name: "Glycolysis & Pyruvate Decarboxylation",
            badge: "Cytoplasm",
            notes: "10-step enzymatic pathway yielding 2 net ATP, 2 NADH, and 2 Pyruvate. Rate-limiting step: PFK-1.",
            formula: "Glucose + 2 ADP + 2 Pi + 2 NAD+ -> 2 Pyruvate + 2 ATP + 2 NADH + 2 H+",
            examTip: "PFK-1 is allosterically inhibited by high ATP and activated by AMP and F-2,6-BP."
          },
          {
            id: "sub-krebs",
            name: "Citric Acid (Krebs) Cycle",
            badge: "Matrix",
            notes: "Occurs inside mitochondrial matrix. 2 turns per glucose generate 6 NADH, 2 FADH2, and 2 GTP/ATP.",
            formula: "Acetyl-CoA + Oxaloacetate -> Citrate (via Citrate Synthase)",
            examTip: "Succinate dehydrogenase is the ONLY enzyme embedded directly in the inner mitochondrial membrane."
          },
          {
            id: "sub-oxphos",
            name: "Oxidative Phosphorylation & Chemiosmosis",
            badge: "Inner Membrane",
            notes: "Complexes I, III, and IV pump protons into intermembrane space; Complex V (ATP Synthase) harnesses proton flux.",
            formula: "Proton-Motive Force: Δp = ΔΨ - (2.3 RT/F)ΔpH",
            examTip: "Uncouplers like 2,4-DNP collapse Δp without inhibiting electron transport, dissipating energy as heat."
          }
        ]
      },
      {
        id: "cat-quantum",
        name: "2. Quantum Computing Foundations",
        badge: "Advanced",
        summary: "Principles of quantum superposition, entanglement, and computational gates",
        children: [
          {
            id: "sub-qubit",
            name: "Qubit & Bloch Sphere Geometry",
            badge: "Hilbert Space",
            notes: "State vector |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ with normalization |α|² + |β|² = 1.",
            formula: "|ψ⟩ = α|0⟩ + β|1⟩",
            examTip: "Measurement projects the superposition irrevocably into |0⟩ or |1⟩ with probabilities |α|² and |β|²."
          },
          {
            id: "sub-gates",
            name: "Quantum Logic Gates & Entanglement",
            badge: "Unitary Transforms",
            notes: "Hadamard creates equal superposition; CNOT creates Bell entangled states (|00⟩ + |11⟩)/√2.",
            formula: "H = (1/√2) [[1, 1], [1, -1]]",
            examTip: "All quantum gates must be reversible and unitary (U†U = I) to preserve norm."
          },
          {
            id: "sub-shor",
            name: "Shor's & Grover's Algorithms",
            badge: "Complexity",
            notes: "Shor offers exponential speedup for integer factorization via QFT; Grover offers quadratic speedup O(√N) for search.",
            formula: "QFT: |j⟩ -> (1/√N) Σ exp(2πi jk/N) |k⟩",
            examTip: "Threatens 2048-bit RSA encryption; mandates transition to post-quantum cryptography (PQC)."
          }
        ]
      },
      {
        id: "cat-macro",
        name: "3. Macroeconomics & Monetary Policy",
        badge: "Intermediate",
        summary: "Central bank transmission channels, interest rate corridors, and yield dynamics",
        children: [
          {
            id: "sub-taylor",
            name: "Taylor Rule & Inflation Targeting",
            badge: "Corridor Rate",
            notes: "Prescriptive policy model setting nominal interest rate based on inflation gaps and GDP output gap.",
            formula: "i = r* + π + 0.5(π - π*) + 0.5(y - y*)",
            examTip: "The Taylor principle requires raising nominal rate by MORE than 1:1 against inflation to raise REAL rates."
          },
          {
            id: "sub-balance",
            name: "Quantitative Easing vs Tightening (QT)",
            badge: "Balance Sheet",
            notes: "Direct asset purchase/redemption altering bank reserve liquidity and long-term borrowing term premiums.",
            formula: "M2 = Monetary Base × Money Multiplier",
            examTip: "QT drains liquidity without immediate rate hikes, flattening or inverting short-term funding spreads."
          }
        ]
      }
    ]
  }
};

export const initialSlideDeck: SlideDeckData = {
  deckTitle: "StudyApex Master Curriculum Lecture Deck",
  slides: [
    {
      slideNumber: 1,
      title: "Cellular Bioenergetics: The Mitochondrial Dynamo",
      subtitle: "Module 1 • High-Yield Cellular Mechanisms",
      bullets: [
        "Chemiosmotic coupling translates chemical bond energy into an electrochemical proton gradient (Δp).",
        "Electron transport chain: Complexes I, III, and IV pump ~10 H+ per NADH across the inner membrane.",
        "Complex V (ATP Synthase) functions as a molecular rotary motor producing ~1 ATP per 3-4 H+ influx."
      ],
      keyVisual: {
        type: "metric",
        title: "Net Energy Harvest",
        value: "30-32 ATP",
        caption: "Calculated per complete glucose oxidation cycle"
      },
      voiceNarration: "Welcome everyone. In this opening slide, we examine the extraordinary molecular turbine inside our cells. Notice how the electron transport chain doesn't make ATP directly—it pumps protons out, creating a concentrated battery charge across the inner membrane that drives the catalytic head of ATP synthase."
    },
    {
      slideNumber: 2,
      title: "Quantum Superposition & The Bloch Sphere",
      subtitle: "Module 2 • Quantum Information Architecture",
      bullets: [
        "Unlike classical bits bounded to binary 0 or 1, a qubit occupies continuous probability amplitudes.",
        "The state vector |ψ⟩ = α|0⟩ + β|1⟩ is constrained by unitary conservation |α|² + |β|² = 1.",
        "Unitary logic gates (Hadamard, Pauli-X, CNOT) execute rotations on the sphere surface without measurement."
      ],
      keyVisual: {
        type: "comparison",
        title: "Information State Space",
        value: "2^N Hilbert Dim",
        caption: "Exponential parallelism across N entangled qubits"
      },
      voiceNarration: "Turning now to quantum foundations. Here we see the Bloch sphere representation. While a conventional computer must check states sequentially, an array of entangled qubits explores a two-to-the-N dimensional state space simultaneously until an observation collapses the wave function."
    },
    {
      slideNumber: 3,
      title: "Monetary Policy Transmission & Yield Inversion",
      subtitle: "Module 3 • Macroeconomic Balance Sheet Dynamics",
      bullets: [
        "The Federal Reserve dual mandate: Maximum employment and long-run price stability (2.0% target).",
        "Taylor Rule dynamics: Adjusting the Federal Funds Rate above neutral to cool overheated output gaps.",
        "Yield Curve Inversion (2Y vs 10Y Treasury): Historic leading indicator signaling imminent recessionary risk."
      ],
      keyVisual: {
        type: "framework",
        title: "Inflation Target Corridor",
        value: "2.0% PCE",
        caption: "Anchor for long-term consumer inflation expectations"
      },
      voiceNarration: "Finally, let's step back to macroeconomics. When demand drives inflation away from the two percent anchor, central banks hike policy rates. If short-term rates eclipse ten-year yields, that inversion signals that debt markets anticipate contraction ahead."
    },
    {
      slideNumber: 4,
      title: "Synthesis: Resilient Systems Under Stress",
      subtitle: "Module 4 • Cross-Domain Conceptual Review",
      bullets: [
        "Biological threshold: Glycolysis shifts to lactic fermentation when oxygen oxygen acceptors are depleted.",
        "Quantum threshold: Decoherence time T2 sets the upper bound on viable gate depth before error accumulation.",
        "Economic threshold: The Zero Lower Bound (ZLB) forces monetary authorities into unconventional quantitative easing."
      ],
      keyVisual: {
        type: "metric",
        title: "System Fault Limit",
        value: "Threshold Dynamics",
        caption: "Non-linear failure states when buffers are exhausted"
      },
      voiceNarration: "To conclude, consider the overarching lesson from all three domains: systems maintain equilibrium through feedback buffers, but once those buffers cross critical thresholds, non-linear phase transitions take place."
    }
  ]
};

export const initialQuiz: QuizData = {
  quizTitle: "StudyApex Active Recall Mastery Assessment",
  estimatedMinutes: 10,
  questions: [
    {
      id: "q-1",
      question: "In mitochondrial oxidative phosphorylation, what is the exact physical driving force that induces rotation in the c-ring of ATP synthase?",
      options: [
        "Direct electrostatic repulsion of ADP by magnesium ions",
        "Protonation and deprotonation of specific aspartate/glutamate residues within the c-subunit",
        "Thermal fluctuation of water molecules inside the intermembrane space",
        "Active ATP hydrolysis occurring in the mitochondrial matrix"
      ],
      correctIndex: 1,
      difficulty: "Hard",
      explanation: "Protons enter through the half-channels of the stationary a-subunit, protonating a conserved carboxylate residue (aspartate or glutamate) on the c-ring. This neutralizes its charge, allowing it to rotate through the hydrophobic lipid bilayer until exiting into the matrix.",
      sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
    },
    {
      id: "q-2",
      question: "Why does the oxidation of one molecule of FADH2 generate fewer ATP molecules (~1.5) than one molecule of NADH (~2.5)?",
      options: [
        "FADH2 cannot enter the mitochondrial matrix and remains trapped in the cytosol",
        "FADH2 enters electron transport at Complex II, bypassing the proton pumping of Complex I",
        "FADH2 produces cytotoxic superoxide radicals that destroy ATP synthase",
        "FADH2 electrons are carried directly to oxygen without cytochrome c mediation"
      ],
      correctIndex: 1,
      difficulty: "Medium",
      explanation: "Electrons from FADH2 are transferred to ubiquinone via Complex II (succinate dehydrogenase). Because Complex II does not pump protons across the inner membrane, four fewer protons are translocated per electron pair compared to NADH (which enters at Complex I).",
      sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
    },
    {
      id: "q-3",
      question: "A single-qubit quantum state is prepared in |0⟩. What is the resulting state vector after applying a standard Hadamard gate?",
      options: [
        "|1⟩",
        "(|0⟩ + |1⟩) / √2",
        "i|0⟩ - |1⟩",
        "(|0⟩ - |1⟩) / 2"
      ],
      correctIndex: 1,
      difficulty: "Easy",
      explanation: "The Hadamard transform maps computational basis states into equal superpositions: H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ - |1⟩)/√2. This places the qubit along the +X axis of the Bloch sphere.",
      sourceRef: "Source 2: Quantum Computing Foundations"
    },
    {
      id: "q-4",
      question: "In quantum information theory, what does the 'No-Cloning Theorem' fundamentally state?",
      options: [
        "Quantum computers can never simulate classical deterministic circuits",
        "It is physically impossible to create an identical copy of an arbitrary unknown quantum state",
        "Entangled pairs must immediately decouple if separated by more than 1 kilometer",
        "Error correction circuits cannot detect phase-flip bit errors"
      ],
      correctIndex: 1,
      difficulty: "Medium",
      explanation: "The linearity of quantum mechanics and unitary operations prohibits any physical transformation that copies an arbitrary unknown quantum state |ψ⟩ onto another blank state |0⟩ without altering the original.",
      sourceRef: "Source 2: Quantum Computing Foundations"
    },
    {
      id: "q-5",
      question: "According to the monetary policy Taylor Rule, if inflation rises by 1 percentage point above target, how should the central bank adjust nominal interest rates to maintain stabilizing real conditions?",
      options: [
        "Keep nominal rates completely constant to prevent banking sector volatility",
        "Raise nominal interest rates by MORE than 1 percentage point (e.g. 1.5 pp) so real rates rise",
        "Lower nominal rates by 1 percentage point to encourage investment",
        "Limit the rate change strictly to the rate of population growth"
      ],
      correctIndex: 1,
      difficulty: "Hard",
      explanation: "This is the core 'Taylor Principle': if inflation increases by 1%, the central bank must raise nominal rates by more than 1% (typically 1.5%). This ensures the real interest rate (r = i - π) actually rises, discouraging excessive borrowing and cooling aggregate demand.",
      sourceRef: "Source 3: Macroeconomics & Monetary Policy"
    },
    {
      id: "q-6",
      question: "When the Treasury yield curve inverts (e.g., 2-Year yields exceed 10-Year yields), what primary market expectation is reflected?",
      options: [
        "Investors anticipate runaway economic expansion over the coming decade",
        "Investors anticipate near-term monetary tightening followed by eventual economic slowdown and rate cuts",
        "The Federal Reserve has permanently eliminated government bond auctions",
        "Commercial banks have ceased offering checking deposits"
      ],
      correctIndex: 1,
      difficulty: "Medium",
      explanation: "An inverted yield curve reflects investor expectations that current high short-term interest rates will slow down economic activity, compelling the central bank to lower rates in the future. Historically, this has been a reliable predictor of economic downturns.",
      sourceRef: "Source 3: Macroeconomics & Monetary Policy"
    }
  ]
};

export const initialTimeline: TimelineData = {
  timelineTitle: "Chronological Progression & Scientific Milestones",
  events: [
    {
      id: "t-1",
      epoch: "1961 - Chemiosmotic Revolution",
      title: "Peter Mitchell Proposes Proton-Motive Coupling",
      description: "Mitchell overturned conventional biochemistry by proposing that ATP synthesis is energized by an electrochemical proton gradient across membranes rather than high-energy chemical intermediates, earning the 1978 Nobel Prize.",
      category: "Discovery",
      impact: "Critical"
    },
    {
      id: "t-2",
      epoch: "1982 - Quantum Computing Vision",
      title: "Feynman's Quantum Simulation Postulate",
      description: "Richard Feynman demonstrated that classical computers cannot efficiently simulate quantum mechanical systems without exponential overhead, proposing computers constructed of quantum elements.",
      category: "Discovery",
      impact: "High"
    },
    {
      id: "t-3",
      epoch: "1993 - Systematic Monetary Rules",
      title: "John B. Taylor Publishes the Taylor Rule",
      description: "Introduced the rule-based policy guideline linking central bank target rates to inflation gaps and real output gaps, moving central banking away from discretionary ad-hoc decisions.",
      category: "Policy",
      impact: "High"
    },
    {
      id: "t-4",
      epoch: "1994 - Algorithmic Cryptanalysis",
      title: "Peter Shor Formulates Quantum Factoring",
      description: "Shor demonstrated polynomial-time integer factorization on a quantum machine, establishing that quantum computing poses an existential disruption to RSA public-key cryptography.",
      category: "Mechanism",
      impact: "Critical"
    },
    {
      id: "t-5",
      epoch: "1997 - Rotary Catalysis Confirmation",
      title: "John Walker & Paul Boyer Solve ATP Synthase",
      description: "Crystallographic X-ray structure verified that ATP synthase rotates physically at speeds upwards of 100 revolutions per second, confirming mechanical rotation in living organisms.",
      category: "Mechanism",
      impact: "Critical"
    },
    {
      id: "t-6",
      epoch: "2024–2026 - Modern Frontier Synthesis",
      title: "Fault-Tolerant Logical Qubits & Balance Sheet Normalization",
      description: "Hardware transitions from noisy intermediate-scale quantum (NISQ) systems toward neutral-atom and superconducting surface code error correction, while central banks execute quantitative tightening (QT).",
      category: "Synthesis",
      impact: "High"
    }
  ],
  infographics: [
    {
      metric: "ATP Harvest per Glucose",
      value: "30-32 ATP",
      label: "Net Bio-Yield",
      trend: "+38% theoretical max",
      description: "Efficiency of aerobic respiration versus just 2 ATP produced via anaerobic glycolysis alone."
    },
    {
      metric: "Bloch Sphere State Space",
      value: "2^50+ States",
      label: "Quantum Hilbert Dim",
      trend: "Exponential scale",
      description: "A 50-qubit quantum state demands more classical RAM to simulate than exists on ordinary supercomputers."
    },
    {
      metric: "Taylor Inflation Target",
      value: "2.0% Core PCE",
      label: "Target Stability Anchor",
      trend: "Target benchmark",
      description: "The targeted annual price increase standard utilized by the Federal Open Market Committee."
    },
    {
      metric: "Decoherence Window",
      value: "~100-300 μs",
      label: "Superconducting T2",
      trend: "Coherence limit",
      description: "Active time available to execute quantum gate operations before environmental noise causes phase collapse."
    }
  ]
};

export const initialTableFaq: TableFaqData = {
  tableTitle: "Comparative Technical Matrix: Metabolic, Quantum & Economic Systems",
  columns: [
    "Discipline / Stage",
    "Primary Mechanism",
    "Fundamental Unit",
    "Key Limiting Bottleneck",
    "Equilibrium Metric"
  ],
  rows: [
    {
      col0: "Glycolysis (Bioenergetics)",
      col1: "Substrate-level phosphorylation",
      col2: "Glucose (6-Carbon)",
      col3: "Phosphofructokinase-1 (PFK-1)",
      col4: "2 net ATP / 2 NADH"
    },
    {
      col0: "Citric Acid Cycle (Bio)",
      col1: "Oxidative decarboxylation",
      col2: "Acetyl-CoA",
      col3: "Isocitrate Dehydrogenase",
      col4: "3 NADH, 1 FADH2, 1 GTP"
    },
    {
      col0: "Electron Transport (Bio)",
      col1: "Chemiosmotic proton pumping",
      col2: "Electrons / H+ protons",
      col3: "Oxygen (terminal acceptor)",
      col4: "Proton-Motive Force (Δp)"
    },
    {
      col0: "Quantum Computing",
      col1: "Unitary superposition & phase",
      col2: "Qubit (|0⟩, |1⟩)",
      col3: "Decoherence (T1/T2 relaxation)",
      col4: "Fidelity > 99.9%"
    },
    {
      col0: "Monetary Policy (Macro)",
      col1: "Interest rate corridor & QT",
      col2: "Monetary Base / Reserves",
      col3: "Zero Lower Bound / Stagflation",
      col4: "2.0% Inflation / Neutral r*"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      category: "Bioenergetics",
      question: "Why does uncoupling oxidative phosphorylation cause hyperthermia (rapid overheating)?",
      answer: "Compounds like 2,4-dinitrophenol (DNP) transport protons across the inner mitochondrial membrane into the matrix, bypassing ATP synthase. Because electron transport continues at maximum speed without resistance, 100% of the proton gradient energy is dissipated directly as thermal heat instead of being captured into chemical bonds of ATP.",
      sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
    },
    {
      id: "faq-2",
      category: "Bioenergetics",
      question: "What is the difference between substrate-level phosphorylation and oxidative phosphorylation?",
      answer: "Substrate-level phosphorylation directly transfers a high-energy phosphate group from a phosphorylated metabolic intermediate to ADP (such as 1,3-bisphosphoglycerate to 3-phosphoglycerate). Oxidative phosphorylation uses redox energy from electron transport to pump protons across a membrane, driving ATP synthesis indirectly via ATP synthase rotary catalysis.",
      sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
    },
    {
      id: "faq-3",
      category: "Quantum Computing",
      question: "Why can't we simply read out all superposition states at the end of a quantum algorithm?",
      answer: "According to the Born rule in quantum mechanics, measuring a qubit forces its state vector to collapse probabilistically into one of the classical basis eigenstates (|0⟩ or |1⟩). Quantum algorithms like Shor's rely on constructive and destructive phase interference so the desired answer has near-100% measurement probability upon collapse.",
      sourceRef: "Source 2: Quantum Computing Foundations"
    },
    {
      id: "faq-4",
      category: "Quantum Computing",
      question: "What is quantum entanglement and how does it differ from classical correlation?",
      answer: "Entanglement is a non-separable quantum state of two or more qubits (e.g. (|00⟩ + |11⟩)/√2). Even when separated by light-years, the outcome of measuring one qubit instantaneously determines the state of the other, violating Bell's inequalities and exhibiting correlations that cannot be explained by classical hidden variables.",
      sourceRef: "Source 2: Quantum Computing Foundations"
    },
    {
      id: "faq-5",
      category: "Macroeconomics",
      question: "Why do central banks fear deflation even more than moderate inflation?",
      answer: "Deflation causes real debt burdens to escalate, as wages and corporate revenues fall while debt principal remains fixed. Furthermore, consumers postpone big-ticket purchases anticipating lower prices tomorrow, triggering a contractionary spiral where consumption drops, businesses lay off workers, and nominal interest rates strike the Zero Lower Bound.",
      sourceRef: "Source 3: Macroeconomics & Monetary Policy"
    },
    {
      id: "faq-6",
      category: "Macroeconomics",
      question: "How does Quantitative Tightening (QT) work in practice?",
      answer: "In QT, the central bank allows Treasuries and mortgage-backed securities on its balance sheet to mature without reinvesting the proceeds, or sells them outright. This drains bank reserves from the financial system and increases the supply of bonds in private markets, pushing long-term bond yields up and tightening financial conditions.",
      sourceRef: "Source 3: Macroeconomics & Monetary Policy"
    }
  ]
};

export const sampleHistoricalAttempts: QuizAttempt[] = [
  {
    id: "att-1",
    timestamp: "Yesterday, 4:15 PM",
    score: 5,
    total: 6,
    percentage: 83.3,
    mode: "practice",
    timeSpentSeconds: 312,
    userAnswers: { "q-1": 1, "q-2": 1, "q-3": 1, "q-4": 1, "q-5": 0, "q-6": 1 }
  },
  {
    id: "att-2",
    timestamp: "2 days ago, 11:20 AM",
    score: 6,
    total: 6,
    percentage: 100,
    mode: "timed",
    timeSpentSeconds: 245,
    userAnswers: { "q-1": 1, "q-2": 1, "q-3": 1, "q-4": 1, "q-5": 1, "q-6": 1 }
  }
];
