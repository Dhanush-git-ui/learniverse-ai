import { Lightbulb, Github, Twitter, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-800">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white stroke-2" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Learn<span className="text-blue-400">iverse</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              AI-guided DSA learning built for HITAM students preparing for placements and technical interviews.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://cdc-hitam.onrender.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-[11px] font-semibold text-slate-300">
                CDC HITAM
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Learn */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4">Platform</div>
            <ul className="space-y-2.5">
              {[
                { label: "Topics", to: "/topics" },
                { label: "Top 100 Codes", to: "/top-100-codes" },
                { label: "Placement Test", to: "/assessment" },
                { label: "How It Works", to: "/how-it-works" },
                { label: "About", to: "/about" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4">Quick Access</div>
            <ul className="space-y-2.5">
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Student Login", to: "/" },
                { label: "Admin Console", to: "/assessment?admin=true" },
                { label: "Check Score ↗", to: "https://cdc-hitam.onrender.com/dashboard", external: true },
              ].map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.to} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium">
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to} className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} LearnIverse. Built at HITAM, Hyderabad.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
