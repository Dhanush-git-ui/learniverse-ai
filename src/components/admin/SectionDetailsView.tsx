import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Check,
  Save
} from 'lucide-react';
import { AssessmentSection, QuestionBreakdownItem } from '../../types/adminAssessment';

interface SectionDetailsViewProps {
  section: AssessmentSection;
  onBack: () => void;
  onSave: (updatedSection: AssessmentSection) => void;
  onOpenQuestionPicker: () => void;
}

export const SectionDetailsView: React.FC<SectionDetailsViewProps> = ({
  section,
  onBack,
  onSave,
  onOpenQuestionPicker,
}) => {
  const [sectionName, setSectionName] = useState(section.name);
  const [timeLimit, setTimeLimit] = useState(section.timeLimit);
  const [breakdown, setBreakdown] = useState<QuestionBreakdownItem[]>(
    section.questionBreakdown || []
  );
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  const totalQuestions = breakdown.reduce((acc, curr) => acc + curr.count, 0);

  const handleSaveAndReturn = () => {
    const updated: AssessmentSection = {
      ...section,
      name: sectionName,
      timeLimit: Number(timeLimit) || 25,
      questionsCount: totalQuestions,
      score: totalQuestions,
      questionBreakdown: breakdown,
    };
    onSave(updated);
    onBack();
  };

  const handleDeleteRow = (id: string) => {
    setBreakdown(breakdown.filter((item) => item.id !== id));
    setOpenMenuRowId(null);
  };

  const handleUpdateRowCount = (id: string, newCount: number) => {
    setBreakdown(breakdown.map(item => 
      item.id === id ? { ...item, count: Math.max(1, newCount) } : item
    ));
    setEditingRowId(null);
    setOpenMenuRowId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleSaveAndReturn}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sections</span>
        </button>

        <button
          onClick={handleSaveAndReturn}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save & Return</span>
        </button>
      </div>

      {/* Section Details Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Section Details
        </h1>
      </div>

      {/* Inputs: Name of Section & Time Limit side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name of Section
          </label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="e.g. Front End Technical MCQ Test"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Time Limit (in Mins)
          </label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            placeholder="25"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Subtle Horizontal Divider */}
      <hr className="border-slate-200/90 mb-8" />

      {/* Questions Details Heading with Info Icon */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <span>Questions Details</span>
          <HelpCircle className="w-4 h-4 text-slate-400" />
        </h2>
        <div className="text-xs text-slate-500">
          Total in Section: <strong className="font-bold text-slate-800">{totalQuestions} Questions</strong>
        </div>
      </div>

      {/* Questions Breakdown Table (Matching Screenshot 6) */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs mb-6">
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
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  No question groups added yet. Click <strong>+ Add More Questions</strong> below to select questions.
                </td>
              </tr>
            ) : (
              breakdown.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 text-center text-slate-500 font-medium text-xs">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800 text-sm">
                    {row.topic}
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-xs">
                    {row.subTopic}
                  </td>
                  <td className="py-4 px-4 text-center text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-medium text-xs ${
                      row.difficulty === 'Easy' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : row.difficulty === 'Medium'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {row.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-400 text-xs">
                    {row.tags || '-'}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-800 text-sm">
                    {editingRowId === row.id ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          defaultValue={row.count}
                          min={1}
                          className="w-16 px-2 py-1 border border-blue-400 rounded text-center text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateRowCount(row.id, Number((e.target as HTMLInputElement).value));
                            }
                          }}
                          onBlur={(e) => handleUpdateRowCount(row.id, Number(e.target.value))}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span>{row.count}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center relative">
                    <button
                      onClick={() => setOpenMenuRowId(openMenuRowId === row.id ? null : row.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuRowId === row.id && (
                      <div
                        className="absolute right-6 top-8 w-36 bg-white border border-slate-200 rounded-lg shadow-2xs py-1 z-20 text-left text-xs font-medium text-slate-700"
                        onMouseLeave={() => setOpenMenuRowId(null)}
                      >
                        <button
                          onClick={() => {
                            setEditingRowId(row.id);
                            setOpenMenuRowId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Change Count</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* + Add More Questions Link (Matching Screenshot 6) */}
      <div>
        <button
          onClick={onOpenQuestionPicker}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group"
        >
          <Plus className="w-4 h-4 stroke-[2.5] group-hover:scale-110 transition-transform" />
          <span>Add More Questions</span>
        </button>
      </div>
    </div>
  );
};
