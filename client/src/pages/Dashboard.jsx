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
  Compass,
  Box,
  Glasses,
  ArrowDown
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
              <span className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                SIH 2026 Smart Education Platform
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {timeGreeting}, Student 👋
            </h1>
            <p className="text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Continue your quantum computing journey. Build circuits, simulate superpositions, and master algorithms with your AI tutor.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate('/lab')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm uppercase tracking-wider shadow-quantum-cyan transition-all hover:scale-105"
            >
              <FlaskConical className="w-4 h-4" />
              Open Quantum Lab
            </button>
          </div>
        </div>
      </div>

      {/* Immersive Lab entry point */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-purple-500/25 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-cyan-950/30 relative overflow-hidden">
        <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-200 flex items-center justify-center flex-shrink-0">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-purple-300">New WebXR Immersive Experience</span>
              <h2 className="text-2xl font-bold text-white mt-1">WebXR Virtual Quantum Lab</h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">Step inside the room-scale virtual quantum laboratory with 6DoF headset tracking, VR controllers, hand tracking, and spatial Bell State entanglement.</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/vr-lab')} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-100 text-sm font-bold hover:bg-purple-500/30 transition-colors flex-shrink-0">
            <Glasses className="w-4 h-4" /> Enter WebXR VR <ArrowRight className="w-4 h-4" />
          </button>
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
            <span className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Continue Learning
            </span>
            <span className="text-sm font-mono text-slate-400">Lesson 4.2</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Quantum Entanglement</h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
            Dive into the Einstein-Podolsky-Rosen paradox, Bell inequalities, and state correlation using Hadamard and CNOT gates.
          </p>

          {/* Progress bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-400">Module Progress</span>
              <span className="text-cyan-400 font-bold font-mono">72%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                style={{ width: '72%' }} 
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/lab')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-sm transition-all duration-200 group-hover:shadow-quantum-cyan"
          >
            Continue Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Recommended Learning Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Recommended Learning
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              Intermediate
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Grover's Search Algorithm</h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
            Discover quantum amplitude amplification to search an unsorted list in O(√N) queries instead of classical O(N).
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              Estimated time: 20 min
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              Hands-on Lab Included
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/algorithms/grovers-search')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 border border-purple-500/30 font-semibold text-sm transition-all duration-200 group-hover:shadow-quantum-purple"
          >
            Start Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Connected learning journey */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Your learning journey</h3>
            <p className="text-sm text-slate-400 mt-1">Move from a concept to a measurable experiment.</p>
          </div>
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {['Learn', 'Build', 'Simulate', 'Visualize', 'Experiment', 'Ask AI', 'Challenge', 'Progress'].map((step, index, steps) => (
            <React.Fragment key={step}>
              <span className={`px-4 py-2.5 rounded-xl text-sm font-bold border ${index < 3 ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-200' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
                {step}
              </span>
              {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive Learning Path Visualization */}
      <LearningPath />

      {/* Recent Activity List */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <p className="text-sm text-slate-400">Your latest simulations, quiz submissions, and completed milestones</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/progress')}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
          >
            View All
            <ArrowRight className="w-4 h-4" />
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
                <div className={`w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ${act.color} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{act.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
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
