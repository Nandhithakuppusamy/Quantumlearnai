import React, { useState } from 'react';
import { Code2, Play, RotateCcw, Terminal } from 'lucide-react';
import { circuitToCode, parseQuantumCode } from '../utils/quantumSimulator';

export const QuantumCodeEditor = ({ circuit, onCircuitChange, onSimulate, isSimulating }) => {
  const [code, setCode] = useState(() => circuitToCode(circuit));
  const [error, setError] = useState('');

  const syncFromVisual = (nextCircuit) => {
    setCode(circuitToCode(nextCircuit));
    setError('');
  };

  const applyCode = () => {
    const parsed = parseQuantumCode(code);
    if (!parsed.circuit) {
      setError(parsed.error);
      return;
    }
    onCircuitChange(parsed.circuit);
    setError('');
  };

  return (
    <div className="glass-card rounded-2xl border border-cyan-500/20 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-300 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Code Mode</h3>
            <p className="text-[11px] text-slate-400">The same circuit, written as beginner-friendly quantum code</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
          qc • 2 qubits
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-slate-800 bg-[#050812] overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800 text-[10px] text-slate-500">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            quantum_circuit.py
          </div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck="false"
            aria-label="Quantum circuit code"
            className="w-full min-h-44 resize-y bg-transparent p-4 font-mono text-sm leading-7 text-cyan-200 outline-none placeholder:text-slate-600"
            placeholder={'qc.h(0)\nqc.cx(0, 1)\nqc.measure_all()'}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-300 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyCode}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-bold hover:bg-purple-500/25 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            Apply to circuit
          </button>
          <button
            type="button"
            onClick={() => {
              syncFromVisual(circuit);
              setCode(circuitToCode(circuit));
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sync visual
          </button>
          <button
            type="button"
            onClick={onSimulate}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-semibold hover:bg-cyan-500/25 disabled:opacity-50 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Run code circuit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantumCodeEditor;