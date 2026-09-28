import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Binary, 
  HelpCircle, 
  TrendingUp, 
  Settings, 
  User, 
  Atom, 
  Flame,
  Box,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/lab', label: 'Quantum Lab', icon: FlaskConical, badge: 'Workbench' },
  { path: '/vr-lab', label: 'VR Lab', icon: Box, badge: '3D' },
  { path: '/algorithms', label: 'Algorithms', icon: Binary },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
];

const BOTTOM_ITEMS = [
  { path: '/profile', label: 'Student Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ mobileOpen = false, onClose }) => {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
        />
      )}
      <aside className={`${mobileOpen ? 'flex' : 'hidden'} md:flex flex-col w-72 md:w-64 flex-shrink-0 bg-[#090e1a]/98 border-r border-slate-800/80 p-5 min-h-screen fixed md:sticky inset-y-0 left-0 md:inset-auto top-0 backdrop-blur-xl z-50`}>
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-quantum-cyan">
          <Atom className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-extrabold text-white tracking-tight">QuantumLearn</h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
          </div>
          <p className="text-[10px] text-slate-400">Quantum Learning Platform</p>
        </div>
        <button type="button" onClick={onClose} className="md:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Close navigation">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-1.5 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
          Core Learning
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-white border border-cyan-500/30 shadow-quantum-cyan' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Streak Mini Widget (Cleaned of fake social rankings) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-purple-500/20 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white">7 Day Streak</span>
              <span className="text-[10px] text-slate-400 block">Personal Best</span>
            </div>
          </div>
          <span className="text-[11px] font-bold font-mono text-cyan-400">84% Acc</span>
        </div>
      </div>

      {/* Bottom Navigation Links */}
      <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
          Account & Prefs
        </div>
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-white border border-cyan-500/30 shadow-quantum-cyan' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                  }`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Discreet project identifier */}
      <div className="pt-3 text-[10px] text-slate-400 font-mono text-center">
        Problem ID: SIH26140
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
