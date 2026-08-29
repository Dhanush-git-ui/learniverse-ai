import { useState, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { 
  BookOpen, 
  Lightbulb, 
  Play, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Code,
  Sparkles,
  Info,
  RotateCcw,
  Copy,
  Check,
  Folder,
  FolderOpen,
  Award,
  Unlock,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useToast } from "@/hooks/use-toast";
import { TOP_100_QUESTIONS, Top100Question } from '@/data/top100Data';
import { runAndEvaluate } from '@/services/codeExecutionService';
import AlgorithmStepPanel from '@/components/coding/AlgorithmStepPanel';

export default function Top100Codes() {
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Top100Question>(TOP_100_QUESTIONS[0]);
  const [selectedLang, setSelectedLang] = useState<string>('python');
  
  // Track user code edits per question per language
  const [userCodes, setUserCodes] = useState<Record<string, Record<string, string>>>({});
  
  // UI Panels / tabs
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'hints' | 'solution'>('description');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Working with Numbers": false,
    "Arrays": false,
    "Matrix": false,
    "Pattern Printing": false
  });
  
  // Hint reveal states
  const [revealHint1, setRevealHint1] = useState(false);
  const [revealHint2, setRevealHint2] = useState(false);
  
  // Execution states
  const [compilationResult, setCompilationResult] = useState<any>(null);
  const [runningCode, setRunningCode] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcases' | 'output'>('testcases');
  const [copied, setCopied] = useState(false);

  // Algorithm states
  const [algorithmText, setAlgorithmText] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');

  // Categories list
  const categories = ["Getting Started", "Working with Numbers", "Arrays", "Matrix", "Pattern Printing"];

  // Toggle categories
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Reset states when selected question changes
  useEffect(() => {
    setRevealHint1(false);
    setRevealHint2(false);
    setCompilationResult(null);
    setActiveConsoleTab('testcases');
    setActiveLeftTab('description');
  }, [selectedQuestion]);

  // Load code from state or default to boilerplate template
  const currentCode = userCodes[selectedQuestion.id]?.[selectedLang] ?? selectedQuestion.boilerplate[selectedLang as keyof typeof selectedQuestion.boilerplate];

  const handleCodeChange = (val: string | undefined) => {
    if (val === undefined) return;
    setUserCodes(prev => ({
      ...prev,
      [selectedQuestion.id]: {
        ...(prev[selectedQuestion.id] || {}),
        [selectedLang]: val
      }
    }));
  };

  // Reset current question's code to default template
  const handleResetCode = () => {
    const template = selectedQuestion.boilerplate[selectedLang as keyof typeof selectedQuestion.boilerplate];
    setUserCodes(prev => ({
      ...prev,
      [selectedQuestion.id]: {
        ...(prev[selectedQuestion.id] || {}),
        [selectedLang]: template
      }
    }));
    toast({
      title: "Code Reset",
      description: "Restored default solution template.",
    });
  };

  // Trigger compiler runner
  const handleRunCode = async () => {
    setRunningCode(true);
    setCompilationResult(null);
    setActiveConsoleTab('output');
    
    try {
      const testCases = selectedQuestion.examples.map(ex => ({
        input: ex.input,
        output: ex.output
      }));

      const result = await runAndEvaluate(currentCode, selectedLang, testCases);
      setCompilationResult(result);
      
      const allPassed = result.passed_cases !== undefined && result.passed_cases === result.total_cases;
      toast({
        title: allPassed ? '🎉 All Test Cases Passed!' : '❌ Some Test Cases Failed',
        description: result.passed_cases !== undefined
          ? `${result.passed_cases} / ${result.total_cases} passed successfully.`
          : 'Check logs for compile/execution details.',
        variant: allPassed ? 'default' : 'destructive',
      });
    } catch (err: any) {
      toast({
        title: 'Execution Failed',
        description: err?.message ?? 'Compilation engine failed.',
        variant: 'destructive',
      });
    } finally {
      setRunningCode(false);
    }
  };

  const handleCopySolution = () => {
    const codeText = selectedQuestion.solution[selectedLang as keyof typeof selectedQuestion.solution] ?? '';
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Optimal solution code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered questions based on search input
  const filteredQuestions = TOP_100_QUESTIONS.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.statement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-white text-slate-800 overflow-hidden font-sans select-none">
      <Navbar />
      
      {/* Spacer below Navbar */}
      <div className="h-16 flex-none" />

      {/* Main Workspace Dashboard */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <PanelGroup direction="horizontal">
          
          {/* Panel 1: Sidebar List of 100 Questions */}
          <Panel defaultSize={22} minSize={18} maxSize={32}>
            <div className="h-full flex flex-col border-r border-slate-200 bg-slate-50">
              
              {/* Premium Branding Header */}
              <div className="p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Top 100 Coding Interview Questions</span>
                  </div>
                </div>
                
                {/* Custom Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search challenges by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-slate-700 transition-colors focus:ring-1 focus:ring-emerald-400/30"
                  />
                </div>
              </div>
              
              {/* Scrollable folder-like Categories */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                {categories.map(cat => {
                  const catQuestions = filteredQuestions.filter(q => q.category === cat);
                  if (catQuestions.length === 0) return null;
                  const isExpanded = expandedCategories[cat];
                  
                  return (
                    <div key={cat} className="space-y-1.5 bg-white rounded-xl p-1 border border-slate-200">
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center space-x-2">
                          {isExpanded ? (
                            <FolderOpen className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Folder className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="font-bold text-xs uppercase tracking-wider text-slate-700">{cat}</span>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono font-bold">
                          {catQuestions.length}
                        </span>
                      </button>
                      
                      {isExpanded && (
                        <div className="pl-1.5 space-y-1 pr-1 animate-fade-in max-h-[350px] overflow-y-auto custom-scrollbar">
                          {catQuestions.map(q => {
                            const isSelected = selectedQuestion.id === q.id;
                            
                            return (
                              <button
                                key={q.id}
                                onClick={() => setSelectedQuestion(q)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg text-sm transition-all relative ${
                                  isSelected 
                                    ? 'bg-emerald-50 border-l-2 border-emerald-500 text-emerald-700 font-semibold shadow-sm shadow-emerald-100' 
                                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <span className="font-mono text-xs text-slate-400 w-5">{q.id}.</span>
                                <span className="truncate flex-1 text-sm">{q.title}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                                  q.difficulty === 'Easy' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : q.difficulty === 'Medium' 
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {q.difficulty[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
          
          {/* Custom Resize Grip */}
          <PanelResizeHandle className="w-1.5 bg-slate-100 border-x border-slate-200 hover:bg-emerald-200 transition-colors cursor-col-resize flex items-center justify-center">
            <div className="h-4 w-0.5 bg-slate-300 rounded" />
          </PanelResizeHandle>
          
          {/* Panel 2: Problem Description / Hints / Solutions */}
          <Panel defaultSize={36} minSize={25}>
            <div className="h-full flex flex-col bg-white border-r border-slate-200">
              
              {/* Premium Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-white text-sm px-2 flex-none justify-between items-center pr-4">
                <div className="flex">
                  <button
                    onClick={() => setActiveLeftTab('description')}
                    className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-bold transition-all ${
                      activeLeftTab === 'description' 
                        ? 'border-emerald-500 text-emerald-700 bg-emerald-50' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Problem</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveLeftTab('hints')}
                    className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-bold transition-all ${
                      activeLeftTab === 'hints' 
                        ? 'border-amber-500 text-amber-700 bg-amber-50' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Double Hints</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveLeftTab('solution')}
                    className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-bold transition-all ${
                      activeLeftTab === 'solution' 
                        ? 'border-sky-500 text-sky-700 bg-sky-50' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-sky-500" />
                    <span>Optimal Solution</span>
                  </button>
                </div>
                
                {activeLeftTab === 'solution' && (
                  <button
                    onClick={handleCopySolution}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-slate-500 hover:text-slate-900 transition-colors"
                    title="Copy Solution Code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              
              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
                {activeLeftTab === 'description' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {selectedQuestion.category}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${
                          selectedQuestion.difficulty === 'Easy' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : selectedQuestion.difficulty === 'Medium' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {selectedQuestion.difficulty}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                        {selectedQuestion.id}. {selectedQuestion.title}
                      </h2>
                    </div>

                    <AlgorithmStepPanel
                      algorithmText={algorithmText}
                      setAlgorithmText={setAlgorithmText}
                      timeComplexity={timeComplexity}
                      setTimeComplexity={setTimeComplexity}
                      spaceComplexity={spaceComplexity}
                      setSpaceComplexity={setSpaceComplexity}
                    />

                    {/* Problem Statement Card */}
                    <div className="text-slate-700 text-base leading-relaxed whitespace-pre-line bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      {selectedQuestion.statement}
                    </div>
                    
                    {/* Input / Output Format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs block mb-1">Input Format</span>
                        <span className="font-mono text-sm text-slate-700">{selectedQuestion.inputFormat}</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs block mb-1">Output Format</span>
                        <span className="font-mono text-sm text-slate-700">{selectedQuestion.outputFormat}</span>
                      </div>
                    </div>
                    
                    {/* Examples Section */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Examples & Test Cases</h4>
                      <div className="space-y-3">
                        {selectedQuestion.examples.map((ex, idx) => (
                          <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-sm font-mono">
                            <div className="flex">
                              <span className="text-slate-400 w-16 select-none">Input:</span>
                              <span className="text-slate-700">{ex.input}</span>
                            </div>
                            <div className="flex">
                              <span className="text-slate-400 w-16 select-none">Output:</span>
                              <span className="text-emerald-600 font-bold">{ex.output}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeLeftTab === 'hints' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-200">
                        <Lightbulb className="w-4.5 h-4.5 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">Step-by-Step Hints</h3>
                    </div>
                    <p className="text-sm text-slate-500">If you are stuck, unlock the logical roadmap sequentially. Try to formulate a solution with Hint 1 first!</p>
                    
                    {/* Hint 1 Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Unlock className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-sm text-slate-800">💡 Hint 1: Logical Foundation</span>
                        </div>
                        {!revealHint1 && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-[11px]"
                            onClick={() => setRevealHint1(true)}
                          >
                            Reveal Hint 1
                          </Button>
                        )}
                      </div>
                      {revealHint1 && (
                        <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-4">
                          {selectedQuestion.hint1}
                        </p>
                      )}
                    </div>
                    
                    {/* Hint 2 Card */}
                    <div className={`bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm transition-all ${!revealHint1 ? 'opacity-40' : 'opacity-100'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {revealHint2 ? <Unlock className="w-4 h-4 text-amber-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                          <span className="font-bold text-sm text-slate-800">💡 Hint 2: Implementation Details</span>
                        </div>
                        {revealHint1 && !revealHint2 && (
                          <Button 
                            size="sm" 
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 text-[11px]"
                            onClick={() => setRevealHint2(true)}
                          >
                            Reveal Hint 2
                          </Button>
                        )}
                        {!revealHint1 && (
                          <span className="text-[10px] text-slate-400 italic font-medium">Unlock Hint 1 First</span>
                        )}
                      </div>
                      {revealHint2 && (
                        <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-4">
                          {selectedQuestion.hint2}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {activeLeftTab === 'solution' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-start space-x-3 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed text-amber-700">
                        <strong>Optimal Solution:</strong> Review this solution to understand space/time optimal logic and best code styling after you finish your execution attempts.
                      </span>
                    </div>
                    
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-500 capitalize">{selectedLang} Implementation</span>
                      </div>
                      <div className="p-5 overflow-x-auto max-h-[480px] custom-scrollbar bg-slate-900">
                        <pre className="font-mono text-sm text-slate-200 whitespace-pre">
                          {selectedQuestion.solution[selectedLang as keyof typeof selectedQuestion.solution] ?? '// Solution code not loaded'}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
          
          {/* Custom Resize Grip */}
          <PanelResizeHandle className="w-1.5 bg-slate-100 border-x border-slate-200 hover:bg-emerald-200 transition-colors cursor-col-resize flex items-center justify-center">
            <div className="h-4 w-0.5 bg-slate-300 rounded" />
          </PanelResizeHandle>
          
          {/* Panel 3: Code Editor & Console Drawer */}
          <Panel defaultSize={42} minSize={30}>
            <PanelGroup direction="vertical">
              
              {/* Monaco Code Editor Workspace */}
              <Panel defaultSize={65} minSize={40}>
                <div className="h-full flex flex-col bg-white">
                  
                  {/* Editor Header Tools */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 flex-none text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center border border-emerald-200">
                        <Code className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      
                      {/* Language Selection */}
                      <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg py-1 px-3 focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer font-medium hover:bg-slate-50 transition-colors text-sm"
                      >
                        <option value="python">Python 3</option>
                        <option value="cpp">C++ (GCC)</option>
                        <option value="java">Java (OpenJDK)</option>
                        <option value="javascript">JavaScript (NodeJS)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleResetCode}
                        className="text-slate-500 hover:text-slate-900 text-xs flex items-center space-x-1.5 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={handleRunCode}
                        disabled={runningCode}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-4 py-1.5 flex items-center space-x-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-500/10 text-xs rounded-lg hover:shadow-lg hover:shadow-emerald-500/15"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{runningCode ? 'Running...' : 'Run Code'}</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Monaco Editor Canvas */}
                  <div className="flex-1 min-h-0">
                    <Editor
                      height="100%"
                      language={selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : selectedLang === 'javascript' ? 'javascript' : 'python'}
                      theme="vs-light"
                      value={currentCode}
                      onChange={handleCodeChange}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        scrollbar: { vertical: 'visible', horizontal: 'visible' },
                        scrollBeyondLastLine: false,
                        padding: { top: 12 }
                      }}
                    />
                  </div>
                </div>
              </Panel>
              
              {/* Custom Resize Grip */}
              <PanelResizeHandle className="h-1.5 bg-slate-100 border-y border-slate-200 hover:bg-emerald-200 transition-colors cursor-row-resize flex items-center justify-center">
                <div className="w-8 h-0.5 bg-slate-300 rounded" />
              </PanelResizeHandle>
              
              {/* Bottom: Console Panel */}
              <Panel defaultSize={35} minSize={20}>
                <div className="h-full flex flex-col bg-white overflow-hidden border-t border-slate-200">
                  
                  {/* Console Tabs */}
                  <div className="flex border-b border-slate-200 bg-white px-3 flex-none justify-between items-center pr-4">
                    <div className="flex text-xs">
                      <button
                        onClick={() => setActiveConsoleTab('testcases')}
                        className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 font-bold transition-all ${
                          activeConsoleTab === 'testcases' 
                            ? 'border-emerald-500 text-emerald-700' 
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Test Cases</span>
                      </button>
                      
                      <button
                        onClick={() => setActiveConsoleTab('output')}
                        className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 font-bold transition-all ${
                          activeConsoleTab === 'output' 
                            ? 'border-emerald-500 text-emerald-700' 
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>Execution Results</span>
                        {compilationResult && (
                          <span className={`w-2 h-2 rounded-full ${
                            compilationResult.passed_cases === compilationResult.total_cases ? 'bg-green-500 animate-ping' : 'bg-red-500'
                          }`} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Console body content */}
                  <div className="flex-1 overflow-y-auto p-5 font-mono text-sm custom-scrollbar bg-slate-50">
                    {activeConsoleTab === 'testcases' ? (
                      <div className="space-y-4">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider select-none">Example parameters for validation:</div>
                        {selectedQuestion.examples.map((ex, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                            <span className="text-slate-600 font-bold block text-sm">Case {idx + 1}:</span>
                            <div className="text-slate-600 text-sm">Input: <code className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">{ex.input}</code></div>
                            <div className="text-slate-600 text-sm">Expected Output: <code className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{ex.output}</code></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {runningCode && (
                          <div className="flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-semibold animate-pulse text-emerald-600">Submitting to Judge0 Compiler Engine...</span>
                          </div>
                        )}
                        
                        {!runningCode && !compilationResult && (
                          <div className="text-slate-400 text-center py-12 select-none">Run your code above to view the test case execution details.</div>
                        )}
                        
                        {!runningCode && compilationResult && (
                          <div className="space-y-5">
                            
                            {/* Summary Card */}
                            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                              <div>
                                <span className="font-bold text-sm text-slate-800">
                                  Execution Status: {compilationResult.passed_cases !== undefined 
                                    ? `${compilationResult.passed_cases} / ${compilationResult.total_cases} Passed` 
                                    : 'Finished'}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5">Tested using Judge0 Engine fallback logic</div>
                              </div>
                              <span className="text-slate-500 text-sm font-mono font-medium">Time: {compilationResult.runtime ?? 'N/A'}</span>
                            </div>
                            
                            {/* Victory Card */}
                            {compilationResult.passed_cases === compilationResult.total_cases && (
                              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3.5 animate-bounce-subtle">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                                  <Award className="w-5.5 h-5.5 text-emerald-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider">Perfect Evaluation!</h4>
                                  <p className="text-[11px] text-slate-600 mt-0.5">All examples match the optimal return solution format successfully.</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Compile & Runtime Errors */}
                            {compilationResult.error && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <XCircle className="w-4.5 h-4.5 text-red-600" />
                                  <span className="font-bold text-xs">Compilation or Runtime Exception:</span>
                                </div>
                                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-red-700 bg-red-100/60 p-3 rounded-lg border border-red-200">{compilationResult.error}</pre>
                              </div>
                            )}
                            
                            {/* stdout Output Logs */}
                            {compilationResult.stdout && (
                              <div className="space-y-2">
                                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Standard Console Output (stdout):</div>
                                <pre className="p-4 bg-slate-900 rounded-xl border border-slate-200 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">{compilationResult.stdout}</pre>
                              </div>
                            )}

                            {/* Detailed List of Test Cases */}
                            {compilationResult.results && compilationResult.results.length > 0 && (
                              <div className="space-y-3">
                                <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">Individual Case Evaluation:</div>
                                {compilationResult.results.map((c: any, idx: number) => (
                                  <div key={idx} className={`p-4 rounded-xl border transition-all ${c.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'} space-y-2`}>
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs text-slate-800">Case {idx + 1}</span>
                                      {c.passed ? (
                                        <span className="flex items-center space-x-1.5 text-green-700 text-[10px] font-bold bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>PASSED</span>
                                        </span>
                                      ) : (
                                        <span className="flex items-center space-x-1.5 text-red-400 text-[10px] font-bold bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                                          <XCircle className="w-3.5 h-3.5" />
                                          <span>FAILED</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-300 space-y-1">
                                      <div>Input: <code className="text-amber-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">{c.input}</code></div>
                                      <div>Expected: <code className="text-emerald-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">{c.expected}</code></div>
                                      <div>Returned: <code className={`${c.passed ? 'text-green-400' : 'text-red-400'} bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800`}>{c.actual || 'None'}</code></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
