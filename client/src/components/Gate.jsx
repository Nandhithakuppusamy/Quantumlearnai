import React from 'react';
import { GATE_INFO } from '../utils/quantumSimulator';

export const Gate = ({ gateKey, isSelected, onClick, isSmall = false, tooltip = true }) => {
  const info = GATE_INFO[gateKey] || {
    name: gateKey,
    symbol: gateKey,
    color: 'from-slate-600 to-slate-700',
    description: 'Quantum Gate'
  };

  return (
    <div className="relative group inline-block">
      <button
        type="button"
        onClick={onClick}
        className={`relative flex items-center justify-center font-mono font-bold transition-all duration-200 cursor-pointer select-none rounded-xl border ${
          isSmall 
            ? 'w-10 h-10 text-sm' 
            : 'w-12 h-12 text-base'
        } ${
          isSelected
            ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 shadow-quantum-cyan border-cyan-400 bg-gradient-to-br ' + info.color
            : 'border-slate-700/80 bg-slate-800/90 text-white hover:border-cyan-400/60 hover:scale-105 shadow-md'
        }`}
      >
        <span className={isSelected ? 'text-white drop-shadow' : 'text-slate-100 group-hover:text-cyan-300'}>
          {info.symbol}
        </span>

        {/* Small gate symbol indicator */}
        <span className="absolute bottom-1 right-1 text-[8px] opacity-40 font-sans uppercase">
          {gateKey === 'CNOT' ? '2q' : '1q'}
        </span>
      </button>

      {/* Tooltip on hover */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 text-left">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
            <span className="font-semibold text-xs text-white">{info.name}</span>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              {info.symbol}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{info.description}</p>
          {info.matrix && (
            <div className="mt-1.5 pt-1 border-t border-slate-800/60 font-mono text-[10px] text-purple-300">
              U = {info.matrix}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gate;
