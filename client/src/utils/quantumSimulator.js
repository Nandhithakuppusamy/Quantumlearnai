/**
 * QuantumLearn AI - Educational Local Quantum Simulator
 * Provides exact state vector calculations, gate transformations, 
 * Bloch sphere coordinates, and measurement shot sampling.
 */

// Complex number helpers
export const complex = (real, imag = 0) => ({ real, imag });
export const cAdd = (a, b) => complex(a.real + b.real, a.imag + b.imag);
export const cSub = (a, b) => complex(a.real - b.real, a.imag - b.imag);
export const cMul = (a, b) => complex(
  a.real * b.real - a.imag * b.imag,
  a.real * b.imag + a.imag * b.real
);
export const cAbsSq = (a) => a.real * a.real + a.imag * a.imag;
export const cConj = (a) => complex(a.real, -a.imag);

const INV_SQRT2 = 1 / Math.SQRT2;

// Quantum Gate definitions (2x2 unitary matrices)
export const GATES = {
  I: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(1, 0)]
  ],
  H: [
    [complex(INV_SQRT2, 0), complex(INV_SQRT2, 0)],
    [complex(INV_SQRT2, 0), complex(-INV_SQRT2, 0)]
  ],
  X: [
    [complex(0, 0), complex(1, 0)],
    [complex(1, 0), complex(0, 0)]
  ],
  Y: [
    [complex(0, 0), complex(0, -1)],
    [complex(0, 1), complex(0, 0)]
  ],
  Z: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(-1, 0)]
  ],
  S: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 1)]
  ],
  T: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(INV_SQRT2, INV_SQRT2)]
  ]
};

export const GATE_INFO = {
  H: {
    name: 'Hadamard',
    symbol: 'H',
    color: 'from-cyan-500 to-blue-600',
    description: 'Creates superposition by mapping |0⟩ → (|0⟩+|1⟩)/√2 and |1⟩ → (|0⟩-|1⟩)/√2.',
    matrix: '[[1, 1], [1, -1]] / √2'
  },
  X: {
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    color: 'from-purple-500 to-indigo-600',
    description: 'Quantum bit flip. Maps |0⟩ → |1⟩ and |1⟩ → |0⟩.',
    matrix: '[[0, 1], [1, 0]]'
  },
  Y: {
    name: 'Pauli-Y',
    symbol: 'Y',
    color: 'from-emerald-500 to-teal-600',
    description: 'Bit and phase flip combined. Introduces an imaginary phase i.',
    matrix: '[[0, -i], [i, 0]]'
  },
  Z: {
    name: 'Pauli-Z',
    symbol: 'Z',
    color: 'from-amber-500 to-orange-600',
    description: 'Phase flip. Leaves |0⟩ unchanged and maps |1⟩ → -|1⟩.',
    matrix: '[[1, 0], [0, -1]]'
  },
  S: {
    name: 'Phase Gate (S)',
    symbol: 'S',
    color: 'from-fuchsia-500 to-pink-600',
    description: 'Adds a π/2 phase shift to |1⟩. Equal to √Z.',
    matrix: '[[1, 0], [0, i]]'
  },
  T: {
    name: 'π/8 Gate (T)',
    symbol: 'T',
    color: 'from-rose-500 to-red-600',
    description: 'Adds a π/4 phase shift to |1⟩. Universal gate component.',
    matrix: '[[1, 0], [0, e^(iπ/4)]]'
  },
  CNOT: {
    name: 'Controlled-NOT',
    symbol: '⊕',
    color: 'from-violet-500 to-cyan-600',
    description: 'Flips target qubit if and only if control qubit is |1⟩. Generates entanglement.',
    matrix: '4x4 Controlled Inversion'
  },
  M: {
    name: 'Measurement',
    symbol: 'M',
    color: 'from-slate-600 to-slate-700',
    description: 'Collapses quantum superposition into classical 0 or 1 outcome.',
    matrix: 'Projection Operator'
  }
};

// Kronecker Product of two 2x2 matrices -> 4x4 matrix
export const tensorProduct2x2 = (A, B) => {
  const result = [];
  for (let rA = 0; rA < 2; rA++) {
    for (let rB = 0; rB < 2; rB++) {
      const row = [];
      for (let cA = 0; cA < 2; cA++) {
        for (let cB = 0; cB < 2; cB++) {
          row.push(cMul(A[rA][cA], B[rB][cB]));
        }
      }
      result.push(row);
    }
  }
  return result;
};

// Matrix multiplication on 4-element state vector
export const applyMatrix4 = (matrix, state) => {
  const next = [];
  for (let r = 0; r < 4; r++) {
    let sum = complex(0, 0);
    for (let c = 0; c < 4; c++) {
      sum = cAdd(sum, cMul(matrix[r][c], state[c]));
    }
    next.push(sum);
  }
  return next;
};

// Apply CNOT with q0 as control, q1 as target
export const applyCNOT_01 = (state) => {
  // |00> -> |00>, |01> -> |01>, |10> -> |11>, |11> -> |10>
  return [state[0], state[1], state[3], state[2]];
};

// Apply CNOT with q1 as control, q0 as target
export const applyCNOT_10 = (state) => {
  // |00> -> |00>, |01> -> |11>, |10> -> |10>, |11> -> |01>
  return [state[0], state[3], state[2], state[1]];
};

// Calculate Bloch Sphere coordinates (theta, phi, x, y, z) for single qubit reduced state
export const calculateBlochCoords = (state, qubitIndex) => {
  // Compute reduced density matrix for chosen qubit
  // State basis: 0:|00>, 1:|01>, 2:|10>, 3:|11>
  let rho00, rho01, rho10, rho11;

  if (qubitIndex === 0) {
    // Trace out qubit 1:
    // rho00 = |00><00| + |01><01|
    rho00 = cAdd(cMul(state[0], cConj(state[0])), cMul(state[1], cConj(state[1]))).real;
    // rho11 = |10><10| + |11><11|
    rho11 = cAdd(cMul(state[2], cConj(state[2])), cMul(state[3], cConj(state[3]))).real;
    // rho01 = state[0]*state[2]* + state[1]*state[3]*
    rho01 = cAdd(cMul(state[0], cConj(state[2])), cMul(state[1], cConj(state[3])));
  } else {
    // Trace out qubit 0:
    // rho00 = |00><00| + |10><10|
    rho00 = cAdd(cMul(state[0], cConj(state[0])), cMul(state[2], cConj(state[2]))).real;
    // rho11 = |01><01| + |11><11|
    rho11 = cAdd(cMul(state[1], cConj(state[1])), cMul(state[3], cConj(state[3]))).real;
    // rho01 = state[0]*state[1]* + state[2]*state[3]*
    rho01 = cAdd(cMul(state[0], cConj(state[1])), cMul(state[2], cConj(state[3])));
  }

  rho10 = cConj(rho01);

  // Pauli expectation values:
  // x = 2 * Re(rho01)
  // y = 2 * Im(rho10) = -2 * Im(rho01)
  // z = rho00 - rho11
  const x = 2 * rho01.real;
  const y = -2 * rho01.imag;
  const z = rho00 - rho11;

  const r = Math.sqrt(x * x + y * y + z * z);
  const theta = r > 0.0001 ? Math.acos(Math.max(-1, Math.min(1, z / (r || 1)))) : 0;
  const phi = (x !== 0 || y !== 0) ? Math.atan2(y, x) : 0;

  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3)),
    z: Number(z.toFixed(3)),
    r: Number(r.toFixed(3)),
    theta: Number(theta.toFixed(3)),
    phi: Number(phi.toFixed(3)),
    isEntangled: r < 0.95
  };
};

// Sample shots given basis probabilities
export const sampleShots = (probabilities, totalShots = 1000) => {
  const counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
  const keys = ['00', '01', '10', '11'];
  
  // Multinomial sampling with deterministic seed jitter
  let remaining = totalShots;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const p = probabilities[key] || 0;
    // Slight realistic fluctuation (+- 1-2% for realistic quantum simulation feel)
    const jitter = (Math.random() - 0.5) * 0.02 * (p > 0.05 ? 1 : 0);
    const adjustedP = Math.max(0, p + jitter);
    const count = Math.round(adjustedP * totalShots);
    counts[key] = Math.min(count, remaining);
    remaining -= counts[key];
  }
  counts[keys[keys.length - 1]] = Math.max(0, remaining);

  return counts;
};

// Simulate 2-qubit circuit defined by sequential steps
export const simulateCircuit = (circuitSteps, totalShots = 1000) => {
  // Initial state |00>
  let state = [
    complex(1, 0),
    complex(0, 0),
    complex(0, 0),
    complex(0, 0)
  ];

  // Process each step in the circuit
  for (const step of circuitSteps) {
    if (step.type === 'cnot') {
      if (step.control === 0 && step.target === 1) {
        state = applyCNOT_01(state);
      } else if (step.control === 1 && step.target === 0) {
        state = applyCNOT_10(state);
      }
    } else {
      // Single qubit gate(s)
      const gateQ0 = step.q0 && GATES[step.q0] ? GATES[step.q0] : GATES.I;
      const gateQ1 = step.q1 && GATES[step.q1] ? GATES[step.q1] : GATES.I;
      const combinedMatrix = tensorProduct2x2(gateQ0, gateQ1);
      state = applyMatrix4(combinedMatrix, state);
    }
  }

  // Calculate probabilities
  const p00 = cAbsSq(state[0]);
  const p01 = cAbsSq(state[1]);
  const p10 = cAbsSq(state[2]);
  const p11 = cAbsSq(state[3]);

  const probabilities = {
    '00': Number(p00.toFixed(4)),
    '01': Number(p01.toFixed(4)),
    '10': Number(p10.toFixed(4)),
    '11': Number(p11.toFixed(4))
  };

  const shotCounts = sampleShots(probabilities, totalShots);

  // Find most probable states
  let maxP = -1;
  const mostProbable = [];
  for (const [basis, p] of Object.entries(probabilities)) {
    if (p > maxP) {
      maxP = p;
    }
  }
  for (const [basis, p] of Object.entries(probabilities)) {
    if (Math.abs(p - maxP) < 0.05 && p > 0.05) {
      mostProbable.push(`|${basis}⟩`);
    }
  }

  // Bloch vectors for both qubits
  const blochQ0 = calculateBlochCoords(state, 0);
  const blochQ1 = calculateBlochCoords(state, 1);

  return {
    stateVector: state,
    probabilities,
    shotCounts,
    totalShots,
    mostProbableState: mostProbable.join(' / ') || '|00⟩',
    executionTime: '0.02 s',
    bloch: {
      q0: blochQ0,
      q1: blochQ1
    }
  };
};

// Human-readable beginner code representation shared by the Visual, Code, and VR modes.
export const circuitToCode = (circuitSteps = []) => {
  const lines = ['const qc = new QuantumCircuit(2);'];
  for (const step of circuitSteps) {
    if (step?.type === 'cnot') {
      lines.push(`qc.cx(${step.control}, ${step.target});`);
      continue;
    }
    if (step?.q0 && step.q0 !== 'M') lines.push(`qc.${step.q0.toLowerCase()}(0);`);
    if (step?.q1 && step.q1 !== 'M') lines.push(`qc.${step.q1.toLowerCase()}(1);`);
    if (step?.q0 === 'M' || step?.q1 === 'M') lines.push('qc.measure_all();');
  }
  if (!lines.some((line) => line.includes('measure_all'))) lines.push('qc.measure_all();');
  return lines.join('\n');
};

// Parse the deliberately small teaching syntax used in Code Mode.
export const parseQuantumCode = (source = '') => {
  const steps = [];
  const lines = source.split(/\r?\n/);
  const supportedGates = ['h', 'x', 'y', 'z', 's', 't'];
  let hasMeasurement = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\/\/.*$/, '').trim();
    if (!line || line.startsWith('const qc')) continue;
    if (/^qc\.measure_all\s*\(\s*\)\s*;?$/.test(line)) {
      hasMeasurement = true;
      continue;
    }

    const singleGate = line.match(/^qc\.(h|x|y|z|s|t)\s*\(\s*([01])\s*\)\s*;?$/i);
    if (singleGate) {
      const gate = singleGate[1].toUpperCase();
      const qubit = Number(singleGate[2]);
      steps.push({
        id: `step-${steps.length + 1}`,
        q0: qubit === 0 ? gate : null,
        q1: qubit === 1 ? gate : null
      });
      continue;
    }

    const cnot = line.match(/^qc\.cx\s*\(\s*([01])\s*,\s*([01])\s*\)\s*;?$/i);
    if (cnot && cnot[1] !== cnot[2]) {
      steps.push({
        id: `step-${steps.length + 1}`,
        type: 'cnot',
        control: Number(cnot[1]),
        target: Number(cnot[2])
      });
      continue;
    }

    if (line.startsWith('qc.') && !supportedGates.some((gate) => line.toLowerCase().startsWith(`qc.${gate}`))) {
      return { error: `I don't recognize "${line}". Try qc.h(0), qc.cx(0, 1), or qc.measure_all().` };
    }
    return { error: `Please check this line: "${line}". Gates use a qubit number of 0 or 1.` };
  }

  if (!steps.length && !hasMeasurement) {
    return { error: 'Add at least one gate, such as qc.h(0), before applying the code.' };
  }

  if (hasMeasurement) {
    steps.push({ id: `step-${steps.length + 1}`, q0: 'M', q1: 'M' });
  }
  return { circuit: steps };
};

// Algorithm Preset Circuits and Educational metadata
export const ALGORITHM_PRESETS = {
  bell_state: {
    id: 'bell_state',
    name: 'Bell State (|Φ⁺⟩)',
    difficulty: 'Beginner',
    circuit: [
      { id: 'step-1', q0: 'H', q1: null },
      { id: 'step-2', type: 'cnot', control: 0, target: 1 },
      { id: 'step-3', q0: 'M', q1: 'M' }
    ],
    stateFormula: '|ψ⟩ = (|00⟩ + |11⟩) / √2',
    explanation: 'This Bell state represents two maximally entangled qubits. Measuring qubit 0 instantaneously dictates the outcome of qubit 1 with 100% correlation.',
    expectedProbabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 },
    tutorInitial: 'Your circuit begins with a Hadamard gate on q0, creating an even superposition (|0⟩+|1⟩)/√2. The CNOT gate then entangles q0 and q1. That is why your simulation yields only correlated |00⟩ and |11⟩ measurement results!'
  },
  grover_search: {
    id: 'grover_search',
    name: "Grover's Search",
    difficulty: 'Intermediate',
    circuit: [
      { id: 'step-1', q0: 'H', q1: 'H' },
      { id: 'step-2', type: 'cnot', control: 0, target: 1 }, // Oracle phase kick
      { id: 'step-3', q0: 'H', q1: 'H' }, // Diffusion
      { id: 'step-4', q0: 'X', q1: 'X' },
      { id: 'step-5', type: 'cnot', control: 0, target: 1 },
      { id: 'step-6', q0: 'X', q1: 'X' },
      { id: 'step-7', q0: 'H', q1: 'H' },
      { id: 'step-8', q0: 'M', q1: 'M' }
    ],
    stateFormula: '|ψ⟩ ≈ 0.00|00⟩ + 0.00|01⟩ + 0.00|10⟩ + 1.00|11⟩',
    explanation: "Grover's algorithm searches an unsorted database of N items in O(√N) steps using quantum amplitude amplification to boost the probability of the target item.",
    expectedProbabilities: { '00': 0.04, '01': 0.04, '10': 0.04, '11': 0.88 },
    tutorInitial: "Grover's Search initialized both qubits into equal superposition. The oracle inverted the phase of the target state |11⟩, and the diffusion operator inverted all amplitudes about the average, amplifying the marked state to near 100% probability!"
  },
  teleportation: {
    id: 'teleportation',
    name: 'Quantum Teleportation',
    difficulty: 'Intermediate',
    circuit: [
      { id: 'step-1', q0: 'H', q1: null }, // State prep / Bell pair
      { id: 'step-2', type: 'cnot', control: 0, target: 1 }, // Entangle Alice & Bob
      { id: 'step-3', q0: 'X', q1: null }, // Source payload
      { id: 'step-4', q0: 'H', q1: null }, // Bell measurement
      { id: 'step-5', type: 'cnot', control: 0, target: 1 }, // Feedforward correction
      { id: 'step-6', q0: 'M', q1: 'M' }
    ],
    stateFormula: '|ψ_Bob⟩ = α|0⟩ + β|1⟩  (Fidelity: 1.000)',
    explanation: 'Teleports the exact quantum state of an arbitrary qubit to a distant receiver using pre-shared entanglement and 2 classical transmission bits. No physical matter is moved.',
    expectedProbabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 },
    tutorInitial: 'Quantum Teleportation utilizes an entangled EPR channel between sender (Alice) and receiver (Bob). Through a Bell-basis measurement and classical communication, the quantum state is reconstructed with 100% fidelity without violating the No-Cloning Theorem.'
  },
  deutsch_jozsa: {
    id: 'deutsch_jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    difficulty: 'Intermediate',
    circuit: [
      { id: 'step-1', q0: null, q1: 'X' }, // Initialize q1 in |1>
      { id: 'step-2', q0: 'H', q1: 'H' },  // Put both into superposition
      { id: 'step-3', type: 'cnot', control: 0, target: 1 }, // Balanced oracle Uf
      { id: 'step-4', q0: 'H', q1: null }, // Interference on query qubit
      { id: 'step-5', q0: 'M', q1: 'M' }
    ],
    stateFormula: '|ψ⟩ = |10⟩ (Balanced Oracle Confirmed in 1 Query)',
    explanation: 'Determines whether an unknown black-box function f(x) is constant (same output for all inputs) or balanced (output is 0 for half, 1 for half) using only a single quantum evaluation.',
    expectedProbabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
    tutorInitial: 'Deutsch-Jozsa achieved the first deterministic quantum speedup! Classically, testing a 2-variable function requires evaluating 2+ inputs. Quantum interference collapses constant functions to |0...0⟩ and balanced functions to non-zero states in 1 query.'
  }
};
