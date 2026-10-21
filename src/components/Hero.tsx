import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Target, Share2, Layers, Link2, Disc,
  GitBranch, Cpu, BarChart2, Hash, Brain, Code2, Play, Send,
  ChevronRight, Zap, CheckCircle2, Clock, Trophy
} from "lucide-react";

// ── Binary Search Visualizer State ────────────────────────
const ARRAY = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const TARGET = 13;

function getBinarySearchSteps() {
  const steps: { left: number; right: number; mid: number; found: boolean }[] = [];
  let l = 0, r = ARRAY.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    steps.push({ left: l, right: r, mid, found: ARRAY[mid] === TARGET });
    if (ARRAY[mid] === TARGET) break;
    else if (ARRAY[mid] < TARGET) l = mid + 1;
    else r = mid - 1;
  }
  return steps;
}

const DSA_TOPICS = [
  { title: "Arrays", icon: Layers, slug: "arrays", color: "blue" },
  { title: "Linked Lists", icon: Link2, slug: "linked-lists", color: "emerald" },
  { title: "Stacks & Queues", icon: Disc, slug: "stacks-and-queues", color: "violet" },
  { title: "Trees", icon: GitBranch, slug: "trees", color: "emerald" },
  { title: "Graphs", icon: Share2, slug: "graphs", color: "violet" },
  { title: "Dynamic Prog.", icon: Cpu, slug: "dynamic-programming", color: "rose" },
  { title: "Sorting", icon: BarChart2, slug: "sorting-algorithms", color: "amber" },
  { title: "Hashing", icon: Hash, slug: "searching-algorithms", color: "rose" },
];

const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string; hbg: string }> = {
  blue:    { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100",   hbg: "group-hover:bg-blue-600" },
  emerald: { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-100",hbg: "group-hover:bg-emerald-600" },
  violet:  { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100",  hbg: "group-hover:bg-violet-600" },
  rose:    { bg: "bg-rose-50",   text: "text-rose-600",   border: "border-rose-100",   hbg: "group-hover:bg-rose-600" },
  amber:   { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100",  hbg: "group-hover:bg-amber-600" },
};

const STEPS = getBinarySearchSteps();
const COMPLEXITY_CODE = `def binary_search(arr: list, target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`;

const STAT_ITEMS = [
  { value: "12+", label: "DSA Topics", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  { value: "607+", label: "Concepts", icon: Brain, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { value: "O(log n)", label: "Think Optimal", icon: Zap, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
];

const Hero = () => {
  const [step, setStep] = useState(0);
  const [autoRun, setAutoRun] = useState(false);
  const [running, setRunning] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatSent, setChatSent] = useState(false);

  useEffect(() => {
    if (!autoRun) return;
    if (step >= STEPS.length - 1) { setAutoRun(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [autoRun, step]);

  const handleRun = () => {
    setStep(0);
    setRunning(true);
    setTimeout(() => { setRunning(false); setAutoRun(true); }, 400);
  };

  const cur = STEPS[Math.min(step, STEPS.length - 1)];
  const comparisons = step + 1;

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-0 sm:pt-28 lg:pt-32">
      {/* ── Subtle dot grid background ── */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      {/* ── Atmospheric blue glow ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] opacity-40 pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* ═══════ HERO GRID ════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-10 lg:gap-14 items-center">

          {/* ── LEFT: Headline & CTAs ─────────────────────── */}
          <div className="lg:col-span-5 space-y-7">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-bold tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              AI-First DSA Platform · HITAM
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-900 leading-[1.06] tracking-tight">
                Stop memorizing.{" "}
                <br className="hidden sm:block" />
                <span className="text-gradient-blue">Master DSA</span>{" "}
                <br className="hidden sm:block" />
                from first principles.
              </h1>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg font-medium pt-1">
                Build the algorithmic intuition that companies actually test — through live visualization, Socratic AI tutoring, and placement-grade challenges.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/topics"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                Start Learning
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/assessment"
                className="btn-ghost inline-flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-blue-600" />
                Take Placement Test
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {STAT_ITEMS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800 leading-tight font-mono">{s.value}</div>
                      <div className="text-[10.5px] font-medium text-slate-500 leading-tight">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex -space-x-2">
                {["#2563eb","#7c3aed","#059669","#dc2626"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold" style={{ background: c, zIndex: 4 - i }}>
                    {["D","A","M","R"][i]}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-700">240+ HITAM students</span> preparing for placements
              </span>
            </div>
          </div>

          {/* ── RIGHT: Binary Search Visualizer ──────────── */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end pb-8 lg:pb-0">
            <div className="w-full max-w-[520px] card-surface-elevated rounded-[20px] overflow-hidden">

              {/* Editor top bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <Code2 className="w-3.5 h-3.5" />
                  binary_search.py
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    Python 3.12
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">

                {/* ── Code snippet ── */}
                <div className="code-editor rounded-2xl overflow-hidden">
                  <div className="px-4 pt-3 pb-1 flex items-center justify-between border-b border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider">ALGORITHM</span>
                    <button
                      onClick={handleRun}
                      disabled={running || autoRun}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      {autoRun ? "Running…" : running ? "Starting…" : "Run Visualizer"}
                    </button>
                  </div>
                  <pre className="font-mono text-[11.5px] leading-[1.8] px-4 py-3 overflow-x-auto custom-scrollbar">
                    {COMPLEXITY_CODE.split("\n").map((line, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="select-none text-slate-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                        <span
                          className="text-slate-300"
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/def /g, '<span class="text-violet-400">def </span>')
                              .replace(/return /g, '<span class="text-violet-400">return </span>')
                              .replace(/while /g, '<span class="text-violet-400">while </span>')
                              .replace(/(if |elif |else:)/g, '<span class="text-violet-400">$1</span>')
                              .replace(/(\d+)/g, '<span class="text-amber-400">$1</span>')
                              .replace(/(binary_search|len)/g, '<span class="text-blue-400">$1</span>')
                              .replace(/(list|int)/g, '<span class="text-emerald-400">$1</span>')
                          }}
                        />
                      </div>
                    ))}
                  </pre>
                </div>

                {/* ── Array Visualizer ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Live Visualization</span>
                    <div className="flex items-center gap-3 text-[10.5px] font-mono">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>O(log n)</span>
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-blue-600 font-bold">
                        Step {Math.min(step + 1, STEPS.length)} / {STEPS.length}
                      </span>
                    </div>
                  </div>

                  {/* Target indicator */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold">Searching for</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">target = {TARGET}</span>
                    {cur.found && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold animate-fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Found at index {cur.mid}!
                      </span>
                    )}
                  </div>

                  {/* Array boxes */}
                  <div className="relative">
                    {/* Pointer labels */}
                    <div className="flex gap-1 mb-1">
                      {ARRAY.map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
                          {i === cur.left && !cur.found && (
                            <div className="text-[9px] font-bold text-blue-600 animate-fade-in leading-none">L</div>
                          )}
                          {i === cur.mid && (
                            <div className={`text-[9px] font-bold leading-none animate-fade-in ${cur.found ? "text-emerald-600" : "text-amber-500"}`}>
                              M
                            </div>
                          )}
                          {i === cur.right && !cur.found && i !== cur.left && (
                            <div className="text-[9px] font-bold text-blue-600 animate-fade-in leading-none">R</div>
                          )}
                          {i !== cur.left && i !== cur.mid && !(i === cur.right && !cur.found && i !== cur.left) && (
                            <div className="text-[9px] leading-none opacity-0">·</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Boxes */}
                    <div className="flex gap-1">
                      {ARRAY.map((num, i) => {
                        const isActive = i >= cur.left && i <= cur.right;
                        const isMid = i === cur.mid;
                        const isFound = isMid && cur.found;
                        return (
                          <div
                            key={i}
                            className={`
                              flex-1 aspect-square flex items-center justify-center rounded-lg font-mono font-bold text-[11px] sm:text-xs
                              transition-all duration-300 border min-w-0
                              ${isFound
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-110"
                                : isMid
                                ? "bg-amber-400 text-white border-amber-400 shadow-md shadow-amber-400/30 scale-105"
                                : isActive
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-50 text-slate-300 border-slate-200"
                              }
                            `}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>

                    {/* Index labels */}
                    <div className="flex gap-1 mt-1">
                      {ARRAY.map((_, i) => (
                        <div key={i} className="flex-1 flex items-center justify-center">
                          <span className="text-[9px] font-mono text-slate-400">{i}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend & status */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-[10px] font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200 inline-block" /> Active
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> Mid
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Found
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {comparisons} comparison{comparisons !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Step through buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => { setAutoRun(false); setStep(0); }}
                      className="px-3 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
                      disabled={step >= STEPS.length - 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Next Step
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>Complexity:</span>
                      <span className="font-bold text-blue-600">O(log {ARRAY.length})</span>
                      <span className="text-slate-300">≈</span>
                      <span className="font-bold text-slate-600">4 max</span>
                    </div>
                  </div>
                </div>

                {/* ── AI Chat mini ── */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 leading-relaxed">
                      {chatSent
                        ? "Binary search eliminates half the search space each step — that's why it's O(log n). Even for 1 million elements, you'd need at most 20 comparisons."
                        : "Why is Binary Search faster than Linear Search?"}
                    </div>
                  </div>
                  {!chatSent && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && chatInput.trim() && setChatSent(true)}
                        placeholder="Ask the AI tutor anything…"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                      />
                      <button
                        onClick={() => chatInput.trim() && setChatSent(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/30"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {chatSent && (
                    <button
                      onClick={() => { setChatSent(false); setChatInput(""); }}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Ask another question →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ TOPICS STRIP ══════════════════════════════ */}
        <div className="mt-14 border-t border-slate-100 pt-8 pb-12">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Explore Topics
            </span>
            <Link
              to="/topics"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {DSA_TOPICS.map((topic, i) => {
              const Icon = topic.icon;
              const c = TOPIC_COLORS[topic.color];
              return (
                <Link
                  key={topic.title}
                  to={`/topics/${topic.slug}`}
                  className="group flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/8 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={`w-9 h-9 rounded-xl border ${c.bg} ${c.border} ${c.text} flex items-center justify-center transition-all duration-200 ${c.hbg} group-hover:text-white flex-shrink-0`}>
                    <Icon className="w-4 h-4 stroke-2" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-center leading-tight">
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
