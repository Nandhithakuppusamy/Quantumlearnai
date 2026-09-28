import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Clock, Cpu, CheckCircle2, Zap } from 'lucide-react';

export const ProbabilityChart = ({ 
  simulationResult, 
  stateFormula, 
  stateExplanation,
  isSimulating 
}) => {
  if (!simulationResult) {
    return (
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-base font-bold text-white">Circuit Ready to Simulate</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Click the "Simulate" button above to execute this quantum circuit on our educational local simulator.
        </p>
      </div>
    );
  }

  const { probabilities, shotCounts, totalShots, mostProbableState, executionTime } = simulationResult;

  const chartData = [
    { state: '|00⟩', key: '00', prob: Math.round((probabilities['00'] || 0) * 100), shots: shotCounts['00'] || 0 },
    { state: '|01⟩', key: '01', prob: Math.round((probabilities['01'] || 0) * 100), shots: shotCounts['01'] || 0 },
    { state: '|10⟩', key: '10', prob: Math.round((probabilities['10'] || 0) * 100), shots: shotCounts['10'] || 0 },
    { state: '|11⟩', key: '11', prob: Math.round((probabilities['11'] || 0) * 100), shots: shotCounts['11'] || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Results & Probability Chart */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Simulation Complete
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Measurement Probabilities</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Local Quantum Simulation
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs sm:text-sm text-slate-400 block font-medium">Total Shots</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-white mt-1 block">{totalShots || 1000}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs sm:text-sm text-slate-400 block font-medium">Execution Time</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 mt-1 block flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {executionTime || '0.02 s'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs sm:text-sm text-slate-400 block font-medium">Most Probable</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1 block truncate">
              {mostProbableState}
            </span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="state" 
                stroke="#64748b" 
                tick={{ fill: '#cbd5e1', fontSize: 13, fontFamily: 'monospace' }} 
              />
              <YAxis 
                domain={[0, 100]} 
                unit="%" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md">
                        <p className="font-mono text-sm font-bold text-cyan-300">Basis State: {data.state}</p>
                        <p className="text-sm text-white mt-1">Probability: <span className="font-bold">{data.prob}%</span></p>
                        <p className="text-xs text-slate-400 mt-0.5">Shots: {data.shots} / {totalShots}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.prob > 0 ? (index % 2 === 0 ? '#06b6d4' : '#8b5cf6') : '#1e293b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Probability Breakdown Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800">
          {chartData.map((d) => (
            <div key={d.state} className="text-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="font-mono text-sm text-slate-300 font-semibold">{d.state}</div>
              <div className="text-base sm:text-lg font-bold text-cyan-400 mt-0.5">{d.prob}%</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{d.shots} shots</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quantum State Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h4 className="text-base font-bold uppercase tracking-wider text-white">Quantum State</h4>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 font-mono text-cyan-300 text-base sm:text-lg lg:text-xl font-bold tracking-wide flex items-center justify-between overflow-x-auto">
          <span>{stateFormula || '|ψ⟩ = (|00⟩ + |11⟩) / √2'}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-sans">
            Bra-Ket
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-300 mt-3.5 leading-relaxed">
          {stateExplanation || "This Bell state represents two entangled qubits. Measuring one qubit gives information about the other."}
        </p>
      </div>
    </div>
  );
};

export default ProbabilityChart;
