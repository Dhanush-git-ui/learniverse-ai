import React from 'react';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Challenge {
  title: string;
  difficulty: string;
  statement: string;
  examples: Example[];
  constraints?: string[];
}

interface ProblemDescriptionPanelProps {
  challenge: Challenge;
}

export default function ProblemDescriptionPanel({ challenge }: ProblemDescriptionPanelProps) {
  if (!challenge) return null;

  return (
    <div className="space-y-6 text-slate-705 dark:text-slate-300 select-text">
    {/* Description statement */}
    <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-300">
      {challenge.statement}
    </div>

    {/* Examples */}
    <div className="space-y-4">
      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">Examples</h4>
      {challenge.examples?.map((ex, idx) => (
          <div 
            key={idx} 
            className="bg-slate-100/50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900/60 rounded-xl p-4 font-mono text-xs space-y-2.5 shadow-sm dark:shadow-inner"
          >
            <p className="text-blue-600 dark:text-blue-400 font-bold">Example {idx + 1}:</p>
            <div className="space-y-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <p>
                <strong className="text-slate-500 dark:text-slate-400">Input:</strong>{' '}
                <span className="text-slate-750 dark:text-slate-300">{ex.input}</span>
              </p>
              <p>
                <strong className="text-slate-500 dark:text-slate-400">Output:</strong>{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ex.output}</span>
              </p>
              {ex.explanation && (
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  <strong className="text-slate-500 dark:text-slate-400">Explanation:</strong> {ex.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints */}
      {challenge.constraints && challenge.constraints.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-550 font-mono">Constraints</h4>
          <ul className="space-y-2 pl-4 list-disc text-xs text-slate-500 dark:text-slate-400">
            {challenge.constraints.map((c, idx) => (
              <li key={idx} className="leading-relaxed">
                <code className="bg-slate-100 dark:bg-slate-950 text-blue-650 dark:text-blue-350 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-900/60 font-mono text-[11px]">
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
