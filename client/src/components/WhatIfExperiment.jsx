import React, { useMemo } from 'react';
import { ArrowRight, Bot, GitCompare, Sparkles } from 'lucide-react';
import { circuitToCode, simulateCircuit } from '../utils/quantumSimulator';

const formatPercent = (value) => `${Math.round(value * 100)}%`;

const getExplanation = (originalResult, modifiedResult) => {
  const changed = Object.entries(originalResult.probabilities)
    .filter(([state, value]) => Math.abs(value - modifiedResult.probabilities[state]) > 0.02)
    .map(([state]) => `|${state}⟩`);
  if (!changed.length) {
    return 'This change preserves the measurement probabilities in this circuit. Some gates change phase rather than the final computational-basis counts.';
  }
  return `The modified circuit changes the amplitudes that reach measurement, so the probability of ${changed.join(', ')} shifts. In simple terms, the added or removed gate changes how the qubits interfere before they are measured.`;
};

const ResultStrip = ({ title, result, accent }) => (
  <div className={`rounded-xl border ${accent} bg-slate-950/60 p-3.5 sm:p-4`}>
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-sm font-bold text-white">{title}</span>
      <span className="text-xs text-slate-400 font-medium">1000 shots</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(result.probabilities).map(([state, probability]) => (
        <div key={state} className="rounded-lg bg-slate-900/80 p-2 sm:p-2.5 text-center">
          <span className="block text-xs font-mono text-slate-400">|{state}⟩</span>
          <span className="block text-sm sm:text-base font-bold text-cyan-300 mt-1">{formatPercent(probability)}</span>
        </div>
      ))}
    </div>
  </div>
);

export const WhatIfExperiment = ({ originalCircuit, modifiedCircuit, currentResult }) => {
  const originalResult = useMemo(() => simulateCircuit(originalCircuit), [originalCircuit]);
  const computedModifiedResult = useMemo(() => simulateCircuit(modifiedCircuit), [modifiedCircuit]);
  const modifiedResult = currentResult || computedModifiedResult;
  const explanation = getExplanation(originalResult, modifiedResult);

  return (
    <div className="glass-card rounded-2xl border border-amber-500/20 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/30 to-slate-900/40">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">What-If Experiment</h3>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-300 border border-amber-500/30 bg-amber-500/10 rounded-full px-2.5 py-0.5">Compare</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">What happens if I change this gate?</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Original circuit
            </div>
            <pre className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{circuitToCode(originalCircuit)}</pre>
          </div>
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-950/10 p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Modified circuit
            </div>
            <pre className="font-mono text-sm leading-relaxed text-cyan-200 whitespace-pre-wrap">{circuitToCode(modifiedCircuit)}</pre>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
          <ResultStrip title="Original probabilities" result={originalResult} accent="border-slate-800" />
          <ResultStrip title="Modified probabilities" result={modifiedResult} accent="border-cyan-500/25" />
        </div>

        <div className="rounded-xl border border-purple-500/25 bg-purple-950/15 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-200 mb-2">
            <Bot className="w-4 h-4 text-purple-300" />
            AI explanation
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default WhatIfExperiment;