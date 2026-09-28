import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  FlaskConical,
  GitCompare,
  Play,
  Sparkles,
  Box
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ALGORITHM_PRESETS, simulateCircuit } from '../utils/quantumSimulator';
import { useLab } from '../context/LabContext';
import QuantumCircuit from '../components/QuantumCircuit';
import QuantumCodeEditor from '../components/QuantumCodeEditor';
import ProbabilityChart from '../components/ProbabilityChart';
import BlochSphere from '../components/BlochSphere';
import AITutor from '../components/AITutor';
import WhatIfExperiment from '../components/WhatIfExperiment';

const MODES = [
  { id: 'visual', label: 'Visual Mode', icon: FlaskConical, hint: 'Gate builder' },
  { id: 'code', label: 'Code Mode', icon: Code2, hint: 'Write a circuit' },
  { id: 'vr', label: 'VR Mode', icon: Box, hint: 'WebXR Virtual Lab' }
];

export const QuantumLab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialAlgoKey = new URLSearchParams(location.search).get('algo') || 'bell_state';
  const {
    selectedAlgoKey,
    setSelectedAlgoKey,
    circuit,
    setCircuit,
    simulationResult,
    setSimulationResult,
    isSimulating,
    setIsSimulating,
    recordMetric
  } = useLab();
  const [selectedBlochQubit, setSelectedBlochQubit] = useState(0);
  const [mode, setMode] = useState('visual');
  const [showWhatIf, setShowWhatIf] = useState(false);

  const activePreset = ALGORITHM_PRESETS[selectedAlgoKey] || ALGORITHM_PRESETS.bell_state;
  const originalCircuit = activePreset.circuit;

  useEffect(() => {
    if (ALGORITHM_PRESETS[initialAlgoKey] && initialAlgoKey !== selectedAlgoKey) {
      handleSelectAlgorithm(initialAlgoKey);
    }
  // The query string is an entry point, not a live source of state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAlgoKey]);

  const handleSelectAlgorithm = (key) => {
    setSelectedAlgoKey(key);
    const preset = ALGORITHM_PRESETS[key];
    if (preset) {
      setCircuit(preset.circuit);
      setSimulationResult(simulateCircuit(preset.circuit));
      toast.success(`Loaded ${preset.name} Circuit`);
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationResult(simulateCircuit(circuit));
      setIsSimulating(false);
      recordMetric('experiments');
      toast.success('Simulation complete. Probabilities updated.');
    }, 380);
  };

  const handleCircuitChange = (nextCircuit) => {
    setCircuit(nextCircuit);
    recordMetric('circuitsModified');
  };

  const handleResetCircuit = () => {
    setCircuit(activePreset.circuit);
    setSimulationResult(simulateCircuit(activePreset.circuit));
    toast('Circuit reset to preset default', { icon: '🔄' });
  };

  const handleWhatIf = () => {
    setShowWhatIf((current) => !current);
    recordMetric('whatIf');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider text-cyan-400">Interactive Workbench</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Quantum Learning Lab</h1>
          <p className="text-base text-slate-300 mt-1">Build, simulate, compare, and understand quantum circuits.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm font-mono text-cyan-300 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" /> Educational Local Simulator
          </span>
          <button type="button" onClick={() => navigate('/vr-lab')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs sm:text-sm font-bold text-purple-200 hover:bg-purple-500/25 transition-colors">
            <Box className="w-4 h-4" /> Open in WebXR VR
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 p-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {MODES.map(({ id, label, icon: Icon, hint }) => (
            <button
              key={id}
              type="button"
              onClick={() => id === 'vr' ? navigate('/vr-lab') : setMode(id)}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-colors ${mode === id ? 'bg-cyan-500/15 border border-cyan-500/30 text-white' : 'border border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-white'}`}
            >
              <Icon className={`w-5 h-5 ${mode === id ? 'text-cyan-300' : 'text-slate-500'}`} />
              <span>
                <strong className="block text-sm font-bold">{label}</strong>
                <small className="block text-xs text-slate-400 mt-0.5">{hint}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Select Quantum Algorithm to Load:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.entries(ALGORITHM_PRESETS).map(([key, preset]) => {
            const isSelected = selectedAlgoKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectAlgorithm(key)}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${isSelected ? 'bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border-cyan-400 ring-2 ring-cyan-500/20 shadow-quantum-cyan' : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${preset.difficulty === 'Beginner' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' : 'bg-purple-500/10 text-purple-300 border-purple-500/20'}`}>{preset.difficulty}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                </div>
                <h3 className={`text-base font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{preset.name}</h3>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={handleRunSimulation} disabled={isSimulating} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-quantum-cyan disabled:opacity-50 hover:brightness-110 transition-all">
          <Play className="w-4 h-4 fill-white" /> {isSimulating ? 'Simulating...' : 'Simulate'}
        </button>
        <button type="button" onClick={handleWhatIf} className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-colors ${showWhatIf ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-400/40'}`}>
          <GitCompare className="w-4 h-4" /> What-If
        </button>
        <button type="button" onClick={() => navigate('/vr-lab')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-sm font-bold hover:bg-purple-500/25 transition-colors">
          <Box className="w-4 h-4" /> Open in WebXR VR
        </button>
      </div>

      {mode === 'code' ? (
        <QuantumCodeEditor
          circuit={circuit}
          onCircuitChange={handleCircuitChange}
          onSimulate={handleRunSimulation}
          isSimulating={isSimulating}
        />
      ) : (
        <QuantumCircuit
          circuit={circuit}
          onCircuitChange={handleCircuitChange}
          onSimulate={handleRunSimulation}
          isSimulating={isSimulating}
          onReset={handleResetCircuit}
          activeAlgorithmName={activePreset.name}
        />
      )}

      {showWhatIf && (
        <WhatIfExperiment
          originalCircuit={originalCircuit}
          modifiedCircuit={circuit}
          currentResult={simulationResult}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6 min-w-0">
          <ProbabilityChart
            simulationResult={simulationResult}
            stateFormula={activePreset.stateFormula}
            stateExplanation={activePreset.explanation}
            isSimulating={isSimulating}
          />
          <BlochSphere
            blochCoords={simulationResult?.bloch}
            selectedQubit={selectedBlochQubit}
            onSelectQubit={setSelectedBlochQubit}
          />
        </div>
        <div className="xl:col-span-5 space-y-6 min-w-0">
          <AITutor currentAlgorithm={selectedAlgoKey} />
          <div className="glass-card rounded-2xl p-6 border border-slate-800 text-sm">
            <h4 className="text-base font-bold text-white mb-2.5 flex items-center gap-2"><BookOpen className="w-4 h-4 text-cyan-400" /> Algorithm Quick Notes: {activePreset.name}</h4>
            <p className="text-slate-300 leading-relaxed mb-3.5">{activePreset.explanation}</p>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300">Expected State: {activePreset.stateFormula}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumLab;