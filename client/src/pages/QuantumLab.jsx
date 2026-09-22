import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FlaskConical, 
  Sparkles, 
  Cpu, 
  Play, 
  RotateCcw, 
  Layers, 
  Compass, 
  Bot, 
  CheckCircle2, 
  Zap,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ALGORITHM_PRESETS, simulateCircuit } from '../utils/quantumSimulator';
import QuantumCircuit from '../components/QuantumCircuit';
import ProbabilityChart from '../components/ProbabilityChart';
import BlochSphere from '../components/BlochSphere';
import AITutor from '../components/AITutor';

export const QuantumLab = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialAlgoKey = searchParams.get('algo') || 'bell_state';

  const [selectedAlgoKey, setSelectedAlgoKey] = useState(
    ALGORITHM_PRESETS[initialAlgoKey] ? initialAlgoKey : 'bell_state'
  );
  
  // Active circuit in editor
  const [circuit, setCircuit] = useState(
    ALGORITHM_PRESETS[selectedAlgoKey]?.circuit || ALGORITHM_PRESETS.bell_state.circuit
  );

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(() => 
    simulateCircuit(ALGORITHM_PRESETS.bell_state.circuit)
  );

  // Bloch sphere active qubit
  const [selectedBlochQubit, setSelectedBlochQubit] = useState(0);

  const activePreset = ALGORITHM_PRESETS[selectedAlgoKey] || ALGORITHM_PRESETS.bell_state;

  // Handle selecting an algorithm tab
  const handleSelectAlgorithm = (key) => {
    setSelectedAlgoKey(key);
    const preset = ALGORITHM_PRESETS[key];
    if (preset) {
      setCircuit(preset.circuit);
      // Run immediate calculation for the preset
      const res = simulateCircuit(preset.circuit);
      setSimulationResult(res);
      toast.success(`Loaded ${preset.name} Circuit`);
    }
  };

  // Run simulation button handler
  const handleRunSimulation = () => {
    setIsSimulating(true);
    
    // Simulate brief realistic quantum calculation delay (350ms)
    setTimeout(() => {
      const res = simulateCircuit(circuit);
      setSimulationResult(res);
      setIsSimulating(false);
      toast.success('Simulation Complete! Probabilities updated.');
    }, 380);
  };

  // Reset to default algorithm circuit
  const handleResetCircuit = () => {
    setCircuit(activePreset.circuit);
    const res = simulateCircuit(activePreset.circuit);
    setSimulationResult(res);
    toast('Circuit reset to preset default', { icon: '🔄' });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Subtitle Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive Workbench
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Quantum Learning Lab</h1>
          <p className="text-sm text-slate-300 mt-1">
            Build, simulate and understand quantum circuits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Educational Local Simulator
          </span>
        </div>
      </div>

      {/* Algorithm Selector Cards at Top */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Select Quantum Algorithm to Load:
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(ALGORITHM_PRESETS).map(([key, preset]) => {
            const isSelected = selectedAlgoKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectAlgorithm(key)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border-cyan-400 ring-2 ring-cyan-500/20 shadow-quantum-cyan'
                    : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    preset.difficulty === 'Beginner'
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                      : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                  }`}>
                    {preset.difficulty}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {preset.name}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lab Layout: Circuit & Visualizer Left (7 cols), AI Tutor Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Circuit Editor, Probability Chart, Bloch Sphere */}
        <div className="lg:col-span-7 space-y-6">
          {/* Circuit Canvas */}
          <QuantumCircuit
            circuit={circuit}
            onCircuitChange={setCircuit}
            onSimulate={handleRunSimulation}
            isSimulating={isSimulating}
            onReset={handleResetCircuit}
            activeAlgorithmName={activePreset.name}
          />

          {/* Probability Chart & Quantum State Card */}
          <ProbabilityChart
            simulationResult={simulationResult}
            stateFormula={activePreset.stateFormula}
            stateExplanation={activePreset.explanation}
            isSimulating={isSimulating}
          />

          {/* Bloch Sphere Component */}
          <BlochSphere
            blochCoords={simulationResult?.bloch}
            selectedQubit={selectedBlochQubit}
            onSelectQubit={setSelectedBlochQubit}
          />
        </div>

        {/* Right Column: AI Quantum Tutor Panel */}
        <div className="lg:col-span-5 space-y-6">
          <AITutor currentAlgorithm={selectedAlgoKey} />

          {/* Educational Quick Reference Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Algorithm Quick Notes: {activePreset.name}
            </h4>
            <p className="text-slate-300 leading-relaxed mb-3">
              {activePreset.explanation}
            </p>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-[11px] text-cyan-300">
              Expected State: {activePreset.stateFormula}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuantumLab;
