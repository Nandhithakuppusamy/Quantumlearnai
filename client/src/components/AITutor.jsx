import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { ALGORITHM_TUTOR_CONTEXT, getTutorAnswer } from '../utils/aiTutorEngine';

export const AITutor = ({ currentAlgorithm = 'bell_state' }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const context = ALGORITHM_TUTOR_CONTEXT[currentAlgorithm] || ALGORITHM_TUTOR_CONTEXT.bell_state;

  // Initialize or update tutor when algorithm changes
  useEffect(() => {
    const initialGreeting = {
      id: `initial-${Date.now()}`,
      sender: 'ai',
      text: context.summary,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialGreeting]);
  }, [currentAlgorithm]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate realistic AI thought generation
    setTimeout(() => {
      const answer = getTutorAnswer(query, currentAlgorithm);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleSuggestedClick = (question) => {
    handleSend(question);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text: context.summary,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-[700px] overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-quantum-cyan">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                🤖 Quantum AI Tutor
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">Contextual Quantum Assistant</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Questions Chips */}
      <div className="p-3 bg-slate-950/50 border-b border-slate-800/80">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1 mb-2">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {context.suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestedClick(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-cyan-950/70 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                isAI
                  ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-quantum-cyan'
              }`}>
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>
                <div className={`text-[9px] mt-1.5 text-right ${isAI ? 'text-slate-500' : 'text-cyan-100/70'}`}>
                  {msg.time}
                </div>
              </div>

              {!isAI && (
                <div className="w-7 h-7 rounded-lg bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your quantum tutor..."
            className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-quantum-cyan disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AITutor;
