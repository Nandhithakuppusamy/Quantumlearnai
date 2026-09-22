import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  FlaskConical,
  Zap,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QUIZ_QUESTIONS } from '../utils/quizData';
import toast from 'react-hot-toast';

export const Quiz = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + (isCompleted ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (idx) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast.success('Correct! +50 Q-XP');
    } else {
      toast.error('Incorrect option');
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        userAnswer: idx,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Quiz finished
      setIsCompleted(true);
      const finalScorePct = Math.round(((score + (selectedOption === currentQ.correctAnswer ? 0 : 0)) / QUIZ_QUESTIONS.length) * 100);
      try {
        localStorage.setItem('quantumlearn_quiz_score', finalScorePct.toString());
        localStorage.setItem('quantumlearn_quiz_completed', 'true');
      } catch (e) {
        // local storage fallback
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setAnswersHistory([]);
    toast('Quiz reset! Good luck.', { icon: '🎯' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive Assessment
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Quantum Knowledge Quiz</h1>
          <p className="text-sm text-slate-300 mt-1">
            Test your understanding of superposition, entanglement, quantum gates, and algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Current Score: {score} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 relative overflow-hidden">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Topic Badge */}
          <div className="inline-block">
            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Topic: {currentQ.topic}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let optionClasses = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';
              if (hasAnswered) {
                if (isCorrect) {
                  optionClasses = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-quantum-cyan';
                } else if (isSelected) {
                  optionClasses = 'bg-rose-500/10 border-rose-500/50 text-rose-300';
                } else {
                  optionClasses = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionClasses = 'border-cyan-400 bg-cyan-950/40 text-white';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${optionClasses} ${
                    !hasAnswered ? 'hover:scale-[1.01] cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold border transition-colors ${
                      hasAnswered && isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : hasAnswered && isSelected
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 group-hover:border-cyan-400 group-hover:text-cyan-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Detailed Explanation */}
          {hasAnswered && (
            <div className={`p-4 rounded-2xl border transition-all ${
              selectedOption === currentQ.correctAnswer
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Correct Answer!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Incorrect Option
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-300 mt-1.5">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {hasAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-quantum-cyan transition-all"
              >
                {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Celebration View */
        <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-quantum-cyan">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Quiz Completed
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Final Score: {score} / {QUIZ_QUESTIONS.length}
            </h2>
            <div className="text-lg font-bold text-purple-400 font-mono mt-1">
              {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% Accuracy
            </div>
          </div>

          {/* Required Completion Text */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-sm font-medium">
            Great work! Your understanding of quantum fundamentals is improving.
          </div>

          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your quiz results have been recorded in your student profile and progress tracker.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>

            <button
              type="button"
              onClick={() => navigate('/lab')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-quantum-cyan transition-all"
            >
              <FlaskConical className="w-4 h-4" />
              Practice in Lab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
