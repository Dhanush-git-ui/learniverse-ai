import React from 'react';
import { 
  X, 
  ListChecks, 
  Code2, 
  Database, 
  Monitor, 
  Mic, 
  MessageSquare 
} from 'lucide-react';
import { SectionType } from '../../types/adminAssessment';

interface SectionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: SectionType) => void;
}

export const SectionTypeModal: React.FC<SectionTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null;

  const types: { 
    id: SectionType; 
    title: string; 
    customIcon?: React.ReactNode; 
    icon?: React.ReactNode; 
  }[] = [
    {
      id: 'MCQ',
      title: 'MCQ',
      icon: <ListChecks className="w-8 h-8 stroke-[1.5] text-slate-700" />,
    },
    {
      id: 'Coding',
      title: 'Coding',
      icon: <Code2 className="w-8 h-8 stroke-[1.5] text-slate-700" />,
    },
    {
      id: 'SQL',
      title: 'SQL',
      customIcon: (
        <div className="flex flex-col items-center justify-center">
          <Database className="w-6 h-6 stroke-[1.5] text-slate-700" />
          <span className="text-[10px] font-extrabold tracking-tight text-slate-800 -mt-0.5">SQL</span>
        </div>
      ),
    },
    {
      id: 'Textual',
      title: 'Textual',
      customIcon: (
        <span className="text-3xl font-serif font-bold text-slate-800 select-none">
          T
        </span>
      ),
    },
    {
      id: 'Web Coding',
      title: 'Web Coding',
      icon: <Monitor className="w-8 h-8 stroke-[1.5] text-slate-700" />,
    },
    {
      id: 'Fill in the Blank',
      title: 'Fill in the Blank',
      customIcon: (
        <span className="text-sm font-bold tracking-widest text-slate-800 select-none font-mono">
          A ... C
        </span>
      ),
    },
    {
      id: 'Audio',
      title: 'Audio',
      icon: <Mic className="w-8 h-8 stroke-[1.5] text-slate-700" />,
    },
    {
      id: 'Communication',
      title: 'Communication',
      icon: <MessageSquare className="w-8 h-8 stroke-[1.5] text-slate-700" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xs border border-slate-200 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header matching Screenshot 11 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Select Section Type
          </h2>
        </div>

        {/* 8 Section Types 2x4 Grid matching Screenshot 11 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {types.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectType(item.id);
                onClose();
              }}
              className="flex flex-col items-center justify-center p-6 h-32 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 hover:shadow-xs transition-all duration-150 group cursor-pointer bg-white"
            >
              <div className="h-10 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {item.customIcon || item.icon}
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors text-center mt-1">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
