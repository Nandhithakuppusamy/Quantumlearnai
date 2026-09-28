import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Bell, 
  Clock, 
  Cpu, 
  Save, 
  RotateCcw,
  Sparkles,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [dailyGoal, setDailyGoal] = useState('30 min');
  const [defaultShots, setDefaultShots] = useState('1000');
  const [notifications, setNotifications] = useState(true);
  const [quantumThemeGlow, setQuantumThemeGlow] = useState(true);

  useEffect(() => {
    try {
      const savedDiff = localStorage.getItem('ql_pref_difficulty');
      const savedGoal = localStorage.getItem('ql_pref_goal');
      const savedShots = localStorage.getItem('ql_pref_shots');
      if (savedDiff) setDifficulty(savedDiff);
      if (savedGoal) setDailyGoal(savedGoal);
      if (savedShots) setDefaultShots(savedShots);
    } catch (e) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('ql_pref_difficulty', difficulty);
      localStorage.setItem('ql_pref_goal', dailyGoal);
      localStorage.setItem('ql_pref_shots', defaultShots);
    } catch (e) {}
    toast.success('Preferences successfully saved!');
  };

  const handleReset = () => {
    setDifficulty('Intermediate');
    setDailyGoal('30 min');
    setDefaultShots('1000');
    setNotifications(true);
    setQuantumThemeGlow(true);
    toast('Settings restored to defaults', { icon: '🔄' });
  };

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Preferences
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Platform Settings</h1>
          <p className="text-sm sm:text-base text-slate-300 mt-1.5">
            Customize your quantum learning curriculum pace, simulation parameters, and notifications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Learning Preferences */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Learning Preferences
          </h3>

          {/* Difficulty */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-slate-200 block">
              Curriculum Difficulty Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                    difficulty === lvl
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-quantum-cyan'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Adjusts recommended algorithms and AI tutor explanation depth.
            </p>
          </div>

          {/* Daily Goal */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
            <label className="text-sm font-semibold text-slate-200 block">
              Daily Study Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['15 min', '30 min', '45 min', '60 min'].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setDailyGoal(goal)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all border ${
                    dailyGoal === goal
                      ? 'bg-purple-600 text-white border-purple-500 shadow-quantum-purple'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simulator Settings */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Simulator & Engine Preferences
          </h3>

          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-slate-200 block">
              Default Measurement Shots
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['500', '1000', '2000', '4000'].map((shots) => (
                <button
                  key={shots}
                  type="button"
                  onClick={() => setDefaultShots(shots)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-mono font-bold transition-all border ${
                    defaultShots === shots
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-quantum-cyan'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {shots} shots
                </button>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Higher shot counts provide closer empirical convergence to exact theoretical probabilities.
            </p>
          </div>
        </div>

        {/* Notifications & System */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-cyan-400" />
            Notifications & Visuals
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-sm font-semibold text-white block">Learning Reminders</span>
              <span className="text-xs sm:text-sm text-slate-400">Receive notifications to maintain your 7-day streak</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-sm font-semibold text-white block">Quantum Theme Glow Effects</span>
              <span className="text-xs sm:text-sm text-slate-400">Glassmorphism shadows and particle animations</span>
            </div>
            <input
              type="checkbox"
              checked={quantumThemeGlow}
              onChange={(e) => setQuantumThemeGlow(e.target.checked)}
              className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Restore Defaults
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold uppercase tracking-wider shadow-quantum-cyan transition-all"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
