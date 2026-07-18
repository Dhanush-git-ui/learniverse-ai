import React from 'react';
import { Award, ExternalLink, Sparkles, Bookmark, Share2 } from 'lucide-react';

const LEETCODE_MAP: Record<string, { id: number; url: string }> = {
  "Two Sum": { id: 1, url: "https://leetcode.com/problems/two-sum/" },
  "Subarray Sum Equals K": { id: 560, url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  "Sort Binary Array": { id: 905, url: "https://leetcode.com/problems/sort-array-by-parity/" },
  "Sort an Array": { id: 912, url: "https://leetcode.com/problems/sort-an-array/" },
  "Binary Search in a Sorted Array": { id: 704, url: "https://leetcode.com/problems/binary-search/" },
  "Search in Rotated Sorted Array": { id: 33, url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  "Reverse Linked List": { id: 206, url: "https://leetcode.com/problems/reverse-linked-list/" },
  "Linked List Cycle": { id: 141, url: "https://leetcode.com/problems/linked-list-cycle/" },
  "Search in a Binary Search Tree": { id: 700, url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
  "Kth Smallest Element in a BST": { id: 230, url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  "Maximum Depth of Binary Tree": { id: 104, url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  "Validate Binary Search Tree": { id: 98, url: "https://leetcode.com/problems/validate-binary-search-tree/" },
  "Valid Parentheses": { id: 20, url: "https://leetcode.com/problems/valid-parentheses/" },
  "Next Greater Element I": { id: 496, url: "https://leetcode.com/problems/next-greater-element-i/" },
  "Sliding Window Maximum": { id: 239, url: "https://leetcode.com/problems/sliding-window-maximum/" },
  "Number of Islands": { id: 200, url: "https://leetcode.com/problems/number-of-islands/" },
  "Network Delay Time": { id: 743, url: "https://leetcode.com/problems/network-delay-time/" },
  "Binary Tree Level Order Traversal": { id: 102, url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  "Validate AVL Tree": { id: 110, url: "https://leetcode.com/problems/balanced-binary-tree/" }
};

interface WorkspaceHeaderProps {
  challenge: any;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
}

export default function WorkspaceHeader({ challenge, aiPanelOpen, setAiPanelOpen }: WorkspaceHeaderProps) {
  const leetInfo = LEETCODE_MAP[challenge?.title] || LEETCODE_MAP[challenge?.title?.trim()];

  return (
    <div className="flex justify-between items-center px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80">
      <div className="flex items-center space-x-3">
        <span className="px-2 py-0.5 text-[10px] font-bold font-mono tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700/80">
          ID: {challenge?.id || 'Code'}
        </span>
        <h2 className="text-sm font-bold text-slate-850 dark:text-slate-100">{challenge?.title}</h2>
        
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
          challenge?.difficulty === 'Easy' 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {challenge?.difficulty || 'Medium'}
        </span>

        {leetInfo && (
          <a
            href={leetInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[10px] font-semibold text-amber-650 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 space-x-1.5 transition-colors bg-amber-500/5 px-2.5 py-0.5 rounded-full border border-amber-500/15"
          >
            <Award className="w-3 h-3" />
            <span>LeetCode #{leetInfo.id}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>

      <div className="flex items-center space-x-3.5 text-slate-400">
        <button className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-800/85">
          <Bookmark className="w-4 h-4" />
        </button>
        <button className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-800/85">
          <Share2 className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <button 
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            aiPanelOpen 
              ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.2)]' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-850 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Coach</span>
        </button>
      </div>
    </div>
  );
}
