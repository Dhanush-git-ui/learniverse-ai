import React from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen, Clock, Target, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  topic?: string;
  concept?: string;
  explanation_teacher?: string;
  explanation_peer?: string;
  hint_teacher?: string;
  hint_peer?: string;
}

interface MCQSummaryScreenProps {
  topicTitle: string;
  questions: MCQQuestion[];
  selectedAnswers: Record<string, string>;
  timeTakenSeconds?: number;
  onRetry: () => void;
  onProceedToCoding: () => void;
}

export default function MCQSummaryScreen({
  topicTitle,
  questions,
  selectedAnswers,
  timeTakenSeconds = 0,
  onRetry,
  onProceedToCoding,
}: MCQSummaryScreenProps) {
  const normalize = (s: string | undefined | null) => (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

  // Compute stats
  let correctCount = 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length || 1;

  const conceptStats: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, idx) => {
    const selected = selectedAnswers[q.id];
    const isCorrect = selected && normalize(selected) === normalize(q.answer);
    if (isCorrect) correctCount++;

    const concept = q.concept || q.topic || `Concept ${Math.floor(idx / 3) + 1}`;
    if (!conceptStats[concept]) conceptStats[concept] = { correct: 0, total: 0 };
    conceptStats[concept].total++;
    if (isCorrect) conceptStats[concept].correct++;
  });

  const accuracyPct = Math.round((correctCount / totalCount) * 100);

  const strongConcepts = Object.entries(conceptStats)
    .filter(([_, s]) => s.correct === s.total && s.total > 0)
    .map(([c]) => c);

  const weakConcepts = Object.entries(conceptStats)
    .filter(([_, s]) => s.correct < s.total)
    .map(([c]) => c);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const getGradeInfo = (pct: number) => {
    if (pct >= 85) return { label: 'Mastery Level', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (pct >= 70) return { label: 'Proficient', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' };
    if (pct >= 50) return { label: 'Developing', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    return { label: 'Needs Remedial Review', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
  };

  const grade = getGradeInfo(accuracyPct);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* 1. Hero Score Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${grade.bg} shadow-sm relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Assessment Completed • {topicTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Quiz Results & Performance Review
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              You answered {correctCount} out of {totalCount} questions accurately. Review the step-by-step solutions below to solidify your understanding.
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md min-w-[140px]">
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {correctCount}<span className="text-slate-400 text-2xl font-bold">/{totalCount}</span>
            </div>
            <div className={`text-base font-extrabold mt-0.5 ${grade.color}`}>
              {accuracyPct}% Score
            </div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
              {grade.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full h-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              accuracyPct >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
              accuracyPct >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-gradient-to-r from-rose-500 to-red-500'
            }`}
            style={{ width: `${Math.max(4, accuracyPct)}%` }}
          />
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            Accuracy
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{accuracyPct}%</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Correct Answers
          </div>
          <div className="text-2xl font-black text-emerald-600">{correctCount} <span className="text-xs text-slate-400 font-semibold">of {totalCount}</span></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Clock className="w-4 h-4 text-purple-600" />
            Time Taken
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {timeTakenSeconds > 0 ? formatTime(timeTakenSeconds) : '--'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Award className="w-4 h-4 text-amber-600" />
            Status
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {accuracyPct >= 70 ? 'Passed' : 'Needs Practice'}
          </div>
        </div>
      </div>

      {/* 3. Concept Mastery Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths</span>
          </div>
          {strongConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {strongConcepts.map(c => (
                <span key={c} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800">
                  ✓ {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Continue practicing to identify your core strong subtopics.</p>
          )}
        </div>

        {/* Growth Areas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Recommended Focus Areas</span>
          </div>
          {weakConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {weakConcepts.map(c => (
                <span key={c} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-lg border border-amber-200 dark:border-amber-800">
                  ⚠ {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 font-semibold">Perfect run! No immediate weak areas detected on this topic.</p>
          )}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex items-center gap-2 border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Retry All Questions
        </Button>

        <Button
          onClick={onProceedToCoding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md"
        >
          <span>Next: Try Coding Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 5. Detailed Question Review */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Step-by-Step Question Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {answeredCount} of {totalCount} Attempted
          </span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = selected && normalize(selected) === normalize(q.answer);

            return (
              <div
                key={q.id || idx}
                className={`p-5 rounded-xl border bg-white dark:bg-slate-900 transition-all ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60 shadow-2xs'
                    : 'border-rose-200 dark:border-rose-900/60 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 mt-0.5">
                      Q{idx + 1}.
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className={`p-2.5 rounded-lg border ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300'
                      : 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 text-rose-900 dark:text-rose-300'
                  }`}>
                    <span className="font-bold text-[11px] block text-slate-500 uppercase tracking-wider mb-0.5">
                      Your Selected Answer:
                    </span>
                    <span className="font-medium">{selected || 'None (Skipped)'}</span>
                  </div>

                  {!isCorrect && (
                    <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      <span className="font-bold text-[11px] block text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                        Correct Answer:
                      </span>
                      <span className="font-semibold">{q.answer}</span>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                {(q.explanation_teacher || q.explanation_peer) && (
                  <div className="p-3 bg-slate-50/80 dark:bg-slate-800/30 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">
                      💡 Concept Explanation:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {q.explanation_teacher || q.explanation_peer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
