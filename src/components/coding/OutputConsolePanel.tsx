import React from 'react';
import { Terminal, CheckCircle2, XCircle } from 'lucide-react';

interface OutputConsolePanelProps {
  result: any;
  activeTab: 'testcases' | 'output' | 'aiFeedback';
  setActiveTab: (tab: 'testcases' | 'output' | 'aiFeedback') => void;
  challenge: any;
}

export default function OutputConsolePanel({ result, activeTab, setActiveTab, challenge }: OutputConsolePanelProps) {
  const isAccepted = result?.passed_cases !== undefined && result.passed_cases === result.total_cases;

  return (
    <div className="flex flex-col h-full font-mono text-xs text-slate-300">
      
      {/* Console Tab Selector */}
      <div className="flex border-b border-slate-800 pb-2 mb-3.5 space-x-4 flex-none">
        <button 
          onClick={() => setActiveTab('testcases')}
          className={`pb-1 border-b-2 font-bold transition-all ${
            activeTab === 'testcases' 
              ? 'border-blue-500 text-slate-100' 
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          Test Cases
        </button>
        <button 
          onClick={() => setActiveTab('output')}
          className={`pb-1 border-b-2 font-bold transition-all ${
            activeTab === 'output' 
              ? 'border-blue-500 text-slate-100' 
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          Run Output
        </button>
        {result?.approach_review && (
          <button 
            onClick={() => setActiveTab('aiFeedback')}
            className={`pb-1 border-b-2 font-bold transition-all text-blue-450 ${
              activeTab === 'aiFeedback' 
                ? 'border-blue-550 border-blue-500' 
                : 'border-transparent text-slate-500 hover:text-slate-350'
            }`}
          >
            AI Review
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'testcases' && (
          <div className="space-y-4 font-mono">
            {challenge.examples?.map((ex: any, idx: number) => (
              <div key={idx} className="pb-3 border-b border-slate-800/60 last:border-0 last:pb-0 space-y-1.5">
                <span className="text-blue-400 font-bold">Case {idx + 1}:</span>
                <p><span className="text-slate-550">Input:    </span> <span className="text-slate-200">{ex.input}</span></p>
                <p><span className="text-slate-550">Expected: </span> <span className="text-emerald-400">{ex.output}</span></p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="space-y-4">
            {!result ? (
              <div className="text-slate-500 flex items-center gap-2 py-4">
                <Terminal className="w-4 h-4" />
                <span>Console empty. Click Run to evaluate code.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result header */}
                <div className="flex items-center gap-2">
                  {isAccepted ? (
                    <div className="flex items-center text-emerald-400 font-bold gap-1 text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-rose-400 font-bold gap-1 text-sm bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                      <XCircle className="w-4 h-4" />
                      <span>{result.results ? 'Wrong Answer / Error' : 'Rejected'}</span>
                    </div>
                  )}
                  {result.runtime && (
                    <span className="text-[10px] text-slate-500 font-sans ml-auto">⏱ {result.runtime}</span>
                  )}
                </div>

                {/* Metrics row (submit mode) */}
                {result.passed_cases !== undefined && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-sans">Time Taken</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{result.runtime}</p>
                      <p className="text-[9px] text-emerald-400 font-sans mt-0.5">via Piston</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-sans">Memory Usage</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{result.memory ?? 'N/A'}</p>
                      <p className="text-[9px] text-slate-500 font-sans mt-0.5">Not tracked</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-sans">Passed cases</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{result.passed_cases} / {result.total_cases}</p>
                      <p className="text-[9px] text-slate-400 font-sans mt-0.5">Test verification</p>
                    </div>
                  </div>
                )}

                {/* Per-test-case diff */}
                {result.results && Array.isArray(result.results) && (
                  <div className="space-y-3 mt-1 font-mono text-[11px]">
                    {result.results.map((r: any, i: number) => {
                      const isErr = !!r.error;
                      const isPass = !!r.passed;
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border space-y-1.5 ${
                            isPass
                              ? 'border-emerald-700/40 bg-emerald-950/20 text-emerald-300'
                              : isErr
                              ? 'border-amber-700/40 bg-amber-950/20 text-amber-300'
                              : 'border-rose-700/40 bg-rose-950/20 text-rose-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[10px] uppercase tracking-wider mb-1">
                            <span>{isPass ? '✓' : '✗'} Case {i + 1}</span>
                            <span className={`px-1.5 py-0.5 rounded ${
                              isPass ? 'bg-emerald-500/20 text-emerald-400' : isErr ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {isPass ? 'PASSED' : isErr ? 'RUNTIME ERROR' : 'WRONG ANSWER'}
                            </span>
                          </div>
                          <p><span className="text-slate-400">Input:    </span><span className="text-slate-200">{r.input || r.stdin || '(none)'}</span></p>
                          <p><span className="text-slate-400">Expected: </span><span className="text-emerald-400">{r.expected || '(none)'}</span></p>
                          {!isErr && (
                            <p><span className="text-slate-400">Returned: </span><span className={isPass ? 'text-emerald-400' : 'text-rose-400'}>{r.actual || '(no output)'}</span></p>
                          )}
                          {isErr && (
                            <div className="mt-1 p-2 bg-rose-950/40 border border-rose-800/50 rounded text-rose-300 whitespace-pre-wrap text-[10px]">
                              <strong className="block text-rose-400 font-bold mb-0.5">Error Details:</strong>
                              {r.error}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Raw stdout (run mode, no test cases) */}
                {result.raw_output !== undefined && result.passed_cases === undefined && (
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono whitespace-pre-wrap text-[11px] leading-relaxed">
                    <strong className="block mb-1 text-slate-400 text-[10px] uppercase tracking-wider">Output:</strong>
                    {result.raw_output || <span className="text-slate-500">(no output)</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'aiFeedback' && result?.approach_review && (
          <div className="p-3.5 bg-blue-950/20 border-l-2 border-blue-600 text-slate-300 rounded-lg leading-relaxed font-sans text-xs">
            <strong className="block mb-1.5 text-blue-400">AI Code Review:</strong>
            {result.approach_review}
          </div>
        )}
      </div>
    </div>
  );
}
