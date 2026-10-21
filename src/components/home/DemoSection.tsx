import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, User, CheckCircle2, Sparkles } from "lucide-react";

const CONVERSATION = [
  {
    role: "teacher",
    badge: "Teacher AI",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    avatarColor: "bg-blue-600",
    content: "Let's understand Binary Search. The key idea: because the array is sorted, each comparison eliminates half the remaining elements. What does that tell you about the time complexity?",
  },
  {
    role: "user",
    badge: "You",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    avatarColor: "bg-emerald-500",
    content: "It must be O(log n) since we halve the search space each time.",
  },
  {
    role: "teacher",
    badge: "Teacher AI",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    avatarColor: "bg-blue-600",
    content: "Exactly. Now here is the key question: what is the maximum number of comparisons needed to search 1,000,000 elements?",
  },
  {
    role: "peer",
    badge: "Peer AI",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    avatarColor: "bg-violet-600",
    content: "Hint: log₂(1,000,000) ≈ 20. So instead of up to 1M comparisons like linear search, binary search needs at most 20. That's the power of halving.",
  },
];

const PROOF_POINTS = [
  { title: "No spoon-feeding", desc: "Socratic questioning that forces you to reason, not just recall.", check: true },
  { title: "Dual AI perspectives", desc: "Teacher AI explains. Peer AI challenges. Both improve you.", check: true },
  { title: "Placement-grade rigor", desc: "Every question is calibrated to actual interview difficulty.", check: true },
];

const DemoSection = () => {
  const [visible, setVisible] = useState(2);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: proof + CTA ─────────────────────────── */}
          <div className="space-y-7 order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 text-[11px] font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3 h-3 text-amber-500" />
                How It Feels
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-3">
                The conversation that{" "}
                <span className="text-gradient-blue">builds intuition.</span>
              </h2>
              <p className="text-base text-slate-500 leading-relaxed">
                Not a chatbot that gives you answers. A tutor that makes you find them — then challenges you to go deeper.
              </p>
            </div>

            <div className="space-y-4">
              {PROOF_POINTS.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 mb-0.5">{p.title}</div>
                    <div className="text-sm text-slate-500">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats inline */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "5", label: "Learning stages", sub: "per topic" },
                { v: "2×", label: "Faster mastery", sub: "vs solo study" },
                { v: "0", label: "Passive reading", sub: "active only" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-slate-900 font-mono">{s.v}</div>
                  <div className="text-[11px] font-bold text-slate-700 mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-slate-400">{s.sub}</div>
                </div>
              ))}
            </div>

            <Link
              to="/topics"
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ── Right: conversation preview ───────────────── */}
          <div className="order-1 lg:order-2">
            <div className="card-surface-elevated rounded-[20px] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <Brain className="w-3.5 h-3.5 text-blue-500" />
                  LearnIverse AI Tutor · Binary Search
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-semibold">Live</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 min-h-[360px]">
                {CONVERSATION.slice(0, visible).map((msg, i) => (
                  <div
                    key={i}
                    className="animate-fade-in space-y-1.5"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${msg.avatarColor} flex items-center justify-center flex-shrink-0`}>
                        {msg.role === "user"
                          ? <User className="w-3.5 h-3.5 text-white" />
                          : <Brain className="w-3.5 h-3.5 text-white" />
                        }
                      </div>
                      <span className="text-xs font-bold text-slate-700">{msg.badge}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${msg.badgeColor}`}>
                        {msg.role === "user" ? "Responding" : msg.role === "peer" ? "Hinting" : "Explaining"}
                      </span>
                    </div>
                    <div
                      className={`ml-8 text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : msg.role === "peer"
                          ? "bg-violet-50 text-violet-900 border border-violet-100"
                          : "bg-blue-50 text-blue-900 border border-blue-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {visible < CONVERSATION.length && (
                  <button
                    onClick={() => setVisible((v) => Math.min(v + 1, CONVERSATION.length))}
                    className="ml-8 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Continue conversation
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {visible >= CONVERSATION.length && (
                  <div className="ml-8 text-[11px] text-slate-400 font-medium animate-fade-in">
                    Ready for the next level? →{" "}
                    <Link to="/topics" className="text-blue-600 font-semibold hover:underline">
                      Try it yourself
                    </Link>
                  </div>
                )}
              </div>

              {/* Input bar mockup */}
              <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60 flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 font-medium">
                  Ask about time complexity, edge cases, trade-offs…
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
