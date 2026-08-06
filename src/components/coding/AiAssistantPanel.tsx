import React, { useState } from 'react';
import { Sparkles, HelpCircle, Bug, TrendingUp, Lightbulb } from 'lucide-react';

interface AiAssistantProps {
  challenge: any;
  userCode: string;
  codingHintMode: 'teacher' | 'peer';
  setCodingHintMode: (mode: 'teacher' | 'peer') => void;
  revealCodingHint1: boolean;
  setRevealCodingHint1: (reveal: boolean) => void;
  revealCodingHint2: boolean;
  setRevealCodingHint2: (reveal: boolean) => void;
}

export default function AiAssistantPanel(props: AiAssistantProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  return (
    <div className="h-full flex flex-col space-y-4 text-xs font-sans">
      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold border-b border-slate-205 dark:border-slate-800 pb-2">
        <Sparkles className="w-4 h-4" />
        <span>Socratic AI Coach</span>
      </div>

      {/* AI Modes Selector */}
      <div className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => props.setCodingHintMode('teacher')}
          className={`flex-1 py-1 rounded text-center text-[10px] font-semibold transition-all ${
            props.codingHintMode === 'teacher' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Teacher Mode
        </button>
        <button 
          onClick={() => props.setCodingHintMode('peer')}
          className={`flex-1 py-1 rounded text-center text-[10px] font-semibold transition-all ${
            props.codingHintMode === 'peer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Buddy Analogy
        </button>
      </div>

      {/* Socratic Hints */}
      <div className="space-y-2.5">
        <div className="flex gap-2">
          <button 
            onClick={() => props.setRevealCodingHint1(!props.revealCodingHint1)}
            className="flex-1 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {props.revealCodingHint1 ? 'Hide Hint 1' : 'Request Hint 1'}
          </button>
          <button 
            onClick={() => props.setRevealCodingHint2(!props.revealCodingHint2)}
            className="flex-1 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {props.revealCodingHint2 ? 'Hide Hint 2' : 'Request Hint 2'}
          </button>
        </div>

        {props.revealCodingHint1 && (
          <div className="p-3 bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl leading-relaxed">
            <strong>{props.codingHintMode === 'teacher' ? '👨‍🏫 Socratic Hint 1:' : '💡 Peer Analogy 1:'}</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{props.codingHintMode === 'teacher' ? props.challenge.hint1_teacher : props.challenge.hint1_peer}</p>
          </div>
        )}

        {props.revealCodingHint2 && (
          <div className="p-3 bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl leading-relaxed">
            <strong>{props.codingHintMode === 'teacher' ? '👨‍🏫 Socratic Hint 2:' : '💡 Peer Analogy 2:'}</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{props.codingHintMode === 'teacher' ? props.challenge.hint2_teacher : props.challenge.hint2_peer}</p>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800" />

      {/* AI Assistant Toolkit */}
      <div className="space-y-2 flex-1">
        <span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-widest font-bold font-mono">Tutor Actions</span>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setActiveAction('bugs')}
            className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl flex flex-col items-center gap-1.5 text-center text-[10px] font-semibold text-slate-655 dark:text-slate-300 hover:text-slate-850 dark:hover:text-white transition-colors"
          >
            <Bug className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            <span>Identify Bugs</span>
          </button>
          
          <button 
            onClick={() => setActiveAction('complexity')}
            className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl flex flex-col items-center gap-1.5 text-center text-[10px] font-semibold text-slate-655 dark:text-slate-300 hover:text-slate-850 dark:hover:text-white transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Complexity</span>
          </button>
        </div>

        {activeAction === 'bugs' && (
          <div className="p-3 bg-rose-500/5 border border-rose-200/50 dark:border-rose-500/20 text-slate-700 dark:text-slate-300 rounded-xl leading-relaxed animate-fade-in">
            <strong className="text-rose-600 dark:text-rose-400 block mb-1">🔍 Bug Spotter:</strong>
            Let's dry-run your solution with an empty array `nums = []`. Does your loop pointer bounds guard against `IndexOutOfBounds`?
          </div>
        )}

        {activeAction === 'complexity' && (
          <div className="p-3 bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300 rounded-xl leading-relaxed animate-fade-in">
            <strong className="text-emerald-650 dark:text-emerald-400 block mb-1">📈 Scaling Complexity:</strong>
            Your solution uses nested loops which takes O(N²) time. Since N can be up to 10⁴, this will time out. Can we use a hash map to look up targets in O(1) time?
          </div>
        )}
      </div>
    </div>
  );
}
