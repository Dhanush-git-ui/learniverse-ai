import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, RefreshCw, AlignLeft } from 'lucide-react';

interface CodeEditorPanelProps {
  userCode: string;
  setUserCode: (code: string) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  handleRunCode: () => void;
  handleSubmitCode: () => void;
  submittingCode: boolean;
}

import { useState, useEffect } from 'react';

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export default function CodeEditorPanel(props: CodeEditorPanelProps) {
  const isDark = useIsDarkMode();
  const editorTheme = isDark ? 'vs-dark' : 'vs';

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
      
      {/* Editor Control Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-slate-50 dark:bg-slate-955 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <select 
            value={props.selectedLang} 
            onChange={(e) => props.setSelectedLang(e.target.value)}
            className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java 17</option>
            <option value="javascript">JavaScript</option>
          </select>
          <span className="text-[10px] text-slate-500 font-mono">Auto-saved</span>
        </div>
      </div> 
        

   {/* Editor Canvas */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-950 p-1">
        <Editor
          height="100%"
          language={props.selectedLang === 'cpp' ? 'cpp' : props.selectedLang === 'java' ? 'java' : props.selectedLang === 'python' ? 'python' : 'javascript'}
          theme={editorTheme}
          value={props.userCode}
          onChange={(v) => props.setUserCode(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 }
          }}
          className="rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850"
        />
      </div>

      {/* Runner Buttons */}
      <div className="flex justify-between items-center px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-405 dark:text-slate-500">Ctrl + Enter to Run</span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={props.handleRunCode} 
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-250 dark:border-slate-800 transition-all active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>
          <button 
            onClick={props.handleSubmitCode} 
            disabled={props.submittingCode}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_10px_rgba(37,99,235,0.15)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{props.submittingCode ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

