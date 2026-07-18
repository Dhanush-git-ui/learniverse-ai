import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import WorkspaceHeader from './WorkspaceHeader';
import ProblemDescriptionPanel from './ProblemDescriptionPanel';
import CodeEditorPanel from './CodeEditorPanel';
import OutputConsolePanel from './OutputConsolePanel';
import AiAssistantPanel from './AiAssistantPanel';

interface CodingWorkspaceProps {
  challenge: any;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  userCode: string;
  setUserCode: (code: string) => void;
  compilationResult: any;
  submittingCode: boolean;
  handleRunCode: () => void;
  handleSubmitCode: () => void;
  codingHintMode: 'teacher' | 'peer';
  setCodingHintMode: (mode: 'teacher' | 'peer') => void;
  revealCodingHint1: boolean;
  setRevealCodingHint1: (reveal: boolean) => void;
  revealCodingHint2: boolean;
  setRevealCodingHint2: (reveal: boolean) => void;
}

export default function CodingWorkspace(props: CodingWorkspaceProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcases' | 'output' | 'aiFeedback'>('testcases');
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md">
      
      {/* 1. Header Bar */}
      <WorkspaceHeader 
        challenge={props.challenge} 
        aiPanelOpen={aiPanelOpen}
        setAiPanelOpen={setAiPanelOpen}
      />
      
      {/* 2. Main Workspace Layout */}
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal">
          
          {/* Left Panel: Description */}
          <Panel defaultSize={35} minSize={25}>
            <div className="h-full overflow-y-auto p-5 bg-slate-50/30 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800/80">
              <ProblemDescriptionPanel challenge={props.challenge} />
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-blue-600/30 transition-all cursor-col-resize" />
          
          {/* Middle Panel: Code Editor + Bottom Console */}
          <Panel defaultSize={45} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Editor */}
              <Panel defaultSize={60} minSize={40}>
                <div className="h-full bg-white dark:bg-slate-950 flex flex-col">
                  <CodeEditorPanel 
                    userCode={props.userCode}
                    setUserCode={props.setUserCode}
                    selectedLang={props.selectedLang}
                    setSelectedLang={props.setSelectedLang}
                    handleRunCode={props.handleRunCode}
                    handleSubmitCode={props.handleSubmitCode}
                    submittingCode={props.submittingCode}
                  />
                </div>
              </Panel>
              
              <PanelResizeHandle className="h-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-blue-600/30 transition-all cursor-row-resize" />
              
              {/* Console */}
              <Panel defaultSize={40} minSize={20}>
                <div className="h-full bg-slate-950 p-4 overflow-y-auto border-t border-slate-800">
                  <OutputConsolePanel 
                    result={props.compilationResult}
                    activeTab={activeConsoleTab}
                    setActiveTab={setActiveConsoleTab}
                    challenge={props.challenge}
                  />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {/* Right Panel: AI Assistant */}
          {aiPanelOpen && (
            <>
              <PanelResizeHandle className="w-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-blue-600/30 transition-all cursor-col-resize" />
              <Panel defaultSize={20} minSize={15}>
                <div className="h-full bg-slate-55/20 dark:bg-slate-900/20 p-5 overflow-y-auto border-l border-slate-200 dark:border-slate-800/80">
                  <AiAssistantPanel 
                    challenge={props.challenge}
                    userCode={props.userCode}
                    codingHintMode={props.codingHintMode}
                    setCodingHintMode={props.setCodingHintMode}
                    revealCodingHint1={props.revealCodingHint1}
                    setRevealCodingHint1={props.setRevealCodingHint1}
                    revealCodingHint2={props.revealCodingHint2}
                    setRevealCodingHint2={props.setRevealCodingHint2}
                  />
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
