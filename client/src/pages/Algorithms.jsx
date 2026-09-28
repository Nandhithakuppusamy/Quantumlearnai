import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Binary, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  FlaskConical, 
  BookOpen, 
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { ALGORITHMS } from '../utils/algorithmData';

export const Algorithms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAlgorithms = ALGORITHMS.filter((algo) => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || algo.level === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive Catalog
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Quantum Algorithms</h1>
          <p className="text-sm text-slate-300 mt-1">
            Explore fundamental quantum algorithms, understand their complexity speedups, and launch them in the lab.
          </p>
        </div>

        {/* Search & Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center w-full sm:w-auto bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-xs overflow-x-auto">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-white font-bold shadow-quantum-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map((algo) => {
          const isComplete = algo.progress === 100;
          return (
            <div
              key={algo.id}
              className="glass-card rounded-2xl p-6 border border-slate-800/90 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle accent glow top-right */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

              <div>
                {/* Badges: Level & Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    algo.level === 'Beginner'
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                      : algo.level === 'Intermediate'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  }`}>
                    {algo.level}
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {algo.estimatedTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {algo.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {algo.tagline}
                </p>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {algo.shortDesc}
                </p>
              </div>

              {/* Progress & Action */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Mastery Progress</span>
                  <span className="font-mono font-bold text-cyan-400">{algo.progress}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${algo.progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => navigate(`/algorithms/${algo.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all group-hover:shadow-quantum-cyan"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Learn
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {algo.presetId && (
                    <>
                      <button
                        type="button"
                        onClick={() => navigate(`/lab?algo=${algo.presetId}`)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Experiment
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/lab?algo=${algo.presetId}`)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                        title="Open directly in Quantum Lab"
                        aria-label="Open directly in Quantum Lab"
                      >
                        <FlaskConical className="w-4 h-4 text-cyan-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Algorithms;
