/**
 * QuantumLearn AI - Interactive Quiz Questions
 */

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    topic: 'Superposition',
    question: 'What does a Hadamard (H) gate create?',
    options: [
      'A classical bit',
      'Quantum superposition',
      'Data encryption',
      'Quantum measurement'
    ],
    correctAnswer: 1, // index of option B
    explanation: 'The Hadamard gate maps the basis states |0⟩ and |1⟩ into an equal superposition state: (|0⟩ + |1⟩)/√2 and (|0⟩ - |1⟩)/√2, creating an equal probability of measuring 0 or 1.'
  },
  {
    id: 2,
    topic: 'Entanglement',
    question: 'Which gate is commonly paired with a Hadamard gate to create maximal entanglement?',
    options: [
      'Pauli-X (NOT)',
      'Controlled-NOT (CNOT)',
      'T Gate (π/8)',
      'Phase (S) Gate'
    ],
    correctAnswer: 1, // index of option B
    explanation: 'Applying a Hadamard gate to qubit 0 creates a superposition (|0⟩+|1⟩)/√2. Following it with a CNOT (with q0 as control and q1 as target) entangles the two qubits into the Bell State (|00⟩+|11⟩)/√2.'
  },
  {
    id: 3,
    topic: 'Measurement',
    question: 'What happens when a quantum measurement is performed on a superposition state?',
    options: [
      'Converts a quantum state into a definite classical outcome (collapsing the state)',
      'Generates an identical copy of the qubit',
      'Permanently deletes the entire quantum circuit',
      'Doubles the number of available qubits in the register'
    ],
    correctAnswer: 0, // index of option A
    explanation: 'Measurement interacts with the environment, causing wave function collapse according to Born’s rule. The continuous quantum probability amplitudes collapse into a discrete classical 0 or 1.'
  },
  {
    id: 4,
    topic: 'Bloch Sphere',
    question: 'On the standard Bloch sphere representation, which quantum states correspond to the North and South poles?',
    options: [
      '|+⟩ and |-⟩',
      '|0⟩ (North) and |1⟩ (South)',
      '|i⟩ and |-i⟩',
      '|00⟩ and |11⟩'
    ],
    correctAnswer: 1, // index of option B
    explanation: 'The North pole represents the computational basis state |0⟩ (θ = 0), and the South pole represents |1⟩ (θ = π). Superposition states lie along the equator.'
  },
  {
    id: 5,
    topic: "Grover's Search",
    question: "What is the computational speedup achieved by Grover's Algorithm over classical search in an unsorted database?",
    options: [
      'Exponential speedup: O(log N) vs O(N)',
      'Quadratic speedup: O(√N) vs O(N)',
      'Constant speedup: 2x faster',
      'Linear speedup: N/2 steps'
    ],
    correctAnswer: 1, // index of option B
    explanation: "Grover's algorithm searches N items in O(√N) quantum queries via amplitude amplification, providing a provable quadratic speedup over the classical brute-force average of N/2 queries."
  },
  {
    id: 6,
    topic: 'Quantum Teleportation',
    question: 'Why doesn’t Quantum Teleportation allow faster-than-light (superluminal) communication?',
    options: [
      'It requires transmitting 2 classical bits through standard channels to complete reconstruction',
      'Quantum entanglement automatically degrades after 1 millisecond',
      'The sender’s qubit must be physically mailed to the receiver',
      'Photons are too slow to travel through fiber optics'
    ],
    correctAnswer: 0, // index of option A
    explanation: 'Even though entanglement correlation is instantaneous, Bob cannot decipher or reconstruct the teleported state until he receives Alice’s 2 classical measurement bits, which travel at or below light speed.'
  },
  {
    id: 7,
    topic: 'Quantum Gates',
    question: 'What is the action of the Pauli-X gate on a qubit in the state |0⟩?',
    options: [
      'Leaves it unchanged in |0⟩',
      'Flips it to |1⟩ (Quantum NOT)',
      'Adds a complex phase factor i',
      'Projects it onto the Y axis'
    ],
    correctAnswer: 1, // index of option B
    explanation: 'The Pauli-X gate is the quantum analog of a classical NOT gate. It flips the basis state |0⟩ to |1⟩ and |1⟩ to |0⟩ by swapping the probability amplitudes.'
  }
];
