import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Check, 
  X, 
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { QuestionItem } from '../../types/adminAssessment';

interface MyQuestionsManagerProps {
  questions: QuestionItem[];
  onAddQuestion: (q: QuestionItem) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (q: QuestionItem) => void;
}

export const MyQuestionsManager: React.FC<MyQuestionsManagerProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State for Creating / Editing Question
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('Java');
  const [subTopic, setSubTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [tags, setTags] = useState('CORE');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !selectedTopic || q.topic === selectedTopic;
    const matchesDiff = !selectedDifficulty || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDiff;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !optA.trim() || !optB.trim()) return;

    const newQ: QuestionItem = {
      id: `my-q-${Date.now()}`,
      prompt: prompt.trim(),
      topic,
      subTopic: subTopic.trim() || 'General',
      difficulty,
      tags: tags.trim() || '-',
      options: [optA.trim(), optB.trim(), optC.trim() || 'None of the above', optD.trim() || 'All of the above'],
      correctAnswer,
      explanation: explanation.trim() || 'Correct answer verified.',
      library: 'My Questions',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    onAddQuestion(newQ);
    setIsCreateModalOpen(false);
    // Reset form
    setPrompt('');
    setSubTopic('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Question Bank
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and manage your custom assessment questions. These questions appear under "My Questions" library.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Question</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search custom questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
          >
            <option value="">All Topics</option>
            <option value="Java">Java</option>
            <option value="Javascript">Javascript</option>
            <option value="DSA">DSA</option>
            <option value="CS Fundamentals">CS Fundamentals</option>
            <option value="SQL">SQL</option>
            <option value="HTML and CSS">HTML and CSS</option>
            <option value="React">React</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No custom questions found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click "+ Create New Question" above to author proprietary assessment questions.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div 
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {q.topic}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">{q.subTopic}</span>
                      <span className="text-slate-400">•</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                        q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {q.prompt}
                    </p>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2.5 inline-block cursor-pointer"
                    >
                      {isExpanded ? 'Hide Options' : 'See More & Options >'}
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteQuestion(q.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-2 bg-slate-50 p-4 rounded-lg">
                    <div className="font-semibold text-slate-700 mb-1">Answer Options:</div>
                    <ul className="space-y-1.5 text-slate-600">
                      {q.options?.map((opt, i) => {
                        const optLetter = String.fromCharCode(65 + i);
                        const isCorrect = q.correctAnswer === optLetter || q.correctAnswer === opt;
                        return (
                          <li key={i} className={`flex items-start gap-2 ${isCorrect ? 'text-emerald-700 font-bold' : ''}`}>
                            <span>{optLetter}.</span>
                            <span>{opt}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 inline" />}
                          </li>
                        );
                      })}
                    </ul>
                    {q.explanation && (
                      <div className="mt-2 text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                        <strong className="not-italic text-slate-700">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Question Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xs border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Author Custom Question
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-8 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Question Prompt *</label>
                <textarea
                  required
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the complete question prompt..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="Java">Java</option>
                    <option value="Javascript">Javascript</option>
                    <option value="DSA">DSA</option>
                    <option value="CS Fundamentals">CS Fundamentals</option>
                    <option value="SQL">SQL</option>
                    <option value="HTML and CSS">HTML and CSS</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Sub Topic</label>
                  <input
                    type="text"
                    value={subTopic}
                    onChange={(e) => setSubTopic(e.target.value)}
                    placeholder="e.g. Tags, Variables, OOP"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Exclusive Tag</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. CORE, ARCH"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block font-bold text-slate-800">Answer Options *</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-bold text-slate-500">A.</span>
                    <input
                      required
                      type="text"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Option A"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-bold text-slate-500">B.</span>
                    <input
                      required
                      type="text"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Option B"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-bold text-slate-500">C.</span>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Option C"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-bold text-slate-500">D.</span>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Option D"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Correct Option</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Explanation</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Short rationale..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
