import { Zap, Users, Target, Code2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    num: "01",
    icon: Target,
    title: "First-Principles Breakdown",
    description: "Socratic AI questioning forces you to think before you code. No spoon-feeding — just the right nudge at the right moment.",
    accent: "blue",
    tag: "Understand → Think",
    metric: "5-stage learning loop",
  },
  {
    num: "02",
    icon: Code2,
    title: "Live Code Execution",
    description: "Write Python, C++, or Java directly in the browser. Hidden test cases, complexity analysis, and instant feedback from your AI tutor.",
    accent: "emerald",
    tag: "Practice → Challenge",
    metric: "Real-time runtime analysis",
  },
  {
    num: "03",
    icon: Users,
    title: "Dual AI Perspective",
    description: "Teacher AI explains with precision. Peer AI challenges with edge cases. Two complementary lenses on every algorithm.",
    accent: "violet",
    tag: "Teacher + Peer AI",
    metric: "Complementary viewpoints",
  },
  {
    num: "04",
    icon: Zap,
    title: "Placement Diagnostics",
    description: "Interview-grade assessment calibrated to HITAM placement standards. Track your percentile, identify gaps, and target weak areas.",
    accent: "amber",
    tag: "Assess → Rank",
    metric: "CDC HITAM integrated",
  },
];

const ACCENT: Record<string, { num: string; icon: string; border: string; bg: string; tag: string }> = {
  blue:    { num: "text-blue-500",   icon: "text-blue-600 bg-blue-50 border-blue-100",   border: "hover:border-blue-300",   bg: "hover:bg-blue-50/30", tag: "bg-blue-50 text-blue-700 border-blue-200" },
  emerald: { num: "text-emerald-500",icon: "text-emerald-600 bg-emerald-50 border-emerald-100",border: "hover:border-emerald-300",bg: "hover:bg-emerald-50/30", tag: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  violet:  { num: "text-violet-500", icon: "text-violet-600 bg-violet-50 border-violet-100",  border: "hover:border-violet-300", bg: "hover:bg-violet-50/30",  tag: "bg-violet-50 text-violet-700 border-violet-200" },
  amber:   { num: "text-amber-500",  icon: "text-amber-600 bg-amber-50 border-amber-100",   border: "hover:border-amber-300",  bg: "hover:bg-amber-50/30",  tag: "bg-amber-50 text-amber-700 border-amber-200" },
};

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100 relative overflow-hidden">
      {/* Faint grid texture */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-70" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">

        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-[11px] font-bold tracking-widest uppercase mb-4">
            Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-3">
            A four-pillar engine for{" "}
            <span className="text-gradient-blue">real algorithmic mastery.</span>
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Not flashcards. Not solutions. A pedagogical system designed around how expert programmers actually learn.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            const c = ACCENT[p.accent];
            return (
              <div
                key={p.num}
                className={`group relative bg-white rounded-2xl p-6 border border-slate-200 ${c.border} ${c.bg} transition-all duration-300 hover:shadow-lg animate-fade-in-up cursor-default`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Number */}
                <div className={`text-[11px] font-black tracking-widest font-mono mb-4 ${c.num}`}>
                  {p.num}
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${c.icon} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5 stroke-2" />
                </div>

                {/* Tag */}
                <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border mb-3 ${c.tag}`}>
                  {p.tag}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-tight mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {p.description}
                </p>

                {/* Metric */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 border-t border-slate-100 pt-4 mt-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {p.metric}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 rounded-2xl border border-slate-200 px-6 py-5">
          <div>
            <div className="text-sm font-bold text-slate-800 mb-0.5">Ready to break O(n²) habits?</div>
            <div className="text-sm text-slate-500">Start the 5-stage loop on any DSA topic right now.</div>
          </div>
          <Link
            to="/topics"
            className="btn-primary inline-flex items-center gap-2 group flex-shrink-0"
          >
            Explore Topics
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
