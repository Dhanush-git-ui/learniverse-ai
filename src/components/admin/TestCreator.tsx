import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  Search, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Award, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  FileText, 
  Layers, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AdminAssessment, AssessmentSection, QuestionItem } from '../../types/adminAssessment';
import { LEARNIVERSE_SAMPLE_QUESTIONS, INITIAL_MY_QUESTIONS } from '../../data/mockAdminData';
import { getAdminQuestionPage } from '../../services/adminQuestionBankService';

interface TestCreatorProps {
  onBack: () => void;
  onSave: (assessment: AdminAssessment, status: 'Draft' | 'In Progress') => Promise<boolean>;
  editingAssessment?: AdminAssessment | null;
  authorName?: string;
}

const TEMPLATE_PRESETS = [
  { title: 'Full Stack Developer Screening', role: 'Full Stack', duration: 60, topic: 'All' },
  { title: 'Frontend React & JavaScript Assessment', role: 'Frontend', duration: 45, topic: 'Javascript' },
  { title: 'Backend Python & REST APIs Challenge', role: 'Backend', duration: 45, topic: 'Python' },
  { title: 'Java & Object Oriented Programming Test', role: 'Java', duration: 45, topic: 'Java' },
  { title: 'Data Structures & Algorithms Screening', role: 'DSA', duration: 60, topic: 'DSA' },
  { title: 'Database Query & SQL Mastery', role: 'SQL', duration: 30, topic: 'SQL' },
  { title: 'Core Computer Science Fundamentals', role: 'Core CS', duration: 40, topic: 'CS Fundamentals' },
];

const TOPIC_CHIPS = [
  'All',
  'DSA',
  'Python',
  'Javascript',
  'Java',
  'SQL',
  'CS Fundamentals',
  'React',
  'HTML and CSS',
];

export const TestCreator: React.FC<TestCreatorProps> = ({
  onBack,
  onSave,
  editingAssessment,
  authorName = 'Learniverse Admin',
}) => {
  // Current Wizard Step: 1 = Details, 2 = Questions, 3 = Review & Publish
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // STEP 1 STATE: Details
  const [title, setTitle] = useState(editingAssessment?.title || '');
  const [roleName, setRoleName] = useState(editingAssessment?.roleName || 'Full Stack');
  const [duration, setDuration] = useState<number>(editingAssessment?.totalTime || 45);
  const [passingPercentage, setPassingPercentage] = useState<number>(60);
  const [instructions, setInstructions] = useState(
    'Please complete all questions within the allocated time. Once you submit, your score and evaluation will be recorded.'
  );
  const [enableProctoring, setEnableProctoring] = useState(true);
  const [fullScreenLock, setFullScreenLock] = useState(true);

  // STEP 2 STATE: Question Pool & Selection
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(() => {
    if (editingAssessment?.sections?.length) {
      return editingAssessment.sections.flatMap(s => s.selectedQuestionIds || []);
    }
    return [];
  });

  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [showSelectedDrawer, setShowSelectedDrawer] = useState(false);
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);

  // Live Question Bank items (from DB + builtin sample fallback)
  const [dbQuestions, setDbQuestions] = useState<QuestionItem[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Custom added questions in this creator session
  const [customQuestions, setCustomQuestions] = useState<QuestionItem[]>([]);

  // New Custom Question form fields
  const [newQPrompt, setNewQPrompt] = useState('');
  const [newQTopic, setNewQTopic] = useState('DSA');
  const [newQDifficulty, setNewQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState('A');
  const [newQExplanation, setNewQExplanation] = useState('');

  // STEP 3 STATE: Review & Publish
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const [assessmentId] = useState<string>(
    () => editingAssessment?.id || `drive-${Date.now().toString(36)}`
  );

  const shareableUrl = `${window.location.origin}/assessment?drive=${assessmentId}`;

  // Fetch approved questions from database on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoadingQuestions(true);
    getAdminQuestionPage({ status: 'Approved', page: 1, pageSize: 50 })
      .then((res) => {
        if (!cancelled && res.items.length > 0) {
          setDbQuestions(res.items);
        }
      })
      .catch(() => {
        // Fall back gracefully to built-in verified sample questions
      })
      .finally(() => {
        if (!cancelled) setIsLoadingQuestions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Combined master pool of questions (DB + built-in samples + session custom)
  const masterQuestionPool = useMemo<QuestionItem[]>(() => {
    const poolMap = new Map<string, QuestionItem>();

    // 1. Session-authored custom questions
    customQuestions.forEach(q => poolMap.set(q.id, q));

    // 2. Database questions
    dbQuestions.forEach(q => poolMap.set(q.id, q));

    // 3. Built-in verified sample questions
    (LEARNIVERSE_SAMPLE_QUESTIONS as QuestionItem[]).forEach(q => {
      if (!poolMap.has(q.id)) poolMap.set(q.id, q);
    });

    // 4. Initial my questions
    (INITIAL_MY_QUESTIONS as QuestionItem[]).forEach(q => {
      if (!poolMap.has(q.id)) poolMap.set(q.id, q);
    });

    return Array.from(poolMap.values());
  }, [dbQuestions, customQuestions]);

  // Filtered questions based on search, topic chip, difficulty
  const filteredQuestions = useMemo(() => {
    return masterQuestionPool.filter(q => {
      const matchSearch =
        !questionSearch ||
        q.prompt.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.topic.toLowerCase().includes(questionSearch.toLowerCase()) ||
        (q.tags && q.tags.toLowerCase().includes(questionSearch.toLowerCase()));

      const matchTopic =
        selectedTopic === 'All' ||
        q.topic.toLowerCase().includes(selectedTopic.toLowerCase());

      const matchDifficulty =
        selectedDifficulty === 'All' ||
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchSearch && matchTopic && matchDifficulty;
    });
  }, [masterQuestionPool, questionSearch, selectedTopic, selectedDifficulty]);

  // Map of selected Question Items
  const selectedQuestions = useMemo(() => {
    const selectedSet = new Set(selectedQuestionIds);
    return masterQuestionPool.filter(q => selectedSet.has(q.id));
  }, [masterQuestionPool, selectedQuestionIds]);

  const totalScore = selectedQuestions.length; // 1 point per question by default

  // Toggle question selection
  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 1-Click Auto Select questions
  const handleAutoSelect = (count: number) => {
    // Prefer matching current topic if set, otherwise from all pool
    const candidates = filteredQuestions.length >= count ? filteredQuestions : masterQuestionPool;
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, count).map(q => q.id);
    setSelectedQuestionIds(Array.from(new Set([...selectedQuestionIds, ...picked])));
  };

  // Add custom question
  const handleSaveCustomQuestion = () => {
    if (!newQPrompt.trim()) return;
    const newId = `custom-q-${Date.now()}`;
    const newQuestion: QuestionItem = {
      id: newId,
      prompt: newQPrompt.trim(),
      topic: newQTopic,
      subTopic: 'Custom',
      difficulty: newQDifficulty,
      tags: 'CUSTOM',
      options: newQOptions.filter(o => o.trim().length > 0),
      correctAnswer: newQCorrect,
      explanation: newQExplanation.trim() || undefined,
      library: 'My Questions',
      reviewStatus: 'Approved',
    };
    setCustomQuestions(prev => [newQuestion, ...prev]);
    setSelectedQuestionIds(prev => [newId, ...prev]);
    setIsAddCustomModalOpen(false);
    // Reset form
    setNewQPrompt('');
    setNewQOptions(['', '', '', '']);
    setNewQExplanation('');
  };

  // Copy candidate link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Build final AdminAssessment object
  const buildAssessment = (status: 'Draft' | 'In Progress'): AdminAssessment => {
    const section: AssessmentSection = {
      id: `sec-${assessmentId}`,
      name: `${roleName} Technical Section`,
      type: 'MCQ',
      timeLimit: duration,
      questionsCount: selectedQuestions.length,
      score: totalScore,
      selectedQuestionIds,
      questionBreakdown: [
        {
          id: `qb-${assessmentId}`,
          topic: roleName || 'General',
          subTopic: 'Assessment',
          difficulty: 'Medium',
          tags: 'ASSESSMENT',
          count: selectedQuestions.length,
        },
      ],
    };

    return {
      id: assessmentId,
      title: title.trim() || `${roleName} Assessment`,
      roleName: roleName.trim(),
      publishedOn:
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startTime:
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }) + ', Now',
      endTime:
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }) + ', 11:59 PM',
      totalScore,
      totalTime: duration,
      status,
      sections: [section],
      createdBy: authorName,
    };
  };

  // Handle final save or publish
  const handleExecuteSave = async (status: 'Draft' | 'In Progress') => {
    if (!title.trim()) {
      setCurrentStep(1);
      setSaveError('Please provide an assessment title before saving.');
      return;
    }
    if (selectedQuestionIds.length === 0) {
      setCurrentStep(2);
      setSaveError('Please select at least 1 question for your assessment.');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      const assessmentToSave = buildAssessment(status);
      const success = await onSave(assessmentToSave, status);
      if (!success) {
        setSaveError('Could not save the assessment to the database. Please try again.');
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 animate-fade-in">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cancel & Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Step {currentStep} of 3
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentStep === 1
                ? 'Configure test title, duration, role, and integrity rules'
                : currentStep === 2
                ? 'Pick questions from the verified question bank or auto-generate'
                : 'Review candidate experience, copy test link, and publish'}
            </p>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Details</span>
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => {
              if (!title.trim()) {
                setSaveError('Please enter a test title first.');
                return;
              }
              setSaveError('');
              setCurrentStep(2);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 2
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Questions ({selectedQuestionIds.length})</span>
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => {
              if (!title.trim() || selectedQuestionIds.length === 0) {
                setSaveError('Select at least 1 question before reviewing.');
                return;
              }
              setSaveError('');
              setCurrentStep(3);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 3
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Review & Publish</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner if any */}
      {saveError && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </div>
          <button onClick={() => setSaveError('')} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          STEP 1: TEST DETAILS & CONFIGURATION
      ========================================================================= */}
      {currentStep === 1 && (
        <div className="mt-8 space-y-8 animate-fade-in">
          {/* Quick Preset Templates Section */}
          <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Quick Template Presets (Click to autofill)
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => {
                    setTitle(preset.title);
                    setRoleName(preset.role);
                    setDuration(preset.duration);
                    if (preset.topic !== 'All') {
                      setSelectedTopic(preset.topic);
                    }
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-600 transition-all shadow-2xs cursor-pointer"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Basic Test Metadata */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Assessment Details</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assessment Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer Screening"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Role / Domain
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Engineer"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Candidate Instructions & Overview
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter guidelines for candidates before they begin..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* Right Card: Time, Passing Criteria & Integrity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Duration, Scoring & Integrity</span>
              </h3>

              {/* Duration Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Duration (Minutes): <span className="text-blue-600">{duration} mins</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[15, 30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        duration === mins
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 30)}
                  className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>

              {/* Passing Percentage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Passing Score: <span className="text-blue-600">{passingPercentage}%</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={5}
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>40% (Basic)</span>
                  <span>60% (Standard)</span>
                  <span>75% (Strict)</span>
                  <span>90% (Elite)</span>
                </div>
              </div>

              {/* Integrity Toggles */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Candidate Anti-Cheating Controls
                </span>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Fullscreen Enforcement</span>
                      <span className="text-[11px] text-slate-500">Candidate must stay in full screen during test</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={fullScreenLock}
                    onChange={(e) => setFullScreenLock(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Tab Switch Detection</span>
                      <span className="text-[11px] text-slate-500">Flags candidate violations if tab loses focus</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableProctoring}
                    onChange={(e) => setEnableProctoring(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!title.trim()) {
                  setSaveError('Please enter a test title before continuing.');
                  return;
                }
                setSaveError('');
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Question Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: QUESTION SELECTION (CLEAN, FAST, DIRECT)
      ========================================================================= */}
      {currentStep === 2 && (
        <div className="mt-8 space-y-6 animate-fade-in">
          {/* Top Control Bar: Search & Magic Auto-Select */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search questions by keyword, topic, or language..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              {/* 1-Click Magic Auto-Select & Custom Question Authoring */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAutoSelect(10)}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Automatically pick 10 questions"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>⚡ Auto-Select 10</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutoSelect(20)}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Automatically pick 20 questions"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>⚡ Auto-Select 20</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddCustomModalOpen(true)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Custom Question</span>
                </button>
              </div>
            </div>

            {/* Filter Chips: Topic & Difficulty */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {/* Topic Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Topic:</span>
                {TOPIC_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setSelectedTopic(chip)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTopic === chip
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Difficulty Pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Difficulty:</span>
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
              <span>Showing {filteredQuestions.length} Questions</span>
              <span className="text-blue-600 font-extrabold">
                {selectedQuestionIds.length} Selected for Test
              </span>
            </div>

            {isLoadingQuestions ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
                Loading verified question bank...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
                No questions found matching your filter criteria. Try changing the topic chip or search terms.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-2xs ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50/20 ring-1 ring-blue-400/30'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Question Content */}
                      <div className="flex-1 space-y-2">
                        {/* Meta Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            #{idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            {q.topic}
                          </span>
                          {q.subTopic && q.subTopic !== q.topic && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {q.subTopic}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-md font-extrabold ${
                              q.difficulty.toLowerCase() === 'easy'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : q.difficulty.toLowerCase() === 'medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Prompt */}
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {q.prompt}
                        </p>

                        {/* Options Preview */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {q.options.map((opt, oIndex) => {
                              const letter = String.fromCharCode(65 + oIndex);
                              const isCorrect =
                                q.correctAnswer === letter ||
                                q.correctAnswer?.toLowerCase() === opt.toLowerCase();
                              return (
                                <div
                                  key={oIndex}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 ${
                                    isCorrect
                                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 font-bold'
                                      : 'bg-slate-50 border-slate-100 text-slate-600'
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {letter}
                                  </span>
                                  <span className="truncate">{opt}</span>
                                  {isCorrect && <Check className="w-3 h-3 text-emerald-600 ml-auto shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Right: 1-Click Add/Remove Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleQuestion(q.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Sticky Selected Tray Dock at Bottom */}
          <div className="sticky bottom-4 bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
                {selectedQuestionIds.length}
              </div>
              <div>
                <span className="text-xs font-bold block">
                  {selectedQuestionIds.length} Questions Selected
                </span>
                <span className="text-[11px] text-slate-400">
                  Total Score: {totalScore} pts • Duration: {duration} mins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedQuestionIds.length === 0) {
                    setSaveError('Please select at least 1 question for your test.');
                    return;
                  }
                  setSaveError('');
                  setCurrentStep(3);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review & Publish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: REVIEW & PUBLISH
      ========================================================================= */}
      {currentStep === 3 && (
        <div className="mt-8 space-y-6 animate-fade-in">
          {/* Executive Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                  Assessment Overview
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{roleName} Candidate Screening</p>
              </div>

              {/* Shareable Link Box */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">Candidate Access URL</span>
                  <span className="text-xs font-mono font-bold text-slate-800 truncate max-w-xs block">
                    {shareableUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Questions</span>
                <span className="text-xl font-black text-slate-900">{selectedQuestions.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Score</span>
                <span className="text-xl font-black text-slate-900">{totalScore} pts</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Duration</span>
                <span className="text-xl font-black text-slate-900">{duration} mins</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Passing Cutoff</span>
                <span className="text-xl font-black text-blue-600">{passingPercentage}%</span>
              </div>
            </div>

            {/* Questions Table Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Included Questions ({selectedQuestions.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Edit Question List
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-4">Question Prompt</th>
                      <th className="py-2.5 px-3">Topic</th>
                      <th className="py-2.5 px-3">Difficulty</th>
                      <th className="py-2.5 px-3 text-center w-16">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {selectedQuestions.map((q, i) => (
                      <tr key={q.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono font-bold">
                          {i + 1}
                        </td>
                        <td className="py-2.5 px-4 font-medium max-w-md truncate">
                          {q.prompt}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-semibold">
                          {q.topic}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              q.difficulty.toLowerCase() === 'easy'
                                ? 'bg-emerald-50 text-emerald-700'
                                : q.difficulty.toLowerCase() === 'medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleQuestion(q.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Footer: Save Draft or Publish Live */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              ← Back to Questions
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleExecuteSave('Draft')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleExecuteSave('In Progress')}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{isSaving ? 'Publishing...' : '🚀 Publish Assessment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INLINE MODAL: ADD CUSTOM QUESTION ON THE FLY
      ========================================================================= */}
      {isAddCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add Custom Question</span>
              </h3>
              <button
                onClick={() => setIsAddCustomModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Prompt *</label>
                <textarea
                  rows={3}
                  value={newQPrompt}
                  onChange={(e) => setNewQPrompt(e.target.value)}
                  placeholder="Enter the question statement..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <select
                    value={newQTopic}
                    onChange={(e) => setNewQTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    {TOPIC_CHIPS.filter(c => c !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newQDifficulty}
                    onChange={(e) => setNewQDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Options & Correct Answer</label>
                {newQOptions.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewQCorrect(letter)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                          newQCorrect === letter
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to set as correct answer"
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newQOptions];
                          updated[i] = e.target.value;
                          setNewQOptions(updated);
                        }}
                        placeholder={`Option ${letter}`}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-slate-900 font-medium"
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation (Optional)</label>
                <input
                  type="text"
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  placeholder="Why is this answer correct?"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCustomModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newQPrompt.trim()}
                onClick={handleSaveCustomQuestion}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all disabled:opacity-50"
              >
                Save & Add to Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCreator;

