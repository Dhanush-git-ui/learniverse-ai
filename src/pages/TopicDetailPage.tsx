import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Code, Award, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationBox from '@/components/ConversationBox';
import { getTopicBySlug } from '@/services/TopicService';
import { useToast } from "@/hooks/use-toast";
import CodingWorkspace from '@/components/coding/CodingWork';
import { runAndEvaluate } from '@/services/codeExecutionService';

export const LEETCODE_MAP: Record<string, { id: number; url: string }> = {
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

// Interface for tracking user answers and performance
interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  attemptedAt: Date;
  hintsUsed: number;
}

const TopicDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Declare all Hooks at the very top level
  const [activeTab, setActiveTab] = useState<'overview' | 'socratic' | 'mcq' | 'coding'>('overview');
  const [_overviewMarkdown, _setOverviewMarkdown] = useState('');
  const [topicData, setTopicData] = useState<any>(null);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [codingChallenges, setCodingChallenges] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // MCQ challenge interactive states
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submittedMCQs, setSubmittedMCQs] = useState<{ [key: string]: boolean }>({});
  const [mcqHintMode, setMcqHintMode] = useState<{ [key: string]: 'teacher' | 'peer' }>({});
  const [mcqRevealHint, setMcqRevealHint] = useState<{ [key: string]: boolean }>({});
  const [mcqScore, setMcqScore] = useState(0);

  // Coding problem states
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0); // 0 = Easy, 1 = Medium
  const [selectedLang, setSelectedLang] = useState('cpp');
  const [userCode, setUserCode] = useState('');
  const [compilationResult, setCompilationResult] = useState<any>(null);
  const [submittingCode, setSubmittingCode] = useState(false);
  const [codingHintMode, setCodingHintMode] = useState<'teacher' | 'peer'>('teacher');
  const [revealCodingHint1, setRevealCodingHint1] = useState(false);
  const [revealCodingHint2, setRevealCodingHint2] = useState(false);
  const [_revealOptimalSolutions, setRevealOptimalSolutions] = useState(false);

  // Existing Socratic practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [_showFeedback, setShowFeedback] = useState(false);
  const [_feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [hintsUsedForCurrentQuestion, setHintsUsedForCurrentQuestion] = useState(0);
  const [sessionProgress, setSessionProgress] = useState({
    totalCorrect: 0,
    totalAttempted: 0,
    averageTime: 0
  });

  const topic = getTopicBySlug(slug || '');

  const normalize = (s: string | undefined | null) => {
    if (!s) return '';
    return s.toString().trim().replace(/\s+/g, ' ').toLowerCase();
  }
  // Effect to load data from backend preloaded endpoints
  useEffect(() => {
    if (topic) {
      setLoadingContent(true);
      fetch(`/api/topic/all-content?topic=${encodeURIComponent(topic.title)}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setTopicData(data);
          setMcqs(data.mcqs || []);
          setCodingChallenges(data.coding_problems || []);
          setLoadingContent(false);
        })
        .catch(err => {
          console.error("Error loading preloaded content:", err);
          setTopicData(null);
          setLoadingContent(false);
        });
    }
  }, [slug, topic?.title]);

  // Helper to dynamically extract parameter names from the first example input
  const getParamsFromExample = (inputStr: string): string[] => {
    if (!inputStr) return ['nums'];
    const matches = Array.from(inputStr.matchAll(/(\w+)\s*=/g));
    if (matches.length > 0) {
      return matches.map(m => m[1]);
    }
    // Fallback if it is a raw array/value
    return ['nums'];
  };

  // Sync templates on language/problem switch
  useEffect(() => {
    if (codingChallenges.length > 0) {
      let currentIdx = selectedProblemIdx;
      if (currentIdx >= codingChallenges.length) {
        currentIdx = 0;
        setSelectedProblemIdx(0);
      }
      const p = codingChallenges[currentIdx];
      if (!p) return;

      setRevealCodingHint1(false);
      setRevealCodingHint2(false);
      setRevealOptimalSolutions(false);
      setCompilationResult(null);

      // Extract dynamic parameter names (e.g., nums, target)
      const params = getParamsFromExample(p.examples[0]?.input || '');
      const paramStr = params.join(', ');

      if (selectedLang === 'python') {
        setUserCode(`# Solution for ${p.title}\ndef solve(${paramStr}):\n    # Write your solution here\n    pass`);
      } else if (selectedLang === 'cpp') {
        const cppParams = params.map(param => {
          if (param.toLowerCase().includes('target') || param === 'k' || param === 'val') return `int ${param}`;
          if (param.toLowerCase().includes('head')) return `ListNode* ${param}`;
          return `vector<int>& ${param}`;
        }).join(', ');
        const cppReturnType = p.title.toLowerCase().includes('cycle') ? 'bool' : p.title.toLowerCase().includes('sum') ? 'int' : 'vector<int>';
        setUserCode(`// Solution for ${p.title}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n${cppReturnType} solve(${cppParams}) {\n    // Write your solution here\n    return ${params[0] || 'nums'};\n}`);
      } else if (selectedLang === 'java') {
        const javaParams = params.map(param => {
          if (param.toLowerCase().includes('target') || param === 'k' || param === 'val') return `int ${param}`;
          if (param.toLowerCase().includes('head')) return `ListNode ${param}`;
          return `int[] ${param}`;
        }).join(', ');
        const javaReturnType = p.title.toLowerCase().includes('cycle') ? 'boolean' : p.title.toLowerCase().includes('sum') ? 'int' : 'int[]';
        setUserCode(`// Solution for ${p.title}\nimport java.util.*;\nclass Solution {\n    public ${javaReturnType} solve(${javaParams}) {\n        // Write your solution here\n        return ${params[0] || 'nums'};\n    }\n}`);
      } else {
        setUserCode(`// Solution for ${p.title}\nfunction solve(${paramStr}) {\n    // Write your solution here\n    return ${params[0] || 'nums'};\n}`);
      }
    }
  }, [selectedProblemIdx, codingChallenges, selectedLang]);

  useEffect(() => {
    setStartTime(new Date());
    setShowFeedback(false);
    setFeedbackType(null);
    setHintsUsedForCurrentQuestion(0);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (userAnswers.length > 0) {
      const totalCorrect = userAnswers.filter((a: UserAnswer) => a.isCorrect).length;
      const totalTime = userAnswers.reduce((sum: number, a: UserAnswer) => sum + a.timeTaken, 0);

      setSessionProgress({
        totalCorrect,
        totalAttempted: userAnswers.length,
        averageTime: Math.round(totalTime / userAnswers.length)
      });
    }
  }, [userAnswers]);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Topic Not Found</h1>
        <p className="text-gray-600 dark:text-gray-350 mb-6">The topic you're looking for doesn't exist or has been moved.</p>
        <Button
          variant="default"
          onClick={() => navigate('/topics')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Browse All Topics
        </Button>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      toast({
        title: "Topic Completed!",
        description: `You've completed all questions in this topic. Correct: ${sessionProgress.totalCorrect}/${sessionProgress.totalAttempted}`,
      });
    }
  };

  const _handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const analyzeAnswer = (userAnswer: string): boolean => {
    const solution = currentQuestion.solution.toLowerCase();
    const answer = userAnswer.toLowerCase();

    const solutionKeywords = solution.split(/[\s,.;:!?()[\]{}'"]+/).filter(word => word.length > 3);
    const answerKeywords = answer.split(/[\s,.;:!?()[\]{}'"]+/).filter(word => word.length > 3);

    let matchCount = 0;
    for (const keyword of solutionKeywords) {
      if (answerKeywords.includes(keyword)) matchCount++;
    }

    const accuracy = solutionKeywords.length > 0 ? matchCount / solutionKeywords.length : 0;
    return accuracy > 0.4;
  };

  const _handleSubmitAnswer = (answer: string) => {
    const endTime = new Date();
    const timeTaken = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    const isCorrect = analyzeAnswer(answer);

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeTaken,
      attemptedAt: new Date(),
      hintsUsed: hintsUsedForCurrentQuestion
    };

    setUserAnswers(prev => [...prev, userAnswer]);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);

    if (!completedQuestions.includes(currentQuestionIndex + 1)) {
      setCompletedQuestions(prev => [...prev, currentQuestionIndex + 1]);
    }

    toast({
      title: isCorrect ? "Correct!" : "Not quite right",
      description: isCorrect ? "Great job! Your answer is correct." : "Review the feedback to improve your answer.",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const _handleRequestHint = () => {
    setHintsUsedForCurrentQuestion(prev => prev + 1);
  };

  // Run code via Piston (quick run — first example input only)
  const handleRunCode = async () => {
    setCompilationResult(null);
    const challenge = codingChallenges[selectedProblemIdx];
    if (!challenge) return;
    try {
      const result = await runAndEvaluate(userCode, selectedLang, challenge.examples ?? []);
      setCompilationResult(result);
    } catch (err: any) {
      toast({
        title: 'Run Error',
        description: err?.message ?? 'Piston execution failed.',
        variant: 'destructive',
      });
    }
  };

  // Submit code via Piston (evaluates against all example test cases)
  const handleSubmitCode = async () => {
    setSubmittingCode(true);
    setCompilationResult(null);
    const challenge = codingChallenges[selectedProblemIdx];
    if (!challenge) { setSubmittingCode(false); return; }
    try {
      const result = await runAndEvaluate(userCode, selectedLang, challenge.examples ?? []);
      setCompilationResult(result);
      const allPassed = result.passed_cases !== undefined && result.passed_cases === result.total_cases;
      toast({
        title: allPassed ? '✅ All Tests Passed!' : '❌ Some Tests Failed',
        description: result.passed_cases !== undefined
          ? `${result.passed_cases} / ${result.total_cases} test cases passed in ${result.runtime}`
          : 'Check the output console for details.',
        variant: allPassed ? 'default' : 'destructive',
      });
    } catch (err: any) {
      toast({
        title: 'Submit Error',
        description: err?.message ?? 'Piston submission failed.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingCode(false);
    }
  };

  const isCodingTab = activeTab === 'coding';

  return (
    <div className={`bg-[#f8fafc] dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${
      isCodingTab ? 'h-screen flex flex-col overflow-hidden' : 'min-h-screen'
    }`}>
      <Navbar />
      <main className={`transition-all duration-300 ${isCodingTab ? 'pt-16 pb-0 flex-1 flex flex-col min-h-0 overflow-hidden' : 'pt-24 pb-16'}`}>
        <div className={`mx-auto h-full ${isCodingTab ? 'w-full max-w-full px-6 flex-1 flex flex-col min-h-0 overflow-hidden' : 'container px-4 sm:px-6 lg:px-8'}`}>

          {/* Hide Back button on Coding tab */}
          {!isCodingTab && (
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-gray-650 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={() => navigate('/topics')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Topics
              </Button>
            </div>
          )}

          {/* Hide Header card on Coding tab */}
          {!isCodingTab && (
            <header className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mr-4 bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">{topic.category}</span>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{topic.title}</h1>
                </div>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-350 max-w-4xl">{topic.description}</p>
            </header>
          )}

          {/* Navigation Tabs bar */}
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-800 overflow-x-auto flex-none ${
            isCodingTab ? 'mb-4 pb-2' : 'mb-8'
          }`}>
            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center space-x-2 pb-4 px-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
              >
                <Book className="w-4 h-4" />
                <span>1. Quick Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('socratic')}
                className={`flex items-center space-x-2 pb-4 px-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'socratic'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>2. Socratic Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('mcq')}
                className={`flex items-center space-x-2 pb-4 px-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'mcq'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                <Award className="w-4 h-4" />
                <span>3. MCQ Challenge</span>
              </button>
              <button
                onClick={() => setActiveTab('coding')}
                className={`flex items-center space-x-2 pb-4 px-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'coding'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                <Code className="w-4 h-4" />
                <span>4. Coding Challenge</span>
              </button>
            </div>

            {isCodingTab && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-650 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-2 md:mb-0 md:mr-2 self-start md:self-auto"
                onClick={() => navigate('/topics')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Topics
              </Button>
            )}
          </div>

          {loadingContent ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading Preloaded content...</p>
            </div>
          ) : (
            <div className={isCodingTab ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : ''}>
              {/* Tab 1: Quick Overview */}
              {activeTab === 'overview' && topicData && topicData.overview && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

                  {/* 60s Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 border p-6 rounded-xl shadow-sm">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">Quick Summary (60s Read)</h3>
                      <ul className="space-y-2.5 text-sm leading-relaxed">
                        <li><strong>What is it?</strong> {topicData.overview.what_is_it}</li>
                        <li><strong>Why does it matter?</strong> {topicData.overview.why_it_matters}</li>
                        <li><strong>Core Idea:</strong> {topicData.overview.core_idea}</li>
                        <li className="flex items-center space-x-4">
                          <span><strong>Time:</strong> <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-xs">{topicData.overview.time_complexity}</code></span>
                          <span><strong>Space:</strong> <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-xs">{topicData.overview.space_complexity}</code></span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">When to Use</h4>
                      <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                        {topicData.overview.when_to_use.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                      </ul>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-red-400">Common Mistakes</h4>
                      <ul className="list-disc pl-5 text-xs text-red-600/80 dark:text-red-400/80 space-y-1">
                        {topicData.overview.common_mistakes.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Pseudocode Container */}
                  <div className="bg-white dark:bg-gray-900 border p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-purple-650">Pseudocode</h3>
                    <pre className="p-4 bg-slate-950 text-emerald-400 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">{topicData.pseudocode}</pre>
                  </div>

                  {/* Real World Usage */}
                  <div className="bg-white dark:bg-gray-900 border p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold">Real World Usage</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {topicData.real_world_usage.slice(0, 5).map((item: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg border">
                          <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">{item.use_case}</h4>
                          <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Recognition Guide */}
                  <div className="bg-white dark:bg-gray-900 border p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold">Interview Recognition Guide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border space-y-2">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Keywords</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {topicData.recognition_guide.keywords.map((kw: string) => <span key={kw} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">{kw}</span>)}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border space-y-2">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Patterns</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {topicData.recognition_guide.patterns.map((pt: string, i: number) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-905/40 dark:bg-slate-950/40 rounded-lg border space-y-2">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Constraints</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {topicData.recognition_guide.constraints.map((cn: string, i: number) => <li key={i}>{cn}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Socratic Chat */}
              {activeTab === 'socratic' && (
                <div className="w-full h-[650px] border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
                  <ConversationBox
                    key={topic.id || topic.title}
                    sessionTitle={`${topic.title} - Socratic AI Tutors`}
                    topic={topic}
                  />
                </div>
              )}

              {/* Tab 3: MCQ Challenge */}
              {activeTab === 'mcq' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-5 rounded-xl border flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300">Socratic MCQ Challenge (15 Questions)</span>
                    </div>
                    <span className="font-bold text-blue-600">Score: {mcqScore} / {mcqs.length}</span>
                  </div>

                  {mcqs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">Failed to load MCQs. Try again.</div>
                  ) : (
                    mcqs.map((q, idx) => {
                      const isSubmitted = submittedMCQs[q.id];
                      const mode = mcqHintMode[q.id] || 'teacher';

                      return (
                        <div key={q.id || idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm space-y-4">
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{idx + 1}. {q.question}</h4>

                          <div className="flex items-center space-x-2 text-xs">
                            <span>Socratic Mode:</span>
                            <button
                              onClick={() => setMcqHintMode(p => ({ ...p, [q.id]: 'teacher' }))}
                              className={`px-3 py-1 rounded-full border ${mode === 'teacher' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
                            >
                              Teacher Mode
                            </button>
                            <button
                              onClick={() => setMcqHintMode(p => ({ ...p, [q.id]: 'peer' }))}
                              className={`px-3 py-1 rounded-full border ${mode === 'peer' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}
                            >
                              Peer Mode
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {q.options.map((option: string) => {
                              const isSelected = selectedAnswers[q.id] === option;
                              const isCorrectOption = normalize(option) === normalize(q.answer);

                              let optionStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40';
                              if (isSelected) {
                                optionStyle = 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400';
                              }
                              if (isSubmitted) {
                                if (isCorrectOption) {
                                  optionStyle = 'border-green-500 bg-green-50/40 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-semibold';
                                } else if (isSelected) {
                                  optionStyle = 'border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-700 dark:text-red-400';
                                } else {
                                  optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={option}
                                  disabled={isSubmitted}
                                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: option }))}
                                  className={`p-3.5 rounded-lg text-left border text-sm transition-all ${optionStyle}`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex space-x-3">
                            {!isSubmitted && (
                              <>
                                <Button
                                  onClick={() => {
                                    setSubmittedMCQs(prev => ({ ...prev, [q.id]: true }));
                                    if (normalize(selectedAnswers[q.id]) === normalize(q.answer)) setMcqScore(s => s + 1);
                                  }}
                                  disabled={!selectedAnswers[q.id]}
                                  className="bg-blue-600 text-white"
                                >
                                  Submit Answer
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setMcqRevealHint(p => ({ ...p, [q.id]: !p[q.id] }))}
                                >
                                  {mcqRevealHint[q.id] ? 'Hide Hint' : 'Request Hint'}
                                </Button>
                              </>
                            )}
                          </div>

                          {mcqRevealHint[q.id] && !isSubmitted && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900 dark:bg-amber-955 dark:bg-amber-950/20 border rounded-lg text-xs">
                              <strong>{mode === 'teacher' ? '👨‍🏫 Teacher Hint:' : '💡 Buddy Hint:'}</strong>{' '}
                              {mode === 'teacher' ? q.hint_teacher : q.hint_peer}
                            </div>
                          )}

                          {isSubmitted && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-lg text-xs space-y-2">
                              <span className={`font-bold block ${normalize(selectedAnswers[q.id]) === normalize(q.answer) ? 'text-green-600' : 'text-red-650'}`}>
                                {normalize(selectedAnswers[q.id]) === normalize(q.answer) ? 'Correct!' : `Incorrect (Correct Answer: ${q.answer})`}
                              </span>
                              <p><strong>{mode === 'teacher' ? 'Teacher Explanation:' : 'Peer Analogy:'}</strong></p>
                              <p className="text-slate-605">{mode === 'teacher' ? q.explanation_teacher : q.explanation_peer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {/* Tab 4: Coding Challenges */}
              {activeTab === 'coding' && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-4 animate-fade-in pb-4">
                  {/* Problem Selection Selector */}
                  <div className="flex border-b border-slate-800 space-x-6 flex-none">
                    {codingChallenges.map((challenge, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedProblemIdx(idx)}
                        className={`pb-3 text-sm font-bold transition-all relative ${
                          selectedProblemIdx === idx 
                            ? 'text-blue-400 font-semibold' 
                            : 'text-slate-500 hover:text-slate-350'
                        }`}
                      >
                        {challenge.title}
                        {selectedProblemIdx === idx && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Redesigned Workspace taking remaining height */}
                  <div className="flex-1 min-h-0">
                    {codingChallenges.length > 0 && (
                      <CodingWorkspace
                        challenge={codingChallenges[selectedProblemIdx]}
                        selectedLang={selectedLang}
                        setSelectedLang={setSelectedLang}
                        userCode={userCode}
                        setUserCode={setUserCode}
                        compilationResult={compilationResult}
                        submittingCode={submittingCode}
                        handleRunCode={handleRunCode}
                        handleSubmitCode={handleSubmitCode}
                        codingHintMode={codingHintMode}
                        setCodingHintMode={setCodingHintMode}
                        revealCodingHint1={revealCodingHint1}
                        setRevealCodingHint1={setRevealCodingHint1}
                        revealCodingHint2={revealCodingHint2}
                        setRevealCodingHint2={setRevealCodingHint2}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {!isCodingTab && <Footer />}
    </div>
  );
};

export default TopicDetailPage;
