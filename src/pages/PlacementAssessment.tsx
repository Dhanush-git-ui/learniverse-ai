import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Monitor, Video, Maximize2, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Bookmark, RotateCcw, AlertTriangle, Send, Play, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { runAndEvaluate } from '@/services/codeExecutionService';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Question {
  id: string;
  category: string;
  topic: string;
  difficulty: string;
  question: string;
  options?: string[];
  marks: number;
  negative_marks?: number;
  tags?: any;
  company_tags?: string[];
  companyTags?: string[];
  examples?: { input: string; output: string; explanation?: string; expected?: string }[];
  correct_option?: string;
  case_image?: string;
  diagram_url?: string;
  image_url?: string;
  question_type?: string;
}

// ─── Device / dual-screen detection helpers ───────────────────────────────────

/** Returns true when running on a mobile/touch device */
const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return (
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Mobile|BlackBerry|Windows Phone/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  );
};

/** Returns true when a secondary/extended display is likely in use.
 *  Heuristic: the physical screen width is substantially wider than the current
 *  window width AND window.screenLeft suggests an off-primary position, OR
 *  screenX is large enough to indicate a secondary monitor.
 */
const isDualScreen = (): boolean => {
  try {
    const screenW = window.screen.width;
    const innerW  = window.innerWidth;
    // If the full screen width is more than 1.4× the window width, multi-monitor is likely
    if (screenW > innerW * 1.4) return true;
    // If the window is positioned far to the right (secondary monitor to the right)
    const offsetX = window.screenX ?? (window as any).screenLeft ?? 0;
    if (Math.abs(offsetX) > 800) return true;
  } catch (_) { /* ignore */ }
  return false;
};

// ─── Chart auto-generation helpers ────────────────────────────────────────────

type ChartType = 'pie' | 'bar' | 'line' | null;

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

/** Detect if a question text describes a chart, and what kind */
const detectChartType = (text: string): ChartType => {
  const lower = text.toLowerCase();
  if (/pie\s*chart|donut\s*chart|pie\s*graph/.test(lower)) return 'pie';
  if (/bar\s*(chart|graph)|histogram|column\s*chart/.test(lower)) return 'bar';
  if (/line\s*(chart|graph)|trend\s*(chart|graph)|time\s*series/.test(lower)) return 'line';
  return null;
};

interface ChartDataPoint { name: string; value: number; }

/** Attempt to extract { name, value } data points from a question string.
 *  Looks for patterns like "Category: 30%", "Category - 45", "Category = 12", etc.
 */
const extractChartData = (text: string): ChartDataPoint[] => {
  const results: ChartDataPoint[] = [];
  // Pattern 1: "Label: 35%" or "Label: 35"
  const pattern1 = /([A-Za-z][A-Za-z\s]{0,25}?)[\s:–\-=]+(\d+(?:\.\d+)?)\s*%?/g;
  let m: RegExpExecArray | null;
  while ((m = pattern1.exec(text)) !== null) {
    const name = m[1].trim();
    const value = parseFloat(m[2]);
    if (name.length > 1 && value > 0 && !results.find(r => r.name === name)) {
      results.push({ name, value });
    }
  }
  // Deduplicate and cap at 8 entries
  return results.slice(0, 8);
};

interface AutoChartProps { questionText: string; }

const AutoChart = ({ questionText }: AutoChartProps) => {
  const chartType = detectChartType(questionText);
  const data = extractChartData(questionText);
  if (!chartType || data.length < 2) return null;

  return (
    <div className="my-4 bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-3">Auto-generated chart</p>
      <ResponsiveContainer width="100%" height={220}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
              {data.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// ─── Pictorial / case-based question image renderer ───────────────────────────

interface QuestionImageProps {
  question: Question & { case_image?: string; diagram_url?: string; image_url?: string; question_type?: string; };
}
const QuestionImage = ({ question }: QuestionImageProps) => {
  const imgUrl = question.case_image || question.diagram_url || question.image_url;
  const isCaseBased = question.question_type === 'case_based' ||
    /\bcase\b.*\bfollowing\b|\brefer.*\bfigure\b|\bdiagram\b|\bshown.*\bbelow\b/i.test(question.question);

  if (imgUrl) {
    return (
      <div className="my-3 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 text-center">
        <img src={imgUrl} alt="Question diagram" className="max-h-64 mx-auto object-contain p-2" />
      </div>
    );
  }
  if (isCaseBased) {
    return (
      <div className="my-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-4 text-center text-slate-500 text-xs font-mono">
        📊 Refer to the diagram / case data described in the question text above.
      </div>
    );
  }
  return null;
};

// ─── Local score calculator (enables instant result page) ─────────────────────

const computeLocalScore = (
  qs: Question[],
  answersMap: Record<string, string>,
  codingSubmissionsMap: Record<string, { passed_cases: number; total_cases: number }>,
): { aptitude: number; verbal: number; comp_fundamentals: number; coding: number; total: number } => {
  let aptitude = 0, verbal = 0, comp_fundamentals = 0, coding = 0;
  qs.forEach(q => {
    if (q.category === 'Coding') {
      const sub = codingSubmissionsMap[q.id];
      if (sub && sub.passed_cases === sub.total_cases && sub.total_cases > 0) coding++;
    } else {
      const userAns = answersMap[q.id] || '';
      const correctOpt = (q as any).correct_option || '';
      if (userAns && userAns === correctOpt) {
        if (q.category === 'Aptitude') aptitude++;
        else if (q.category === 'Verbal') verbal++;
        else if (q.category === 'Computer_Fundamentals') comp_fundamentals++;
      }
    }
  });
  return { aptitude, verbal, comp_fundamentals, coding, total: aptitude + verbal + comp_fundamentals + coding };
};

// ─── Coding submit state per question ─────────────────────────────────────────

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
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  
  // Coding Editor state
  const [selectedLang, setSelectedLang] = useState<string>('python');
  const [compilationResult, setCompilationResult] = useState<any>(null);
  const [runningCode, setRunningCode] = useState<boolean>(false);
  const [submittingCode, setSubmittingCode] = useState<boolean>(false);
  // Per-question coding submission results (passed_cases / total_cases)
  const [codingSubmissions, setCodingSubmissions] = useState<Record<string, { passed_cases: number; total_cases: number; runtime?: string }>>({});
  // Device detection warnings
  const [mobileWarning, setMobileWarning] = useState<boolean>(false);
  const [dualScreenWarning, setDualScreenWarning] = useState<boolean>(false);
  
  // Hints state
  const [hints, setHints] = useState<Record<string, string>>({});
  const [loadingHint, setLoadingHint] = useState<Record<string, boolean>>({});
  
  // Final Results
  const [resultsData, setResultsData] = useState<any>(null);
  const [model, setModel] = useState<any>(null);
  const [cocoModel, setCocoModel] = useState<any>(null);
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

  // Candidate Registration State & Validation
  const [studentName, setStudentName] = useState<string>(() => localStorage.getItem('learniverse_student_name') || '');
  const [studentNameError, setStudentNameError] = useState<string | null>(null);
  const [rollNumber, setRollNumber] = useState<string>(() => localStorage.getItem('learniverse_roll_number') || '');
  const [rollNumberError, setRollNumberError] = useState<string | null>(null);
  const [branch, setBranch] = useState<string>(() => localStorage.getItem('learniverse_student_branch') || 'CSE');


  // Derived state for active questions & current question
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


  // Extract company badges from question metadata
  const getQuestionCompanyTags = (q?: Question): string[] => {
    if (!q) return ["TCS", "Infosys", "Wipro"];
    const list: string[] = [];
    const knownCompanies = ["TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "Cognizant", "HCL", "Deloitte", "IBM", "Tech Mahindra", "Genpact", "Amazon"];

    const addIfValid = (val: any) => {
      if (!val) return;
      if (Array.isArray(val)) {
        val.forEach((item: any) => {
          if (typeof item === 'string' && knownCompanies.includes(item) && !list.includes(item)) {
            list.push(item);
          }
        });
      } else if (typeof val === 'string') {
        if (knownCompanies.includes(val) && !list.includes(val)) {
          list.push(val);
        } else {
          try {
            addIfValid(JSON.parse(val));
          } catch (_) {}
        }
      }
    };

    addIfValid(q.company_tags);
    addIfValid(q.companyTags);
    addIfValid(q.tags);

    if (list.length === 0) {
      const defaults = ["TCS", "Infosys", "Wipro"];
      const hash = q.id ? (q.id.charCodeAt(0) + (q.id.charCodeAt(q.id.length - 1) || 0)) % defaults.length : 0;
      return [defaults[hash], defaults[(hash + 1) % defaults.length]];
    }
    return list;
  };

  // Helper to render inline code backticks `code` nicely
  const renderFormattedInline = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className="bg-slate-900 text-blue-300 font-mono text-xs px-1.5 py-0.5 rounded-md border border-slate-800 font-semibold mx-0.5 shadow-sm">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Render structured sections for coding problem statements (Problem Statement, Constraints, Input/Output Format)
  const renderCodingProblemStatement = (rawText: string) => {
    if (!rawText) return null;

    if (rawText.includes('###')) {
      const sections: { title: string; content: string }[] = [];
      const parts = rawText.split(/(###\s*[^\n#]+)/g);
      
      let currentTitle = "Problem Statement";
      let currentContent = "";

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i].trim();
        if (!p) continue;
        if (p.startsWith('###')) {
          if (currentContent.trim()) {
            sections.push({ title: currentTitle, content: currentContent.trim() });
          }
          currentTitle = p.replace(/^###\s*/, '').trim();
          currentContent = "";
        } else {
          currentContent += (currentContent ? "\n" : "") + p;
        }
      }
      if (currentContent.trim()) {
        sections.push({ title: currentTitle, content: currentContent.trim() });
      }

      return (
        <div className="space-y-4">
          {sections.map((sec, idx) => {
            const lowerTitle = sec.title.toLowerCase();

            if (lowerTitle.includes("constraint")) {
              const lines = sec.content.split('\n').map(l => l.trim()).filter(Boolean);
              return (
                <div key={idx} className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Constraints</span>
                  </div>
                  <ul className="space-y-1.5 font-mono text-xs text-amber-200/90 pl-1">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>{renderFormattedInline(line.replace(/^-\s*/, ''))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (lowerTitle.includes("input format")) {
              return (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-xs uppercase tracking-wider">
                    <span>📥 Input Format</span>
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed font-sans">
                    {renderFormattedInline(sec.content)}
                  </div>
                </div>
              );
            }

            if (lowerTitle.includes("output format")) {
              return (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
                    <span>📤 Output Format</span>
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed font-sans">
                    {renderFormattedInline(sec.content)}
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                <h3 className="font-extrabold text-base md:text-lg text-white flex items-center gap-2">
                  📌 {sec.title}
                </h3>
                <div className="text-slate-200 text-sm md:text-base leading-relaxed space-y-2 font-sans select-text">
                  {sec.content.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{renderFormattedInline(para)}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="text-slate-200 text-sm md:text-base leading-relaxed font-sans select-text">
          {renderFormattedInline(rawText)}
        </div>
      </div>
    );
  };

  // Render formatted code blocks inside question stems (e.g. CS Fundamentals output prediction)
  const renderQuestionStem = (stemText: string) => {
    if (!stemText) return null;
    
    let formattedText = stemText;
    
    // Auto-convert inline code snippets or code blocks enclosed in single backticks
    if (!formattedText.includes('```')) {
      const codePatterns = [
        /`+(void\s+[\s\S]+?)`+/i,
        /`+(int\s+[\s\S]+?)`+/i,
        /`+(def\s+[\s\S]+?)`+/i,
        /`+(class\s+[\s\S]+?)`+/i,
        /`+([\s\S]*?(?:computeLPS|printf|cout|System\.out|struct|#include)[\s\S]*?)`+/i
      ];
      for (const pat of codePatterns) {
        if (pat.test(formattedText)) {
          formattedText = formattedText.replace(pat, (_match, codeContent) => {
            const prettyCode = codeContent
              .replace(/;\s*/g, ';\n')
              .replace(/\{\s*/g, '{\n  ')
              .replace(/\}\s*/g, '\n}\n');
            return `\n\`\`\`cpp\n${prettyCode.trim()}\n\`\`\`\n`;
          });
          break;
        }
      }
    }

    if (formattedText.includes('```')) {
      const parts = formattedText.split(/(```[\s\S]*?```)/g);
      return (
        <div className="space-y-3">
          {parts.map((part, idx) => {
            if (part.startsWith('```')) {
              const lines = part.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
              return (
                <div key={idx} className="my-3">
                  <div className="flex items-center justify-between bg-slate-900 border-t border-x border-slate-800 px-4 py-1.5 rounded-t-xl text-[11px] font-mono font-bold text-slate-400">
                    <span>CODE SNIPPET</span>
                    <span className="text-emerald-400 font-mono">C / C++</span>
                  </div>
                  <pre className="bg-slate-950 border border-slate-800 p-4 rounded-b-xl font-mono text-sm text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                    <code>{lines}</code>
                  </pre>
                </div>
              );
            }
            return part.trim() ? <p key={idx} className="font-semibold text-lg text-slate-100 whitespace-pre-wrap leading-relaxed">{part.trim()}</p> : null;
          })}
        </div>
      );
    }
    return <p className="font-semibold text-lg md:text-xl text-slate-100 whitespace-pre-wrap leading-relaxed">{stemText}</p>;
  };


  // Admin Portal State
  const [mainTab, setMainTab] = useState<'student' | 'admin'>('student');
  const [adminSessions, setAdminSessions] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('');
  const [selectedAdminSession, setSelectedAdminSession] = useState<any | null>(null);

  // Internet Disconnect Monitor
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchAdminSessions = async () => {
    setAdminLoading(true);
    try {
      let url = '/api/assessment/admin/sessions?';
      if (adminSearch) url += `search=${encodeURIComponent(adminSearch)}&`;
      if (adminStatusFilter) url += `status=${encodeURIComponent(adminStatusFilter)}`;
      const res = await fetch(url, {
        headers: { 'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey' }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminSessions(data.sessions || []);
      }
    } catch (e) {
      console.error("Failed to fetch admin sessions", e);
    } finally {
      setAdminLoading(false);
    }
  };

  const validateRollNumber = (input: string): boolean => {
    const cleaned = input.trim().toUpperCase();
    const pattern = /^[A-Z0-9]{8,12}$/;
    return pattern.test(cleaned);
  };

  const startAssessmentSession = async (rollToUse?: string, nameToUse?: string): Promise<boolean> => {
    const rawRoll = rollToUse !== undefined ? rollToUse : rollNumber;
    const cleanRoll = rawRoll.trim().toUpperCase();
    const rawName = nameToUse !== undefined ? nameToUse : studentName;
    const cleanName = rawName.trim();
    
    let hasErr = false;
    if (!cleanName || cleanName.length < 2) {
      setStudentNameError("Please enter your Full Name before starting.");
      hasErr = true;
    } else {
      setStudentNameError(null);
    }

    if (!cleanRoll) {
      setRollNumberError("Please enter your Roll Number before starting.");
      hasErr = true;
    } else if (!validateRollNumber(cleanRoll)) {
      setRollNumberError("Invalid Roll Number format. Expected format e.g.: 23E51A0561, 24E51A66E1");
      hasErr = true;
    } else {
      setRollNumberError(null);
    }

    if (hasErr) return false;
    
    setLoadingQuestions(true);
    setErrorMsg(null);
    
    localStorage.setItem('learniverse_roll_number', cleanRoll);
    localStorage.setItem('learniverse_student_name', cleanName);
    localStorage.setItem('learniverse_student_branch', branch);
    localStorage.setItem('learniverse_assessment_user_id', cleanRoll);

    let maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          setErrorMsg("Waking up assessment database server (attempt " + attempt + " of " + maxAttempts + ")...");
          await new Promise(r => setTimeout(r, 2000));
          setErrorMsg(null);
        }

        const response = await fetch('/api/assessment/start', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey',
            'X-Roll-Number': cleanRoll
          },
          body: JSON.stringify({
            roll_number: cleanRoll,
            user_id: cleanRoll,
            student_name: cleanName,
            branch: branch,
            year: "4th Year",
            browser_info: {
              user_agent: navigator.userAgent,
              screen_resolution: `${window.screen.width}x${window.screen.height}`,
              platform: navigator.platform
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const msg = errData.detail || `Server returned status code ${response.status}`;
          if (response.status === 503 && attempt < maxAttempts) {
            continue; // retry automatically
          }
          setErrorMsg(msg);
          return false;
        }

        const data = await response.json();
        if (data.attempt_id && data.questions) {
          setAttemptId(data.attempt_id);
          setQuestions(data.questions);
          
          // Restore server-saved answers or local draft answers
          if (data.saved_answers && Object.keys(data.saved_answers).length > 0) {
            setAnswers(data.saved_answers);
          } else {
            const savedDraft = localStorage.getItem(`draft_answers_${data.attempt_id}`);
            if (savedDraft) {
              try {
                setAnswers(JSON.parse(savedDraft));
              } catch (e) {
                console.error("Failed to parse saved draft answers", e);
              }
            }
          }
          if (data.duration < 7200) {
            setTimeLeft(data.duration);
          }
          setLoadingQuestions(false);
          return true;
        }
        setLoadingQuestions(false);
        return false;
      } catch (e: any) {
        if (attempt < maxAttempts) {
          continue;
        }
        console.error("Failed to start assessment", e);
        setErrorMsg("Failed to connect to the assessment server. Check if your backend is running.");
        setLoadingQuestions(false);
        return false;
      } finally {
        setLoadingQuestions(false);
      }
    }
    setLoadingQuestions(false);
    return false;
  };



  // Save draft answers to localStorage on change and periodically push to backend /api/assessment/autosave
  useEffect(() => {
    if (attemptId && Object.keys(answers).length > 0) {
      localStorage.setItem(`draft_answers_${attemptId}`, JSON.stringify(answers));
    }
  }, [answers, attemptId]);

  // Periodic 30-second server auto-save sync
  useEffect(() => {
    if (step !== 'test' || !attemptId) return;

    const autoSaveInterval = setInterval(() => {
      if (Object.keys(answersRef.current).length > 0) {
        fetch('/api/assessment/autosave', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey',
            'X-Roll-Number': rollNumber
          },
          body: JSON.stringify({
            attempt_id: attemptIdRef.current || attemptId,
            answers: answersRef.current,
            coding_submissions: codingSubmissions
          })
        }).catch(err => console.error("Periodic auto-save error:", err));
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [step, attemptId, codingSubmissions]);

  const handleResetAttempts = async () => {
    setErrorMsg(null);
    setLoadingQuestions(true);
    const userId = localStorage.getItem('learniverse_assessment_user_id') || rollNumber;
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
        localStorage.removeItem('learniverse_roll_number');
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



  // Keyboard navigation & option selection hook
  useEffect(() => {
    if (step !== 'test' || isPaused || isSubmitting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable ||
        activeEl?.classList.contains('monaco-mouse-cursor-text')
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || (e.altKey && (e.key === 'n' || e.key === 'N'))) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || (e.altKey && (e.key === 'p' || e.key === 'P'))) {
        e.preventDefault();
        handlePrev();
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        if (currentQuestion) {
          setMarkedForReview(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
        }
      } else if (['1', '2', '3', '4'].includes(e.key) && currentQuestion && currentQuestion.category !== 'Coding') {
        e.preventDefault();
        const optMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optMap[e.key] }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, isPaused, isSubmitting, currentIdx, activeSection, currentQuestion]);


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

  function handleNext() {
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
  }

  function handlePrev() {
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
  }

  // Handle auto-submit on violations limit or timeout
  const isSubmittingRef = useRef(false);
  const attemptIdRef = useRef(attemptId);
  const questionsRef = useRef(questions);
  const answersRef = useRef(answers);
  
  useEffect(() => {
    attemptIdRef.current = attemptId;
    questionsRef.current = questions;
    answersRef.current = answers;
  }, [attemptId, questions, answers]);

  function handleAutoSubmit() {
    submitAssessment(true, attemptIdRef.current, questionsRef.current, answersRef.current);
  }

  // Submit test to API
  async function submitAssessment(isAuto = false, _attemptId = attemptId, _questions = questions, _answers = answers) {

    if (!_attemptId) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    
    // Stop Camera feed immediately
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (err) {}
    }

    // Separate coding answers from MCQ answers
    const mcqAnswers: Record<string, string> = {};
    const codingSubmissionsPayload: Record<string, any> = {};

    _questions.forEach((q) => {
      const ans = _answers[q.id] || '';
      if (q.category === 'Coding') {
        const sub = codingSubmissions[q.id];
        codingSubmissionsPayload[q.id] = {
          code: ans,
          language: selectedLang,
          passed_cases: sub ? sub.passed_cases : (ans.trim() !== '' && !ans.includes('# Write your solution here') && !ans.includes('// Write your solution here') ? 1 : 0),
          total_cases: sub ? sub.total_cases : 1
        };
      } else {
        mcqAnswers[q.id] = ans;
      }
    });

    // ── Instant result: compute score locally and show result page NOW ──────
    const localScore = computeLocalScore(_questions, _answers, codingSubmissions);
    // Build a minimal report from local data (full report comes from server)
    const localReport = _questions
      .filter(q => q.category !== 'Coding')
      .map(q => ({
        id: q.id,
        category: q.category,
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        correct_option: q.correct_option ?? '',
        explanation: (q as any).explanation ?? '',
        user_answer: _answers[q.id] || '',
        is_correct: (_answers[q.id] || '') === (q.correct_option ?? ''),
        coding_details: null
      }));

    setResultsData(localScore);
    setReportData(localReport);
    setStep('score');
    setIsSubmitting(false);

    // Exit Fullscreen after transition to score step
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {}
    }

    // ── Background: send to server and reconcile once response arrives ───────
    fetch('/api/assessment/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey'
      },
      body: JSON.stringify({
        attempt_id: _attemptId,
        answers: mcqAnswers,
        coding_submissions: codingSubmissionsPayload
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success') {
        localStorage.removeItem('learniverse_assessment_user_id');
        // Reconcile with server score (more accurate, includes coding evaluation)
        setResultsData(data.score);
        setReportData(data.report || localReport);
      }
    })
    .catch(e => {
      console.error("Background submission failed", e);
    });
  };

  // 1. Log violations to backend
  const recordViolation = async (type: string, details: string = '') => {
    if (isSubmittingRef.current) return;
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
      if (isSubmittingRef.current) return;
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

  // 3. Tab switch, window blur & Alt+Tab lockdown
  useEffect(() => {
    if (step !== 'test') return;

    // Tab switch (Ctrl+Tab, clicking another tab, browser losing focus to OS)
    const onVisibilityChange = () => {
      if (isSubmittingRef.current) return;
      if (document.hidden) {
        setIsPaused(true);
        recordViolation("tab_switch", "User navigated to another browser tab or switched window");
      }
    };

    // Window blur fires for Alt+Tab, Win+D, clicking taskbar, clicking outside browser
    const onBlur = () => {
      if (isSubmittingRef.current) return;
      setIsPaused(true);
      recordViolation("window_blur", "User switched window or alt-tabbed away from exam");
    };

    // Window focus — resume when they come back (they'll need to re-enter fullscreen)
    const onFocus = () => {
      if (isSubmittingRef.current) return;
      // Do NOT clear isPaused here — they must click "Re-enter Fullscreen"
      // which calls enterFullScreen() and clears isPaused via the fullscreenchange event
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [step]);

  // 4. Keyboard lockdown — blocks all cheat shortcuts during exam
  useEffect(() => {
    if (step !== 'test') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (isSubmittingRef.current) return;

      const ctrl  = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt   = e.altKey;
      const key   = e.key.toLowerCase();

      // ── Window / tab switching ───────────────────────────────────────────
      // Alt+Tab  (Windows/Linux switch window)
      const isAltTab = alt && key === 'tab';
      // Alt+F4   (Windows close window)
      const isAltF4  = alt && key === 'f4';
      // Ctrl+W   (Close tab)
      const isCtrlW  = ctrl && key === 'w';
      // Ctrl+T   (New tab)
      const isCtrlT  = ctrl && key === 't';
      // Ctrl+N   (New window)
      const isCtrlN  = ctrl && key === 'n';
      // Meta/Win key (opens Start menu / app switcher)
      const isWinKey = e.key === 'Meta' || e.key === 'OS';
      // Ctrl+Tab / Ctrl+Shift+Tab (switch browser tabs)
      const isCtrlTab = ctrl && key === 'tab';

      // ── Copy / Paste / Cut ───────────────────────────────────────────────
      const isCopy  = ctrl && key === 'c';
      const isPaste = ctrl && key === 'v';
      const isCut   = ctrl && key === 'x';

      // ── Screenshot / screen recording ───────────────────────────────────
      const isPrintScreen    = e.key === 'PrintScreen';
      const isSnippingTool   = (e.metaKey && shift && key === 's'); // Win+Shift+S
      const isScreenRecord   = (ctrl && shift && key === '5');       // macOS Cmd+Shift+5

      // ── Developer tools ──────────────────────────────────────────────────
      const isF12       = e.key === 'F12';
      const isInspect   = ctrl && shift && key === 'i';
      const isConsole   = ctrl && shift && key === 'j';
      const isViewSource = ctrl && key === 'u';

      // ── Other shortcuts that could expose content ────────────────────────
      const isSave  = ctrl && key === 's';
      const isPrint = ctrl && key === 'p';
      const isFind  = ctrl && key === 'f';

      const shouldBlock = (
        isAltTab || isAltF4 || isCtrlW || isCtrlT || isCtrlN || isWinKey || isCtrlTab ||
        isCopy || isPaste || isCut ||
        isPrintScreen || isSnippingTool || isScreenRecord ||
        isF12 || isInspect || isConsole || isViewSource ||
        isSave || isPrint || isFind
      );

      if (shouldBlock) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Record violations for the most important actions
        if (isAltTab || isCtrlTab || isCtrlN || isCtrlT) {
          setIsPaused(true);
          recordViolation("tab_switch_attempt", `Blocked window/tab switch: ${e.key}`);
        } else if (isCopy || isPaste || isCut) {
          recordViolation("copy_paste_attempt", `Blocked clipboard action: ${e.key}`);
        } else if (isPrintScreen || isSnippingTool || isScreenRecord) {
          recordViolation("screenshot_attempt", `Blocked screenshot key: ${e.key}`);
        } else if (isF12 || isInspect || isConsole || isViewSource) {
          recordViolation("devtools_attempt", `Blocked devtools key: ${e.key}`);
        }
      }
    };

    // Use capture phase (true) so we intercept before any other handler
    window.addEventListener("keydown", onKeyDown, true);

    // ── Block touchpad / touch gestures (three-finger swipe switches tabs) ──
    // Prevent horizontal swipe navigation (back/forward/tab-switch gestures)
    const onWheel = (e: WheelEvent) => {
      // Block horizontal scroll (swipe left/right) which triggers tab switching
      // on macOS trackpad and some touchscreens
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Block touch-based swipe gestures (mobile / touchscreen)
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      // If horizontal swipe is dominant and > 30px — block it
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Block pointer-based swipe gestures (stylus / pen / trackpad pointer events)
    const onPointerDown = (e: PointerEvent) => {
      // Block right/left pointer buttons (mouse back/forward navigation buttons)
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [step]);

  // 5. AI Face Presence & Object/Phone Detector Loop
  useEffect(() => {
    if (step !== 'test' || !videoRef.current) return;

    let isMounted = true;
    let checkInterval: any;
    let consecutiveMissingCount = 0;

    const detectWebcamFrame = async () => {
      if (isSubmittingRef.current) return;
      const blazefaceGlobal = (window as any).blazeface;
      const cocoGlobal = (window as any).cocoSsd;

      try {
        let activeFaceModel = model;
        if (!activeFaceModel && blazefaceGlobal) {
          activeFaceModel = await blazefaceGlobal.load();
          if (isMounted) setModel(activeFaceModel);
        }

        let activeCocoModel = cocoModel;
        if (!activeCocoModel && cocoGlobal) {
          activeCocoModel = await cocoGlobal.load();
          if (isMounted) setCocoModel(activeCocoModel);
        }

        if (videoRef.current && videoRef.current.readyState >= 2) {
          // 1. Face detection
          if (activeFaceModel) {
            const predictions = await activeFaceModel.estimateFaces(videoRef.current, false);
            if (predictions.length === 0) {
              consecutiveMissingCount++;
              if (isMounted) setProctorWarning("⚠️ Face not detected. Align yourself in the camera.");
              if (consecutiveMissingCount >= 5) {
                consecutiveMissingCount = 0;
                recordViolation("face_missing", "Candidate left webcam frame");
              }
            } else {
              consecutiveMissingCount = 0;
              if (isMounted) setProctorWarning(null);
            }
          }

          // 2. Object & Mobile Phone detection (Coco-SSD)
          if (activeCocoModel) {
            const objPredictions = await activeCocoModel.detect(videoRef.current);
            
            // Check for cell phones / prohibited items
            const prohibitedItem = objPredictions.find((p: any) => 
              ['cell phone', 'phone', 'remote', 'book', 'laptop'].includes(p.class.toLowerCase()) && p.score > 0.4
            );

            if (prohibitedItem) {
              if (isMounted) setProctorWarning(`⚠️ Prohibited Device (${prohibitedItem.class}) detected in camera!`);
              recordViolation("prohibited_device", `Detected ${prohibitedItem.class} in webcam frame`);
            }

            // Check for multiple persons (Disabled for this run per configuration)
            // const persons = objPredictions.filter((p: any) => p.class.toLowerCase() === 'person' && p.score > 0.4);
            // if (persons.length > 1) {
            //   if (isMounted) setProctorWarning("⚠️ Multiple people detected in camera frame!");
            //   recordViolation("multiple_people", `Detected ${persons.length} persons in webcam frame`);
            // }
          }
        }
      } catch (err) {
        console.error("AI proctoring detector error:", err);
      }
    };

    checkInterval = setInterval(detectWebcamFrame, 1500);
    return () => {
      isMounted = false;
      clearInterval(checkInterval);
    };
  }, [step, model, cocoModel]);

  // Enable WebRTC Camera stream
  const startCamera = async () => {
    // Device detection: block mobile before camera step
    if (isMobileDevice()) {
      setMobileWarning(true);
      return;
    }
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
    // Dual-screen detection before locking exam
    if (isDualScreen()) {
      setDualScreenWarning(true);
      recordViolation("dual_screen", "Dual-monitor setup detected at fullscreen gate");
    }
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
      setCompilationResult({ results: [{ actual: e.message || "Execution failed.", expected: '', input: 'Error', passed: false }] });
    } finally {
      setRunningCode(false);
    }
  };

  // Submit individual coding question
  const handleSubmitCode = async () => {
    if (!currentQuestion) return;
    setSubmittingCode(true);
    setCompilationResult(null);
    try {
      const userCode = answers[currentQuestion.id] || '';
      const rawExamples = (currentQuestion as any).examples || [];
      const examples = rawExamples.map((ex: any) => ({
        input: ex.input || "",
        output: ex.expected || ex.output || ""
      }));
      const result = await runAndEvaluate(userCode, selectedLang, examples);
      setCompilationResult(result);
      // Record per-question submission for scoring
      const passed = result.passed_cases ?? (result.results?.filter((r: any) => r.passed).length ?? 0);
      const total  = result.total_cases  ?? (result.results?.length ?? 1);
      setCodingSubmissions(prev => ({
        ...prev,
        [currentQuestion.id]: { passed_cases: passed, total_cases: total, runtime: result.runtime }
      }));
    } catch (e: any) {
      setCompilationResult({ results: [{ actual: e.message || "Submission failed.", expected: '', input: 'Error', passed: false }] });
    } finally {
      setSubmittingCode(false);
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
    if (!resultsData) return;

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - 40; // 20px margin left & right
      let y = 20;

      const checkPageBreak = (neededHeight: number = 10) => {
        if (y + neededHeight > 275) {
          doc.addPage();
          y = 20;
        }
      };

      const printWrapped = (
        text: string, 
        x: number = 20, 
        fontSize: number = 10, 
        fontStyle: 'normal' | 'bold' | 'italic' = 'normal', 
        color: [number, number, number] = [30, 41, 59], 
        lineHeight: number = 5
      ) => {
        if (!text) return;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        doc.setTextColor(...color);
        const textWidth = maxWidth - (x - 20);
        const lines = doc.splitTextToSize(text, textWidth);
        for (let i = 0; i < lines.length; i++) {
          checkPageBreak(lineHeight);
          doc.text(lines[i], x, y);
          y += lineHeight;
        }
      };

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 42, 'F');
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text("Learniverse AI Placement Assessment Report", 20, 20);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Candidate Roll No: ${rollNumber || 'N/A'}   |   Generated: ${new Date().toLocaleString()}`, 20, 32);

      y = 52;

      // Performance Summary Box
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, y, maxWidth, 48, 3, 3, 'F');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("Candidate Performance Summary", 26, y + 10);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Aptitude: ${resultsData.aptitude} Marks   |   Verbal: ${resultsData.verbal} Marks`, 26, y + 18);
      doc.text(`Computer Fundamentals: ${resultsData.comp_fundamentals || 0} Marks   |   Coding: ${resultsData.coding} Marks`, 26, y + 25);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(`Total Score: ${resultsData.total} Marks`, 26, y + 33);

      const isDisqualified = violations >= 3;
      doc.setTextColor(isDisqualified ? 225 : 16, isDisqualified ? 29 : 185, isDisqualified ? 72 : 129);
      doc.text(`Proctoring Safety Status: ${violations} / 3 Violations Recorded (${isDisqualified ? 'DISQUALIFIED' : 'PASSED CLEARANCE'})`, 26, y + 41);

      y += 58;

      const addSectionHeader = (title: string, color: [number, number, number]) => {
        checkPageBreak(18);
        doc.setFillColor(...color);
        doc.roundedRect(20, y, maxWidth, 8, 2, 2, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(title, 25, y + 5.5);
        y += 14;
      };

      // 1. WHAT WENT WRONG
      const wrongQs = reportData.filter(r => !r.is_correct && r.user_answer !== "" && r.category !== "Coding");
      addSectionHeader(`1. What Went Wrong (${wrongQs.length} Incorrect Questions)`, [225, 29, 72]);

      if (wrongQs.length === 0) {
        printWrapped("No incorrect answers! Outstanding accuracy across non-coding sections.", 25, 9.5, 'italic', [100, 116, 139]);
        y += 4;
      } else {
        wrongQs.forEach((q, i) => {
          checkPageBreak(20);
          printWrapped(`Question ${i + 1} [${q.category} ➜ ${q.topic}]`, 20, 10, 'bold', [225, 29, 72]);
          printWrapped(q.question, 20, 9.5, 'normal', [15, 23, 42]);
          printWrapped(`Your Choice: ${q.user_answer}   |   Correct Answer: ${q.correct_option}`, 25, 9, 'bold', [180, 40, 40]);
          if (q.explanation) {
            printWrapped(`Explanation: ${q.explanation}`, 25, 8.5, 'italic', [71, 85, 105]);
          }
          y += 5;
        });
      }

      y += 6;

      // 2. DID NOT ATTEMPT
      const unattemptedQs = reportData.filter(r => r.user_answer === "" && r.category !== "Coding");
      addSectionHeader(`2. Did Not Attempt (${unattemptedQs.length} Unattempted Questions)`, [217, 119, 6]);

      if (unattemptedQs.length === 0) {
        printWrapped("All non-coding questions were attempted.", 25, 9.5, 'italic', [100, 116, 139]);
        y += 4;
      } else {
        unattemptedQs.forEach((q, i) => {
          checkPageBreak(20);
          printWrapped(`Question ${i + 1} [${q.category} ➜ ${q.topic}]`, 20, 10, 'bold', [217, 119, 6]);
          printWrapped(q.question, 20, 9.5, 'normal', [15, 23, 42]);
          printWrapped(`Correct Answer: ${q.correct_option}`, 25, 9, 'bold', [16, 185, 129]);
          if (q.explanation) {
            printWrapped(`Explanation: ${q.explanation}`, 25, 8.5, 'italic', [71, 85, 105]);
          }
          y += 5;
        });
      }

      y += 6;

      // 3. CORRECT ANSWERS
      const correctQs = reportData.filter(r => r.is_correct && r.category !== "Coding");
      addSectionHeader(`3. Correct Answers (${correctQs.length} Questions)`, [16, 185, 129]);

      if (correctQs.length === 0) {
        printWrapped("No non-coding questions were answered correctly.", 25, 9.5, 'italic', [100, 116, 139]);
        y += 4;
      } else {
        correctQs.forEach((q, i) => {
          checkPageBreak(20);
          printWrapped(`Question ${i + 1} [${q.category} ➜ ${q.topic}]`, 20, 10, 'bold', [16, 185, 129]);
          printWrapped(q.question, 20, 9.5, 'normal', [15, 23, 42]);
          printWrapped(`Your Answer (Correct): ${q.correct_option}`, 25, 9, 'bold', [16, 185, 129]);
          if (q.explanation) {
            printWrapped(`Explanation: ${q.explanation}`, 25, 8.5, 'italic', [71, 85, 105]);
          }
          y += 5;
        });
      }

      y += 6;

      // 4. CODING REVIEWS
      const codingQs = reportData.filter(r => r.category === "Coding");
      addSectionHeader(`4. Coding Challenges & Technical Reviews (${codingQs.length} Problems)`, [79, 70, 229]);

      if (codingQs.length === 0) {
        printWrapped("No coding questions available.", 25, 9.5, 'italic', [100, 116, 139]);
        y += 4;
      } else {
        codingQs.forEach((q, i) => {
          checkPageBreak(30);
          printWrapped(`Coding Challenge ${i + 1}: ${q.topic}`, 20, 10.5, 'bold', [79, 70, 229]);
          printWrapped(`Problem Prompt:`, 20, 9.5, 'bold', [15, 23, 42]);
          printWrapped(q.question, 20, 9, 'normal', [30, 41, 59]);

          if (q.coding_details) {
            printWrapped(`Test Cases Passed: ${q.coding_details.passed_cases} / ${q.coding_details.total_cases}`, 25, 9, 'bold', [37, 99, 235]);
            printWrapped(`Complexity Bounds: Time (${q.coding_details.time_complexity}) | Space (${q.coding_details.space_complexity})`, 25, 9, 'bold', [100, 116, 139]);

            if (q.coding_details.user_code && q.coding_details.user_code.trim()) {
              printWrapped(`Candidate Submitted Solution:`, 25, 9, 'bold', [225, 29, 72]);
              printWrapped(q.coding_details.user_code, 25, 8, 'normal', [120, 40, 40], 4);
            } else {
              printWrapped(`Candidate Submitted Solution: [No Solution Code Submitted]`, 25, 9, 'italic', [148, 163, 184]);
            }

            if (q.coding_details.optimal_code) {
              printWrapped(`Optimal Reference Solution:`, 25, 9, 'bold', [16, 185, 129]);
              printWrapped(q.coding_details.optimal_code, 25, 8, 'normal', [20, 90, 50], 4);
            }
          }

          if (q.explanation) {
            printWrapped(`Optimal Solution Analysis: ${q.explanation}`, 25, 8.5, 'italic', [71, 85, 105]);
          }
          y += 6;
        });
      }

      doc.save(`Learniverse_Placement_Assessment_Report_${rollNumber || 'Candidate'}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans"
         onCopy={(e) => e.preventDefault()}
         onPaste={(e) => e.preventDefault()}
         onCut={(e) => e.preventDefault()}
         onContextMenu={(e) => e.preventDefault()}>
      
      {isOffline && (
        <div className="bg-amber-600/90 backdrop-blur-md text-white font-bold py-2 text-center text-xs w-full z-50 fixed top-0 left-0 shadow-lg flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Network connection offline. Progress is safely preserved in local storage and will sync upon reconnection.</span>
        </div>
      )}

      {proctorWarning && (
        <div className="bg-rose-600/90 backdrop-blur-md text-white font-bold py-2.5 text-center text-xs sm:text-sm w-full z-50 fixed top-0 left-0 shadow-lg animate-pulse flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{proctorWarning}</span>
        </div>
      )}
      
      {step === 'landing' && (
        <div className="max-w-4xl w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-950/40 text-slate-100 transition-all duration-300 animate-fade-in my-8">
          
          <div className="flex flex-col sm:flex-row items-center sm:justify-between border-b border-slate-800 pb-6 mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  PLACEMENT TEST
                </h1>
                <p className="text-xs font-medium text-slate-400 mt-1">EVALUATION SYSTEM v2.0</p>
              </div>
            </div>
            
            {/* Main Portal View Selector */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setMainTab('student')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mainTab === 'student' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Candidate Portal
              </button>
              <button
                onClick={() => {
                  setMainTab('admin');
                  fetchAdminSessions();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mainTab === 'admin' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🛡 Proctor Admin Console
              </button>
            </div>
          </div>

          {mainTab === 'admin' ? (
            /* Proctor Admin Console View */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search by Roll Number or Name..."
                    className="bg-slate-900 border border-slate-700 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder:text-slate-500 w-full sm:w-64 outline-none focus:border-indigo-500"
                  />
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs px-3.5 py-2.5 rounded-xl text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="started">Active Exam</option>
                    <option value="completed">Completed</option>
                    <option value="disqualified">Disqualified</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={fetchAdminSessions}
                    disabled={adminLoading}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    🔄 {adminLoading ? 'Loading...' : 'Refresh Sessions'}
                  </button>
                  <button
                    onClick={() => window.open('/api/assessment/admin/export', '_blank')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    📥 Export CSV
                  </button>
                </div>
              </div>

              {/* Sessions Table */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                {adminLoading ? (
                  <div className="p-12 text-center text-slate-400 text-xs font-mono">Loading active and past candidate sessions...</div>
                ) : adminSessions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs font-mono">No candidate sessions match the filter criteria.</div>
                ) : (
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-900 text-slate-400 uppercase font-mono font-bold text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Roll Number</th>
                          <th className="p-3.5">Candidate Name</th>
                          <th className="p-3.5">Branch</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Total Score</th>
                          <th className="p-3.5">Suspicion Score</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {adminSessions.map((session: any) => (
                          <tr key={session.session_id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5 font-bold text-indigo-400">{session.student_roll_number}</td>
                            <td className="p-3.5 font-sans font-semibold text-slate-200">{session.student_name || 'Candidate'}</td>
                            <td className="p-3.5 text-slate-400">{session.branch || 'CSE'}</td>
                            <td className="p-3.5">
                              {session.status === 'completed' ? (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-[10px]">COMPLETED</span>
                              ) : session.status === 'disqualified' ? (
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold text-[10px]">DISQUALIFIED</span>
                              ) : (
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold text-[10px] animate-pulse">IN PROGRESS</span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-white">{session.total_marks || '0.00'}</td>
                            <td className="p-3.5">
                              <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                                Number(session.suspicion_score || 0) > 40
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {session.suspicion_score || '0.00'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setSelectedAdminSession(session)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-semibold px-3 py-1 rounded-lg text-[11px] transition-all"
                              >
                                View Timeline
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Inspector Modal */}
              {selectedAdminSession && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-fade-in text-slate-100 max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-white">Candidate Proctor Audit Log</h3>
                        <p className="text-xs text-indigo-400 font-mono font-bold mt-0.5">{selectedAdminSession.student_roll_number} • {selectedAdminSession.student_name}</p>
                      </div>
                      <button
                        onClick={() => setSelectedAdminSession(null)}
                        className="text-slate-400 hover:text-white text-sm font-bold bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-lg flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Tab Switches</span>
                        <span className="font-bold text-white text-sm">{selectedAdminSession.tab_switch_count || 0}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Fullscreen Exits</span>
                        <span className="font-bold text-white text-sm">{selectedAdminSession.fullscreen_exit_count || 0}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Copy Attempts</span>
                        <span className="font-bold text-white text-sm">{selectedAdminSession.copy_attempts || 0}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Suspicion Score</span>
                        <span className="font-bold text-rose-400 text-sm">{selectedAdminSession.suspicion_score || 0}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recorded Integrity Events</h4>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono max-h-48 overflow-y-auto space-y-1.5">
                        {Array.isArray(selectedAdminSession.suspicious_events) && selectedAdminSession.suspicious_events.length > 0 ? (
                          selectedAdminSession.suspicious_events.map((evt: any, idx: number) => (
                            <div key={idx} className="flex items-start justify-between border-b border-slate-900 pb-1.5 text-slate-300">
                              <span className="text-rose-400 font-bold">[{evt.event || 'violation'}]</span>
                              <span className="text-slate-400 text-[10px]">{evt.details || 'Event triggered'}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 text-center py-3">No proctoring violations recorded for this candidate.</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedAdminSession(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                      >
                        Close Inspector
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            
            {/* Offerings list */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">1. PLACEMENT OFFERINGS</h2>
              
              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl hover:border-slate-700 transition-all">
                <span className="font-bold text-xs text-blue-400 block">CS & Coding Benchmark</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">62 questions covering Aptitude, Verbal Reasoning, Core CS fundamentals, and 2 live Coding challenges.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl hover:border-slate-700 transition-all">
                <span className="font-bold text-xs text-purple-400 block">AI Complexity Reports</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">Automated runtime performance review, time/space complexity limits verification, and optimal references.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl hover:border-slate-700 transition-all">
                <span className="font-bold text-xs text-emerald-400 block">Verified PDF Reports</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">Download detailed, professional scorecards with incorrect response tracking and safety clearance.</p>
              </div>
            </div>

            {/* Test mechanics list */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">2. TEST ENVIRONMENT</h2>

              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl hover:border-slate-700 transition-all">
                <span className="font-bold text-xs text-indigo-400 block">Automated Proctoring</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">AI presence loop tracks webcam frame. Face presence and focus is verified periodically throughout the exam.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl hover:border-slate-700 transition-all">
                <span className="font-bold text-xs text-rose-400 block">Anti-Cheat Tab Lockdown</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">Exiting fullscreen mode or switching browser tabs registers safety violations. Exceeding 3 violations disqualifies you.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl hover:border-slate-700 transition-all">
                <span className="font-bold text-xs text-cyan-400 block">Resume Support</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">If disconnected, you can log back in within the 120-minute window to resume your test from the same state.</p>
              </div>
            </div>

          </div>

          {/* Candidate Profile Registration Form */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-inner mb-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">3. CANDIDATE IDENTIFICATION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Candidate Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>👤 Full Name</span>
                  <span className="text-rose-400 font-semibold text-[11px]">* Required</span>
                </label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (studentNameError) setStudentNameError(null);
                  }}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-950 border border-slate-800 p-3 font-semibold text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                />
                {studentNameError && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1 font-mono">⚠️ {studentNameError}</p>
                )}
              </div>

              {/* Roll Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>🎓 Roll Number</span>
                  <span className="text-rose-400 font-semibold text-[11px]">* Required</span>
                </label>
                <input 
                  type="text" 
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value);
                    if (rollNumberError) setRollNumberError(null);
                  }}
                  placeholder="e.g. 23E51A0561"
                  maxLength={12}
                  className="w-full bg-slate-950 border border-slate-800 p-3 font-mono font-bold text-sm tracking-wider text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl uppercase transition-all"
                />
                {rollNumberError && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1 font-mono">⚠️ {rollNumberError}</p>
                )}
              </div>
            </div>

            {/* Branch / Department selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                🏫 Department / Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 text-xs font-semibold text-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="AI_DS">Artificial Intelligence & Data Science (AI/DS)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
                <option value="MECH">Mechanical Engineering</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="space-y-4 mb-6">
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-300 text-left flex items-start space-x-2 font-mono">
                <span className="text-base">⚠️</span>
                <div>
                  <span className="uppercase block font-bold text-[10px] mb-0.5">Assessment Setup Error:</span>
                  <p>{errorMsg}</p>
                </div>
              </div>
              <Button 
                onClick={handleResetAttempts}
                disabled={loadingQuestions}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3 rounded-xl border border-slate-700 transition-all"
              >
                {loadingQuestions ? 'Resetting...' : 'Reset Attempts & Start Fresh'}
              </Button>
            </div>
          )}

          <Button 
            onClick={async () => {
              const ok = await startAssessmentSession(rollNumber, studentName);
              if (ok) setStep('instructions');
            }} 
            disabled={loadingQuestions}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loadingQuestions ? 'Preloading Questions...' : 'Begin Assessment Setup'}
          </Button>
            </>
          )}
        </div>
      )}



      {step === 'instructions' && (
        <div className="max-w-lg w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 space-y-6 animate-fade-in text-slate-100">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Assessment Guidelines</h2>
          
          <div className="flex items-start gap-3 border-l-2 border-indigo-500 pl-4 py-3 bg-indigo-500/10 text-indigo-200 text-xs rounded-r-xl">
            <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">This system uses strict webcam and browser focus tracking. Any anomalous actions trigger warnings.</p>
          </div>

          <div className="text-sm text-slate-300 space-y-3.5 leading-relaxed">
            <ul className="space-y-3">
              <li className="flex items-start gap-3.5">
                <span className="text-indigo-400 mt-1 select-none font-bold">▪</span>
                <span>Fullscreen is <strong className="text-white font-bold">strictly mandatory</strong>. Exiting will pause the test.</span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="text-indigo-400 mt-1 select-none font-bold">▪</span>
                <span>Changing browser tabs or opening secondary apps records a <strong className="text-white font-bold">Violation</strong>.</span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="text-indigo-400 mt-1 select-none font-bold">▪</span>
                <span><strong className="text-rose-400 font-bold">3 violations</strong> will result in immediate disqualification and auto-submission.</span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="text-indigo-400 mt-1 select-none font-bold">▪</span>
                <span>Right-click, text selection, copy/paste shortcuts are disabled.</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={() => setStep('system_check')} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99]"
          >
            I Agree, Run Compatibility Check
          </Button>
        </div>
      )}

      {step === 'system_check' && (
        <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 text-center space-y-6 animate-fade-in text-slate-100">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Monitor className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">System Checks</h2>
          <div className="text-xs text-left bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono leading-relaxed text-emerald-400">
            <p>✓ Browser support: Verified (Chrome/Chromium V8)</p>
            <p>✓ Display resolution: Compatible ({window.innerWidth}x{window.innerHeight}px)</p>
            <p>✓ Connection Latency: 24ms (Optimal)</p>
            <p>✓ Monaco IDE Canvas: Preloaded</p>
            <p className={isMobileDevice() ? "text-rose-400" : "text-emerald-400"}>
              {isMobileDevice() ? "✗ Mobile device detected — use a desktop browser" : "✓ Device type: Desktop"}
            </p>
          </div>

          {mobileWarning && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-300 text-xs font-mono text-left space-y-1">
              <p className="font-bold text-rose-400 uppercase tracking-wide">⚠ Mobile Device Detected</p>
              <p>This assessment requires a desktop or laptop computer. Mobile phones and tablets are not permitted. Please switch devices and reload.</p>
            </div>
          )}

          <Button
            onClick={startCamera}
            disabled={mobileWarning}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50"
          >
            Activate Proctor Webcam
          </Button>
        </div>
      )}

      {step === 'camera_check' && (
        <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 text-center space-y-5 animate-fade-in text-slate-100">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Video className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Camera Calibration</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">Adjust your lighting and ensure your face is fully visible inside the frame.</p>
          </div>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 object-cover scale-x-[-1]" />
          <Button 
            onClick={() => setStep('fullscreen_gate')} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99]"
          >
            Verify Camera & Proceed
          </Button>
        </div>
      )}

      {step === 'fullscreen_gate' && (
        <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 text-center space-y-6 animate-fade-in text-slate-100">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <Maximize2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Secure Test Environment</h2>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">Clicking the button will lock this assessment into fullscreen and start the timer.</p>
          </div>
          <Button 
            onClick={enterFullScreen} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99]"
          >
            Lock Screen & Start Exam
          </Button>
        </div>
      )}

      {step === 'test' && currentQuestion && (
        <>
        <div className="w-full h-screen flex flex-col md:flex-row gap-6 p-4 box-border bg-slate-950 text-slate-100 relative">
          {/* Immediate Submitting Screen */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center z-50 p-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-2xl font-extrabold text-white">Submitting Assessment...</h2>
              <p className="text-slate-400 text-sm max-w-sm">Finalizing answers, please wait...</p>
            </div>
          )}

          {/* Dual-screen warning banner */}
          {dualScreenWarning && (
            <div className="fixed top-0 left-0 w-full z-40 bg-amber-500/90 text-slate-900 text-xs font-bold py-2 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Dual-monitor setup detected. Please use a single screen during this assessment. A violation has been recorded.
              <button onClick={() => setDualScreenWarning(false)} className="ml-3 underline">Dismiss</button>
            </div>
          )}

          {/* Pause Lockdown screen */}
          {isPaused && !isSubmitting && (
            <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-50 p-6 text-center">
              <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-rose-400 mb-2">LOCKOUT VIOLATION</h2>
              <p className="text-slate-300 text-sm max-w-md text-center mb-6 leading-relaxed">
                You exited fullscreen mode. An anomaly report has been recorded. Re-enter immediately to avoid test termination.
              </p>
              <Button onClick={enterFullScreen} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20">
                Re-enter Fullscreen
              </Button>
            </div>
          )}

          {/* Left panel: Question & Editor */}
          <div className="flex-1 flex flex-col bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 min-h-0 shadow-2xl shadow-indigo-950/20">
            {/* Section tabs */}
            <div className="flex border-b border-slate-800 mb-6 space-x-4 overflow-x-auto">
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
                  className={`pb-3 px-2 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${
                    activeSection === sec.id
                      ? 'border-blue-500 text-blue-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {sec.label} ({sec.length})
                </button>
              ))}
            </div>

            {/* Header info with live Violation Counter & Company Badges */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4 flex-wrap gap-2">
              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                  {currentQuestion.category} ➜ {currentQuestion.topic}
                </span>

                {/* Company Badges */}
                <div className="flex items-center gap-1.5">
                  {getQuestionCompanyTags(currentQuestion).map((comp) => (
                    <span key={comp} className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1">
                      🏢 {comp}
                    </span>
                  ))}
                </div>
                
                {/* Live Violation Badge */}
                <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                  violations === 0 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : violations < 3 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse' 
                    : 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-bounce'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Violations: {violations} / 3</span>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-xs">
                Question {currentIdx + 1} of {activeQs.length} ({currentQuestion.marks} Marks • <strong className="text-emerald-400 font-semibold">No Negative Marking</strong>)
              </span>
            </div>
            
            {/* Question description */}
            {currentQuestion.category === 'Coding' ? (
              <div className="flex-1 flex min-h-0 w-full overflow-hidden mt-2">
                <PanelGroup direction="horizontal">
                  {/* Left: Problem description & Examples */}
                  <Panel defaultSize={38} minSize={25}>
                    <div className="h-full overflow-y-auto pr-4 space-y-4 select-text">
                      {renderCodingProblemStatement(currentQuestion.question)}
                      
                      {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                        <div className="space-y-4 mt-6">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">Examples</h4>
                          {currentQuestion.examples.map((ex: any, idx: number) => (
                            <div 
                              key={idx} 
                              className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2.5 shadow-sm"
                            >
                              <p className="text-blue-400 font-bold">Example {idx + 1}:</p>
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
                      <div className="border-t border-slate-800 pt-6 mt-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">Stuck? Need a Hint?</h4>
                          {!hints[currentQuestion.id] && (
                            <Button 
                              onClick={() => handleRequestHint(currentQuestion.id)}
                              disabled={loadingHint[currentQuestion.id]}
                              size="sm"
                              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs px-3 py-1 h-7 rounded-lg"
                            >
                              {loadingHint[currentQuestion.id] ? "Generating..." : "Reveal Hint"}
                            </Button>
                          )}
                        </div>

                        {hints[currentQuestion.id] && (
                          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200/90 leading-relaxed space-y-1.5 animate-fade-in shadow-sm select-text">
                            <span className="font-bold text-indigo-400 block uppercase tracking-widest text-[9px] font-mono">Conceptual Coach Hint:</span>
                            <p>{hints[currentQuestion.id]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>

                  <PanelResizeHandle className="w-1.5 bg-slate-800/40 hover:bg-blue-500/40 transition-all cursor-col-resize mx-2 rounded" />

                  {/* Right: Monaco Editor + Console */}
                  <Panel defaultSize={62} minSize={40}>
                    <PanelGroup direction="vertical">
                      {/* Editor Panel */}
                      <Panel defaultSize={65} minSize={40}>
                        <div className="h-full flex flex-col border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                          <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-slate-800 flex-none">
                            <select
                              value={selectedLang}
                              onChange={(e) => setSelectedLang(e.target.value)}
                              className="border border-slate-800 bg-slate-950 text-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                            >
                              <option value="python">Python 3</option>
                              <option value="javascript">JavaScript</option>
                              <option value="cpp">C++ (GCC)</option>
                              <option value="java">Java 17</option>
                            </select>
                            <div className="flex items-center gap-2">
                              <Button onClick={handleRunCode} disabled={runningCode || submittingCode} size="sm" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs py-1 h-8 rounded-lg transition-all active:scale-[0.98] flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                {runningCode ? 'Running...' : 'Run Code'}
                              </Button>
                              <Button onClick={handleSubmitCode} disabled={runningCode || submittingCode} size="sm" className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white text-xs py-1 h-8 rounded-lg transition-all active:scale-[0.98] flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                {submittingCode ? 'Submitting...' : 'Submit Code'}
                              </Button>
                            </div>
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

                      <PanelResizeHandle className="h-1.5 bg-slate-800/40 hover:bg-blue-500/40 transition-all cursor-row-resize my-2 rounded" />

                      {/* Console Output Panel */}
                      <Panel defaultSize={35} minSize={20}>
                        <div className="h-full bg-slate-950 border border-slate-800 p-4 rounded-2xl overflow-y-auto font-mono text-xs flex flex-col">
                          <div className="flex items-center justify-between mb-2 flex-none">
                            <span className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Execution Output</span>
                            {compilationResult && currentQuestion && codingSubmissions[currentQuestion.id] && (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${codingSubmissions[currentQuestion.id].passed_cases === codingSubmissions[currentQuestion.id].total_cases ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                                {codingSubmissions[currentQuestion.id].passed_cases}/{codingSubmissions[currentQuestion.id].total_cases} Passed
                              </span>
                            )}
                          </div>
                          <div className="flex-1 overflow-y-auto min-h-0 space-y-2 text-[11px] leading-relaxed">
                            {compilationResult ? (
                              compilationResult.results && compilationResult.results.length > 0 ? (
                                compilationResult.results.map((r: any, idx: number) => (
                                  <div key={idx} className={`p-2.5 rounded-xl border ${r.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-[9px] font-bold uppercase ${r.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {r.passed ? '✓ Passed' : '✗ Failed'} — Case {idx + 1}
                                      </span>
                                    </div>
                                    {r.input && <p className="text-slate-400"><span className="text-slate-500">Input:</span> {r.input}</p>}
                                    <p className="text-slate-300"><span className="text-slate-500">Expected:</span> <span className="text-emerald-400">{r.expected}</span></p>
                                    <p className="text-slate-300"><span className="text-slate-500">Actual:</span> <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>{r.actual}</span></p>
                                  </div>
                                ))
                              ) : (
                                <pre className="text-slate-300 whitespace-pre-wrap font-mono">{compilationResult.raw_output || 'Completed successfully.'}</pre>
                              )
                            ) : (
                              <span className="text-slate-500">Console empty. Click "Run Code" to test or "Submit Code" to evaluate.</span>
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
                {renderQuestionStem(currentQuestion.question)}

                
                {/* Pictorial / case-based image */}
                <QuestionImage question={currentQuestion} />

                {/* Auto-generated chart for chart-related questions */}
                <AutoChart questionText={currentQuestion.question} />
                
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
                          className={`p-4 rounded-2xl text-left border text-sm md:text-base transition-all flex items-center space-x-3.5 ${
                            isSelected 
                              ? 'bg-blue-500/15 border-blue-500 text-blue-400 font-semibold shadow-sm' 
                              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-blue-600 border-transparent text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
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
            <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-auto">
              <Button
                variant="outline"
                disabled={currentIdx === 0 && activeSection === 'Aptitude'}
                onClick={handlePrev}
                className="border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setMarkedForReview(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                  className={`text-xs rounded-xl ${markedForReview[currentQuestion.id] ? 'text-purple-400 font-semibold bg-purple-500/10' : 'text-slate-400 hover:text-white'}`}
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
                  className="text-xs text-slate-400 hover:text-rose-400 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-1" /> Clear Answer
                </Button>
              </div>

              <Button
                disabled={currentIdx === activeQs.length - 1 && activeSection === 'Coding'}
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
              >
                Save & Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right panel: Palette & Proctor camera */}
          <div className="w-full md:w-80 flex flex-col space-y-6">
            
            {/* Live Timer details */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl text-center shadow-xl shadow-indigo-950/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Time Remaining</span>
              <p className="text-3xl font-mono font-bold text-blue-400 mt-1">{formatTime(timeLeft)}</p>
            </div>

            {/* Float proctored Webcam */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden p-3 relative shadow-xl shadow-indigo-950/20">
              <div className="absolute top-4 left-4 bg-emerald-500 w-2.5 h-2.5 rounded-full animate-ping" />
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-36 bg-slate-950 rounded-2xl object-cover scale-x-[-1] border border-slate-800" />
              <p className="text-[9px] text-center text-slate-400 mt-2 font-mono uppercase tracking-wider">AI Proctor Monitoring Active</p>
            </div>

            {/* Question Palette grid */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl flex-1 flex flex-col min-h-[340px] shadow-xl shadow-indigo-950/20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-extrabold text-white tracking-wide">Question Palette</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{currentIdx + 1} / {activeQs.length}</span>
              </div>
              
              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono mb-3 p-2 bg-slate-950/90 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-emerald-400 font-bold">Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
                  <span className="text-purple-300 font-bold">Marked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-rose-400 font-bold">Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shadow-sm" />
                  <span className="text-slate-400 font-bold">Not Visited</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[220px] pr-1.5 min-h-0 flex-1">
                {activeQs.map((q, idx) => {
                  const hasAnswered = (answers[q.id] !== undefined && answers[q.id] !== '') || Boolean(codingSubmissions[q.id]?.code);
                  const isFlagged = Boolean(markedForReview[q.id]);
                  const hasVisited = Boolean(visited[q.id]);
                  const isCurrent = currentIdx === idx;

                  let itemStyle = 'border-slate-800 bg-slate-950 text-slate-400';
                  if (isCurrent) {
                    itemStyle = 'border-blue-400 bg-blue-600/35 text-white font-extrabold ring-2 ring-blue-500 shadow-lg shadow-blue-500/30';
                  } else if (isFlagged && hasAnswered) {
                    itemStyle = 'border-purple-400 bg-purple-600/30 text-purple-200 font-bold ring-1 ring-purple-500/50';
                  } else if (isFlagged) {
                    itemStyle = 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold ring-1 ring-amber-500/40';
                  } else if (hasAnswered) {
                    itemStyle = 'border-emerald-500/80 bg-emerald-500/20 text-emerald-300 font-bold shadow-sm';
                  } else if (hasVisited) {
                    itemStyle = 'border-rose-800/80 bg-rose-950/20 text-rose-300 font-semibold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-10 h-10 rounded-xl border text-xs flex flex-col items-center justify-center relative transition-all ${itemStyle}`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 text-[9px]">🔖</span>
                      )}
                      {hasAnswered && !isFlagged && (
                        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => setShowSubmitModal(true)}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 rounded-xl mt-4 shadow-lg shadow-rose-500/20 transition-all"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting Assessment...' : 'Submit Assessment'}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Custom Submit Confirmation Modal ───────────────────────────── */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md p-7 space-y-5 animate-fade-in">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white leading-tight">Submit Assessment?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone</p>
                </div>
              </div>

              {/* Stats summary */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-sm">
                {(() => {
                  const attempted = Object.values(answers).filter(val => val.trim() !== '').length;
                  const total = questions.length;
                  const unattempted = total - attempted;
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Questions</span>
                        <span className="font-bold text-white">{total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400">Answered</span>
                        <span className="font-bold text-emerald-400">{attempted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-400">Not Answered</span>
                        <span className="font-bold text-amber-400">{unattempted}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-800 pt-2 mt-1">
                        <span className="text-slate-400">Violations Recorded</span>
                        <span className={`font-bold ${violations > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{violations} / 3</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Warning if unattempted */}
              {Object.values(answers).filter(val => val.trim() !== '').length < questions.length && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>You have unattempted questions. Once submitted, you cannot go back to answer them.</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={async () => {
                    setShowSubmitModal(false);
                    setIsPaused(false);
                    await enterFullScreen();
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                >
                  ← Go Back to Exam
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    submitAssessment();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-rose-500/20"
                >
                  {isSubmitting ? 'Submitting...' : 'Yes, Submit Final'}
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}

      {step === 'score' && resultsData && (
        <div className="max-w-4xl w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 space-y-8 animate-fade-in text-slate-100 my-8">
          {violations >= 3 ? (
            <div className="bg-rose-950/30 border border-rose-800/50 p-6 rounded-2xl text-center space-y-2">
              <XCircle className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
              <h2 className="text-2xl font-extrabold tracking-tight text-rose-400">ASSESSMENT DISQUALIFIED</h2>
              <p className="text-sm text-slate-300">The exam was automatically terminated after exceeding the policy threshold (3 violations).</p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Assessment Completed</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">Attempt graded successfully. Your metrics are outlined below.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-left font-mono">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Aptitude</span>
              <span className="text-lg font-extrabold text-white">{resultsData.aptitude} <span className="text-xs text-slate-400 font-normal">Marks</span></span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Verbal</span>
              <span className="text-lg font-extrabold text-white">{resultsData.verbal} <span className="text-xs text-slate-400 font-normal">Marks</span></span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Fundamentals</span>
              <span className="text-lg font-extrabold text-white">{resultsData.comp_fundamentals || 0} <span className="text-xs text-slate-400 font-normal">Marks</span></span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Coding</span>
              <span className="text-lg font-extrabold text-white">{resultsData.coding} <span className="text-xs text-slate-400 font-normal">Marks</span></span>
            </div>
            <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 col-span-2 md:col-span-1 text-center shadow-lg shadow-indigo-950/20">
              <span className="text-[10px] text-indigo-400 block uppercase font-bold tracking-wider mb-1">Total Score</span>
              <span className="text-lg font-black text-indigo-400">{resultsData.total} <span className="text-xs text-indigo-300 font-normal">Marks</span></span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-left space-y-2 text-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2">📋 <span className="font-semibold text-slate-200">Violations Count</span>: <span className="font-mono text-slate-300 font-bold">{violations} violations recorded.</span></p>
              <p className="flex items-center gap-2">🛡 <span className="font-semibold text-slate-200">Safety Clearance</span>: {violations >= 3 ? <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">Declined</span> : <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Approved</span>}</p>
            </div>
            <Button onClick={downloadPDFReport} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20">
              Download Detailed Report (PDF)
            </Button>
          </div>

          {/* Interactive Report Viewer */}
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-bold border-b border-slate-800 pb-3 text-white">Post-Exam Analysis Report</h3>
            
            {/* Filter Tabs */}
            <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
              {[
                { id: 'wrong', label: 'What Went Wrong' },
                { id: 'unattempted', label: 'Did Not Attempt' },
                { id: 'correct', label: 'Correct Answers' },
                { id: 'coding', label: 'Coding Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setReportTab(tab.id as any)}
                  className={`pb-3 border-b-2 transition-all ${reportTab === tab.id ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List Viewer */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {reportTab === 'wrong' && (
                reportData.filter(r => !r.is_correct && r.user_answer !== "" && r.category !== "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No incorrect attempts! Excellent work.</p>
                ) : (
                  reportData.filter(r => !r.is_correct && r.user_answer !== "" && r.category !== "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                      <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">{q.category} ➜ {q.topic}</span>
                      <h4 className="font-semibold text-slate-100 text-base leading-snug">{q.question}</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs mt-2 pt-2 border-t border-slate-900">
                        <p className="text-rose-400 font-medium"><span className="font-semibold text-slate-400">Your Answer:</span> {q.user_answer}</p>
                        <p className="text-emerald-400 font-medium"><span className="font-semibold text-slate-400">Correct Option:</span> {q.correct_option}</p>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 mt-2 leading-relaxed"><span className="font-bold text-slate-200">Explanation:</span> {q.explanation}</p>
                    </div>
                  ))
                )
              )}

              {reportTab === 'unattempted' && (
                reportData.filter(r => r.user_answer === "" && r.category !== "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No questions left unattempted!</p>
                ) : (
                  reportData.filter(r => r.user_answer === "" && r.category !== "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                      <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">{q.category} ➜ {q.topic}</span>
                      <h4 className="font-semibold text-slate-100 text-base leading-snug">{q.question}</h4>
                      <p className="text-xs text-emerald-400 mt-2 font-semibold"><span className="font-semibold text-slate-400">Correct Option:</span> {q.correct_option}</p>
                      <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 mt-1 leading-relaxed"><span className="font-bold text-slate-200">Explanation:</span> {q.explanation}</p>
                    </div>
                  ))
                )
              )}

              {reportTab === 'correct' && (
                reportData.filter(r => r.is_correct && r.category !== "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No correct answers found.</p>
                ) : (
                  reportData.filter(r => r.is_correct && r.category !== "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">{q.category} ➜ {q.topic}</span>
                      <h4 className="font-semibold text-slate-100 text-base leading-snug">{q.question}</h4>
                      <p className="text-xs text-emerald-400 mt-2 font-semibold"><span className="font-semibold text-slate-400">Your Correct Answer:</span> {q.correct_option}</p>
                      <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 mt-1 leading-relaxed"><span className="font-bold text-slate-200">Explanation:</span> {q.explanation}</p>
                    </div>
                  ))
                )
              )}

              {reportTab === 'coding' && (
                reportData.filter(r => r.category === "Coding").length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No coding submissions found.</p>
                ) : (
                  reportData.filter(r => r.category === "Coding").map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">Coding Challenge ➜ {q.topic}</span>
                        <span className="text-xs text-slate-300 font-mono bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg">Passed: {q.coding_details.passed_cases}/{q.coding_details.total_cases} test cases</span>
                      </div>
                      <h4 className="font-semibold text-slate-100 text-base leading-snug">{q.question}</h4>
                      
                      {/* Code comparison panel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Your Solution Code:</span>
                          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-rose-300 max-h-[200px]">{q.coding_details.user_code || '// No code submitted'}</pre>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Optimal Reference Solution:</span>
                          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-emerald-300 max-h-[200px]">{q.coding_details.optimal_code || '// Optimal solution template'}</pre>
                        </div>
                      </div>

                      {/* Complexity details */}
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex space-x-6 font-mono text-[10px] uppercase text-indigo-400">
                          <span>Time Complexity limit: <strong className="text-slate-200">{q.coding_details.time_complexity}</strong></span>
                          <span>Space Complexity limit: <strong className="text-slate-200">{q.coding_details.space_complexity}</strong></span>
                        </div>
                        <p className="text-slate-300 border-t border-slate-800 pt-2 leading-relaxed"><span className="font-bold text-slate-200">Optimal Explanation:</span> {q.explanation}</p>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              onClick={async () => {
                setAnswers({});
                setViolations(0);
                setResultsData(null);
                setReportData([]);
                setAttemptId(null);
                setErrorMsg(null);
                if (rollNumber && validateRollNumber(rollNumber)) {
                  const ok = await startAssessmentSession(rollNumber);
                  if (ok) setStep('instructions');
                } else {
                  setStep('landing');
                }
              }} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99]"
            >
              🔄 Retake Assessment (Unlimited Attempts)
            </Button>

            <Button onClick={() => setStep('landing')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-6 rounded-xl border border-slate-700 text-sm transition-all">
              Return to Landing Portal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
