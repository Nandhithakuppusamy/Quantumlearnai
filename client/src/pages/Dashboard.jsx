import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Binary, 
  Award, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  PlayCircle,
  FlaskConical,
  Compass
} from 'lucide-react';
import StatCard from '../components/StatCard';
import LearningPath from '../components/LearningPath';

export const Dashboard = () => {
  const navigate = useNavigate();

  // Greeting based on time of day
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const recentActivities = [
    { title: 'Completed: Quantum Gates', type: 'Lesson', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Quiz: Superposition — 90%', type: 'Quiz', time: 'Yesterday', icon: Award, color: 'text-purple-400' },
    { title: 'Practiced: Bell State', type: 'Lab', time: '2 days ago', icon: FlaskConical, color: 'text-cyan-400' },
    { title: "Started: Grover's Algorithm", type: 'Lesson', time: '3 days ago', icon: PlayCircle, color: 'text-amber-400' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 overflow-hidden">
        {/* Glow backdrop blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SIH 2026 Smart Education Platform
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {timeGreeting}, Student 👋
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Continue your quantum computing journey. Build circuits, simulate superpositions, and master algorithms with your AI tutor.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate('/lab')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-quantum-cyan transition-all hover:scale-105"
            >
              <FlaskConical className="w-4 h-4" />
              Open Quantum Lab
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Learning Progress"
          value="68%"
          subtitle="4 of 6 primary modules completed"
          icon={TrendingUp}
          color="cyan"
          trend="+8% this week"
        />
        <StatCard
          title="Algorithms Learned"
          value="4 / 8"
          subtitle="Bell, Grover, Teleport, Deutsch-Jozsa"
          icon={Binary}
          color="purple"
          trend="Mastery Track"
        />
        <StatCard
          title="Quiz Accuracy"
          value="84%"
          subtitle="Across 24 practice questions"
          icon={Award}
          color="emerald"
          trend="Top 10%"
        />
        <StatCard
          title="Learning Streak"
          value="7 Days"
          subtitle="Personal best record"
          icon={Flame}
          color="amber"
          trend="🔥 Active"
        />
      </div>

      {/* 2 Feature Cards: Continue Learning & Recommended Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Continue Learning Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Continue Learning
            </span>
            <span className="text-xs font-mono text-slate-400">Lesson 4.2</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">Quantum Entanglement</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-5">
            Dive into the Einstein-Podolsky-Rosen paradox, Bell inequalities, and state correlation using Hadamard and CNOT gates.
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5 mb-6">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">Module Progress</span>
              <span className="text-cyan-400 font-bold font-mono">72%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                style={{ width: '72%' }} 
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/lab')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all duration-200 group-hover:shadow-quantum-cyan"
          >
            Continue Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Recommended Learning Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Recommended Learning
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              Intermediate
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">Grover's Search Algorithm</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-5">
            Discover quantum amplitude amplification to search an unsorted list in O(√N) queries instead of classical O(N).
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Estimated time: 20 min
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Hands-on Lab Included
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/algorithms/grovers-search')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all duration-200 group-hover:shadow-quantum-purple"
          >
            Start Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Interactive Learning Path Visualization */}
      <LearningPath />

      {/* Recent Activity List */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Recent Activity</h3>
            <p className="text-xs text-slate-400">Your latest simulations, quiz submissions, and completed milestones</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/progress')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentActivities.map((act, index) => {
            const Icon = act.icon;
            return (
              <div 
                key={index}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => navigate('/lab')}
              >
                <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center ${act.color} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{act.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{act.type}</span>
                    <span>•</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
