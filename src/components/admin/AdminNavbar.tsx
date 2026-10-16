import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Infinity as InfinityIcon, 
  Lightbulb,
  ExternalLink, 
  LogOut, 
  Settings, 
  User, 
  Home as HomeIcon,
  BookOpen,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNavbarProps {
  userName?: string;
  onNavigateHome?: () => void;
  activeNav?: 'home' | 'questions';
  onNavChange?: (tab: 'home' | 'questions') => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  userName = 'Admin',
  onNavigateHome,
  activeNav = 'home',
  onNavChange,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 px-6 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        {/* Left: Learniverse Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => {
              onNavChange?.('home');
              onNavigateHome?.();
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5 text-blue-600 stroke-[2.3]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight leading-none select-none">
                <span className="text-slate-900">Learn</span>
                <span className="text-blue-600">iverse</span>
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-8 text-sm font-semibold">
            <button
              onClick={() => onNavChange?.('home')}
              className={`pb-1 transition-colors relative cursor-pointer ${
                activeNav === 'home'
                  ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-15px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavChange?.('questions')}
              className={`pb-1 transition-colors relative cursor-pointer ${
                activeNav === 'questions'
                  ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-15px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Questions
            </button>
          </nav>
        </div>

        {/* Right: Credits, Help & Profile */}
        <div className="flex items-center gap-4">
          {/* Unlimited Credits pill badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50/50 text-xs font-semibold text-slate-700 shadow-2xs">
            <InfinityIcon className="w-4 h-4 text-blue-600 stroke-[2.5]" />
            <span>Unlimited <span className="font-normal text-slate-500">credits</span></span>
          </div>

          {/* Help icon */}
          <button 
            onClick={() => setIsHelpModalOpen(true)}
            title="Help & Guides"
            className="text-blue-600 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 stroke-[2]" />
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-slate-900 cursor-pointer select-none pl-3 border-l border-slate-200"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {(userName.charAt(0) || 'A').toUpperCase()}
              </div>
              <span className="font-semibold text-xs sm:text-sm">{userName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </div>

            {isProfileMenuOpen && (
              <div 
                className="absolute right-0 top-10 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                  <div className="font-bold text-slate-900 text-sm">{userName}</div>
                  <div className="text-[11px] text-slate-400">admin@learniverse.ai</div>
                </div>

                <Link
                  to="/"
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700"
                >
                  <HomeIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Learniverse Main App</span>
                </Link>

                <Link
                  to="/assessment"
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Candidate Portal</span>
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    localStorage.removeItem('learniverse_admin_authed');
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Admin Hub</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <span>Learniverse Assessment Suite Help</span>
              </h3>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Role-Based Assessments:</strong> Select from 12+ pre-configured technology roles with curated sections and question banks.
              </p>
              <p>
                <strong>AI-Powered Drafts:</strong> Paste any job description to automatically extract requirements, calculate time limits, and create relevant assessment sections.
              </p>
              <p>
                <strong>Section Details:</strong> Drill into any section to adjust topic pools, difficulties, question counts, or add proprietary questions from "My Questions".
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
