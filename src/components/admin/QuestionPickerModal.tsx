import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  HelpCircle, 
  Plus, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sparkles,
  Shuffle
} from 'lucide-react';
import { INITIAL_MY_QUESTIONS } from '../../data/mockAdminData';
import { QuestionItem } from '../../types/adminAssessment';
import { getAdminQuestionPage, getQuestionBankFacets, QuestionBankFacets, reviewQuestion, saveQuestionCollection } from '../../services/adminQuestionBankService';

interface QuestionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle?: string;
  onAddQuestion: (question: any) => void;
  selectedQuestionIds: string[];
  myQuestions?: QuestionItem[];
}

export const QuestionPickerModal: React.FC<QuestionPickerModalProps> = ({
  isOpen,
  onClose,
  sectionTitle = 'Section',
  onAddQuestion,
  selectedQuestionIds = [],
  myQuestions = INITIAL_MY_QUESTIONS,
}) => {
  const [questionLibrary, setQuestionLibrary] = useState<'Learniverse Question Bank' | 'My Questions'>('Learniverse Question Bank');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const [category, setCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<string>('');
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [tags, setTags] = useState<string>('');
  const [questionType, setQuestionType] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [includePendingReview, setIncludePendingReview] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<QuestionItem[]>([]);
  const [bankTotal, setBankTotal] = useState(0);
  const [facets, setFacets] = useState<QuestionBankFacets>({ categories: [], topics: [], question_types: [], companies: [], roles: [] });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reviewBusyId, setReviewBusyId] = useState<string | null>(null);
  const [collectionMessage, setCollectionMessage] = useState('');
  const [pickRandomly, setPickRandomly] = useState(false);
  const [randomCount, setRandomCount] = useState(5);

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const TOPIC_LIST = useMemo(() => facets.topics.map(item => item.value), [facets.topics]);

  useEffect(() => {
    if (!isOpen || questionLibrary !== 'Learniverse Question Bank') return;
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    getAdminQuestionPage({
      search: tags,
      category,
      topic: selectedTopic,
      difficulty,
      questionType,
      company,
      role,
      status: includePendingReview ? 'Pending Review' : 'Approved',
      page: currentPage,
      pageSize: 20,
    }).then((result) => {
      if (cancelled) return;
      setBankQuestions(result.items);
      setBankTotal(result.total);
    }).catch((error: unknown) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Could not load the question bank.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [isOpen, questionLibrary, tags, category, selectedTopic, difficulty, questionType, company, role, includePendingReview, currentPage]);

  useEffect(() => {
    if (!isOpen) return;
    getQuestionBankFacets().then(setFacets).catch((error: unknown) => {
      setLoadError(error instanceof Error ? error.message : 'Could not load question filters.');
    });
  }, [isOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [questionLibrary, tags, category, selectedTopic, difficulty, questionType, company, role, includePendingReview]);

  // My Questions remain browser-local; the shared Learniverse bank is paged from the backend.
  const filteredQuestions = useMemo<QuestionItem[]>(() => {
    if (questionLibrary === 'Learniverse Question Bank') return bankQuestions;
    return myQuestions.filter((q) => {
      if (selectedTopic && !q.topic.toLowerCase().includes(selectedTopic.toLowerCase())) {
        return false;
      }
      if (difficulty && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
        return false;
      }
      if (tags && !`${q.tags} ${q.prompt} ${q.topic} ${q.subTopic}`.toLowerCase().includes(tags.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [questionLibrary, bankQuestions, myQuestions, selectedTopic, difficulty, tags]);

  if (!isOpen) return null;

  // Handle Pick Randomly
  const handleApplyRandomPick = () => {
    const unselected = filteredQuestions.filter(q => (q.library !== 'Learniverse Question Bank' || q.reviewStatus === 'Approved') && !selectedQuestionIds.includes(q.id));
    const shuffled = [...unselected].sort(() => 0.5 - Math.random());
    const toPick = shuffled.slice(0, randomCount);
    toPick.forEach(q => onAddQuestion(q));
  };

  const pageSize = questionLibrary === 'Learniverse Question Bank' ? 20 : 5;
  const totalDisplayCount = questionLibrary === 'Learniverse Question Bank' ? bankTotal : filteredQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalDisplayCount / pageSize));
  const firstVisiblePage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstVisiblePage + index);
  const paginatedQuestions = questionLibrary === 'Learniverse Question Bank' ? filteredQuestions : filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReview = async (question: QuestionItem, status: 'Approved' | 'Rejected') => {
    const note = window.prompt(status === 'Approved' ? 'Record what you verified before approval:' : 'Why are you rejecting this question:');
    if (!note?.trim()) return;
    const evidence = status === 'Approved'
      ? window.prompt('Record the independent answer check or reliable source used (at least 20 characters):')
      : undefined;
    if (status === 'Approved' && (!evidence || evidence.trim().length < 20)) return;
    setReviewBusyId(question.id);
    try {
      await reviewQuestion(question.id, status, note.trim(), evidence?.trim());
      setCollectionMessage(`Question ${status.toLowerCase()}.`);
      setBankQuestions(current => current.filter(item => item.id !== question.id));
      setBankTotal(current => Math.max(0, current - 1));
      setCollectionMessage(`Question ${status.toLowerCase()}.`);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not save the review.');
    } finally {
      setReviewBusyId(null);
    }
  };

  const handleSaveCollection = async () => {
    const name = window.prompt('Name this approved question collection:');
    if (!name?.trim()) return;
    try {
      await saveQuestionCollection(name.trim(), selectedQuestionIds);
      setCollectionMessage('Collection saved to the database.');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not save the collection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xs border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header matching Screenshot 7 & 8 */}
        <div className="px-8 py-5 border-b border-slate-200/80 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add Questions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the question tags combination to pick questions into this section
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body: Left Filter Controls & Right Question Cards */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Filters (4 cols) matching Screenshot 7, 8, 9 */}
          <div className="md:col-span-4 p-6 border-r border-slate-200/80 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
            {/* 1. Question Library Dropdown (Screenshot 8) */}
            <div className="relative">
              <label className="block text-slate-700 font-semibold mb-1.5">
                Question Library
              </label>
              <div 
                onClick={() => {
                  setIsLibraryOpen(!isLibraryOpen);
                  setIsTopicOpen(false);
                  setIsDifficultyOpen(false);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors text-slate-800 font-medium shadow-2xs"
              >
                <span>{questionLibrary}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isLibraryOpen ? 'rotate-180' : ''}`} />
              </div>

              {isLibraryOpen && (
                <div className="absolute top-[68px] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xs py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div 
                    onClick={() => { 
                      setQuestionLibrary('Learniverse Question Bank'); 
                      setIsLibraryOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 hover:bg-blue-50 cursor-pointer font-medium ${questionLibrary === 'Learniverse Question Bank' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-800'}`}
                  >
                    Learniverse Question Bank
                  </div>
                  <div 
                    onClick={() => { 
                      setQuestionLibrary('My Questions'); 
                      setIsLibraryOpen(false); 
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 hover:bg-blue-50 cursor-pointer font-medium ${questionLibrary === 'My Questions' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-800'}`}
                  >
                    My Questions
                  </div>
                </div>
              )}
            </div>

            {questionLibrary === 'Learniverse Question Bank' && (
              <>
                <label className="block text-slate-700 font-semibold">Category
                  <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
                    <option value="">All categories</option>
                    {facets.categories.map(item => <option key={item.value} value={item.value}>{item.value}</option>)}
                  </select>
                </label>
                <label className="block text-slate-700 font-semibold">Question type
                  <select value={questionType} onChange={e => setQuestionType(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
                    <option value="">All types</option>
                    {facets.question_types.map(item => <option key={item.value} value={item.value}>{item.value}</option>)}
                  </select>
                </label>
                <label className="block text-slate-700 font-semibold">Company
                  <select value={company} onChange={e => setCompany(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
                    <option value="">All companies</option>
                    {facets.companies.map(item => <option key={item.value} value={item.value}>{item.name}</option>)}
                  </select>
                </label>
                <label className="block text-slate-700 font-semibold">Role
                  <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
                    <option value="">All roles</option>
                    {facets.roles.map(item => <option key={item.value} value={item.value}>{item.name}</option>)}
                  </select>
                </label>
              </>
            )}

            {/* 2. Topic Dropdown with clear 'x' matching Screenshot 9 */}
            <div className="relative">
              <label className="block text-slate-700 font-semibold mb-1.5">
                Topic
              </label>
              <div 
                onClick={() => {
                  setIsTopicOpen(!isTopicOpen);
                  setIsLibraryOpen(false);
                  setIsDifficultyOpen(false);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors text-slate-800 shadow-2xs"
              >
                <span className={selectedTopic ? 'font-semibold text-slate-900' : 'text-slate-400'}>
                  {selectedTopic || 'Select Topic'}
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedTopic && (
                    <X 
                      className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 p-0.5"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedTopic('');
                        setCurrentPage(1);
                      }}
                    />
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isTopicOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isTopicOpen && (
                <div className="absolute top-[68px] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xs py-1 z-30 max-h-52 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  {TOPIC_LIST.map((topicName) => (
                    <div 
                      key={topicName}
                      onClick={() => { 
                        setSelectedTopic(topicName); 
                        setIsTopicOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`px-3.5 py-2 hover:bg-blue-50 cursor-pointer text-slate-800 flex items-center justify-between ${selectedTopic === topicName ? 'bg-blue-50 font-semibold text-blue-600' : ''}`}
                    >
                      <span>{topicName}</span>
                      {selectedTopic === topicName && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Difficulty Level Dropdown with clear 'x' */}
            <div className="relative">
              <label className="block text-slate-700 font-semibold mb-1.5">
                Difficulty Level
              </label>
              <div 
                onClick={() => {
                  setIsDifficultyOpen(!isDifficultyOpen);
                  setIsLibraryOpen(false);
                  setIsTopicOpen(false);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors text-slate-800 shadow-2xs"
              >
                <span className={difficulty ? 'font-semibold text-slate-900' : 'text-slate-400'}>
                  {difficulty || 'Select Difficulty'}
                </span>
                <div className="flex items-center gap-1.5">
                  {difficulty && (
                    <X 
                      className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 p-0.5"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setDifficulty('');
                        setCurrentPage(1);
                      }}
                    />
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDifficultyOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isDifficultyOpen && (
                <div className="absolute top-[68px] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xs py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <div 
                      key={diff}
                      onClick={() => { 
                        setDifficulty(diff); 
                        setIsDifficultyOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`px-3.5 py-2 hover:bg-blue-50 cursor-pointer text-slate-800 flex items-center justify-between ${difficulty === diff ? 'bg-blue-50 font-semibold text-blue-600' : ''}`}
                    >
                      <span>{diff}</span>
                      {difficulty === diff && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Search question text and tags */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1">
                <span>Search Questions and Tags</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search keywords or tags"
                  value={tags}
                  onChange={(e) => {
                    setTags(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3.5 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>

            {questionLibrary === 'Learniverse Question Bank' && (
              <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
                <input
                  type="checkbox"
                  checked={includePendingReview}
                  onChange={(event) => {
                    setIncludePendingReview(event.target.checked);
                    setCurrentPage(1);
                  }}
                  className="mt-0.5"
                />
                <span>
                  Show pending-review questions. Review each answer and record your reason before approval.
                </span>
              </label>
            )}

            {/* 6. Pick Questions Randomly Toggle (Screenshot 7 & 8) */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-200/60 rounded-xl space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                  <span>Pick Questions Randomly</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setPickRandomly(!pickRandomly)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    pickRandomly ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {pickRandomly && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-[11px]">Count:</span>
                    <select
                      value={randomCount}
                      onChange={(e) => setRandomCount(Number(e.target.value))}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800"
                    >
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <button
                    onClick={handleApplyRandomPick}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Auto Pick</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Question List (8 cols) matching Screenshot 7 & 8 */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {/* Tab header */}
            <div className="px-6 pt-4 pb-2 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-2">
                All Questions ({totalDisplayCount})
              </div>
              <div className="text-xs text-slate-500 font-medium">
                <span className="text-blue-600 font-bold">{selectedQuestionIds.length}</span> Added to Section
                {selectedQuestionIds.length > 0 && questionLibrary === 'Learniverse Question Bank' && (
                  <button onClick={() => void handleSaveCollection()} className="ml-3 rounded border border-blue-200 px-2 py-1 text-blue-700 hover:bg-blue-50">
                    Save as Collection
                  </button>
                )}
              </div>
            </div>

            {/* Questions list with "See More >" and "+ Add" */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{loadError}</div>}
              {collectionMessage && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">{collectionMessage}</div>}
              {loading && <div className="p-4 text-center text-xs text-slate-500">Loading questions…</div>}
              {paginatedQuestions.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  {loading ? 'Loading questions…' : loadError ? 'Question bank unavailable. Check that the backend is running and you are signed in as an admin.' : 'No questions found matching your filters.'}
                </div>
              ) : (
                paginatedQuestions.map((q) => {
                  const isSelected = selectedQuestionIds.includes(q.id);
                  const isExpanded = expandedQuestionId === q.id;
                  const isApproved = q.library !== 'Learniverse Question Bank' || q.reviewStatus === 'Approved';

                  return (
                    <div 
                      key={q.id}
                      className="p-5 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all bg-white relative flex flex-col justify-between shadow-2xs hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                              {q.prompt}
                            </p>
                            {q.library === 'Learniverse Question Bank' && (
                              <span className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                                {isApproved ? 'Approved' : 'Pending Review'}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onAddQuestion(q.library === 'Learniverse Question Bank' ? { ...q, reviewStatus: 'Approved' } : q)}
                            disabled={!isApproved}
                            title={!isApproved ? 'Approve this question before adding it to a test.' : undefined}
                            className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${!isApproved ? 'cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200' : 'cursor-pointer ' + (
                              isSelected
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xs hover:shadow-xs'
                            )}`}
                          >
                            {!isApproved ? (
                              <span>Review first</span>
                            ) : isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Expand Link matching Screenshot 7 & 8 */}
                        <button
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 inline-block cursor-pointer"
                        >
                          {isExpanded ? 'Hide Details' : 'See More >'}
                        </button>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2 bg-slate-50/90 p-4 rounded-lg">
                            {q.options && q.options.length > 0 && (
                              <div>
                                <div className="font-semibold text-slate-700 mb-1.5">Options:</div>
                                <ul className="space-y-1.5 text-slate-600 pl-2">
                                  {q.options.map((opt: string, i: number) => {
                                    const optLabel = String.fromCharCode(65 + i);
                                    const isCorrect = q.correctAnswer === optLabel || q.correctAnswer === opt;
                                    return (
                                      <li key={i} className={`flex items-start gap-2 ${isCorrect ? 'text-emerald-700 font-semibold' : ''}`}>
                                        <span className="font-bold">{optLabel}.</span>
                                        <span>{opt}</span>
                                        {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 inline" />}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                            {q.explanation && (
                              <div className="mt-2.5 text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                                <strong className="text-slate-800 not-italic">Explanation: </strong> 
                                {q.explanation}
                              </div>
                            )}
                            {q.optionExplanations && (
                              <details className="rounded border border-slate-200 bg-white p-2 text-slate-600">
                                <summary className="cursor-pointer font-semibold text-slate-700">Option explanations</summary>
                                <ul className="mt-2 space-y-1">
                                  {q.optionExplanations.map((item, index) => <li key={index}><strong>{String.fromCharCode(65 + index)}.</strong> {item}</li>)}
                                </ul>
                              </details>
                            )}
                            {q.source && (
                              <div className="text-slate-500">Source: <span className="break-all">{q.source}</span></div>
                            )}
                            {q.verificationStatus && (
                              <div className="text-amber-800">Verification: {q.verificationStatus}</div>
                            )}
                            <div className="text-slate-600">Review evidence — Structure: {q.structuralStatus || 'Not Checked'} · Answer: {q.answerStatus || 'Unverified'} · Source: {q.sourceStatus || 'Unverified'} · Expert: {q.expertReviewStatus || 'Pending'}</div>
                            {q.verificationEvidence && <div className="text-slate-500">Evidence: {q.verificationEvidence}</div>}
                            {q.library === 'Learniverse Question Bank' && !isApproved && (
                              <div className="flex gap-2">
                                <button type="button" disabled={reviewBusyId === q.id} onClick={() => void handleReview(q, 'Approved')} className="rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                                  {reviewBusyId === q.id ? 'Saving…' : 'Approve after review'}
                                </button>
                                <button type="button" disabled={reviewBusyId === q.id} onClick={() => void handleReview(q, 'Rejected')} className="rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
                                  Reject
                                </button>
                              </div>
                            )}
                            {q.provenance && <div className="text-slate-500">Provenance: {q.provenance}</div>}
                            {q.company && <div className="text-slate-500">Company: {q.company}</div>}
                            {q.role && <div className="text-slate-500">Role: {q.role}</div>}
                            {q.questionType === 'coding' && (
                              <div className="space-y-2 rounded border border-indigo-100 bg-white p-3 text-slate-700">
                                {q.inputFormat && <div><strong>Input:</strong> {q.inputFormat}</div>}
                                {q.outputFormat && <div><strong>Output:</strong> {q.outputFormat}</div>}
                                {q.constraints && <div><strong>Constraints:</strong> {q.constraints}</div>}
                                {q.sampleExplanation && <div><strong>Sample explanation:</strong> {q.sampleExplanation}</div>}
                                {q.examples && <pre className="overflow-auto whitespace-pre-wrap">{JSON.stringify(q.examples, null, 2)}</pre>}
                                {q.testCases && <pre className="overflow-auto whitespace-pre-wrap">Test cases: {JSON.stringify(q.testCases, null, 2)}</pre>}
                                {q.referenceSolution && <details><summary className="cursor-pointer font-semibold">Reference solution (admin)</summary><pre className="mt-2 overflow-auto whitespace-pre-wrap">{q.referenceSolution}</pre></details>}
                                {(q.timeComplexity || q.spaceComplexity) && <div>{q.timeComplexity && `Time: ${q.timeComplexity}`} {q.spaceComplexity && ` · Space: ${q.spaceComplexity}`}</div>}
                                {q.supportedLanguages && <div>Languages: {q.supportedLanguages.join(', ')}</div>}
                              </div>
                            )}
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                              <span>Topic: <strong className="text-slate-700">{q.topic}</strong></span>
                              <span>•</span>
                              <span>Sub Topic: <strong className="text-slate-700">{q.subTopic}</strong></span>
                              <span>•</span>
                              <span>Difficulty: <strong className="text-slate-700">{q.difficulty}</strong></span>
                              {q.questionType && <><span>•</span><span>Type: <strong className="text-slate-700">{q.questionType}</strong></span></>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls matching Screenshot 7 & 8 */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span>
                {filteredQuestions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {(currentPage - 1) * pageSize + paginatedQuestions.length} of {totalDisplayCount}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      currentPage === pageNum
                        ? 'border border-blue-600 bg-blue-50 text-blue-600'
                        : 'border border-slate-200 hover:bg-white text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                {totalPages > firstVisiblePage + pageNumbers.length - 1 && <span>…</span>}
                {totalPages > firstVisiblePage + pageNumbers.length - 1 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2 py-1 rounded border border-slate-200 hover:bg-white text-slate-700 font-semibold cursor-pointer"
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            <strong className="text-blue-600">{selectedQuestionIds.length}</strong> question(s) selected for this section
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
