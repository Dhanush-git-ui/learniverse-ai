import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ArrowLeft,
  Check
} from 'lucide-react';
import { AssessmentSection, QuestionBreakdownItem } from '../../types/adminAssessment';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: AssessmentSection;
  onSave: (updatedSection: AssessmentSection) => void;
  onOpenQuestionPicker: () => void;
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  isOpen,
  onClose,
  section,
  onSave,
  onOpenQuestionPicker,
}) => {
  const [sectionName, setSectionName] = useState(section.name);
  const [timeLimit, setTimeLimit] = useState(section.timeLimit);
  const [breakdown, setBreakdown] = useState<QuestionBreakdownItem[]>(
    section.questionBreakdown || []
  );

  if (!isOpen) return null;

  const totalQuestions = breakdown.reduce((acc, curr) => acc + curr.count, 0);

  const handleSave = () => {
    onSave({
      ...section,
      name: sectionName,
      timeLimit: Number(timeLimit) || 25,
      questionsCount: totalQuestions,
      score: totalQuestions,
      questionBreakdown: breakdown,
    });
    onClose();
  };

  const handleDeleteRow = (id: string) => {
    setBreakdown(breakdown.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xs border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-8 py-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900">
              Section Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          {/* Section Inputs: Name & Time Limit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Name of Section
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="e.g. Front End Technical MCQ Test"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Time Limit (in Mins)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                placeholder="25"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <hr className="border-slate-200/80" />

          {/* Questions Details Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>Questions Details</span>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </h3>
            </div>

            {/* Questions Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                    <th className="py-3 px-4 w-14 text-center">S.No</th>
                    <th className="py-3 px-6">Topic</th>
                    <th className="py-3 px-6">Sub Topic</th>
                    <th className="py-3 px-4 text-center">Difficulty Level</th>
                    <th className="py-3 px-4 text-center">Exclusive Tags</th>
                    <th className="py-3 px-4 text-center">No.of Questions</th>
                    <th className="py-3 px-4 text-center w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                  {breakdown.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No question groups added yet. Click <strong>+ Add More Questions</strong> below.
                      </td>
                    </tr>
                  ) : (
                    breakdown.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-slate-800">
                          {row.topic}
                        </td>
                        <td className="py-3.5 px-6 text-slate-600 text-xs">
                          {row.subTopic}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs">
                          <span className={`px-2 py-0.5 rounded font-medium ${
                            row.difficulty === 'Easy' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : row.difficulty === 'Medium'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {row.difficulty}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 text-xs">
                          {row.tags || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          {row.count}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* + Add More Questions Link Button */}
            <div className="mt-4">
              <button
                onClick={onOpenQuestionPicker}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add More Questions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};
