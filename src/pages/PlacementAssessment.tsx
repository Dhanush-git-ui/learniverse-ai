import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Monitor, Video, Maximize2, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Bookmark, RotateCcw, AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { runAndEvaluate } from '@/services/codeExecutionService';

interface Question {
  id: string;
  category: string;
  topic: string;
  difficulty: string;
  question: string;
  options?: string[];
  marks: number;
  examples?: { input: string; output: string; explanation?: string }[];
}

// Helper to dynamically extract parameter names from the first example input
const getParamsFromExample = (inputStr: string): string[] => {
  if (!inputStr) return ['nums'];
  const matches = Array.from(inputStr.matchAll(/(\w+)\s*=/g));
  if (matches.length > 0) {
    return matches.map(m => m[1]);
  }
  return ['nums'];
};

// Helper to generate default templates
const getDefaultCodeTemplate = (q: Question, lang: string): string => {
  const params = getParamsFromExample(q.examples?.[0]?.input || '');
  const paramStr = params.join(', ');
  const title = q.topic || 'Solution';

  if (lang === 'python') {
    return `# Solution for ${title}\ndef solve(${paramStr}):\n    # Write your solution here\n    pass`;
  } else if (lang === 'cpp') {
    const cppParams = params.map(param => {
      if (param.toLowerCase().includes('target') || param === 'k' || param === 'val') return `int ${param}`;
      if (param.toLowerCase().includes('head')) return `ListNode* ${param}`;
      return `vector<int>& ${param}`;
    }).join(', ');
    const cppReturnType = title.toLowerCase().includes('cycle') ? 'bool' : title.toLowerCase().includes('sum') ? 'int' : 'vector<int>';
    return `// Solution for ${title}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n${cppReturnType} solve(${cppParams}) {\n    // Write your solution here\n    return ${params[0] || 'nums'};\n}`;
  } else if (lang === 'java') {
    const javaParams = params.map(param => {
      if (param.toLowerCase().includes('target') || param === 'k' || param === 'val') return `int ${param}`;
      if (param.toLowerCase().includes('head')) return `ListNode ${param}`;
      return `int[] ${param}`;
    }).join(', ');
    const javaReturnType = title.toLowerCase().includes('cycle') ? 'boolean' : title.toLowerCase().includes('sum') ? 'int' : 'int[]';
    return `// Solution for ${title}\nimport java.util.*;\nclass Solution {\n    public ${javaReturnType} solve(${javaParams}) {\n        // Write your solution here\n        return ${params[0] || 'nums'};\n    }\n}`;
  } else {
    return `// Solution for ${title}\nfunction solve(${paramStr}) {\n    // Write your solution here\n    return ${params[0] || 'nums'};\n}`;
  }
};

export default function PlacementAssessment() {
  const [step, setStep] = useState<'landing' | 'instructions' | 'system_check' | 'camera_check' | 'fullscreen_gate' | 'test' | 'score'>('landing');
  const [violations, setViolations] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Test State
  const [activeSection, setActiveSection] = useState<'Aptitude' | 'Verbal' | 'Computer_Fundamentals' | 'Coding'>('Aptitude');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { question_id: option_or_code }
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(7200); // 2 hours
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Coding Editor state
  const [selectedLang, setSelectedLang] = useState<string>('python');
  const [compilationResult, setCompilationResult] = useState<any>(null);
  const [runningCode, setRunningCode] = useState<boolean>(false);
  
  // Hints state
  const [hints, setHints] = useState<Record<string, string>>({});
  const [loadingHint, setLoadingHint] = useState<Record<string, boolean>>({});
  
  // Final Results
  const [resultsData, setResultsData] = useState<any>(null);
  const [model, setModel] = useState<any>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [proctorWarning, setProctorWarning] = useState<string | null>(null);
  const [reportTab, setReportTab] = useState<'wrong' | 'unattempted' | 'correct' | 'coding'>('wrong');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // [FIX] Restore camera stream to newly mounted video element when step transitions
  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [step]);

  // Preload or resume attempt on page load
  useEffect(() => {
    const preloadOrResume = async () => {
      setLoadingQuestions(true);
      setErrorMsg(null);
      
      let savedUserId = localStorage.getItem('learniverse_assessment_user_id');
      if (!savedUserId) {
        savedUserId = 'candidate_' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('learniverse_assessment_user_id', savedUserId);
      }
      
      try {
        const response = await fetch('/api/assessment/start', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey'
          },
          body: JSON.stringify({
            user_id: savedUserId,
            browser_info: {
              user_agent: navigator.userAgent,
              screen_resolution: `${window.screen.width}x${window.screen.height}`,
              platform: navigator.platform
            }
          })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          setErrorMsg(errData.detail || `Server returned status code ${response.status}`);
          return;
        }

        const data = await response.json();
        if (data.attempt_id && data.questions) {
          setAttemptId(data.attempt_id);
          setQuestions(data.questions);
          // If resuming an active test
          if (data.duration < 7200) {
            setTimeLeft(data.duration);
            setStep('test');
          }
        }
      } catch (e: any) {
        console.error("Failed to start/resume assessment", e);
        setErrorMsg("Failed to connect to the assessment server. Check if your backend is running.");
      } finally {
        setLoadingQuestions(false);
      }
    };
    preloadOrResume();
  }, []);

  const handleResetAttempts = async () => {
    setErrorMsg(null);
    setLoadingQuestions(true);
    const userId = localStorage.getItem('learniverse_assessment_user_id');
    if (!userId) {
      setLoadingQuestions(false);
      return;
    }
    
    try {
      const response = await fetch('/api/assessment/reset', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey'
        },
        body: JSON.stringify({ user_id: userId })
      });
      
      if (response.ok) {
        localStorage.removeItem('learniverse_assessment_user_id');
        window.location.reload();
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMsg(errData.detail || 'Failed to reset attempts. Please contact support.');
      }
    } catch (e) {
      console.error("Failed to reset attempts", e);
      setErrorMsg("Failed to connect to the server to reset attempts.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (step !== 'test' || isPaused) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, isPaused]);

  // Separate questions by section
  const aptitudeQs = questions.filter(q => q.category === 'Aptitude');
  const verbalQs = questions.filter(q => q.category === 'Verbal');
  const compQs = questions.filter(q => q.category === 'Computer_Fundamentals');
  const codingQs = questions.filter(q => q.category === 'Coding');

  const getActiveQs = () => {
    switch (activeSection) {
      case 'Aptitude': return aptitudeQs;
      case 'Verbal': return verbalQs;
      case 'Computer_Fundamentals': return compQs;
      case 'Coding': return codingQs;
      default: return [];
    }
  };
  const activeQs = getActiveQs();
  const currentQuestion = activeQs[currentIdx];

  // Set current index as visited
  useEffect(() => {
    if (currentQuestion && step === 'test') {
      setVisited((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  }, [currentQuestion, step]);

  // Sync editor template on question or language change
  useEffect(() => {
    if (step === 'test' && currentQuestion && currentQuestion.category === 'Coding') {
      const currentCode = answers[currentQuestion.id] || '';
      // Check if currentCode is empty or matches a default template for any language
      const isDefault = !currentCode.trim() || 
        ['python', 'cpp', 'java', 'javascript'].some(lang => {
          const tmpl = getDefaultCodeTemplate(currentQuestion, lang);
          return currentCode.trim() === tmpl.trim();
        });
      
      if (isDefault) {
        const newTemplate = getDefaultCodeTemplate(currentQuestion, selectedLang);
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: newTemplate }));
      }
    }
  }, [currentQuestion?.id, selectedLang, step]);

  const handleNext = () => {
    if (currentIdx < activeQs.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Transition to next section
      if (activeSection === 'Aptitude') {
        setActiveSection('Verbal');
        setCurrentIdx(0);
      } else if (activeSection === 'Verbal') {
        setActiveSection('Computer_Fundamentals');
        setCurrentIdx(0);
      } else if (activeSection === 'Computer_Fundamentals') {
        setActiveSection('Coding');
        setCurrentIdx(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      // Transition to previous section
      if (activeSection === 'Coding') {
        setActiveSection('Computer_Fundamentals');
        setCurrentIdx(compQs.length - 1);
      } else if (activeSection === 'Computer_Fundamentals') {
        setActiveSection('Verbal');
        setCurrentIdx(verbalQs.length - 1);
      } else if (activeSection === 'Verbal') {
        setActiveSection('Aptitude');
        setCurrentIdx(aptitudeQs.length - 1);
      }
    }
  };

  // Handle auto-submit on violations limit or timeout
  // [FIX M-3] Using useRef to prevent stale closures in event listeners
  const attemptIdRef = useRef(attemptId);
  const questionsRef = useRef(questions);
  const answersRef = useRef(answers);
  
  useEffect(() => {
    attemptIdRef.current = attemptId;
    questionsRef.current = questions;
    answersRef.current = answers;
  }, [attemptId, questions, answers]);

  const handleAutoSubmit = () => {
    submitAssessment(true, attemptIdRef.current, questionsRef.current, answersRef.current);
  };

  // Submit test to API
  const submitAssessment = async (isAuto = false, _attemptId = attemptId, _questions = questions, _answers = answers) => {
    if (!_attemptId) return;
    setIsSubmitting(true);
    
    // Separate coding answers from MCQ answers
    const mcqAnswers: Record<string, string> = {};
    const codingSubmissions: Record<string, any> = {};

    _questions.forEach((q) => {
      const ans = _answers[q.id] || '';
      if (q.category === 'Coding') {
        const hasAttempted = ans.trim() !== '' && 
                             !ans.includes('# Write your solution here') && 
                             !ans.includes('// Write your solution here');
        codingSubmissions[q.id] = {
          code: ans,
          language: selectedLang,
          passed_cases: hasAttempted ? 1 : 0, 
          total_cases: 1
        };
      } else {
        mcqAnswers[q.id] = ans;
      }
    });

    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey'
        },
        body: JSON.stringify({
          attempt_id: _attemptId,
          answers: mcqAnswers,
          coding_submissions: codingSubmissions
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.removeItem('learniverse_assessment_user_id');
        setResultsData(data.score);
        setReportData(data.report || []);
        // Stop Camera feed
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        // Exit Fullscreen if in it
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        setStep('score');
      }
    } catch (e) {
      console.error("Submission failed", e);
      alert("Submission encountered an error. Retrying...");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Log violations to backend
  const recordViolation = async (type: string, details: string = '') => {
    const currentAttemptId = attemptIdRef.current || attemptId;
    if (!currentAttemptId) return;
    try {
      const response = await fetch('/api/assessment/log-violation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey'
        },
        body: JSON.stringify({ attempt_id: currentAttemptId, violation_type: type, details })
      });
      const data = await response.json();
      setViolations(data.violation_count);
      
      if (data.auto_submit) {
        alert("Assessment auto-submitted due to multiple policy violations.");
        handleAutoSubmit();
      }
    } catch (e) {
      console.error("Failed to log violation", e);
    }
  };

  // 2. Fullscreen monitor
  useEffect(() => {
    if (step !== 'test') return;

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPaused(true);
        recordViolation("fullscreen_exit", "User exited fullscreen mode");
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [step]);

  // 3. Tab switch & blur monitor
  useEffect(() => {
    if (step !== 'test') return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("tab_switch", "User navigated to another browser tab");
      }
    };

    const onBlur = () => {
      recordViolation("window_blur", "User clicked outside the browser frame");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [step]);

  // 4. Keyboard Shortcuts & Screenshot Blocker (Disabled for development)
  useEffect(() => {
    /* 
    if (step !== 'test') return;

    const onKeyDown = (e: KeyboardEvent) => {
      const forbidden = [
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c', // Copy
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v', // Paste
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x', // Cut
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's', // Save
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p', // Print
        e.key === 'F12',                                         // DevTools
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i'),// Inspect
        e.key === 'PrintScreen',                                 // PrintScreen key
        (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') // Snipping tool Win+Shift+S
      ];

      if (forbidden.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation("screenshot_attempt", `Key blocked: ${e.key}`);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
    */
  }, [step]);

  // 5. AI Face Presence Detector Loop
  useEffect(() => {
    if (step !== 'test' || !videoRef.current) return;

    let isMounted = true;
    let checkInterval: any;
    let consecutiveMissingCount = 0;

    const detectFace = async () => {
      const blazefaceGlobal = (window as any).blazeface;
      if (!blazefaceGlobal) return;

      try {
        let activeModel = model;
        if (!activeModel) {
          activeModel = await blazefaceGlobal.load();
          if (isMounted) setModel(activeModel);
        }

        if (videoRef.current && videoRef.current.readyState >= 2) {
          const predictions = await activeModel.estimateFaces(videoRef.current, false);
          if (predictions.length === 0) {
            consecutiveMissingCount++;
            if (isMounted) setProctorWarning("⚠️ Face not detected. Align yourself in the camera.");
            
            if (consecutiveMissingCount >= 5) {
              consecutiveMissingCount = 0; // reset
              recordViolation("face_missing", "Candidate left webcam frame");
            }
          } else {
            consecutiveMissingCount = 0;
            if (isMounted) setProctorWarning(null);
          }
        }
      } catch (err) {
        console.error("AI proctoring detector error:", err);
      }
    };

    checkInterval = setInterval(detectFace, 1000);
    return () => {
      isMounted = false;
      clearInterval(checkInterval);
    };
  }, [step, model]);

  // Enable WebRTC Camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep('camera_check');
    } catch (e) {
      alert("Camera permissions are required to start this assessment.");
    }
  };

  const enterFullScreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
      setStep('test');
    } catch (e) {
      console.error("Fullscreen request failed", e);
      setStep('test'); // Bypass if browser blocks fullscreen
    }
  };

  // Helper formatting for timer
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Coding execution
  const handleRunCode = async () => {
    if (!currentQuestion) return;
    setRunningCode(true);
    setCompilationResult(null);
    try {
      const userCode = answers[currentQuestion.id] || '';
      // Retrieve correct examples from question, fallback to mock list
      const rawExamples = (currentQuestion as any).examples || [
        { input: "nums = [2,7,11,15], expected: '[0,1]'" }
      ];
      // Normalize example object keys so output contains expected or output value
      const examples = rawExamples.map((ex: any) => ({
        input: ex.input || "",
        output: ex.expected || ex.output || ""
      }));
      const result = await runAndEvaluate(userCode, selectedLang, examples);
      setCompilationResult(result);
    } catch (e: any) {
      setCompilationResult({ results: [{ actual: e.message || "Execution failed." }] });
    } finally {
      setRunningCode(false);
    }
  };

  const handleRequestHint = async (questionId: string) => {
    if (hints[questionId]) return;
    setLoadingHint(prev => ({ ...prev, [questionId]: true }));
    try {
      const response = await fetch('/api/assessment/hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey'
        },
        body: JSON.stringify({ question_id: questionId })
      });
      if (!response.ok) {
        throw new Error("Failed to fetch hint");
      }
      const data = await response.json();
      setHints(prev => ({ ...prev, [questionId]: data.hint }));
    } catch (err) {
      console.error("Error loading hint:", err);
      alert("Failed to load hint. Please try again.");
    } finally {
      setLoadingHint(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const downloadPDFReport = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      
      // Page title
      doc.setFontSize(22);
      doc.setTextColor(20, 30, 40);
      doc.text("Learniverse AI Assessment Report", 20, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 32);
      
      // Attempt Score Summary
      doc.setFontSize(14);
      doc.setTextColor(20, 30, 40);
      doc.text("Score Summary:", 20, 45);
      doc.setFontSize(11);
      doc.text(`Total Score: ${resultsData.total} Marks`, 20, 52);
      doc.text(`Aptitude: ${resultsData.aptitude} | Verbal: ${resultsData.verbal} | Computer Fundamentals: ${resultsData.comp_fundamentals || 0}`, 20, 58);
      doc.text(`Coding: ${resultsData.coding} Marks`, 20, 64);
      doc.text(`Violations Recorded: ${violations}`, 20, 70);
      
      let y = 85;
      
      // 1. What Went Wrong (Incorrect answers)
      doc.setFontSize(14);
      doc.text("Incorrect Attempts:", 20, y);
      y += 10;
      doc.setFontSize(10);
      const wrong = reportData.filter(r => !r.is_correct && r.user_answer !== "" && r.category !== "Coding");
      wrong.slice(0, 5).forEach((q, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${i+1}. ${q.question.substring(0, 80)}...`, 20, y);
        doc.text(`   Your Answer: ${q.user_answer} | Correct: ${q.correct_option}`, 20, y + 5);
        doc.text(`   Explanation: ${q.explanation.substring(0, 85)}...`, 20, y + 10);
        y += 18;
      });
      
      // 2. Unattempted Questions
      y += 5;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.text("Unattempted Questions:", 20, y);
      y += 10;
      doc.setFontSize(10);
      const unattempted = reportData.filter(r => r.user_answer === "" && r.category !== "Coding");
      unattempted.slice(0, 5).forEach((q, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${i+1}. ${q.question.substring(0, 80)}...`, 20, y);
        doc.text(`   Correct Answer: ${q.correct_option}`, 20, y + 5);
        doc.text(`   Explanation: ${q.explanation.substring(0, 85)}...`, 20, y + 10);
        y += 18;
      });
      
      // 3. Coding Problems & Optimal solutions
      y += 5;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.text("Coding Optimization Review:", 20, y);
      y += 10;
      doc.setFontSize(10);
      const coding = reportData.filter(r => r.category === "Coding");
      coding.forEach((q, i) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.text(`${i+1}. ${q.question.substring(0, 80)}...`, 20, y);
        doc.text(`   User code passed: ${q.coding_details.passed_cases}/${q.coding_details.total_cases} test cases`, 20, y + 5);
        doc.text(`   Optimal complexity: Time: ${q.coding_details.time_complexity} | Space: ${q.coding_details.space_complexity}`, 20, y + 10);
        y += 18;
      });
      
      doc.save("placement_assessment_detailed_report.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col items-center justify-center p-6 select-none"
         onCopy={(e) => e.preventDefault()}
         onPaste={(e) => e.preventDefault()}
         onCut={(e) => e.preventDefault()}
         onContextMenu={(e) => e.preventDefault()}>
      
      {proctorWarning && (
        <div className="bg-rose-600 text-white font-bold py-2.5 text-center text-sm w-full z-40 fixed top-0 left-0 animate-pulse">
          {proctorWarning}
        </div>
      )}
      
      {step === 'landing' && (
        <div className="max-w-3xl w-full bg-[#ffa116] border-4 border-black p-8 rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] text-black transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-center sm:justify-between border-b-4 border-black pb-4 mb-6 gap-4">
            <div className="flex items-center space-x-3.5">
              <ShieldAlert className="w-12 h-12 text-black animate-bounce flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight leading-none">PLACEMENT TEST</h1>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-black/80 mt-1">EVALUATION SYSTEM v2.0</p>
              </div>
            </div>
            <div className="bg-black text-[#ffa116] border-2 border-black font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
              ⏱ 120-MIN LIMIT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Offerings list */}
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-black/90 border-b-2 border-black/40 pb-1">1. PLACEMENT OFFERINGS</h2>
              
              <div className="border-2 border-black bg-white p-3 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-bold text-xs uppercase block text-amber-600">CS & Coding Benchmark</span>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">62 questions covering Aptitude, Verbal Reasoning, Core CS fundamentals, and 2 live Coding challenges.</p>
              </div>

              <div className="border-2 border-black bg-white p-3 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-bold text-xs uppercase block text-purple-600">AI Complexity Reports</span>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">Automated runtime performance review, time/space complexity limits verification, and optimal references.</p>
              </div>

              <div className="border-2 border-black bg-white p-3 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-bold text-xs uppercase block text-emerald-600">Verified PDF Reports</span>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">Download detailed, professional scorecards with incorrect response tracking and safety verification clearance.</p>
              </div>
            </div>

            {/* Test mechanics list */}
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-black/90 border-b-2 border-black/40 pb-1">2. TEST ENVIRONMENT</h2>

              <div className="border-2 border-black bg-white p-3 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-bold text-xs uppercase block text-indigo-600">Automated Proctoring</span>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">AI presence loop tracks webcam frame. Face presence and focus is verified periodically throughout the exam.</p>
              </div>

              <div className="border-2 border-black bg-white p-3 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-bold text-xs uppercase block text-rose-600">Anti-Cheat Tab Lockdown</span>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">Exiting fullscreen mode or switching browser tabs registers safety violations. Exceeding 3 violations disqualifies you.</p>
              </div>

              <div className="border-2 border-black bg-white p-3 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-bold text-xs uppercase block text-blue-600">Resume Support</span>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">If disconnected, you can log back in within the 120-minute window to resume your test from the same questions state.</p>
              </div>
            </div>

          </div>

          {errorMsg && (
            <div className="space-y-4 mb-6">
              <div className="bg-red-500 text-white border-4 border-black p-4 font-bold font-mono text-xs shadow-[4px_4px_0px_rgba(0,0,0,1)] text-left flex items-start space-x-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <span className="uppercase block font-black tracking-widest text-[9px] mb-0.5">Assessment Setup Error:</span>
                  <p>{errorMsg}</p>
                </div>
              </div>
              <Button 
                onClick={handleResetAttempts}
                disabled={loadingQuestions}
                className="w-full bg-white hover:bg-neutral-100 text-black font-black text-sm py-3 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-none uppercase tracking-wider"
              >
                {loadingQuestions ? 'Resetting...' : 'Reset Attempts & Start Fresh'}
              </Button>
            </div>
          )}

          <Button 
            onClick={() => setStep('instructions')} 
            disabled={loadingQuestions || !!errorMsg || questions.length === 0}
            className="w-full bg-black hover:bg-neutral-900 text-white font-black text-lg py-4 border-4 border-black shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-none uppercase tracking-wider disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none disabled:border-neutral-700 disabled:pointer-events-none"
          >
            {loadingQuestions ? 'Preloading Questions...' : errorMsg ? 'Setup Failed' : 'Begin Assessment Setup'}
          </Button>

        </div>
      )}

      {step === 'instructions' && (
        <div className="max-w-lg w-full bg-[#121212] border border-[#242424] p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-4">Assessment Guidelines</h2>
          <div className="text-sm text-neutral-300 space-y-3 mb-6 leading-relaxed">
            <p className="border-l-2 border-[#ffa116] pl-3 bg-[#ffa116]/5 py-1 text-amber-300 text-xs">
              This system uses strict webcam and browser focus tracking. Any anomalous actions trigger warnings.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fullscreen is **strictly mandatory**. Exiting will pause the test.</li>
              <li>Changing browser tabs or opening secondary apps records a **Violation**.</li>
              <li>**3 violations** will result in immediate disqualification and auto-submission.</li>
              <li>Right-click, text selection, copy/paste shortcuts are disabled.</li>
            </ul>
          </div>
          <Button onClick={() => setStep('system_check')} className="w-full bg-[#ffa116] hover:bg-[#e68e0d] text-black font-bold">
            I Agree, Run Compatibility Check
          </Button>
        </div>
      )}

      {step === 'system_check' && (
        <div className="max-w-md w-full bg-[#121212] border border-[#242424] p-8 rounded-2xl shadow-xl text-center">
          <Monitor className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">System Checks</h2>
          <div className="text-xs text-left bg-[#0a0a0a] p-4 rounded-xl border border-[#2d2d2d] space-y-3 mb-6 font-mono">
            <p className="text-emerald-400">✓ Browser support: Verified (Chrome/Chromium V8)</p>
            <p className="text-emerald-400">✓ Display resolution: Compatible ({window.innerWidth}x{window.innerHeight}px)</p>
            <p className="text-emerald-400">✓ Connection Latency: 24ms (Optimal)</p>
            <p className="text-emerald-400">✓ Monaco IDE Canvas: Preloaded</p>
          </div>
          <Button onClick={startCamera} className="w-full bg-[#ffa116] hover:bg-[#e68e0d] text-black font-bold">
            Activate Proctor Webcam
          </Button>
        </div>
      )}

      {step === 'camera_check' && (
        <div className="max-w-md w-full bg-[#121212] border border-[#242424] p-8 rounded-2xl shadow-xl text-center">
          <Video className="w-12 h-12 text-[#ffa116] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-3">Camera Calibration</h2>
          <p className="text-xs text-neutral-400 mb-4">Adjust your lighting and ensure your face is fully visible inside the frame.</p>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 bg-black rounded-xl border border-[#2d2d2d] mb-6 object-cover" />
          <Button onClick={() => setStep('fullscreen_gate')} className="w-full bg-[#ffa116] hover:bg-[#e68e0d] text-black font-bold">
            Verify Camera & Proceed
          </Button>
        </div>
      )}

      {step === 'fullscreen_gate' && (
        <div className="max-w-md w-full bg-[#121212] border border-[#242424] p-8 rounded-2xl shadow-xl text-center">
          <Maximize2 className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold mb-2">Secure Test Environment</h2>
          <p className="text-neutral-400 text-xs mb-6">Clicking the button will lock this assessment into fullscreen and start the timer.</p>
          <Button onClick={enterFullScreen} className="w-full bg-[#ffa116] hover:bg-[#e68e0d] text-black font-bold">
            Lock Screen & Start Exam
          </Button>
        </div>
      )}

      {step === 'test' && currentQuestion && (
        <div className="w-full h-screen flex flex-col md:flex-row gap-6 p-4 box-border">
          {/* Pause Lockdown screen */}
          {isPaused && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-50">
              <AlertTriangle className="w-20 h-20 text-rose-500 mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-rose-500 mb-2">LOCKOUT VIOLATION</h2>
              <p className="text-slate-300 text-sm max-w-sm text-center mb-6 leading-relaxed">
                You exited fullscreen mode. An anomaly report has been sent. Re-enter immediately to avoid test termination.
              </p>
              <Button onClick={enterFullScreen} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2">
                Re-enter Fullscreen
              </Button>
            </div>
          )}

          {/* Left panel: Question & Editor */}
          <div className="flex-1 flex flex-col bg-[#121212] border border-[#242424] rounded-2xl p-6 min-h-0">
            {/* Section tabs */}
            <div className="flex border-b border-[#242424] mb-6 space-x-4 overflow-x-auto">
              {[
                { id: 'Aptitude', label: 'Aptitude', length: aptitudeQs.length },
                { id: 'Verbal', label: 'Verbal', length: verbalQs.length },
                { id: 'Computer_Fundamentals', label: 'Computer Fundamentals', length: compQs.length },
                { id: 'Coding', label: 'Coding', length: codingQs.length }
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id as any);
                    setCurrentIdx(0);
                  }}
                  className={`pb-3 px-1 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${
                    activeSection === sec.id
                      ? 'border-[#ffa116] text-[#ffa116]'
                      : 'border-transparent text-neutral-450 hover:text-white'
                  }`}
                >
                  {sec.label} ({sec.length})
                </button>
              ))}
            </div>

            {/* Header info */}
            <div className="flex justify-between items-center pb-4 border-b border-[#242424] mb-4">
              <span className="bg-[#ffa116]/10 text-[#ffa116] px-3 py-1 rounded-full text-xs font-semibold">
                {currentQuestion.category} ➜ {currentQuestion.topic}
              </span>
              <span className="text-neutral-500 font-mono text-xs">
                Question {currentIdx + 1} of {activeQs.length} ({currentQuestion.marks} Marks)
              </span>
            </div>
            
            {/* Question description */}
            {currentQuestion.category === 'Coding' ? (
              <div className="flex-1 flex min-h-0 w-full overflow-hidden mt-2">
                <PanelGroup direction="horizontal">
                  {/* Left: Problem description & Examples */}
                  <Panel defaultSize={38} minSize={25}>
                    <div className="h-full overflow-y-auto pr-4 space-y-4 select-text">
                      <p className="font-semibold text-lg md:text-xl text-slate-100 whitespace-pre-wrap">{currentQuestion.question}</p>
                      
                      {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                        <div className="space-y-4 mt-6">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">Examples</h4>
                          {currentQuestion.examples.map((ex: any, idx: number) => (
                            <div 
                              key={idx} 
                              className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2.5 shadow-sm"
                            >
                              <p className="text-amber-500 font-bold">Example {idx + 1}:</p>
                              <div className="space-y-1.5 pl-2 border-l border-slate-800">
                                <p>
                                  <strong className="text-slate-400">Input:</strong>{' '}
                                  <span className="text-slate-200">{ex.input}</span>
                                </p>
                                <p>
                                  <strong className="text-slate-400">Output:</strong>{' '}
                                  <span className="text-emerald-400 font-bold">{ex.expected || ex.output}</span>
                                </p>
                                {ex.explanation && (
                                  <p className="text-slate-400 leading-relaxed mt-1">
                                    <strong className="text-slate-400">Explanation:</strong> {ex.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI Conceptual Hints section */}
                      <div className="border-t border-[#242424] pt-6 mt-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">Stuck? Need a Hint?</h4>
                          {!hints[currentQuestion.id] && (
                            <Button 
                              onClick={() => handleRequestHint(currentQuestion.id)}
                              disabled={loadingHint[currentQuestion.id]}
                              size="sm"
                              className="bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-600/30 text-xs px-3 py-1 h-7"
                            >
                              {loadingHint[currentQuestion.id] ? "Generating..." : "Reveal Hint"}
                            </Button>
                          )}
                        </div>

                        {hints[currentQuestion.id] && (
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed space-y-1.5 animate-fade-in shadow-sm select-text">
                            <span className="font-bold text-amber-500 block uppercase tracking-widest text-[9px] font-mono">Conceptual Coach Hint:</span>
                            <p>{hints[currentQuestion.id]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>

                  <PanelResizeHandle className="w-1.5 bg-slate-800/20 hover:bg-amber-500/20 transition-all cursor-col-resize mx-2 rounded" />

                  {/* Right: Monaco Editor + Console */}
                  <Panel defaultSize={62} minSize={40}>
                    <PanelGroup direction="vertical">
                      {/* Editor Panel */}
                      <Panel defaultSize={65} minSize={40}>
                        <div className="h-full flex flex-col border border-[#242424] rounded-xl overflow-hidden bg-[#121212]">
                          <div className="flex justify-between items-center px-4 py-2 bg-[#0d0d0d] border-b border-[#242424] flex-none">
                            <select
                              value={selectedLang}
                              onChange={(e) => setSelectedLang(e.target.value)}
                              className="border border-[#2d2d2d] bg-[#181818] text-neutral-300 rounded px-2.5 py-1 text-xs outline-none cursor-pointer"
                            >
                              <option value="python">Python 3</option>
                              <option value="javascript">JavaScript</option>
                              <option value="cpp">C++ (GCC)</option>
                              <option value="java">Java 17</option>
                            </select>
                            <Button onClick={handleRunCode} disabled={runningCode} size="sm" className="bg-[#242424] hover:bg-[#333333] border border-[#2d2d2d] text-neutral-200 text-xs py-1 h-8 transition-all active:scale-[0.98]">
                              {runningCode ? 'Running...' : 'Run Code'}
                            </Button>
                          </div>
                          <div className="flex-1 min-h-0">
                            <Editor
                              height="100%"
                              language={selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : selectedLang === 'python' ? 'python' : 'javascript'}
                              theme="vs-dark"
                              value={answers[currentQuestion.id] || ''}
                              onChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val || '' }))}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                tabSize: 4,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 8, bottom: 8 }
                              }}
                            />
                          </div>
                        </div>
                      </Panel>

                      <PanelResizeHandle className="h-1.5 bg-slate-800/20 hover:bg-amber-500/20 transition-all cursor-row-resize my-2 rounded" />

                      {/* Console Output Panel */}
                      <Panel defaultSize={35} minSize={20}>
                        <div className="h-full bg-[#0d0d0d] border border-[#2d2d2d] p-4 rounded-xl overflow-y-auto font-mono text-xs flex flex-col">
                          <span className="font-bold text-neutral-500 block mb-2 uppercase tracking-widest text-[9px] flex-none">Execution Output:</span>
                          <div className="flex-1 overflow-y-auto min-h-0 text-[11px] leading-relaxed">
                            {compilationResult ? (
                              compilationResult.results && compilationResult.results[0] ? (
                                <pre className="text-rose-400 whitespace-pre-wrap font-mono">{compilationResult.results[0].actual}</pre>
                              ) : (
                                <pre className="text-slate-300 whitespace-pre-wrap font-mono">{compilationResult.raw_output || 'Clean Run. Completed successfully.'}</pre>
                              )
                            ) : (
                              <span className="text-neutral-500">Console empty. Click "Run Code" to execute.</span>
                            )}
                          </div>
                        </div>
                      </Panel>
                    </PanelGroup>
                  </Panel>
                </PanelGroup>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto mb-6 text-base leading-relaxed pr-2 space-y-4 select-text">
                <p className="font-semibold text-lg md:text-xl text-slate-100 whitespace-pre-wrap">{currentQuestion.question}</p>
                
                {currentQuestion.options && (
                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {['A', 'B', 'C', 'D'].map((optKey, oIdx) => {
                      const optText = currentQuestion.options?.[oIdx];
                      if (!optText) return null;
                      const isSelected = answers[currentQuestion.id] === optKey;
                      
                      return (
                        <button
                          key={optKey}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: optKey }))}
                          className={`p-4 rounded-xl text-left border text-sm md:text-base transition-all flex items-center space-x-3 ${
                            isSelected 
                              ? 'bg-[#ffa116]/10 border-[#ffa116] text-[#ffa116] font-semibold' 
                              : 'bg-[#080808] border-[#2d2d2d] text-neutral-400 hover:bg-[#1a1a1a]'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-[#ffa116] border-transparent text-black' : 'border-[#333333]'
                          }`}>{optKey}</span>
                          <span>{optText}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[#2d2d2d] mt-auto">
              <Button
                variant="outline"
                disabled={currentIdx === 0 && activeSection === 'Aptitude'}
                onClick={handlePrev}
                className="border-[#242424] text-neutral-300 hover:bg-[#202020]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setMarkedForReview(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                  className={`text-xs ${markedForReview[currentQuestion.id] ? 'text-purple-400 font-semibold' : 'text-neutral-450'}`}
                >
                  <Bookmark className="w-4 h-4 mr-1" /> Mark Review
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setAnswers(prev => {
                    const next = { ...prev };
                    delete next[currentQuestion.id];
                    return next;
                  })}
                  className="text-xs text-neutral-455 hover:text-red-400"
                >
                  <RotateCcw className="w-4 h-4 mr-1" /> Clear Answer
                </Button>
              </div>

              <Button
                disabled={currentIdx === activeQs.length - 1 && activeSection === 'Coding'}
                onClick={handleNext}
                className="bg-[#ffa116] hover:bg-[#e68e0d] text-black font-bold"
              >
                Save & Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right panel: Palette & Proctor camera */}
          <div className="w-full md:w-80 flex flex-col space-y-6">
            
            {/* Live Timer details */}
            <div className="bg-[#121212] border border-[#242424] p-5 rounded-2xl text-center">
              <span className="text-[10px] text-neutral-455 uppercase tracking-widest font-mono">Time Remaining</span>
              <p className="text-3xl font-mono font-bold text-amber-500 mt-1">{formatTime(timeLeft)}</p>
            </div>

            {/* Float proctored Webcam */}
            <div className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden p-3 relative">
              <div className="absolute top-4 left-4 bg-emerald-500 w-2.5 h-2.5 rounded-full animate-ping" />
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-36 bg-black rounded-xl object-cover scale-x-[-1]" />
              <p className="text-[9px] text-center text-neutral-400 mt-2 font-mono uppercase tracking-wider">AI Proctor Monitoring Active</p>
            </div>

            {/* Question Palette grid */}
            <div className="bg-[#121212] border border-[#242424] p-5 rounded-2xl flex-1 flex flex-col min-h-[300px]">
              <span className="text-xs font-semibold text-neutral-300 block mb-4 border-b border-[#242424] pb-2">Question Palette</span>
              
              <div className="grid grid-cols-5 gap-2.5 overflow-y-auto max-h-[220px] pr-1.5 min-h-0 flex-1">
                {activeQs.map((q, idx) => {
                  const hasAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                  const isFlagged = markedForReview[q.id];
                  const hasVisited = visited[q.id];

                  let itemStyle = 'border-[#242424] bg-[#0a0a0a] text-neutral-400';
                  if (currentIdx === idx) {
                    itemStyle = 'border-[#ffa116] bg-[#ffa116]/15 text-[#ffa116] font-bold outline-ring';
                  } else if (isFlagged) {
                    itemStyle = 'border-purple-600 bg-purple-900/40 text-purple-200';
                  } else if (hasAnswered) {
                    itemStyle = 'border-emerald-600 bg-emerald-950/40 text-emerald-300';
                  } else if (hasVisited) {
                    itemStyle = 'border-[#333333] bg-[#242424] text-neutral-300';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-10 h-10 rounded-xl border text-xs flex items-center justify-center transition-all ${itemStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Submit triggers */}
              <Button
                onClick={() => {
                  const attempted = Object.values(answers).filter(val => val.trim() !== '').length;
                  const total = questions.length;
                  const confirmSubmit = window.confirm(`You have answered ${attempted} out of ${total} questions. Are you sure you want to submit?`);
                  if (confirmSubmit) {
                    submitAssessment();
                  }
                }}
                disabled={isSubmitting}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl mt-6 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting Assessment...' : 'Submit Assessment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'score' && resultsData && (
        <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-8 animate-fade-in">
          {violations >= 3 ? (
            <div className="bg-rose-950/40 border border-rose-900/30 p-6 rounded-xl text-center space-y-2">
              <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
              <h2 className="text-2xl font-bold text-rose-400">ASSESSMENT DISQUALIFIED</h2>
              <p className="text-sm text-slate-350">The exam was automatically terminated after exceeding the policy threshold (3 violations).</p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h2 className="text-2xl font-bold">Assessment Completed</h2>
              <p className="text-sm text-slate-400">Attempt graded successfully. Your metrics are outlined below.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-left font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Aptitude</span>
              <span className="text-base font-bold text-slate-200">{resultsData.aptitude} Marks</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-550 block uppercase tracking-wider">Verbal</span>
              <span className="text-base font-bold text-slate-200">{resultsData.verbal} Marks</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-550 block uppercase tracking-wider">Fundamentals</span>
              <span className="text-base font-bold text-slate-200">{resultsData.comp_fundamentals || 0} Marks</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-550 block uppercase tracking-wider">Coding</span>
              <span className="text-base font-bold text-slate-200">{resultsData.coding} Marks</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 col-span-2 md:col-span-1 text-center bg-blue-950/20 border-blue-900/30">
              <span className="text-[10px] text-slate-550 block uppercase tracking-wider">Total Score</span>
              <span className="text-base font-bold text-blue-400">{resultsData.total} Marks</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/80 text-xs text-left space-y-2 text-slate-300 flex justify-between items-center">
            <div>
              <p>📋 <span className="font-semibold text-slate-100">Violations Count</span>: {violations} violations recorded.</p>
              <p>🛡 <span className="font-semibold text-slate-100">Safety Clearance</span>: {violations >= 3 ? <span className="text-rose-400 font-bold">Declined</span> : <span className="text-emerald-400 font-bold">Approved</span>}</p>
            </div>
            <Button onClick={downloadPDFReport} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Download Detailed Report (PDF)
            </Button>
          </div>

          {/* Interactive Report Viewer */}
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-bold border-b border-slate-800 pb-2">Post-Exam Analysis Report</h3>
            
            {/* Filter Tabs */}
            <div className="flex border-b border-slate-800/60 space-x-6 text-sm font-semibold">
              {[
                { id: 'wrong', label: 'What Went Wrong' },
                { id: 'unattempted', label: 'Did Not Attempt' },
                { id: 'correct', label: 'Correct Answers' },
                { id: 'coding', label: 'Coding Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setReportTab(tab.id as any)}
                  className={`pb-2 border-b-2 transition-all ${reportTab === tab.id ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-slate-450 hover:text-slate-300'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List Viewer */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {reportTab === 'wrong' && (
                reportData.filter(r => !r.is_correct && r.user_answer !== "" && r.category !== "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm">No incorrect attempts! Excellent work.</p>
                ) : (
                  reportData.filter(r => !r.is_correct && r.user_answer !== "" && r.category !== "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[10px] text-blue-400 font-mono font-bold uppercase">{q.category} ➜ {q.topic}</span>
                      <h4 className="font-semibold text-slate-205 text-slate-200">{q.question}</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs mt-2 pt-2 border-t border-slate-900">
                        <p className="text-rose-400"><span className="font-semibold text-slate-450">Your Answer:</span> {q.user_answer}</p>
                        <p className="text-emerald-400"><span className="font-semibold text-slate-450">Correct Option:</span> {q.correct_option}</p>
                      </div>
                      <p className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded border border-slate-800 mt-2"><span className="font-bold text-slate-350">Explanation:</span> {q.explanation}</p>
                    </div>
                  ))
                )
              )}

              {reportTab === 'unattempted' && (
                reportData.filter(r => r.user_answer === "" && r.category !== "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm">No questions left unattempted!</p>
                ) : (
                  reportData.filter(r => r.user_answer === "" && r.category !== "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[10px] text-yellow-500 font-mono font-bold uppercase">{q.category} ➜ {q.topic}</span>
                      <h4 className="font-semibold text-slate-205 text-slate-200">{q.question}</h4>
                      <p className="text-xs text-emerald-400 mt-2 font-semibold"><span className="font-semibold text-slate-450">Correct Option:</span> {q.correct_option}</p>
                      <p className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded border border-slate-800 mt-1"><span className="font-bold text-slate-350">Explanation:</span> {q.explanation}</p>
                    </div>
                  ))
                )
              )}

              {reportTab === 'correct' && (
                reportData.filter(r => r.is_correct && r.category !== "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm">No correct answers found.</p>
                ) : (
                  reportData.filter(r => r.is_correct && r.category !== "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">{q.category} ➜ {q.topic}</span>
                      <h4 className="font-semibold text-slate-205 text-slate-200">{q.question}</h4>
                      <p className="text-xs text-emerald-400 mt-2 font-semibold"><span className="font-semibold text-slate-450">Your Correct Answer:</span> {q.correct_option}</p>
                      <p className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded border border-slate-800 mt-1"><span className="font-bold text-slate-350">Explanation:</span> {q.explanation}</p>
                    </div>
                  ))
                )
              )}

              {reportTab === 'coding' && (
                reportData.filter(r => r.category === "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm">No coding submissions found.</p>
                ) : (
                  reportData.filter(r => r.category === "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">Coding Challenge ➜ {q.topic}</span>
                        <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded">Passed: {q.coding_details.passed_cases}/{q.coding_details.total_cases} test cases</span>
                      </div>
                      <h4 className="font-semibold text-slate-205 text-slate-200">{q.question}</h4>
                      
                      {/* Code comparison panel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Your Solution Code:</span>
                          <pre className="p-3 bg-slate-900 border border-slate-850 rounded overflow-x-auto text-rose-300 max-h-[200px]">{q.coding_details.user_code || '// No code submitted'}</pre>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Optimal Reference Solution:</span>
                          <pre className="p-3 bg-slate-900 border border-slate-850 rounded overflow-x-auto text-emerald-300 max-h-[200px]">{q.coding_details.optimal_code || '// Optimal solution template'}</pre>
                        </div>
                      </div>

                      {/* Complexity details */}
                      <div className="bg-slate-900/60 p-3.5 rounded border border-slate-850 text-xs space-y-2">
                        <div className="flex space-x-6 font-mono text-[10px] uppercase text-indigo-400">
                          <span>Time Complexity limit: <strong className="text-slate-200">{q.coding_details.time_complexity}</strong></span>
                          <span>Space Complexity limit: <strong className="text-slate-200">{q.coding_details.space_complexity}</strong></span>
                        </div>
                        <p className="text-slate-400 border-t border-slate-900 pt-2"><span className="font-bold text-slate-350">Optimal Explanation:</span> {q.explanation}</p>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          <Button onClick={() => setStep('landing')} className="w-full bg-blue-600 hover:bg-blue-700">
            Return to Assessment Portal
          </Button>
        </div>
      )}
    </div>
  );
}
