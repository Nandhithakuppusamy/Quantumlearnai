import React, { useState } from 'react';
import { Play, RotateCcw, Trash2, Plus, Info, Zap, Sparkles } from 'lucide-react';
import Gate from './Gate';

const PALETTE_GATES = ['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'M'];

export const QuantumCircuit = ({ 
  circuit, 
  onCircuitChange, 
  onSimulate, 
  isSimulating, 
  onReset,
  activeAlgorithmName 
}) => {
  const [selectedGate, setSelectedGate] = useState('H');
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Maximum number of column slots on the wire
  const slotCount = Math.max(6, circuit.length + 1);

  // Handle clicking on a slot in q0 or q1
  const handleSlotClick = (qubitIndex, slotIdx) => {
    const newCircuit = [...circuit];
    
    // If the slot is beyond current circuit length, expand it
    while (newCircuit.length <= slotIdx) {
      newCircuit.push({ id: `step-${newCircuit.length + 1}`, q0: null, q1: null });
    }

    if (selectedGate === 'CNOT') {
      // Toggle CNOT with control on clicked qubit, target on the other
      const targetQubit = qubitIndex === 0 ? 1 : 0;
      newCircuit[slotIdx] = {
        id: `step-${slotIdx + 1}`,
        type: 'cnot',
        control: qubitIndex,
        target: targetQubit
      };
    } else {
      // Single qubit gate
      const currentStep = newCircuit[slotIdx] || { id: `step-${slotIdx + 1}` };
      // If it was a cnot, clear cnot type
      const updatedStep = {
        id: currentStep.id,
        q0: qubitIndex === 0 ? selectedGate : (currentStep.type === 'cnot' ? null : currentStep.q0),
        q1: qubitIndex === 1 ? selectedGate : (currentStep.type === 'cnot' ? null : currentStep.q1)
      };
      newCircuit[slotIdx] = updatedStep;
    }

    onCircuitChange(newCircuit);
  };

  const removeGateAt = (qubitIndex, slotIdx, e) => {
    e.stopPropagation();
    const newCircuit = [...circuit];
    if (!newCircuit[slotIdx]) return;

    if (newCircuit[slotIdx].type === 'cnot') {
      newCircuit[slotIdx] = { id: newCircuit[slotIdx].id, q0: null, q1: null };
    } else {
      newCircuit[slotIdx] = {
        ...newCircuit[slotIdx],
        [qubitIndex === 0 ? 'q0' : 'q1']: null
      };
    }

    // Clean up empty trailing steps
    while (newCircuit.length > 0 && !newCircuit[newCircuit.length - 1].q0 && !newCircuit[newCircuit.length - 1].q1 && !newCircuit[newCircuit.length - 1].type) {
      newCircuit.pop();
    }

    onCircuitChange(newCircuit);
  };

  const handleClear = () => {
    onCircuitChange([
      { id: 'step-1', q0: null, q1: null },
      { id: 'step-2', q0: null, q1: null }
    ]);
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-slate-800">
      {/* Circuit Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Quantum Circuit Editor</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Circuit Canvas: {activeAlgorithmName || 'Custom'}</h3>
          <p className="text-xs text-slate-400">Click any gate from the palette, then click a qubit slot to place it</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all"
            title="Clear circuit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all"
            title="Reset to algorithm default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={onSimulate}
            disabled={isSimulating}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
              isSimulating
                ? 'bg-cyan-600/50 text-cyan-200 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-quantum-cyan hover:scale-[1.02]'
            }`}
          >
            {isSimulating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                Simulate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gate Palette */}
      <div className="my-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Gate Palette (Select gate to place):
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">
            Active: [{selectedGate}]
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {PALETTE_GATES.map((g) => (
            <Gate
              key={g}
              gateKey={g}
              isSelected={selectedGate === g}
              onClick={() => setSelectedGate(g)}
            />
          ))}
        </div>
      </div>

      {/* The Quantum Wire Grid Area */}
      <div className="relative py-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-x-auto">
        <div className="min-w-[520px] sm:min-w-[580px] space-y-12 relative py-4">
          
          {/* Qubit 0 Line */}
          <div className="relative flex items-center">
            {/* Qubit Label */}
            <div className="w-16 flex-shrink-0 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/50">
                q₀
              </span>
              <span className="font-mono text-xs text-slate-500">|0⟩</span>
            </div>

            {/* Horizontal Wire Line */}
            <div className="absolute left-16 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-500/40 via-cyan-400/80 to-cyan-500/40 z-0" />

            {/* Gate Slots for Qubit 0 */}
            <div className="flex items-center gap-6 pl-6 z-10">
              {Array.from({ length: slotCount }).map((_, slotIdx) => {
                const step = circuit[slotIdx];
                const isCnot = step?.type === 'cnot';
                const isControl = isCnot && step?.control === 0;
                const isTarget = isCnot && step?.target === 0;
                const gate = step?.q0;

                return (
                  <div
                    key={`q0-slot-${slotIdx}`}
                    onClick={() => handleSlotClick(0, slotIdx)}
                    onMouseEnter={() => setHoveredSlot({ qubit: 0, slot: slotIdx })}
                    onMouseLeave={() => setHoveredSlot(null)}
                    className="relative w-12 h-12 flex items-center justify-center cursor-pointer group"
                  >
                    {isControl ? (
                      <div className="relative">
                        <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-quantum-cyan flex items-center justify-center" />
                        {/* Vertical line to q1 */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[2px] h-[52px] bg-cyan-400 shadow-quantum-cyan pointer-events-none z-0" />
                      </div>
                    ) : isTarget ? (
                      <div className="w-9 h-9 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center font-bold text-white shadow-quantum-purple">
                        ⊕
                      </div>
                    ) : gate ? (
                      <div className="relative">
                        <Gate gateKey={gate} isSelected={false} isSmall />
                        <button
                          type="button"
                          onClick={(e) => removeGateAt(0, slotIdx, e)}
                          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500/90 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg border border-dashed border-slate-700/60 flex items-center justify-center text-slate-600 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors">
                        <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qubit 1 Line */}
          <div className="relative flex items-center">
            {/* Qubit Label */}
            <div className="w-16 flex-shrink-0 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-purple-300 bg-purple-950/60 px-2 py-1 rounded border border-purple-800/50">
                q₁
              </span>
              <span className="font-mono text-xs text-slate-500">|0⟩</span>
            </div>

            {/* Horizontal Wire Line */}
            <div className="absolute left-16 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-purple-500/40 via-purple-400/80 to-purple-500/40 z-0" />

            {/* Gate Slots for Qubit 1 */}
            <div className="flex items-center gap-6 pl-6 z-10">
              {Array.from({ length: slotCount }).map((_, slotIdx) => {
                const step = circuit[slotIdx];
                const isCnot = step?.type === 'cnot';
                const isControl = isCnot && step?.control === 1;
                const isTarget = isCnot && step?.target === 1;
                const gate = step?.q1;

                return (
                  <div
                    key={`q1-slot-${slotIdx}`}
                    onClick={() => handleSlotClick(1, slotIdx)}
                    onMouseEnter={() => setHoveredSlot({ qubit: 1, slot: slotIdx })}
                    onMouseLeave={() => setHoveredSlot(null)}
                    className="relative w-12 h-12 flex items-center justify-center cursor-pointer group"
                  >
                    {isControl ? (
                      <div className="relative">
                        <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-quantum-cyan flex items-center justify-center" />
                        {/* Vertical line upwards to q0 */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[2px] h-[52px] bg-cyan-400 shadow-quantum-cyan pointer-events-none z-0" />
                      </div>
                    ) : isTarget ? (
                      <div className="w-9 h-9 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center font-bold text-white shadow-quantum-purple">
                        ⊕
                      </div>
                    ) : gate ? (
                      <div className="relative">
                        <Gate gateKey={gate} isSelected={false} isSmall />
                        <button
                          type="button"
                          onClick={(e) => removeGateAt(1, slotIdx, e)}
                          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500/90 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg border border-dashed border-slate-700/60 flex items-center justify-center text-slate-600 group-hover:border-purple-400 group-hover:text-purple-400 transition-colors">
                        <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Click on any empty slot to insert selected gate <strong>{selectedGate}</strong>. Click gate to remove.
          </span>
          <span className="font-mono text-cyan-300">
            Educational Local Simulator • 2 Qubits
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuantumCircuit;
