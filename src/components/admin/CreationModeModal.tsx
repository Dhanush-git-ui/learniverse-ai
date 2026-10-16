import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface CreationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleBased: () => void;
  onSelectAIPowered: () => void;
  onSelectCustom: () => void;
}

export const CreationModeModal: React.FC<CreationModeModalProps> = ({
  isOpen,
  onClose,
  onSelectRoleBased,
  onSelectAIPowered,
  onSelectCustom,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button matching Screenshot 2 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header matching Screenshot 2 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Assessment
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Assess candidates by using a template or custom test.
          </p>
        </div>

        {/* 3 Creation Mode Cards matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Role-Based Assessment */}
          <div
            onClick={onSelectRoleBased}
            className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/10 cursor-pointer transition-all duration-200"
          >
            {/* Person with pen icon */}
            <div className="w-18 h-18 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 11l3-3-3-3-3 3 3 3z" />
                <path d="M18 14l4 4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2.5">
              Role-Based Assessment
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Select the Job Role. We will Create an assessment for you. You can also customize as per your need
            </p>
          </div>

          {/* 2. AI-Powered Assessment (BETA) */}
          <div
            onClick={onSelectAIPowered}
            className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/10 cursor-pointer transition-all duration-200"
          >
            {/* BETA Badge matching Screenshot 2 */}
            <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-bold tracking-wider uppercase">
              BETA
            </div>

            {/* Folder / Briefcase Icon */}
            <div className="w-18 h-18 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <line x1="12" y1="12" x2="12" y2="12.01" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-100" />
              <span>AI-Powered Assessment</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Paste a job description and let AI draft a ready-to-review assessment, tailored to the role.
            </p>
          </div>

          {/* 3. Custom Assessment */}
          <div
            onClick={onSelectCustom}
            className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/10 cursor-pointer transition-all duration-200"
          >
            {/* Document / paper with lines icon */}
            <div className="w-18 h-18 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2.5">
              Custom Assessment
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Create custom Assessment as per your Requirement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
