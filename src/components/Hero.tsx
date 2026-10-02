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
  User 
} from 'lucide-react';

const Hero = () => {
  const [selectedHalf, setSelectedHalf] = useState<'left' | 'right'>('left');
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { label: 'Understand' },
    { label: 'Think' },
    { label: 'Practice' },
    { label: 'Get Challenged' },
    { label: 'Master' },
  ];

  const dsaTopics = [
    { title: 'Arrays', icon: Layers, slug: 'arrays' },
    { title: 'Linked Lists', icon: Link2, slug: 'linked-lists' },
    { title: 'Stacks & Queues', icon: Disc, slug: 'stacks-and-queues' },
    { title: 'Trees', icon: GitBranch, slug: 'trees' },
    { title: 'Graphs', icon: Share2, slug: 'graphs' },
    { title: 'Dynamic Programming', icon: Cpu, slug: 'dynamic-programming' },
    { title: 'Sorting', icon: BarChart2, slug: 'sorting-algorithms' },
    { title: 'Hashing', icon: Hash, slug: 'searching-algorithms' },
  ];

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 pt-6 pb-12 sm:pt-8 sm:pb-14 font-sans select-none">
      
      {/* ── Background: Blueprint Coordinate Lines & Soft Curves ────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg 
          className="absolute inset-0 w-full h-full opacity-60" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-dots" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="0.75" fill="#94a3b8" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
          
          {/* Subtle curved contour lines matching image */}
          <path d="M 0,280 C 450,180 850,420 1600,220" fill="none" stroke="#e0f2fe" strokeWidth="1.2" />
          <path d="M 100,520 C 550,380 950,580 1600,380" fill="none" stroke="#e0f2fe" strokeWidth="0.8" strokeDasharray="3 3" />
          
          {/* Concentric radar circles on right side behind card */}
          <circle cx="1020" cy="330" r="320" fill="none" stroke="#f0f9ff" strokeWidth="1.5" />
          <circle cx="1020" cy="330" r="220" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.8" />
          <circle cx="1020" cy="330" r="120" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
        </svg>

        {/* Soft atmospheric radial gradient glows */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-blue-50/70 rounded-full blur-3xl -z-10" />
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
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>AI-POWERED DSA LEARNING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-slate-950 leading-[1.08]">
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
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm px-6 py-3.5 rounded-xl shadow-xs flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-600 stroke-[2]" />
                <span>Explore Topics</span>
              </Link>
            </div>

            {/* Metrics Row: 12+ Topics, 607+ Concepts, AI-Guided Learning Path */}
            <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <BookOpen className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm leading-tight">12+</div>
                  <div className="text-[11px] font-medium text-slate-500">Topics</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Share2 className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm leading-tight">607+</div>
                  <div className="text-[11px] font-medium text-slate-500">Concepts</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Target className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm leading-tight">AI-Guided</div>
                  <div className="text-[11px] font-medium text-slate-500">Learning Path</div>
                </div>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: INTERACTIVE BINARY SEARCH CARD & STEPPER      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-xl flex items-center gap-3 sm:gap-5">
              
              {/* Tilted soft light-blue polygon backdrop behind card */}
              <div 
                className="absolute -inset-4 bg-[#eff6ff] rounded-[36px] -rotate-1 transform -translate-x-1 translate-y-2 -z-10 border border-blue-100/60 shadow-2xs pointer-events-none" 
              />

              {/* Foreground White Card: Binary Search Interactive Demo */}
              <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-5 sm:p-6 space-y-4 relative z-10">
                
                {/* Card Header: Topic & Progress Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                    Binary Search
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 sm:w-24 h-2 bg-blue-100/80 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full w-[64%]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 font-mono">64%</span>
                    </div>
                    <button 
                      type="button"
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                      aria-label="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bubble 1: Teacher AI */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Teacher AI</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-semibold">
                        Explaining
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                    Let's break down Binary Search step by step. We compare the target with the middle element and reduce the search space by half after each comparison.
                  </p>

                  {/* Array Visualization */}
                  <div className="ml-9 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 space-y-1.5">
                    {/* mid label pointing down */}
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-600">mid</span>
                        <span className="w-0.5 h-1.5 bg-slate-400 rounded-full" />
                      </div>
                    </div>

                    {/* Array numbers */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm">
                      {[1, 3, 5].map((num) => (
                        <div key={num} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-semibold shadow-2xs">
                          {num}
                        </div>
                      ))}

                      {/* Highlighted mid: 7 in vibrant blue */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/30 border border-[#2563eb]">
                        7
                      </div>

                      {[9, 11, 13].map((num) => (
                        <div key={num} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-semibold shadow-2xs">
                          {num}
                        </div>
                      ))}
                    </div>

                    {/* left and right range indicators */}
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium px-2 pt-0.5">
                      <span>← left</span>
                      <span>right →</span>
                    </div>
                  </div>
                </div>

                {/* Bubble 2: Your Turn (Practice) */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Your Turn</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-semibold">
                        Practice
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-700 pl-9 font-medium">
                    If the target is smaller than mid, which half can we eliminate?
                  </p>

                  {/* Choice Buttons: Left half & Right half */}
                  <div className="flex items-center gap-2 pl-9 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedHalf('left')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedHalf === 'left'
                          ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {selectedHalf === 'left' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>Left half</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedHalf('right')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedHalf === 'right'
                          ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {selectedHalf === 'right' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>Right half</span>
                    </button>
                  </div>
                </div>

                {/* Bubble 3: Peer AI (Challenge) */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Peer AI</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold">
                        Challenge
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 pl-9 leading-relaxed">
                    Think about it another way. If the target is smaller, it must be in the left half because the array is sorted in ascending order.
                  </p>
                </div>

              </div>

              {/* ── Stepper Track to the Right of the Card ──────────── */}
              <div className="hidden sm:flex flex-col items-start gap-6 py-4 pl-1">
                {steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={step.label}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className="flex items-center gap-2.5 group cursor-pointer text-left transition-all"
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
                              ? 'bg-[#2563eb] ring-4 ring-blue-100'
                              : 'bg-white border-2 border-slate-300 group-hover:border-blue-400'
                          }`}
                        />
                      </div>

                      <span
                        className={`text-xs transition-colors whitespace-nowrap ${
                          isActive
                            ? 'font-bold text-slate-900'
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
        {/* BOTTOM STRIP: LEARN DSA TOPICS                              */}
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

          {/* 8 Topics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {dsaTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.title}
                  to={`/topics/${topic.slug}`}
                  className="bg-white hover:bg-slate-50/80 border border-slate-200/90 rounded-2xl py-3 px-3.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-600 group-hover:bg-[#2563eb] group-hover:text-white transition-colors flex-shrink-0">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
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
