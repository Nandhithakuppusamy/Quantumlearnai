/**
 * QuantumLearn AI - Curriculum & Algorithm Data
 */

export const ALGORITHMS = [
  {
    id: 'bell-state',
    presetId: 'bell_state',
    name: 'Bell State (|Φ⁺⟩)',
    category: 'Fundamentals',
    level: 'Beginner',
    estimatedTime: '15 min',
    progress: 72,
    badgeColor: 'cyan',
    tagline: 'The foundation of quantum entanglement and quantum teleportation',
    shortDesc: 'Create maximal entanglement between two qubits where measuring one instantaneously dictates the state of the other.',
    whatYoullLearn: [
      'Quantum superposition via the Hadamard (H) gate',
      'The mathematics of the Controlled-NOT (CNOT) gate',
      'Quantum entanglement and Einstein-Podolsky-Rosen (EPR) pairs',
      "Bell's inequality and why quantum mechanics is non-local",
      'Measurement collapse in multi-qubit systems'
    ],
    formula: '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2',
    formulaExplanation: 'An equal superposition of two classical states with zero probability of finding opposite states |01⟩ or |10⟩.',
    concepts: [
      {
        title: 'Superposition First',
        desc: 'Qubit 0 begins in |0⟩ and is put into (|0⟩+|1⟩)/√2 using Hadamard. At this stage, Qubit 1 is still purely |0⟩.',
        highlight: 'Step 1: H(q0)'
      },
      {
        title: 'Entangling with CNOT',
        desc: 'The CNOT gate uses Qubit 0 as control. When q0 is |1⟩, it flips q1 to |1⟩. The states become intrinsically linked.',
        highlight: 'Step 2: CNOT(q0, q1)'
      },
      {
        title: 'Correlated Measurement',
        desc: 'Regardless of physical distance, measuring q0 to be 0 guarantees q1 is 0; measuring q0 to be 1 guarantees q1 is 1.',
        highlight: 'Outcome: 50% |00⟩, 50% |11⟩'
      }
    ],
    circuitSummary: 'q0: ── H ── ● ── M ──\n            │\nq1: ─────── X ── M ──',
    whyItMatters: 'Bell states are the essential quantum resource for Quantum Key Distribution (QKD), superdense coding, and quantum teleportation.'
  },
  {
    id: 'grovers-search',
    presetId: 'grover_search',
    name: "Grover's Search Algorithm",
    category: 'Quantum Algorithms',
    level: 'Intermediate',
    estimatedTime: '20 min',
    progress: 40,
    badgeColor: 'purple',
    tagline: 'Quadratic speedup for unstructured search and database lookup',
    shortDesc: 'Search an unsorted database of N items in O(√N) evaluations using quantum amplitude amplification.',
    whatYoullLearn: [
      'The limits of classical brute-force search (O(N))',
      'Quantum Oracle function f(x) and phase kickback',
      'Grover diffusion operator (inversion about the mean)',
      'Amplitude amplification geometry and optimal iterations',
      'Real-world applications in cryptanalysis and satisfaction problems'
    ],
    formula: 'Iterate: G = (2|s⟩⟨s| - I) · O_f',
    formulaExplanation: 'Alternate between applying the phase oracle O_f and the diffusion operator to rotate the state towards the target answer.',
    concepts: [
      {
        title: 'Equal Superposition',
        desc: 'Every candidate item begins with equal probability amplitude 1/√N across the quantum register.',
        highlight: 'Preparation: H^⊗n'
      },
      {
        title: 'Phase Inversion (Oracle)',
        desc: 'The oracle marks the target state |ω⟩ by flipping its phase from positive to negative: |ω⟩ → -|ω⟩.',
        highlight: 'Step 1: Invert Phase'
      },
      {
        title: 'Inversion About the Mean',
        desc: 'The Grover diffusion operator reflects all amplitudes across their average, dramatically boosting the target amplitude while suppressing distractors.',
        highlight: 'Step 2: Amplify Target'
      }
    ],
    circuitSummary: 'q0: ── H ── [ Oracle ] ── [ Diffusion ] ── M ──\nq1: ── H ── [ Oracle ] ── [ Diffusion ] ── M ──',
    whyItMatters: "Grover's algorithm provides provable quadratic speedup over any classical algorithm, meaning searching 1 trillion items takes ~1 million quantum steps instead of 500 billion classical steps."
  },
  {
    id: 'quantum-teleportation',
    presetId: 'teleportation',
    name: 'Quantum Teleportation',
    category: 'Quantum Communication',
    level: 'Intermediate',
    estimatedTime: '25 min',
    progress: 20,
    badgeColor: 'indigo',
    tagline: 'Disembodied transmission of unknown quantum states using entanglement',
    shortDesc: 'Transmit the complete quantum information of an unknown qubit across any distance using shared entanglement and 2 classical bits.',
    whatYoullLearn: [
      'The No-Cloning Theorem and why quantum states cannot simply be copied',
      'Pre-shared Einstein-Podolsky-Rosen (EPR) entanglement channels',
      'Joint Bell-basis measurement by the sender (Alice)',
      'Classical communication channel requirement (speed-of-light limit)',
      "Unitary feed-forward corrections (X and Z gates) by the receiver (Bob)"
    ],
    formula: '|ψ_in⟩ ⊗ |Φ⁺⟩_AB → Reconstructed |ψ_out⟩ = α|0⟩ + β|1⟩',
    formulaExplanation: 'Alice destroys her local state through measurement, and Bob reconstructs an exact replica using 2 classical bits.',
    concepts: [
      {
        title: 'EPR Channel Setup',
        desc: 'An entangled Bell pair is generated. Alice holds qubit A, and Bob holds qubit B.',
        highlight: 'Pre-shared Entanglement'
      },
      {
        title: 'Alice’s Bell Measurement',
        desc: 'Alice couples her unknown data qubit with qubit A and performs a joint measurement, yielding 2 classical bits.',
        highlight: 'Joint Measurement'
      },
      {
        title: 'Bob’s Unitary Correction',
        desc: 'Bob applies conditional Pauli X and Z gates according to the 2 classical bits received, faithfully restoring the state.',
        highlight: 'Feed-forward Recovery'
      }
    ],
    circuitSummary: 'q0 (Data):  ── ● ── H ── M (c0) ───────────────\n               │         │\nq1 (Alice): ── X ─────── M (c1) ───────────────\n                                 │       │\nq2 (Bob):   ─────────────── Z^(c0) ─ X^(c1) ── |ψ⟩',
    whyItMatters: 'Quantum teleportation is the core backbone for quantum internet repeaters, distributed quantum computing, and secure quantum networks.'
  },
  {
    id: 'deutsch-jozsa',
    presetId: 'deutsch_jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: 'Quantum Speedup',
    level: 'Intermediate',
    estimatedTime: '20 min',
    progress: 15,
    badgeColor: 'emerald',
    tagline: 'The very first demonstration of exponential quantum parallelism',
    shortDesc: 'Determine if an unknown function f(x) is constant or balanced in exactly 1 quantum query, compared to 2^(n-1)+1 classical queries.',
    whatYoullLearn: [
      'Constant vs Balanced black-box oracle definition',
      'The exponential query complexity gap (O(1) quantum vs O(2^n) classical)',
      'Phase kickback mechanism with ancilla initialized in |−⟩',
      'Constructive vs destructive interference on the all-zero state |0...0⟩'
    ],
    formula: '|⟨0...0|ψ_final⟩|² = 1 (Constant) or 0 (Balanced)',
    formulaExplanation: 'If f is constant, quantum amplitudes constructively interfere at |0...0⟩. If f is balanced, destructive interference completely cancels the |0...0⟩ outcome.',
    concepts: [
      {
        title: 'Parallel Query',
        desc: 'Input qubits are placed into equal superposition, evaluating all possible inputs x simultaneously.',
        highlight: 'Superposition Evaluation'
      },
      {
        title: 'Phase Kickback',
        desc: 'The oracle modifies the phase of the input register (-1)^f(x) without altering the target register.',
        highlight: 'Phase Modulation'
      },
      {
        title: 'Interference Readout',
        desc: 'A final Hadamard transform causes complete constructive or destructive interference, giving the answer in one single shot.',
        highlight: 'Single-Shot Decision'
      }
    ],
    circuitSummary: 'q0: ── H ── [ U_f Oracle ] ── H ── M ──\nq1: ─X─ H ── [ U_f Oracle ] ─────────────',
    whyItMatters: 'Deutsch-Jozsa historically provided the first concrete mathematical proof that quantum computers can solve specific computational problems exponentially faster than deterministic classical computers.'
  },
  {
    id: 'shors-algorithm',
    presetId: 'shor',
    name: "Shor's Factoring Algorithm",
    category: 'Advanced Quantum',
    level: 'Advanced',
    estimatedTime: '35 min',
    progress: 0,
    badgeColor: 'rose',
    tagline: 'Polynomial-time prime factorization and the threat to RSA encryption',
    shortDesc: 'Find prime factors of large integers in polynomial time O((log N)³) using the Quantum Fourier Transform (QFT).',
    whatYoullLearn: [
      'Reduction of integer factorization to modular order-finding: a^r ≡ 1 (mod N)',
      'The Quantum Fourier Transform (QFT) circuit decomposition',
      'Phase estimation and continuous fractions algorithm',
      'Post-quantum cryptography (PQC) and quantum-safe transition'
    ],
    formula: 'QFT: |j⟩ → (1/√N) ∑_{k=0}^{N-1} e^{2πi j k / N} |k⟩',
    formulaExplanation: 'Extracts the hidden period r of the periodic modular exponentiation function through coherent quantum phase interference.',
    concepts: [
      {
        title: 'Classical Reduction',
        desc: 'Number theory proves that finding the period r of f(x) = a^x mod N yields non-trivial factors gcd(a^(r/2) ± 1, N).',
        highlight: 'Order Finding'
      },
      {
        title: 'Quantum Fourier Transform',
        desc: 'QFT acts like an optical diffraction grating on quantum amplitudes, revealing the exact frequency/period of the register.',
        highlight: 'Periodic Extraction'
      },
      {
        title: 'Polynomial Speedup',
        desc: 'Reduces an exponentially intractable classical problem into an efficient polynomial algorithm running in BQP.',
        highlight: 'O(log³ N) vs O(e^c∛(N))'
      }
    ],
    circuitSummary: 'Reg 1: ── H^⊗n ── [ Modular Exp ] ── [ Inverse QFT ] ── M ──\nReg 2: ── |0...1⟩ ── [ Modular Exp ] ──────────────────────',
    whyItMatters: "Shor's algorithm broke classical RSA and ECC cryptographic assumptions, driving today's global migration to NIST Post-Quantum Cryptography standards."
  }
];
