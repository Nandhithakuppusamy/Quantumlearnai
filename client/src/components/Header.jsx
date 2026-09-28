import React from 'react';
import { Flame, Zap, FlaskConical, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-[#070a12]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
      {/* Left: Product Branding */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
            QuantumLearn <span className="text-cyan-400 font-mono text-xs">AI</span>
          </span>
        </div>
        <span className="hidden sm:inline-block text-xs text-slate-400 border-l border-slate-800 pl-3">
          Interactive Quantum Algorithm Learning Platform
        </span>
      </div>

      {/* Right: Streaks, XP & Quick Lab Access */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>7 Days</span>
        </div>

        {/* XP Points */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>1,420 Q-XP</span>
        </div>

        {/* Quick Lab shortcut if not on lab page */}
        {location.pathname !== '/lab' && (
          <button
            type="button"
            onClick={() => navigate('/lab')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all hover:scale-105"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Quantum</span> Lab
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
