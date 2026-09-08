import React from 'react';

export interface GenealogyData {
  core_concept: string;
  missing_prereq: string;
  link: string;
  micro_lesson: string;
}

interface Props {
  data: GenealogyData;
}

export default function GenealogyCard({ data }: Props) {
  return (
    <div className="rounded-xl border border-rose-300 bg-rose-50/90 dark:bg-rose-950/20 dark:border-rose-700/60 shadow-sm p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">🌿</span>
        <h3 className="font-bold text-rose-800 dark:text-rose-300">Wrong-Answer Genealogy</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold text-rose-700 dark:text-rose-400">Concept tested:</span>{' '}
          <span className="text-slate-800 dark:text-slate-200">{data.core_concept}</span>
        </div>
        <div>
          <span className="font-semibold text-rose-700 dark:text-rose-400">Likely missing prerequisite:</span>{' '}
          <span className="font-bold text-rose-600 dark:text-rose-300">{data.missing_prereq || 'Unknown — review basics'}</span>
        </div>
        <div>
          <span className="font-semibold text-rose-700 dark:text-rose-400">Why it failed:</span>{' '}
          <span className="text-slate-700 dark:text-slate-300 italic">{data.link}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-lg p-3 mt-1">
          <span className="font-semibold text-rose-700 dark:text-rose-400 text-xs uppercase tracking-wide">Micro-lesson</span>
          <p className="text-slate-800 dark:text-slate-200 mt-1">{data.micro_lesson}</p>
        </div>
      </div>
    </div>
  );
}
