import React, { useState } from 'react';
import { Compass, Info, Layers, RefreshCw } from 'lucide-react';

export const BlochSphere = ({ blochCoords, onSelectQubit, selectedQubit = 0 }) => {
  const currentBloch = blochCoords?.[`q${selectedQubit}`] || {
    x: 0,
    y: 0,
    z: 1,
    r: 1,
    theta: 0,
    phi: 0,
    isEntangled: false
  };

  // SVG Geometry parameters (Center at 130, 130, Radius 85)
  const cx = 130;
  const cy = 130;
  const R = 85;

  // 3D orthographic projection with 20 deg tilt
  // Standard transformation:
  // Screen X = cx + R * (y * cos(30) - x * cos(30))
  // For standard perspective:
  // Z axis: vertical (cy - z * R)
  // X axis: down-left (cx - 0.7 * x * R, cy + 0.4 * x * R)
  // Y axis: right (cx + 0.86 * y * R, cy + 0.2 * y * R)
  const projX = (x, y, z) => cx + (y * 0.85 - x * 0.5) * R;
  const projY = (x, y, z) => cy - (z * 0.95 - x * 0.25) * R;

  const tipX = projX(currentBloch.x, currentBloch.y, currentBloch.z);
  const tipY = projY(currentBloch.x, currentBloch.y, currentBloch.z);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Bloch Sphere Visualization</h3>
        </div>

        {/* Qubit Selector Switch */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => onSelectQubit && onSelectQubit(0)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedQubit === 0
                ? 'bg-cyan-500 text-white shadow-quantum-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Qubit 0 (q₀)
          </button>
          <button
            type="button"
            onClick={() => onSelectQubit && onSelectQubit(1)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedQubit === 1
                ? 'bg-purple-500 text-white shadow-quantum-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Qubit 1 (q₁)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex flex-col items-center justify-center my-3 relative">
        <svg
          viewBox="0 0 260 260"
          className="w-56 h-56 select-none filter drop-shadow-xl"
        >
          <defs>
            {/* Sphere radial glow */}
            <radialGradient id="sphereGlow" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#1e293b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0b101d" stopOpacity="0.7" />
            </radialGradient>

            {/* Vector Arrow Gradient */}
            <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Arrowhead marker */}
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Background Sphere Circle */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="url(#sphereGlow)"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1.5"
          />

          {/* Equator Ellipse (x-y plane) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={R}
            ry={R * 0.28}
            fill="none"
            stroke="rgba(100, 133, 196, 0.35)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* Prime Meridian Ellipse (x-z plane) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={R * 0.28}
            ry={R}
            fill="none"
            stroke="rgba(100, 133, 196, 0.2)"
            strokeWidth="1"
          />

          {/* Z-Axis (Vertical) */}
          <line
            x1={cx}
            y1={cy + R + 14}
            x2={cx}
            y2={cy - R - 14}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {/* North Pole Label |0⟩ */}
          <text
            x={cx}
            y={cy - R - 18}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            |0⟩
          </text>
          {/* South Pole Label |1⟩ */}
          <text
            x={cx}
            y={cy + R + 26}
            textAnchor="middle"
            fill="#a855f7"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            |1⟩
          </text>

          {/* X-Axis (Front-Left) */}
          <line
            x1={cx}
            y1={cy}
            x2={projX(1, 0, 0)}
            y2={projY(1, 0, 0)}
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text
            x={projX(1.15, 0, 0)}
            y={projY(1.15, 0, 0)}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
          >
            +X
          </text>

          {/* Y-Axis (Right) */}
          <line
            x1={cx}
            y1={cy}
            x2={projX(0, 1, 0)}
            y2={projY(0, 1, 0)}
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text
            x={projX(0, 1.15, 0)}
            y={projY(0, 1.15, 0)}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
          >
            +Y
          </text>

          {/* Origin Center Point */}
          <circle cx={cx} cy={cy} r="2.5" fill="#64748b" />

          {/* State Vector Line */}
          <line
            x1={cx}
            y1={cy}
            x2={tipX}
            y2={tipY}
            stroke="url(#vectorGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* State Vector Tip / Glowing Point */}
          <circle
            cx={tipX}
            cy={tipY}
            r="4.5"
            fill="#06b6d4"
            className="animate-pulse"
          />
          <circle
            cx={tipX}
            cy={tipY}
            r="8"
            fill="rgba(6, 182, 212, 0.3)"
          />

          {/* State vector label */}
          <text
            x={tipX + (tipX > cx ? 12 : -12)}
            y={tipY + (tipY > cy ? 12 : -8)}
            textAnchor={tipX > cx ? 'start' : 'end'}
            fill="#06b6d4"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            |ψ_{selectedQubit}⟩
          </text>
        </svg>

        {/* State Coordinates Tag */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs sm:text-sm font-mono text-slate-300">
          <span>x: <strong className="text-cyan-400">{currentBloch.x}</strong></span>
          <span>y: <strong className="text-purple-400">{currentBloch.y}</strong></span>
          <span>z: <strong className="text-emerald-400">{currentBloch.z}</strong></span>
          <span>r: <strong className="text-amber-400">{currentBloch.r}</strong></span>
        </div>

        {/* Entangled Mixed State Notice if r < 0.9 */}
        {currentBloch.isEntangled && (
          <div className="mt-2.5 text-xs sm:text-sm text-amber-300/90 bg-amber-500/10 px-3.5 py-1.5 rounded-lg border border-amber-500/20 text-center">
            ✦ Entangled state: reduced density matrix has length r &lt; 1 (mixed state).
          </div>
        )}
      </div>

      {/* Required Explanation Text Below */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Bloch Sphere Explanation
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          The Bloch sphere represents the state of a single qubit. The north pole corresponds to |0⟩ and the south pole corresponds to |1⟩. Points on the equator represent equal superpositions, while the interior represents mixed states produced by quantum entanglement.
        </p>
      </div>
    </div>
  );
};

export default BlochSphere;
