import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Binary, HelpCircle, TrendingUp, User } from 'lucide-react';

const ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/lab', label: 'Lab', icon: FlaskConical },
  { path: '/algorithms', label: 'Algorithms', icon: Binary },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/profile', label: 'Profile', icon: User },
];

export const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090e1a]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 flex-1 min-w-0 min-h-[2.75rem] px-1 py-1.5 rounded-xl text-[10px] font-medium leading-tight text-center transition-colors
              ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileNav;
