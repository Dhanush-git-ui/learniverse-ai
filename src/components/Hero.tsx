import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  Share2, 
  MoreVertical, 
  Check, 
  Layers, 
  Link2, 
  Disc, 
  GitBranch, 
  Cpu, 
  BarChart2, 
  Hash, 
  User,
  Brain,
  Code2,
  Play,
  Send,
  ChevronDown
} from 'lucide-react';

const Hero = () => {
  // Current active section step: 0 = Understand, 1 = Think, 2 = Practice, 3 = Get Challenged, 4 = Master
  const [activeStep, setActiveStep] = useState<number>(0);

  // Interactive states for individual cards
  const [understandAnswer, setUnderstandAnswer] = useState<string>('');
  const [thinkSelectedHalf, setThinkSelectedHalf] = useState<'left' | 'right'>('left');
  const [practiceRunning, setPracticeRunning] = useState<boolean>(false);
  const [practiceOutput, setPracticeOutput] = useState<string | null>(null);
  const [challengeSelectedOption, setChallengeSelectedOption] = useState<string>('O(log n)');
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);

  const steps = [
    { 
      label: 'Understand', 
      icon: BookOpen,
      dotColor: 'bg-[#2563eb]', 
      ringColor: 'ring-blue-100', 
      textColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-100 text-blue-600',
      progressBarBg: 'bg-[#2563eb]',
      progressPct: 20
    },
    { 
      label: 'Think', 
      icon: Brain,
      dotColor: 'bg-purple-600', 
      ringColor: 'ring-purple-100', 
      textColor: 'text-purple-600',
      badgeBg: 'bg-purple-50 border-purple-100 text-purple-600',
      progressBarBg: 'bg-purple-600',
      progressPct: 40
    },
    { 
      label: 'Practice', 
      icon: Code2,
      dotColor: 'bg-emerald-500', 
      ringColor: 'ring-emerald-100', 
      textColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      progressBarBg: 'bg-emerald-500',
      progressPct: 60
    },
    { 
      label: 'Get Challenged', 
      icon: Target,
      dotColor: 'bg-orange-500', 
      ringColor: 'ring-orange-100', 
      textColor: 'text-orange-600',
      badgeBg: 'bg-orange-50 border-orange-100 text-orange-600',
      progressBarBg: 'bg-orange-500',
      progressPct: 80
    },
    { 
      label: 'Master', 
      icon: BarChart2,
      dotColor: 'bg-[#2563eb]', 
      ringColor: 'ring-blue-100', 
      textColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-100 text-blue-600',
      progressBarBg: 'bg-[#2563eb]',
      progressPct: 100
    },
  ];

  const dsaTopics = [
    { 
      title: 'Arrays', 
      icon: Layers, 
      slug: 'arrays', 
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-[#2563eb]',
      hoverText: 'group-hover:text-blue-600',
      hoverBorder: 'hover:border-blue-300'
    },
    { 
      title: 'Linked Lists', 
      icon: Link2, 
      slug: 'linked-lists', 
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600',
      hoverText: 'group-hover:text-emerald-600',
      hoverBorder: 'hover:border-emerald-300'
    },
    { 
      title: 'Stacks & Queues', 
      icon: Disc, 
      slug: 'stacks-and-queues', 
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-600',
      hoverText: 'group-hover:text-purple-600',
      hoverBorder: 'hover:border-purple-300'
    },
    { 
      title: 'Trees', 
      icon: GitBranch, 
      slug: 'trees', 
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600',
      hoverText: 'group-hover:text-emerald-600',
      hoverBorder: 'hover:border-emerald-300'
    },
    { 
      title: 'Graphs', 
      icon: Share2, 
      slug: 'graphs', 
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-600',
      hoverText: 'group-hover:text-purple-600',
      hoverBorder: 'hover:border-purple-300'
    },
    { 
      title: 'Dynamic Programming', 
      icon: Cpu, 
      slug: 'dynamic-programming', 
      iconBg: 'bg-rose-50 border-rose-100 text-rose-600 group-hover:bg-rose-600',
      hoverText: 'group-hover:text-rose-600',
      hoverBorder: 'hover:border-rose-300'
    },
    { 
      title: 'Sorting', 
      icon: BarChart2, 
      slug: 'sorting-algorithms', 
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-600',
      hoverText: 'group-hover:text-amber-600',
      hoverBorder: 'hover:border-amber-300'
    },
    { 
      title: 'Hashing', 
      icon: Hash, 
      slug: 'searching-algorithms', 
      iconBg: 'bg-rose-50 border-rose-100 text-rose-600 group-hover:bg-rose-600',
      hoverText: 'group-hover:text-rose-600',
      hoverBorder: 'hover:border-rose-300'
    },
  ];

  const handleRunCode = () => {
    setPracticeRunning(true);
    setPracticeOutput(null);
    setTimeout(() => {
      setPracticeRunning(false);
      setPracticeOutput('Found target 7 at index 3 (Comparisons: 1, Time: O(log n))');
    }, 700);
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 font-sans select-none">
      
      {/* ── Background: Technical Grid & Blueprint Coordinate Contours ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg 
          className="absolute inset-0 w-full h-full opacity-70" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.2" fill="#cbd5e1" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)" />
          
          {/* Smooth curved coordinate arcs spanning the background */}
          <path d="M -50,220 C 350,130 750,380 1600,180" fill="none" stroke="#dbeafe" strokeWidth="1.5" opacity="0.8" />
          <path d="M 50,480 C 450,330 850,560 1600,340" fill="none" stroke="#e0f2fe" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
          
          {/* Circuit connection nodes */}
          <circle cx="360" cy="180" r="3.5" fill="#38bdf8" />
          <circle cx="360" cy="180" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
          <circle cx="920" cy="360" r="3.5" fill="#38bdf8" />
          <circle cx="920" cy="360" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
          
          {/* Concentric radar circles on right side behind card */}
          <circle cx="1060" cy="320" r="340" fill="none" stroke="#f0f9ff" strokeWidth="1.5" />
          <circle cx="1060" cy="320" r="230" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.8" />
          <circle cx="1060" cy="320" r="120" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
        </svg>

        {/* Soft atmospheric radial gradient glows */}
        <div className="absolute top-10 right-1/4 w-[520px] h-[520px] bg-blue-50/70 rounded-full blur-3xl -z-10" />
        <div className="absolute -top-10 left-12 w-80 h-80 bg-sky-50/60 rounded-full blur-2xl -z-10" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Main 2-column layout: Left typography vs Right interactive preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 sm:pt-4">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: HERO HEADLINE, SUBTEXT, CTAS, STATS            */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-6.5">
            
            {/* Pill Badge: AI-POWERED DSA LEARNING */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-600 text-[11px] font-bold tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>AI-POWERED DSA LEARNING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-slate-800 leading-[1.08]">
              Master <br />
              <span className="text-[#2563eb] inline-block">Data Structures</span> <br />
              & Algorithms <br />
              <span className="text-slate-700 font-semibold text-3xl sm:text-4xl lg:text-[44px] block mt-1 tracking-tight">
                with AI conversations.
              </span>
            </h1>

            {/* Sub-headline: 2 concise lines */}
            <div className="space-y-1 text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
              <p className="font-normal text-slate-600">Learn concepts. Write code. Get challenged.</p>
              <p className="font-normal text-slate-500">Build the problem-solving skills companies actually test.</p>
            </div>

            {/* CTA Buttons: Start Learning & Explore Topics */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/topics"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                to="/topics"
                className="bg-white hover:bg-slate-50 hover:border-purple-200 hover:text-purple-700 border border-slate-200 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-xl shadow-xs flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-500 stroke-[2]" />
                <span>Explore Topics</span>
              </Link>
            </div>

            {/* Metrics Row: Infused with Yellow, Green, and Purple to reduce black */}
            <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8">
              {/* 12+ Topics: Yellow / Amber Accent */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <BookOpen className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm leading-tight">12+</div>
                  <div className="text-[11px] font-medium text-slate-500">Topics</div>
                </div>
              </div>

              {/* 607+ Concepts: Green / Emerald Accent */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Share2 className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm leading-tight">607+</div>
                  <div className="text-[11px] font-medium text-slate-500">Concepts</div>
                </div>
              </div>

              {/* AI-Guided Learning Path: Purple Accent */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Target className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm leading-tight">AI-Guided</div>
                  <div className="text-[11px] font-medium text-slate-500">Learning Path</div>
                </div>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: INTERACTIVE STACKED CARDS FOR ALL 5 SECTIONS  */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-xl flex items-center gap-3 sm:gap-5">
              
              {/* ── Realistic Layered Backdrop Cards from Image 1 ─── */}
              {/* Layer 1: Farthest tilted translucent backdrop */}
              <div 
                className="absolute -inset-5 bg-[#e0f2fe]/40 rounded-[36px] -rotate-3 transform -translate-x-3 translate-y-3 -z-20 border border-blue-200/40 shadow-xs pointer-events-none" 
              />
              {/* Layer 2: Middle tilted soft blue backdrop */}
              <div 
                className="absolute -inset-3 bg-[#eff6ff] rounded-[34px] rotate-2 transform translate-x-2 -translate-y-1 -z-10 border border-blue-100/70 shadow-2xs pointer-events-none" 
              />

              {/* ── Main Foreground White Card (Dynamic for Current Step) ── */}
              <div className="flex-1 bg-white border border-slate-200/90 rounded-[28px] shadow-2xl shadow-blue-900/10 p-5 sm:p-6 space-y-4 relative z-10 transition-all duration-300">
                
                {/* ─────────────────────────────────────────────────── */}
                {/* 1. UNDERSTAND CARD (Step 0)                        */}
                {/* ─────────────────────────────────────────────────── */}
                {activeStep === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Header: Book icon + Understand + 20% */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                          Understand
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-24 h-2 bg-blue-100/80 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2563eb] rounded-full w-[20%]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 font-mono">20%</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer" aria-label="Menu">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Teacher AI (Explaining) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Teacher AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-semibold">
                            Explaining
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Let's understand Binary Search step by step. We compare the target with the middle element and reduce the search space by half.
                      </p>

                      {/* Array Visualization */}
                      <div className="ml-9 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 space-y-1.5">
                        <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-blue-600">mid</span>
                            <span className="w-0.5 h-1.5 bg-blue-600 rounded-full" />
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm">
                          {[1, 3, 5].map((num) => (
                            <div key={num} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-semibold shadow-2xs">
                              {num}
                            </div>
                          ))}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/30 border border-[#2563eb]">
                            7
                          </div>
                          {[9, 11, 13].map((num) => (
                            <div key={num} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-semibold shadow-2xs">
                              {num}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-2 pt-0.5">
                          <span>← left</span>
                          <span>right →</span>
                        </div>
                      </div>
                    </div>

                    {/* Your Turn (Understand) with Text Input */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Your Turn</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-semibold">
                            Understand
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-700 pl-9 font-medium">
                        What is the main idea behind Binary Search?
                      </p>

                      <div className="pl-9 pt-0.5 flex items-center gap-2">
                        <input
                          type="text"
                          value={understandAnswer}
                          onChange={(e) => setUnderstandAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (understandAnswer.trim()) {
                              setActiveStep(1); // advance to Think
                            }
                          }}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white p-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                          aria-label="Submit Answer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Peer AI (Hint) */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Peer AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold">
                            Hint
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Think about how comparing with the middle element helps us reduce the search space.
                      </p>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────── */}
                {/* 2. THINK CARD (Step 1)                             */}
                {/* ─────────────────────────────────────────────────── */}
                {activeStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Header: Brain icon + Think + 40% */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                          <Brain className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                          Think
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-24 h-2 bg-purple-100/80 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full w-[40%]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 font-mono">40%</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer" aria-label="Menu">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Teacher AI (Explaining) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Teacher AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-semibold">
                            Explaining
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        If the target is smaller than mid, we search in the left half because the array is sorted in ascending order.
                      </p>

                      {/* Array Visualization with Purple Mid */}
                      <div className="ml-9 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 space-y-1.5">
                        <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-purple-600">mid</span>
                            <span className="w-0.5 h-1.5 bg-purple-600 rounded-full" />
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm">
                          {[1, 3, 5].map((num) => (
                            <div key={num} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-semibold shadow-2xs">
                              {num}
                            </div>
                          ))}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm shadow-purple-500/30 border border-purple-600">
                            7
                          </div>
                          {[9, 11, 13].map((num) => (
                            <div key={num} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-semibold shadow-2xs">
                              {num}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-2 pt-0.5">
                          <span>← left</span>
                          <span>right →</span>
                        </div>
                      </div>
                    </div>

                    {/* Your Turn (Think) with Left / Right half choice */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Your Turn</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-semibold">
                            Think
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-700 pl-9 font-medium">
                        If the target is smaller than mid, which half can we eliminate?
                      </p>

                      <div className="flex items-center gap-2 pl-9 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setThinkSelectedHalf('left')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            thinkSelectedHalf === 'left'
                              ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {thinkSelectedHalf === 'left' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          <span>Left half</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setThinkSelectedHalf('right')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            thinkSelectedHalf === 'right'
                              ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {thinkSelectedHalf === 'right' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          <span>Right half</span>
                        </button>
                      </div>
                    </div>

                    {/* Peer AI (Challenge) */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Peer AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold">
                            Challenge
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Are you sure? Try thinking about what the sorted order tells us about the left side.
                      </p>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────── */}
                {/* 3. PRACTICE CARD (Step 2)                           */}
                {/* ─────────────────────────────────────────────────── */}
                {activeStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Header: Code icon + Practice + 60% */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                          Practice
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-24 h-2 bg-emerald-100/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 font-mono">60%</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer" aria-label="Menu">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Teacher AI (Explaining) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Teacher AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-semibold">
                            Explaining
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Let's write the binary search function and test it with examples.
                      </p>

                      {/* Python Code Snippet Box */}
                      <div className="ml-9 bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-sm">
                        {/* Editor Header Bar */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                            <span>Python</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </div>

                          <button
                            type="button"
                            onClick={handleRunCode}
                            disabled={practiceRunning}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{practiceRunning ? 'Running...' : 'Run'}</span>
                          </button>
                        </div>

                        {/* Code Lines */}
                        <pre className="font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto text-slate-300">
                          <code>
                            <span className="text-slate-500 select-none mr-2"> 1</span><span className="text-purple-400">def</span> <span className="text-blue-400">binary_search</span>(arr, target):{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 2</span>    left, right = <span className="text-amber-400">0</span>, <span className="text-blue-300">len</span>(arr) - <span className="text-amber-400">1</span>{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 3</span>    <span className="text-purple-400">while</span> left &lt;= right:{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 4</span>        mid = (left + right) // <span className="text-amber-400">2</span>{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 5</span>        <span className="text-purple-400">if</span> arr[mid] == target:{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 6</span>            <span className="text-purple-400">return</span> mid{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 7</span>        <span className="text-purple-400">elif</span> arr[mid] &gt; target:{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 8</span>            right = mid - <span className="text-amber-400">1</span>{'\n'}
                            <span className="text-slate-500 select-none mr-2"> 9</span>        <span className="text-purple-400">else</span>:{'\n'}
                            <span className="text-slate-500 select-none mr-2">10</span>            left = mid + <span className="text-amber-400">1</span>{'\n'}
                            <span className="text-slate-500 select-none mr-2">11</span>    <span className="text-purple-400">return</span> -<span className="text-amber-400">1</span>
                          </code>
                        </pre>

                        {/* Interactive Execution Output */}
                        {practiceOutput && (
                          <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-2.5 text-[11px] font-mono text-emerald-400 animate-fade-in flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>{practiceOutput}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Your Turn (Practice) */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Your Turn</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-semibold">
                            Practice
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-700 pl-9 font-medium">
                        Try running the code with different inputs.
                      </p>

                      <div className="flex items-center gap-2 pl-9 pt-0.5">
                        <button
                          type="button"
                          onClick={handleRunCode}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Run Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPracticeOutput('Custom Input: arr=[2, 4, 6, 8, 10], target=8 -> Found at index 3')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                        >
                          <span>Change Input</span>
                        </button>
                      </div>
                    </div>

                    {/* Peer AI (Hint) */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Peer AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold">
                            Hint
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Test with a number that is not in the array. What happens?
                      </p>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────── */}
                {/* 4. GET CHALLENGED CARD (Step 3)                     */}
                {/* ─────────────────────────────────────────────────── */}
                {activeStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Header: Target icon + Get Challenged + 80% */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-2xs">
                          <Target className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                          Get Challenged
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-24 h-2 bg-orange-100/80 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full w-[80%]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 font-mono">80%</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer" aria-label="Menu">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Teacher AI (Explaining) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Teacher AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-semibold">
                            Explaining
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Let's test your understanding with a challenge question.
                      </p>

                      {/* Challenge Quiz Box */}
                      <div className="ml-9 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                        <p className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                          In a sorted array of size n, what is the time complexity of Binary Search?
                        </p>

                        <div className="space-y-2 font-mono text-xs">
                          {['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'].map((opt) => (
                            <label
                              key={opt}
                              onClick={() => setChallengeSelectedOption(opt)}
                              className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                                challengeSelectedOption === opt
                                  ? 'bg-white border-orange-400 shadow-xs text-orange-950 font-bold'
                                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                challengeSelectedOption === opt ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                              }`}>
                                {challengeSelectedOption === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Your Turn (Challenge) */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Your Turn</span>
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-semibold">
                            Challenge
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-700 pl-9 font-medium">
                        Select the correct answer and explain your reasoning.
                      </p>

                      <div className="pl-9 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setChallengeSubmitted(true);
                            setTimeout(() => setActiveStep(4), 600); // Advance to Master
                          }}
                          className="bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs py-2 px-6 rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                        >
                          {challengeSubmitted ? 'Correct! ✓' : 'Submit Answer'}
                        </button>
                      </div>
                    </div>

                    {/* Peer AI (Hint) */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Peer AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold">
                            Hint
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Think about how the search space changes in each step.
                      </p>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────── */}
                {/* 5. MASTER CARD (Step 4)                             */}
                {/* ─────────────────────────────────────────────────── */}
                {activeStep === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Header: BarChart icon + Master + 100% */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                          <BarChart2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                          Master
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-24 h-2 bg-blue-100/80 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2563eb] rounded-full w-[100%]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 font-mono">100%</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer" aria-label="Menu">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Teacher AI (Explaining) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Teacher AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-semibold">
                            Explaining
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Great! You've understood the concept, practiced the code, and solved challenges. Keep going to strengthen your skills.
                      </p>

                      {/* Your Progress Box */}
                      <div className="ml-9 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <BarChart2 className="w-4 h-4 text-blue-600" />
                          <span>Your Progress</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <div className="flex justify-between items-center text-[11px] font-medium text-slate-600 mb-1">
                              <span>Understanding</span>
                              <span className="font-mono font-bold text-slate-800">82%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full w-[82%]" />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[11px] font-medium text-slate-600 mb-1">
                              <span>Problem Solving</span>
                              <span className="font-mono font-bold text-slate-800">61%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full w-[61%]" />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[11px] font-medium text-slate-600 mb-1">
                              <span>Implementation</span>
                              <span className="font-mono font-bold text-slate-800">48%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full w-[48%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Your Turn (Master) */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Your Turn</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-semibold">
                            Master
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-700 pl-9 font-medium">
                        You're ready for more advanced problems. Want to try a new challenge?
                      </p>

                      <div className="pl-9 pt-0.5">
                        <Link
                          to="/topics"
                          className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                        >
                          <span>Next Problem</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Peer AI (Motivation) */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">Peer AI</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold">
                            Motivation
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                        Nice progress! Keep solving problems to get interview ready.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* ── Stepper Track to the Right of the Card (Interactive Switcher) ── */}
              <div className="hidden sm:flex flex-col items-start gap-6 py-4 pl-1">
                {steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={step.label}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className="flex items-center gap-2.5 group cursor-pointer text-left transition-all"
                      title={`Switch to ${step.label} stage`}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Connecting vertical line */}
                        {idx !== steps.length - 1 && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                        )}

                        {/* Node circle */}
                        <div
                          className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                            isActive
                              ? `${step.dotColor} ring-4 ${step.ringColor}`
                              : 'bg-white border-2 border-slate-300 group-hover:border-blue-400'
                          }`}
                        />
                      </div>

                      <span
                        className={`text-xs transition-colors whitespace-nowrap ${
                          isActive
                            ? `font-bold ${step.textColor}`
                            : 'font-medium text-slate-400 group-hover:text-slate-700'
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BOTTOM STRIP: LEARN DSA TOPICS (Multi-colored Palette)      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="mt-14 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              LEARN DSA TOPICS
            </span>
            <Link
              to="/topics"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 8 Topics Grid with signature Yellow, Red, Green, Purple & Blue accents */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {dsaTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.title}
                  to={`/topics/${topic.slug}`}
                  className={`bg-white hover:bg-slate-50/80 border border-slate-200/90 ${topic.hoverBorder} rounded-2xl py-3 px-3.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-all duration-200 group`}
                >
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors flex-shrink-0 ${topic.iconBg}`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className={`text-xs font-bold text-slate-700 ${topic.hoverText} transition-colors truncate`}>
                    {topic.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
