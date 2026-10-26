import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Clock, 
  Eye, 
  UserPlus, 
  Plus, 
  GripVertical, 
  HelpCircle, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit3, 
  ChevronRight,
  ArrowRight,
  ClipboardList,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { AssessmentSection } from '../../types/adminAssessment';

interface SectionStepperWizardProps {
  roleTitle: string;
  sections: AssessmentSection[];
  onBack: () => void;
  onUpdateSections: (sections: AssessmentSection[]) => void;
  onOpenCreateSectionType: () => void;
  onEditSection: (section: AssessmentSection) => void;
  onProceedToReview: () => void;
}

export const SectionStepperWizard: React.FC<SectionStepperWizardProps> = ({
  roleTitle = 'Full Stack Developer',
  sections,
  onBack,
  onUpdateSections,
  onOpenCreateSectionType,
  onEditSection,
  onProceedToReview,
}) => {
  const [activeMenuSectionId, setActiveMenuSectionId] = useState<string | null>(null);

  // Compute aggregate totals
  const totalSections = sections.length;
  const totalTime = sections.reduce((sum, s) => sum + (s.timeLimit || 0), 0);
  const totalScore = sections.reduce((sum, s) => sum + (s.score || 0), 0);

  // Delete section
  const handleDeleteSection = (id: string) => {
    onUpdateSections(sections.filter(s => s.id !== id));
    setActiveMenuSectionId(null);
  };

  // Duplicate section
  const handleDuplicateSection = (sec: AssessmentSection) => {
    const dup: AssessmentSection = {
      ...sec,
      id: `sec-${Date.now()}`,
      name: `${sec.name} (Copy)`,
    };
    onUpdateSections([...sections, dup]);
    setActiveMenuSectionId(null);
  };

  // Move section position
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    onUpdateSections(reordered);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 pb-20">
      {/* Top Header Bar matching Screenshot 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {roleTitle}
          </h1>
        </div>

        {/* Aggregate Stats Badges matching Screenshot 4 */}
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-600" />
            <span>Total Sections: <strong className="font-bold text-slate-900">{totalSections}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Total Time: <strong className="font-bold text-slate-900">{totalTime} mins</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-slate-600" />
            <span>Total Score: <strong className="font-bold text-slate-900">{totalScore}</strong></span>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Bar matching Screenshot 4 */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          {/* Step 1: Section Details (Active) */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-600 bg-blue-50/50 text-blue-600 text-xs font-bold shadow-2xs">
            <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>1. Section Details</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400" />

          {/* Step 2: Final Review */}
          <button
            onClick={onProceedToReview}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Final Review</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400" />

          {/* Step 3: Publish & Invite */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 text-slate-400 text-xs font-semibold">
            <UserPlus className="w-3.5 h-3.5" />
            <span>3. Publish & Invite</span>
          </div>
        </div>
      </div>

      {/* Main Section Content matching Screenshot 4 & 5 */}
      <div className="space-y-6">
        {/* Section Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Select & Create Sections
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any section to customize question pools and durations, or drag to reorder.
            </p>
          </div>

          <button
            onClick={onOpenCreateSectionType}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Section</span>
          </button>
        </div>

        {/* Selected Sections Subtitle */}
        <div className="pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Selected Sections
          </div>

          {/* Table Header Labels matching Screenshot 5 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-slate-500 border-b border-slate-200">
            <div className="col-span-5">Section Name</div>
            <div className="col-span-2 text-center">Number of Questions</div>
            <div className="col-span-2 text-center">Time</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Section Rows matching Screenshot 4 & 5 */}
          <div className="space-y-3 mt-3">
            {sections.length === 0 ? (
              <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm">
                No sections added yet. Click <strong>+ Create New Section</strong> above to add modules.
              </div>
            ) : (
              sections.map((sec, index) => (
                <div
                  key={sec.id}
                  className="grid grid-cols-12 gap-4 items-center px-4 py-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-blue-400 hover:shadow-2xs transition-all group relative"
                >
                  {/* Grip & Name (col 5) */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-slate-400">
                      <div className="flex flex-col">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="hover:text-slate-700 disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={index === sections.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="hover:text-slate-700 disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <GripVertical className="w-4 h-4 cursor-grab" />
                    </div>
                    <div 
                      onClick={() => onEditSection(sec)}
                      className="font-semibold text-sm text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                      title="Click to view & edit Section Details"
                    >
                      {sec.name}
                    </div>
                  </div>

                  {/* Number of Questions (col 2) */}
                  <div className="col-span-2 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sec.questionsCount} Questions</span>
                  </div>

                  {/* Time (col 2) */}
                  <div className="col-span-2 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sec.timeLimit} min.</span>
                  </div>

                  {/* Type Badge (col 1) */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[11px] font-bold tracking-wide uppercase border border-blue-100">
                      {sec.type}
                    </span>
                  </div>

                  {/* Score (col 1) */}
                  <div className="col-span-1 text-center font-bold text-xs text-slate-700">
                    {sec.score}
                  </div>

                  {/* Action Menu (col 1) */}
                  <div className="col-span-1 flex items-center justify-center relative">
                    <button
                      onClick={() => setActiveMenuSectionId(activeMenuSectionId === sec.id ? null : sec.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuSectionId === sec.id && (
                      <div
                        className="absolute right-2 top-8 w-44 bg-white border border-slate-200 rounded-lg shadow-2xs py-1 z-30 text-left text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                        onMouseLeave={() => setActiveMenuSectionId(null)}
                      >
                        <button
                          onClick={() => {
                            onEditSection(sec);
                            setActiveMenuSectionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Configure Questions</span>
                        </button>
                        <button
                          onClick={() => handleDuplicateSection(sec)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Duplicate Section</span>
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Section</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-200">
          <button
            onClick={onBack}
            className="px-5 py-2 border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            &larr; Back to Role Selection
          </button>

          <button
            onClick={onProceedToReview}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Proceed to Final Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
