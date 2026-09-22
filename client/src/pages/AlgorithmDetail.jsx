import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  FlaskConical, 
  Play, 
  HelpCircle, 
  Zap, 
  Clock,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ALGORITHMS } from '../utils/algorithmData';
import { ALGORITHM_PRESETS, simulateCircuit } from '../utils/quantumSimulator';
import toast from 'react-hot-toast';

export const AlgorithmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find algorithm by ID or fallback to Bell State
  const algorithm = ALGORITHMS.find((a) => a.id === id) || ALGORITHMS[0];
  const presetKey = algorithm.presetId || 'bell_state';
  const preset = ALGORITHM_PRESETS[presetKey] || ALGORITHM_PRESETS.bell_state;

  // Local interactive simulation state
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunMiniSim = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateCircuit(preset.circuit);
      setSimulationResult(res);
      setIsSimulating(false);
      toast.success('Simulation executed locally! 1000 shots');
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/algorithms')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quantum Algorithms
        </button>
      </div>

      {/* Hero Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                algorithm.level === 'Beginner'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                  : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
              }`}>
                {algorithm.level}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {algorithm.estimatedTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {algorithm.name}
            </h1>
            <p className="text-sm text-cyan-400 font-mono mt-1">
              {algorithm.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/lab?algo=${presetKey}`)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-quantum-cyan transition-all hover:scale-105"
          >
            <FlaskConical className="w-4 h-4" />
            Launch in Full Lab
          </button>
        </div>

        <p className="text-sm text-slate-300 mt-6 leading-relaxed max-w-3xl">
          {algorithm.shortDesc} {algorithm.whyItMatters}
        </p>

        {/* Key Mathematical Formula */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Core Quantum State Formula
            </span>
            <div className="font-mono text-lg font-bold text-white tracking-wide">
              {algorithm.formula}
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            {algorithm.formulaExplanation}
          </p>
        </div>
      </div>

      {/* Section 1: What You'll Learn */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">What You'll Learn</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {algorithm.whatYoullLearn.map((item, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="text-xs text-slate-200 font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Concept Explanation Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Concept Breakdown & Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {algorithm.concepts.map((c, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {c.highlight}
                </span>
                <h3 className="text-base font-bold text-white mt-3 mb-2">{c.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Try It Yourself & Interactive Circuit */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Interactive Playground
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Try It Yourself</h2>
            <p className="text-xs text-slate-400">Preview the exact quantum circuit and trigger a live simulation</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunMiniSim}
              disabled={isSimulating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-quantum-cyan transition-all"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* ASCII Circuit Preview Box */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-semibold">Quantum Gate Layout:</span>
            <span className="font-mono text-cyan-400">2 Qubits Register</span>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed overflow-x-auto p-4 bg-[#060911] rounded-xl border border-slate-800">
            {algorithm.circuitSummary}
          </pre>
        </div>

        {/* Simulation Output Area */}
        {simulationResult && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/60 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Simulation Output (1000 Shots):
              </span>
              <span className="text-xs font-mono text-slate-400">Exec: 0.02s</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(simulationResult.probabilities).map(([state, prob]) => (
                <div key={state} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="font-mono text-xs text-slate-300 font-bold">|{state}⟩</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">{Math.round(prob * 100)}%</div>
                  <div className="text-[10px] text-slate-500">{simulationResult.shotCounts[state]} shots</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Analysis:</strong> {preset.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Section 4: Test Your Knowledge Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 via-slate-900/80 to-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Test Your Knowledge</h3>
            <p className="text-xs text-slate-300">Ready to verify what you've learned about {algorithm.name}?</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/quiz')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-quantum-purple transition-all flex-shrink-0"
        >
          Take Topic Quiz
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AlgorithmDetail;
