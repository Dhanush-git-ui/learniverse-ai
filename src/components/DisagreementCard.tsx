import React from 'react';

export interface DisagreementData {
  disagree_points: string;
  canonical: string;
  better_for_beginner: 'teacher' | 'peer';
  reason: string;
}

interface Props {
  data: DisagreementData;
  onVote?: (persona: 'teacher' | 'peer') => void;
}

export default function DisagreementCard({ data, onVote }: Props) {
  const beginnerIcon = data.better_for_beginner === 'teacher' ? '👨‍🏫' : '💡';
  return (
    <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-700/60 shadow-sm p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">⚡</span>
        <h3 className="font-bold text-amber-800 dark:text-amber-300">Persona Disagreement</h3>
      </div>

      <dl className="space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-amber-700 dark:text-amber-400">Where they differ</dt>
          <dd className="text-slate-700 dark:text-slate-300 italic">{data.disagree_points || 'No significant divergence detected.'}</dd>
        </div>
        <div>
          <dt className="font-semibold text-amber-700 dark:text-amber-400">Canonical answer (textbook)</dt>
          <dd className="text-slate-800 dark:text-slate-200">{data.canonical || 'See responses above.'}</dd>
        </div>
        <div>
          <dt className="font-semibold text-amber-700 dark:text-amber-400">Better for beginners</dt>
          <dd className="text-slate-800 dark:text-slate-200">{beginnerIcon} {data.better_for_beginner === 'teacher' ? 'Teacher' : 'Peer'} — {data.reason}</dd>
        </div>
      </dl>

      {onVote && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onVote('teacher')} className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Teacher Clicked</button>
          <button onClick={() => onVote('peer')} className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700">Peer Clicked</button>
        </div>
      )}
    </div>
  );
}
