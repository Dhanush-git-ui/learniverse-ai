import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getDSATopics } from "@/services/TopicService";
import * as LucideIcons from "lucide-react";

const TOPIC_COLORS = [
  { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    hover: "group-hover:bg-blue-600",    hoverBorder: "hover:border-blue-300" },
  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  hover: "group-hover:bg-violet-600",  hoverBorder: "hover:border-violet-300" },
  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", hover: "group-hover:bg-emerald-600", hoverBorder: "hover:border-emerald-300" },
  { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   hover: "group-hover:bg-amber-600",   hoverBorder: "hover:border-amber-300" },
];

const PopularTopicsSection = () => {
  const topics = getDSATopics().slice(0, 4);

  const renderIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
    return Icon ? <Icon className="w-6 h-6 stroke-2" /> : null;
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-[11px] font-bold tracking-widest uppercase mb-3">
              Most Accessed
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Popular Topics
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-md">
              Start here — these are the topics most asked in HITAM placements and tech interviews.
            </p>
          </div>
          <Link
            to="/topics"
            className="btn-ghost inline-flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
          >
            View All Topics
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic, i) => {
            const c = TOPIC_COLORS[i % TOPIC_COLORS.length];
            return (
              <Link
                key={topic.title}
                to={`/topics/${topic.slug}`}
                className={`group bg-white rounded-2xl p-6 border border-slate-200 ${c.hoverBorder} hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 animate-fade-in-up flex flex-col`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Icon & badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border ${c.bg} ${c.border} ${c.text} flex items-center justify-center transition-all duration-300 ${c.hover} group-hover:text-white group-hover:border-transparent`}>
                    {renderIcon(topic.icon)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                    {topic.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                  {topic.title}
                </h3>

                {/* Separator */}
                <div className="flex-1" />

                {/* Bottom */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-4">
                  <span className="text-sm font-semibold text-slate-500">
                    {topic.questions.length} questions
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                    Learn
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* All topics CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/topics"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            Browse All DSA Topics
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularTopicsSection;
