import React, { useState } from 'react';
import { CheckCircle2, CircleDot, Lock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PATH_STEPS = [
  {
    id: 1,
    title: 'Quantum Basics',
    description: 'Qubits, Dirac notation |ψ⟩, and quantum states vs bits',
    status: 'completed',
    level: 'Beginner',
    route: '/algorithms'
  },
  {
    id: 2,
    title: 'Quantum Gates',
    description: 'Pauli X/Y/Z, Hadamard, Phase, and unitary rotations',
    status: 'completed',
    level: 'Beginner',
    route: '/lab'
  },
  {
    id: 3,
    title: 'Superposition',
    description: 'Linear combinations of states and wave interference',
    status: 'completed',
    level: 'Beginner',
    route: '/lab'
  },
  {
    id: 4,
    title: 'Entanglement',
    description: 'EPR pairs, Bell States, and non-local correlation',
    status: 'active',
    level: 'Intermediate',
    route: '/lab'
  },
  {
    id: 5,
    title: 'Algorithms',
    description: "Grover's Search, Teleportation, Deutsch-Jozsa",
    status: 'next',
    level: 'Intermediate',
    route: '/algorithms'
  },
  {
    id: 6,
    title: 'Advanced Quantum',
    description: "Shor's Factoring, QFT, and Quantum Error Correction",
    status: 'locked',
    level: 'Advanced',
    route: '/algorithms/shors-algorithm'
  }
];

export const LearningPath = () => {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(PATH_STEPS[3]); // Entanglement

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Curriculum Roadmap</span>
          </div>
          <h3 className="text-lg font-bold text-white">Quantum Learning Path</h3>
          <p className="text-xs text-slate-400">Structured mastery path from quantum foundations to advanced algorithms</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Current Focus
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Mastered
          </span>
        </div>
      </div>

      {/* Interactive Path Flow */}
      <div className="py-6 overflow-x-auto">
        <div className="flex items-center min-w-[650px] justify-between relative px-4">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 bg-slate-800 pointer-events-none z-0">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-800 w-[65%]" />
          </div>

          {PATH_STEPS.map((step, idx) => {
            const isSelected = selectedStep.id === step.id;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isLocked = step.status === 'locked';

            return (
              <div 
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                {/* Node Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-110 shadow-quantum-cyan' 
                    : 'group-hover:scale-105'
                } ${
                  isCompleted 
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                    : isActive 
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 animate-pulse'
                    : isLocked 
                    ? 'bg-slate-900 border border-slate-800 text-slate-600'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isActive ? (
                    <CircleDot className="w-5 h-5 text-cyan-300" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold font-mono">0{step.id}</span>
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm mt-3 font-semibold transition-colors ${
                  isSelected ? 'text-white font-bold' : isActive ? 'text-cyan-300' : 'text-slate-300'
                }`}>
                  {step.title}
                </span>
                <span className="text-xs text-slate-400 font-medium">{step.level}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Tray */}
      {selectedStep && (
        <div className="mt-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h4 className="text-base font-bold text-white">{selectedStep.title}</h4>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                  selectedStep.status === 'completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                  selectedStep.status === 'active' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {selectedStep.status === 'completed' ? 'Mastered' : selectedStep.status === 'active' ? 'Current Module' : 'Upcoming'}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">{selectedStep.description}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(selectedStep.route)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition-all flex-shrink-0"
          >
            Explore Lesson
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningPath;
