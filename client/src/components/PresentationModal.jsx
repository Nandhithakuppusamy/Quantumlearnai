import React, { useState } from 'react';
import { X, Play, Sparkles, Award, Compass, Bot, CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';
import { ALGORITHM_PRESETS, simulateCircuit } from '../utils/quantumSimulator';
import QuantumCircuit from './QuantumCircuit';
import ProbabilityChart from './ProbabilityChart';
import BlochSphere from './BlochSphere';
import AITutor from './AITutor';
import toast from 'react-hot-toast';

export const PresentationModal = ({ isOpen, onClose }) => {
  const [selectedPresetKey, setSelectedPresetKey] = useState('bell_state');
  const [circuit, setCircuit] = useState(ALGORITHM_PRESETS.bell_state.circuit);
  const [simulationResult, setSimulationResult] = useState(() => simulateCircuit(ALGORITHM_PRESETS.bell_state.circuit));
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedBlochQubit, setSelectedBlochQubit] = useState(0);

  if (!isOpen) return null;

  const currentPreset = ALGORITHM_PRESETS[selectedPresetKey];

  const handleSelectPreset = (key) => {
    setSelectedPresetKey(key);
    const newPreset = ALGORITHM_PRESETS[key];
    setCircuit(newPreset.circuit);
    const res = simulateCircuit(newPreset.circuit);
    setSimulationResult(res);
    toast.success(`Loaded demo: ${newPreset.name}`);
  };

  const handleRunSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateCircuit(circuit);
      setSimulationResult(res);
      setIsSimulating(false);
      toast.success('Simulation Complete • 1000 shots');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070a12]/95 backdrop-blur-xl flex flex-col overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-quantum-cyan">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                SIH 2026 Presentation Mode
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Problem: SIH26140
              </span>
            </div>
            <p className="text-xs text-slate-400">QuantumLearn AI — Interactive Demonstration for Evaluators</p>
          </div>
        </div>

        {/* Presets Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          {Object.entries(ALGORITHM_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectPreset(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPresetKey === key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-quantum-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
        >
          <X className="w-4 h-4" />
          Exit Presentation
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Judge Pitch Banner */}
        <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Demonstrating: {currentPreset.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{currentPreset.explanation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
              {currentPreset.stateFormula}
            </span>
          </div>
        </div>

        {/* Two-Column Judge Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Circuit & Probability (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <QuantumCircuit
              circuit={circuit}
              onCircuitChange={setCircuit}
              onSimulate={handleRunSimulate}
              isSimulating={isSimulating}
              onReset={() => {
                setCircuit(currentPreset.circuit);
                handleRunSimulate();
              }}
              activeAlgorithmName={currentPreset.name}
            />

            <ProbabilityChart
              simulationResult={simulationResult}
              stateFormula={currentPreset.stateFormula}
              stateExplanation={currentPreset.explanation}
              isSimulating={isSimulating}
            />
          </div>

          {/* Right Column: Bloch Sphere & AI Tutor (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <BlochSphere
              blochCoords={simulationResult?.bloch}
              selectedQubit={selectedBlochQubit}
              onSelectQubit={setSelectedBlochQubit}
            />

            <AITutor currentAlgorithm={selectedPresetKey} />
          </div>

        </div>

        {/* Evaluator Talking Points Drawer */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Key Evaluation Highlights for Hackathon Jury:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-white block mb-1">1. Mathematical Fidelity</strong>
              Exact state-vector linear algebra with complex amplitudes, Kronecker matrix products, and true Born-rule measurement sampling.
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-white block mb-1">2. Zero-Cloud Dependency</strong>
              Runs 100% in browser locally without requiring external API keys or server latency, ensuring resilience during demonstrations.
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-white block mb-1">3. Complete Pedagogy</strong>
              Seamlessly connects circuit manipulation to 3D Bloch sphere vector geometry, probability histograms, and AI pedagogical explanations.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PresentationModal;
