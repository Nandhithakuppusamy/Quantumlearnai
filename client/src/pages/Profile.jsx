import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Flame, 
  Binary, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Edit2,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const [name, setName] = useState('Student');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('Student');

  const badges = [
    { title: 'Quantum Beginner', desc: 'Completed Quantum Foundations and Dirac Notation', unlocked: true, icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/20' },
    { title: 'Circuit Builder', desc: 'Constructed and simulated 25+ quantum circuits in Lab', unlocked: true, icon: Binary, color: 'text-purple-400 bg-purple-500/20' },
    { title: 'Quiz Master', desc: 'Achieved 84%+ accuracy across all quantum assessments', unlocked: true, icon: Award, color: 'text-emerald-400 bg-emerald-500/20' },
    { title: 'Entanglement Pioneer', desc: 'Simulated and measured EPR Bell State correlations', unlocked: true, icon: Zap, color: 'text-amber-400 bg-amber-500/20' },
    { title: 'Superposition Scholar', desc: 'Mastered Hadamard gate rotations on the Bloch Sphere', unlocked: true, icon: ShieldCheck, color: 'text-blue-400 bg-blue-500/20' },
  ];

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setName(tempName.trim());
      setIsEditing(false);
      toast.success('Profile name updated');
    }
  };

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Header Profile Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-quantum-cyan flex-shrink-0">
              {name.charAt(0)}
            </div>

            <div>
              {isEditing ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-slate-900 border border-cyan-400 rounded-xl px-3 py-1.5 text-lg font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="text-sm bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-1.5 rounded-xl font-bold transition-colors">
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{name}</h1>
                  <button 
                    type="button" 
                    onClick={() => { setTempName(name); setIsEditing(true); }}
                    className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Level: Quantum Explorer
                </span>
                <span className="text-sm text-slate-400">SIH 2026 Participant</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Total Quantum XP</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">1,420 Q-XP</span>
          </div>
        </div>

        {/* 3 Core Profile Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs sm:text-sm text-slate-400 block font-medium">Streak</span>
              <span className="text-xl sm:text-2xl font-bold text-white">7 day streak</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs sm:text-sm text-slate-400 block font-medium">Curriculum</span>
              <span className="text-xl sm:text-2xl font-bold text-white">4 algorithms completed</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs sm:text-sm text-slate-400 block font-medium">Accuracy</span>
              <span className="text-xl sm:text-2xl font-bold text-white">84% average quiz score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Earned Badges & Credentials</h2>
            <p className="text-sm text-slate-400 mt-0.5">Milestones unlocked during your quantum computing studies</p>
          </div>
          <span className="text-sm font-mono font-bold text-cyan-400">
            {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div 
                key={b.title}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${b.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5">{b.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mt-2.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
