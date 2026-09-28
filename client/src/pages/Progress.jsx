import React from 'react';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Flame, 
  Calendar,
  Lightbulb,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useLab } from '../context/LabContext';

export const Progress = () => {
  const navigate = useNavigate();
  const { metrics } = useLab();

  const algorithmProgress = [
    { name: 'Quantum Gates', progress: 100, color: 'from-emerald-500 to-teal-400' },
    { name: 'Superposition', progress: 80, color: 'from-cyan-500 to-blue-400' },
    { name: 'Entanglement', progress: 70, color: 'from-indigo-500 to-purple-400' },
    { name: 'Grover', progress: 40, color: 'from-purple-500 to-fuchsia-400' },
    { name: 'Teleportation', progress: 20, color: 'from-pink-500 to-rose-400' },
  ];

  const quizPerformance = [
    { topic: 'Quantum Gates', score: 90, status: 'Mastered' },
    { topic: 'Superposition', score: 85, status: 'Proficient' },
    { topic: 'Entanglement', score: 80, status: 'Review Needed' },
  ];

  const activityData = [
    { day: 'Mon', minutes: 35, simulations: 6 },
    { day: 'Tue', minutes: 45, simulations: 12 },
    { day: 'Wed', minutes: 20, simulations: 4 },
    { day: 'Thu', minutes: 50, simulations: 15 },
    { day: 'Fri', minutes: 60, simulations: 18 },
    { day: 'Sat', minutes: 30, simulations: 8 },
    { day: 'Sun', minutes: 40, simulations: 10 },
  ];

  // Circular progress math
  const overallProgress = 68;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Student Analytics
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Learning Progress</h1>
          <p className="text-sm sm:text-base text-slate-300 mt-1.5">
            Track your quantum curriculum completion, simulation activity, and quiz performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            7 Day Active Streak
          </span>
        </div>
      </div>

      {/* Top Row: Overall Circular Progress & Learning Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overall Progress Circular Card (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Overall Progress
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
              Rank: Explorer
            </span>
          </div>

          {/* SVG Circular Progress Indicator */}
          <div className="relative w-48 h-48 my-4 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#1e293b"
                strokeWidth="12"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="url(#progressGrad)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-white tracking-tight">{overallProgress}%</span>
              <span className="text-xs text-slate-400 uppercase font-bold mt-1">Completed</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-xs mt-3 leading-relaxed">
            You are progressing faster than 85% of peers in the quantum foundation track.
          </p>
        </div>

        {/* Weekly Activity Chart (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Weekly Study Activity
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Practice Time & Circuits Simulated</h3>
            </div>
            <span className="text-sm font-mono text-slate-400">Total: 4.6 hrs</span>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  tick={{ fill: '#cbd5e1', fontSize: 14 }} 
                />
                <YAxis 
                  unit="m" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 14 }} 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
                          <p className="font-bold text-sm text-white">{data.day}</p>
                          <p className="text-xs sm:text-sm text-cyan-400 mt-1">Study time: {data.minutes} mins</p>
                          <p className="text-xs sm:text-sm text-purple-400">Simulations: {data.simulations} runs</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="minutes" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-sm text-slate-400 font-medium">
            <span>Daily learning goal: 30 min</span>
            <span className="text-emerald-400 font-semibold">Goal reached 5 of 7 days</span>
          </div>
        </div>

      </div>

      {/* Experiment analytics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Experiment Analytics</h2>
            <p className="text-sm text-slate-400 mt-1">Your progress across the connected Lab experience.</p>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-300 border border-cyan-500/20 bg-cyan-500/10 rounded-full px-3 py-1">Live from Lab</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {[
            ['Experiments', metrics.experiments, 'Runs completed'],
            ['Circuits modified', metrics.circuitsModified, 'Hands-on edits'],
            ['What-If runs', metrics.whatIf, 'Comparisons'],
            ['VR experiments', metrics.vrExperiments, '3D sessions'],
            ['Algorithms explored', metrics.algorithmsExplored, 'Curriculum'],
            ['Concepts mastered', metrics.conceptsMastered, 'Knowledge']
          ].map(([label, value, note]) => (
            <div key={label} className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">{value}</span>
              <span className="block text-sm font-bold text-cyan-300 mt-1.5">{label}</span>
              <span className="block text-xs text-slate-400 mt-1">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Algorithm Progress & Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Algorithm Progress Bars */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Algorithm Progress</h3>
            <span className="text-sm text-slate-400">5 Algorithms in syllabus</span>
          </div>

          <div className="space-y-4 pt-1">
            {algorithmProgress.map((algo) => (
              <div key={algo.name} className="space-y-1.5">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-200">{algo.name}</span>
                  <span className="font-mono text-cyan-400">{algo.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${algo.color} rounded-full transition-all duration-700`}
                    style={{ width: `${algo.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Performance Cards */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Quiz Performance</h3>
            <span className="text-sm text-slate-400">Average: 85%</span>
          </div>

          <div className="space-y-3 pt-1">
            {quizPerformance.map((q) => (
              <div 
                key={q.topic}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                    Q
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{q.topic}</h4>
                    <span className="text-xs text-slate-400">{q.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-emerald-400">{q.score}%</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/quiz')}
            className="w-full py-3 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            Take Another Practice Quiz
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Learning Recommendation Card (Requirement) */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
              AI Adaptive Learning Recommendation
            </span>
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              "Based on your recent performance, practice Entanglement before moving to Grover's Search."
            </p>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
              Reinforce Bell state density matrices to maximize your retention of amplitude amplification.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/lab?algo=bell_state')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-all shadow-md flex-shrink-0"
        >
          Practice Entanglement
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Progress;
