import React, { useState } from 'react';
import { ArrowLeft, Bot, Box, Cpu, Orbit, Play, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLab } from '../context/LabContext';
import { ALGORITHM_PRESETS, circuitToCode, simulateCircuit } from '../utils/quantumSimulator';

const probabilityLabel = (value) => `${Math.round(value * 100)}%`;

export const VRLab = () => {
  const navigate = useNavigate();
  const {
    selectedAlgoKey,
    circuit,
    setCircuit,
    simulationResult,
    setSimulationResult,
    setIsSimulating,
    isSimulating,
    recordMetric
  } = useLab();
  const [isExplaining, setIsExplaining] = useState(false);
  const preset = ALGORITHM_PRESETS[selectedAlgoKey] || ALGORITHM_PRESETS.bell_state;

  const runExperiment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationResult(simulateCircuit(circuit));
      setIsSimulating(false);
      recordMetric('experiments');
      recordMetric('vrExperiments');
      toast.success('3D experiment complete');
    }, 350);
  };

  const addGate = (gate) => {
    const next = [...circuit, {
      id: `step-${circuit.length + 1}`,
      ...(gate === 'CNOT'
        ? { type: 'cnot', control: 0, target: 1 }
        : { q0: gate, q1: null })
    }];
    setCircuit(next);
    recordMetric('circuitsModified');
  };

  const explain = () => {
    setIsExplaining(true);
    setTimeout(() => setIsExplaining(false), 700);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <button type="button" onClick={() => navigate('/lab')} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 mb-3">
            <ArrowLeft className="w-4 h-4" /> Return to Quantum Lab
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Immersive browser lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">VR Quantum Lab</h1>
          <p className="text-sm text-slate-300 mt-1">Explore the same circuit in an interactive 3D/WebXR-style workspace.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Local simulation
          </span>
          <button type="button" onClick={runExperiment} disabled={isSimulating} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-quantum-cyan disabled:opacity-60">
            <Play className="w-3.5 h-3.5 fill-white" /> {isSimulating ? 'Running...' : 'Run experiment'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-5">
          <div className="vr-stage rounded-3xl border border-purple-500/30 overflow-hidden relative min-h-[450px]">
            <div className="absolute inset-0 vr-grid opacity-40" />
            <div className="relative z-10 p-5 sm:p-7">
              <div className="flex items-center justify-between text-xs mb-7">
                <span className="inline-flex items-center gap-2 text-purple-200"><Orbit className="w-4 h-4" /> 3D entanglement view</span>
                <span className="text-slate-500 font-mono">BELL_STATE / 2 QUBITS</span>
              </div>
              <div className="vr-orbit mx-auto" aria-label="Interactive 3D visualization of two entangled qubits">
                <div className="vr-ring ring-one" />
                <div className="vr-ring ring-two" />
                <div className="vr-core core-one"><span>q₀</span></div>
                <div className="vr-core core-two"><span>q₁</span></div>
                <div className="vr-link" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8 max-w-xl mx-auto">
                <div className="rounded-2xl bg-slate-950/65 border border-cyan-500/25 p-3 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-cyan-300">Qubit 0</span>
                  <strong className="block text-xl text-white mt-1">|0⟩ ↔ |1⟩</strong>
                  <span className="text-[10px] text-slate-400">Control • H gate</span>
                </div>
                <div className="rounded-2xl bg-slate-950/65 border border-purple-500/25 p-3 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-purple-300">Qubit 1</span>
                  <strong className="block text-xl text-white mt-1">|0⟩ ↔ |1⟩</strong>
                  <span className="text-[10px] text-slate-400">Target • CNOT</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Bell State demonstration</h2>
                <p className="text-xs text-slate-400 mt-1">H → CNOT creates the entangled state shown above.</p>
              </div>
              <span className="text-xs font-mono text-cyan-300">|ψ⟩ = (|00⟩ + |11⟩) / √2</span>
            </div>
            <pre className="rounded-xl bg-[#050812] border border-slate-800 p-4 overflow-x-auto text-xs leading-6 text-cyan-200">{circuitToCode(circuit)}</pre>
            <div className="flex flex-wrap gap-2 mt-4">
              {['H', 'X', 'Z', 'CNOT'].map((gate) => (
                <button key={gate} type="button" onClick={() => addGate(gate)} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:border-cyan-400 hover:text-cyan-300">
                  + {gate}
                </button>
              ))}
              <button type="button" onClick={() => { setCircuit(preset.circuit); setSimulationResult(simulateCircuit(preset.circuit)); }} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white">
                <RotateCcw className="inline w-3.5 h-3.5 mr-1" /> Reset Bell circuit
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-5">
          <div className="glass-card rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-300" />
              <h2 className="text-sm font-bold text-white">Measurement results</h2>
              <span className="ml-auto text-[10px] text-slate-500">shared with Lab</span>
            </div>
            <div className="space-y-3">
              {Object.entries(simulationResult.probabilities).map(([state, probability]) => (
                <div key={state}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-slate-300">|{state}⟩</span>
                    <span className="font-bold text-cyan-300">{probabilityLabel(probability)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${Math.max(2, probability * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-4">The matching |00⟩ and |11⟩ peaks show correlation: measuring one qubit tells you the other qubit’s result.</p>
          </div>

          <div className="glass-card rounded-2xl border border-purple-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-purple-300" />
              <h2 className="text-sm font-bold text-white">AI Explain</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isExplaining
                ? 'The H gate creates two possibilities. CNOT links those possibilities so the measurement results stay correlated.'
                : 'Ask why this 3D relationship matters, then return to the Lab to try a What-If experiment.'}
            </p>
            <button type="button" onClick={explain} className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-bold hover:bg-purple-500/25">
              <Sparkles className="w-3.5 h-3.5" /> Explain this result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRLab;