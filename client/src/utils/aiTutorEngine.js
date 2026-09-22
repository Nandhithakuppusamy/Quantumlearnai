/**
 * QuantumLearn AI - Local AI Quantum Tutor Knowledge Engine
 * Provides contextual circuit analysis and educational responses to student inquiries.
 */

export const ALGORITHM_TUTOR_CONTEXT = {
  bell_state: {
    name: 'Bell State (|Φ⁺⟩)',
    summary: "Your circuit begins with a Hadamard gate on q0. The H gate creates a superposition, placing q0 into a combination of |0⟩ and |1⟩. The CNOT gate then entangles q0 and q1. That's why the simulation produces correlated |00⟩ and |11⟩ results.",
    keyPoints: [
      "H gate on q0 transforms |0⟩ → (|0⟩+|1⟩)/√2",
      "CNOT(q0, q1) entangles the qubits: |10⟩ becomes |11⟩",
      "Measurement yields ~50% |00⟩ and ~50% |11⟩ with 0% chance of |01⟩ or |10⟩"
    ],
    suggestedQuestions: [
      "What does the H gate do?",
      "Why are the qubits entangled?",
      "What is Bell State?",
      "What is a qubit?"
    ]
  },
  grover_search: {
    name: "Grover's Search",
    summary: "Grover's circuit searches an unsorted 2-qubit database. First, Hadamard gates put both qubits into equal superposition. Next, the oracle marks the target state |11⟩ by flipping its phase. Finally, the diffusion operator inverts all amplitudes about their mean, boosting |11⟩ to near 100% probability!",
    keyPoints: [
      "Uniform superposition spreads 1/2 amplitude across |00⟩, |01⟩, |10⟩, |11⟩",
      "Phase oracle marks the target state: |11⟩ → -|11⟩",
      "Diffusion operator (H → X → Controlled-Z → X → H) inverts about the mean",
      "Yields quadratic speedup O(√N) over classical O(N) brute-force search"
    ],
    suggestedQuestions: [
      "What is Grover's algorithm?",
      "How does the oracle mark a state?",
      "What is superposition?",
      "What is a Bloch sphere?"
    ]
  },
  teleportation: {
    name: 'Quantum Teleportation',
    summary: "Quantum Teleportation transfers the unknown quantum state of Alice's qubit to Bob's qubit. They share an entangled EPR pair. Alice performs a joint Bell-basis measurement and transmits 2 classical bits to Bob, who applies Pauli X and Z corrections to faithfully restore the exact quantum state.",
    keyPoints: [
      "Pre-shares an entangled EPR pair between Alice and Bob",
      "Alice couples the data qubit with her EPR qubit via CNOT and H",
      "Alice's measurement collapses her state and produces 2 classical bits",
      "Bob applies conditional X and Z operations, reconstructing the state with 100% fidelity"
    ],
    suggestedQuestions: [
      "What is quantum teleportation?",
      "Why do we need 2 classical bits?",
      "Why are the qubits entangled?",
      "What does measurement do?"
    ]
  },
  deutsch_jozsa: {
    name: 'Deutsch-Jozsa Algorithm',
    summary: "Deutsch-Jozsa determines whether an unknown black-box function f(x) is constant or balanced in exactly 1 single quantum query! Superposition queries all inputs concurrently, and phase interference channels constant functions into |0...0⟩ and balanced functions into non-zero states.",
    keyPoints: [
      "Ancilla qubit initialized in |1⟩ and rotated to |−⟩ for phase kickback",
      "Input superposition evaluates f(x) for all inputs concurrently",
      "Final Hadamard creates constructive/destructive interference",
      "Evaluates a global function property in 1 query vs classical worst-case"
    ],
    suggestedQuestions: [
      "What is Deutsch-Jozsa algorithm?",
      "What does the H gate do?",
      "What is superposition?",
      "What are measurement probabilities?"
    ]
  }
};

// Comprehensive educational knowledge base
const KNOWLEDGE_TOPICS = [
  // 1. Quantum / Quantum Computing
  {
    id: 'quantum_computing',
    patterns: [
      /\bquantum\b/i,
      /\bwhat is quantum\b/i,
      /\bquantum computing\b/i,
      /\bquantum computer\b/i,
      /\bhow does quantum work\b/i
    ],
    priority: 10,
    answer: (context) => 
`**Quantum computing** harnesses the laws of quantum mechanics—principally **superposition** and **quantum entanglement**—to process complex information in fundamentally new ways.

• **Classical Computers**: Manipulate discrete binary bits ($0$ or $1$) using transistors.
• **Quantum Computers**: Utilize **qubits** that can exist in continuous superpositions ($\alpha|0\rangle + \beta|1\rangle$).

This parallelism allows quantum processors to explore complex problem spaces (such as molecular chemistry, cryptanalysis, and optimization) exponentially or quadratically faster than classical supercomputers.`
  },

  // 2. Qubit
  {
    id: 'qubit',
    patterns: [
      /\bqubit\b/i,
      /\bwhat is a qubit\b/i,
      /\bqubits\b/i,
      /\bquantum bit\b/i
    ],
    priority: 20,
    answer: (context) => 
`A **qubit** (quantum bit) is the fundamental unit of quantum information, analogous to the classical bit.

• **Classical bit**: Only ever in state $0$ or state $1$.
• **Qubit**: Can be in $|0\rangle$, $|1\rangle$, or any continuous linear **superposition**:
$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$
where $\\alpha$ and $\\beta$ are complex numbers satisfying $|\\alpha|^2 + |\\beta|^2 = 1$.

Geometrically, every pure single-qubit state can be represented as a unique point on the 3D surface of the **Bloch sphere**!`
  },

  // 3. Hadamard Gate / H Gate
  {
    id: 'hadamard',
    patterns: [
      /\bhadamard\b/i,
      /\bh gate\b/i,
      /\bwhat does h do\b/i,
      /\bwhat does the h gate do\b/i,
      /\bh-gate\b/i
    ],
    priority: 30,
    answer: (context) => 
`The **Hadamard (H) gate** is the most essential gate in quantum computing! It transforms computational basis states into equal superpositions:

• $H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$
• $H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$

Matrix representation:
$$H = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}$$

On the **Bloch sphere**, the H gate rotates the state vector $180^\\circ$ around the diagonal $X+Z$ axis, moving a state on the North pole ($|0\\rangle$) directly to the equator ($|+\\rangle$).`
  },

  // 4. Entanglement / Why are qubits entangled
  {
    id: 'entanglement',
    patterns: [
      /\bentangle\b/i,
      /\bentanglement\b/i,
      /\bwhy are the qubits entangled\b/i,
      /\bcorrelated\b/i,
      /\bepr\b/i
    ],
    priority: 25,
    answer: (context) => {
      let contextualNote = "";
      if (context === 'bell_state') {
        contextualNote = "\n\nIn your **Bell State** circuit, $q_0$ is put into superposition with H, and then CNOT entangles $q_0$ and $q_1$. When $q_0$ is measured as $0$, $q_1$ instantly collapses to $0$; when $q_0$ is $1$, $q_1$ instantly collapses to $1$.";
      } else if (context === 'teleportation') {
        contextualNote = "\n\nIn **Quantum Teleportation**, pre-shared entanglement between Alice and Bob provides the non-local correlation channel needed to transmit quantum information.";
      }

      return `**Quantum entanglement** occurs when two or more qubits interact such that the quantum state of each qubit cannot be described independently of the others, regardless of the physical distance separating them.

When two qubits are entangled into a Bell state:
$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$
measuring one qubit instantaneously determines the state of the other qubit with $100\\%$ correlation.${contextualNote}`;
    }
  },

  // 5. Grover's Algorithm
  {
    id: 'grover',
    patterns: [
      /\bgrover\b/i,
      /\bgrover's\b/i,
      /\bgrovers\b/i,
      /\bamplitude amplification\b/i,
      /\bwhat is grover\b/i
    ],
    priority: 30,
    answer: (context) => 
`**Grover's Algorithm** is a quantum search algorithm that searches an unsorted database of $N$ items in $O(\\sqrt{N})$ evaluations, providing a provable **quadratic speedup** over classical brute-force search ($O(N)$).

How it works:
1. **Superposition**: Initialize all possible inputs in equal superposition ($H^{\\otimes n}$).
2. **Oracle**: Inverts the phase of the target marked state ($|\\omega\\rangle \\to -|\\omega\\rangle$).
3. **Diffusion Operator**: Inverts all amplitudes across their mathematical mean, boosting the target probability from $\\frac{1}{N}$ to nearly $100\\%$!`
  },

  // 6. Bloch Sphere
  {
    id: 'bloch_sphere',
    patterns: [
      /\bbloch\b/i,
      /\bbloch sphere\b/i,
      /\bwhat is a bloch sphere\b/i,
      /\bbloch vector\b/i
    ],
    priority: 30,
    answer: (context) => 
`The **Bloch Sphere** is a geometric representation of pure single-qubit quantum states on a unit sphere of radius $r = 1$:

• **North Pole** ($z = +1$): Pure computational basis state $|0\\rangle$.
• **South Pole** ($z = -1$): Pure computational basis state $|1\\rangle$.
• **Equator** ($z = 0$): Equal superpositions, including $|+\\rangle$ on $+X$ and $|-\\rangle$ on $-X$.
• **Interior** ($r < 1$): Represents **mixed states**, which occur when a qubit is entangled with another qubit!`
  },

  // 7. Superposition
  {
    id: 'superposition',
    patterns: [
      /\bsuperposition\b/i,
      /\bwhat is superposition\b/i,
      /\blinear combination\b/i
    ],
    priority: 25,
    answer: (context) => 
`**Quantum superposition** is the principle that allows a quantum system to exist in a linear combination of multiple states simultaneously:

$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$

Unlike a classical coin which must be Heads or Tails, a qubit in superposition has probability amplitudes $\\alpha$ and $\\beta$. It remains in this continuous state until an environmental **measurement** forces it to collapse into a definite classical value.`
  },

  // 8. Quantum Gates
  {
    id: 'quantum_gates',
    patterns: [
      /\bquantum gates\b/i,
      /\bwhat are quantum gates\b/i,
      /\bgates\b/i,
      /\bunitary\b/i
    ],
    priority: 15,
    answer: (context) => 
`**Quantum gates** are the basic building blocks of quantum circuits, analogous to classical logic gates:

• **Single-qubit gates** ($H, X, Y, Z, S, T$): Perform reversible unitary rotations on the Bloch sphere.
• **Two-qubit gates** ($CNOT, CZ, SWAP$): Entangle qubits and enable conditional logic.

Unlike classical NAND/AND gates, quantum gates (except measurement) are strictly **reversible** and represented by unitary matrices ($U^\\dagger U = I$).`
  },

  // 9. Pauli X (NOT Gate)
  {
    id: 'pauli_x',
    patterns: [
      /\bpauli x\b/i,
      /\bpauli-x\b/i,
      /\bx gate\b/i,
      /\bnot gate\b/i
    ],
    priority: 25,
    answer: (context) => 
`The **Pauli-X gate** is the quantum equivalent of the classical NOT gate (bit flip):

• $X|0\\rangle = |1\\rangle$
• $X|1\\rangle = |0\\rangle$

On the Bloch sphere, it rotates the state vector by $180^\\circ$ ($\\pi$ radians) around the X-axis.`
  },

  // 10. Pauli Y
  {
    id: 'pauli_y',
    patterns: [
      /\bpauli y\b/i,
      /\bpauli-y\b/i,
      /\by gate\b/i
    ],
    priority: 25,
    answer: (context) => 
`The **Pauli-Y gate** performs both a bit-flip and a phase-flip simultaneously:

• $Y|0\\rangle = i|1\\rangle$
• $Y|1\\rangle = -i|0\\rangle$

It introduces a complex phase factor $i$ and corresponds to a $180^\\circ$ rotation around the Y-axis on the Bloch sphere.`
  },

  // 11. Pauli Z
  {
    id: 'pauli_z',
    patterns: [
      /\bpauli z\b/i,
      /\bpauli-z\b/i,
      /\bz gate\b/i,
      /\bphase flip\b/i
    ],
    priority: 25,
    answer: (context) => 
`The **Pauli-Z gate** is a phase-flip gate that leaves $|0\\rangle$ unchanged and flips the sign of $|1\\rangle$:

• $Z|0\\rangle = |0\\rangle$
• $Z|1\\rangle = -|1\\rangle$

On the Bloch sphere, it rotates the state vector by $180^\\circ$ around the Z-axis, transforming $|+\\rangle \\leftrightarrow |-\\rangle$.`
  },

  // 12. CNOT Gate
  {
    id: 'cnot',
    patterns: [
      /\bcnot\b/i,
      /\bcontrolled not\b/i,
      /\bcontrolled-not\b/i
    ],
    priority: 25,
    answer: (context) => 
`The **Controlled-NOT (CNOT)** gate is a 2-qubit entangling gate. It flips the target qubit if and only if the control qubit is in state $|1\\rangle$:

• $|00\\rangle \\to |00\\rangle$
• $|01\\rangle \\to |01\\rangle$
• $|10\\rangle \\to |11\\rangle$
• $|11\\rangle \\to |10\\rangle$

When the control qubit is in a superposition, CNOT creates maximal **entanglement** between the two qubits!`
  },

  // 13. Measurement / Collapse
  {
    id: 'measurement',
    patterns: [
      /\bmeasurement\b/i,
      /\bwhat does measurement do\b/i,
      /\bcollapse\b/i,
      /\bborn rule\b/i,
      /\bmeasure\b/i
    ],
    priority: 20,
    answer: (context) => 
`**Measurement** extracts classical information from a quantum system by collapsing its superposition into a definite classical outcome ($0$ or $1$).

According to **Born's Rule**, for a state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$:
• Probability of measuring $0$: $P(0) = |\alpha|^2$
• Probability of measuring $1$: $P(1) = |\beta|^2$

Measurement is fundamentally probabilistic and non-reversible.`
  },

  // 14. Bell State
  {
    id: 'bell_state',
    patterns: [
      /\bbell state\b/i,
      /\bwhat is bell state\b/i,
      /\bbell pair\b/i,
      /\bphi\+\b/i
    ],
    priority: 25,
    answer: (context) => 
`A **Bell State** is one of four maximally entangled two-qubit quantum states. The standard Bell state $|\Phi^+\rangle$ is:

$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$

It is created using a Hadamard gate on $q_0$ followed by a CNOT gate with $q_0$ controlling $q_1$. When measured, both qubits are guaranteed to yield correlated classical outcomes ($50\\% |00\\rangle$ and $50\\% |11\\rangle$).`
  },

  // 15. Quantum Teleportation
  {
    id: 'teleportation',
    patterns: [
      /\bteleportation\b/i,
      /\bquantum teleportation\b/i,
      /\bteleport\b/i
    ],
    priority: 25,
    answer: (context) => 
`**Quantum Teleportation** is a protocol that transmits an unknown quantum state using a pre-shared entangled Bell pair and **2 classical bits**.

1. Alice entangles her data qubit with her half of the Bell pair.
2. Alice performs a Bell-basis measurement, collapsing her qubits and producing 2 classical bits.
3. Bob receives the 2 classical bits and applies conditional Pauli X and Z gates, faithfully restoring Alice's original state.

Because the original state is destroyed during measurement, this adheres strictly to the **No-Cloning Theorem**.`
  },

  // 16. Deutsch-Jozsa Algorithm
  {
    id: 'deutsch_jozsa',
    patterns: [
      /\bdeutsch\b/i,
      /\bjozsa\b/i,
      /\bdeutsch-jozsa\b/i,
      /\bdeutsch jozsa\b/i
    ],
    priority: 25,
    answer: (context) => 
`The **Deutsch-Jozsa Algorithm** deterministically determines whether an unknown function $f(x)$ is **constant** (same output for all inputs) or **balanced** (outputs 0 for half and 1 for half) using **exactly 1 quantum query**!

Classically, testing a function of $n$ bits requires up to $2^{n-1} + 1$ queries in the worst case. Deutsch-Jozsa demonstrated the first exponential quantum separation using quantum parallelism and interference.`
  },

  // 17. Measurement Probabilities / Shots
  {
    id: 'probabilities',
    patterns: [
      /\bmeasurement probabilities\b/i,
      /\bprobabilities\b/i,
      /\bshots\b/i,
      /\bhistogram\b/i
    ],
    priority: 20,
    answer: (context) => 
`**Measurement probabilities** define the statistical likelihood of observing each basis state when measuring a quantum register.

In our local simulator:
• Exact theoretical probabilities are computed from the squared magnitudes of complex state vector amplitudes ($|c_i|^2$).
• Running **1,000 shots** repeatedly samples from these probabilities, mimicking the statistical readout of a real quantum processor.`
  }
];

export const getTutorAnswer = (userQuery, currentAlgorithm = 'bell_state') => {
  if (!userQuery || !userQuery.trim()) {
    return "Feel free to ask any question about quantum computing, quantum gates, or circuits!";
  }

  const query = userQuery.toLowerCase().trim();

  // Score and find the best matching topic based on pattern specificity and priority
  let bestMatch = null;
  let highestScore = -1;

  for (const topic of KNOWLEDGE_TOPICS) {
    for (const pattern of topic.patterns) {
      if (pattern.test(query)) {
        const score = topic.priority + (pattern.source.length / 10);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = topic;
        }
      }
    }
  }

  if (bestMatch) {
    return bestMatch.answer(currentAlgorithm);
  }

  // Educational fallback for unknown/general questions (NOT a Bell State dump!)
  return `I don't have a specific lesson module for that exact question, but I am here to help you master quantum computing! 

Here are some great topics you can ask me about:
• **Quantum Foundations**: *"What is quantum?"*, *"What is a qubit?"*, *"What is superposition?"*
• **Gates**: *"What does the H gate do?"*, *"What is CNOT?"*, *"What is Pauli X?"*
• **Entanglement**: *"Why are the qubits entangled?"*, *"What is Bell State?"*
• **Algorithms**: *"What is Grover's algorithm?"*, *"What is quantum teleportation?"*, *"What is Deutsch-Jozsa?"*
• **Visualizations**: *"What is a Bloch sphere?"*, *"What are measurement probabilities?"*

You can also ask about the circuit currently loaded in the **Quantum Lab**!`;
};
