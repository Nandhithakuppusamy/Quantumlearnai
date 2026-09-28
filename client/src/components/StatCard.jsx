import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'cyan', trend }) => {
  const colorMap = {
    cyan: {
      bg: 'from-cyan-500/10 to-blue-500/5',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      glow: 'group-hover:shadow-quantum-cyan'
    },
    purple: {
      bg: 'from-purple-500/10 to-indigo-500/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      glow: 'group-hover:shadow-quantum-purple'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      glow: ''
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      glow: ''
    }
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`glass-card p-5 sm:p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 ${c.glow} hover:border-slate-700`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${c.bg} rounded-full blur-2xl pointer-events-none`} />
      
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-sm font-semibold uppercase tracking-wider text-slate-300">{title}</span>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-slate-800/80 border ${c.border} ${c.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full border ${c.badge}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-sm text-slate-400 mt-2.5 flex items-center gap-1.5 leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
