import { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface AlgorithmStepPanelProps {
  algorithmText: string;
  setAlgorithmText: (text: string) => void;
  timeComplexity?: string;
  setTimeComplexity?: (tc: string) => void;
  spaceComplexity?: string;
  setSpaceComplexity?: (sc: string) => void;
  onConfirmAlgorithm?: () => void;
  onSkipAlgorithm?: () => void;
}

export default function AlgorithmStepPanel({
  algorithmText,
  setAlgorithmText,
  timeComplexity = '',
  setTimeComplexity,
  spaceComplexity = '',
  setSpaceComplexity,
  onConfirmAlgorithm,
  onSkipAlgorithm
}: AlgorithmStepPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSave = () => {
    setIsSaved(true);
    if (onConfirmAlgorithm) onConfirmAlgorithm();
  };

  const handleSkip = () => {
    if (onSkipAlgorithm) onSkipAlgorithm();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 shadow-sm">
      {/* 4-Step Workflow Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold">
          <BookOpen className="w-4 h-4" />
          <span>Step 1: Algorithm & Approach (Recommended)</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
          <span className={algorithmText.trim() ? "text-emerald-500 font-bold" : "text-slate-400"}>
            {algorithmText.trim() ? "Algorithm Documented ✓" : "Optional / Recommended"}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-sans ml-2"
          >
            {isExpanded ? 'Collapse' : 'Edit Algorithm'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            Describe your problem-solving approach, algorithm steps, or data structures before coding:
          </p>

          <textarea
            value={algorithmText}
            onChange={(e) => {
              setAlgorithmText(e.target.value);
              setIsSaved(false);
            }}
            placeholder="e.g. 1. Initialize two pointers left=0, right=len-1&#10;2. Loop while left < right and check sum&#10;3. Return indices matching target"
            rows={3}
            className="w-full text-xs font-mono p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">Time Complexity</label>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity && setTimeComplexity(e.target.value)}
                placeholder="e.g. O(N)"
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">Space Complexity</label>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity && setSpaceComplexity(e.target.value)}
                placeholder="e.g. O(1)"
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={handleSkip}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-all"
            >
              Skip for Now & Start Coding
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSaved ? "Algorithm Saved ✓" : "Save Approach & Start Coding"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
