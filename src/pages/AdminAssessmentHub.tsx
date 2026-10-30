import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { MyAssessmentsDashboard } from '../components/admin/MyAssessmentsDashboard';
import { CreationModeModal } from '../components/admin/CreationModeModal';
import { RoleCatalogSelector } from '../components/admin/RoleCatalogSelector';
import { SectionStepperWizard } from '../components/admin/SectionStepperWizard';
import { SectionTypeModal } from '../components/admin/SectionTypeModal';
import { SectionDetailsView } from '../components/admin/SectionDetailsView';
import { QuestionPickerModal } from '../components/admin/QuestionPickerModal';
import { AIPoweredModal } from '../components/admin/AIPoweredModal';
import { FinalReviewPublish } from '../components/admin/FinalReviewPublish';
import { MyQuestionsManager } from '../components/admin/MyQuestionsManager';

import { 
  AdminAssessment, 
  AssessmentSection, 
  RoleTemplate, 
  SectionType,
  QuestionBreakdownItem,
  QuestionItem
} from '../types/adminAssessment';
import { ROLE_TEMPLATES, INITIAL_MY_QUESTIONS } from '../data/mockAdminData';
import { deleteTrainerTest, listTrainerTests, saveTrainerTest } from '../services/adminQuestionBankService';

interface AdminAssessmentHubProps {
  hideNavbar?: boolean;
}

export const AdminAssessmentHub: React.FC<AdminAssessmentHubProps> = ({ hideNavbar = false }) => {
  const [assessments, setAssessments] = useState<AdminAssessment[]>([]);
  const [assessmentStorageError, setAssessmentStorageError] = useState('');

  // Custom Authored Questions stored in localStorage
  const [myQuestions, setMyQuestions] = useState<QuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem('learniverse_admin_my_questions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MY_QUESTIONS;
  });

  useEffect(() => {
    let cancelled = false;
    const loadPersistentAssessments = async () => {
      let legacy: AdminAssessment[] = [];
      try {
        const cached = localStorage.getItem('learniverse_admin_assessments');
        if (cached) legacy = JSON.parse(cached);
      } catch {
        legacy = [];
      }
      try {
        const result = await listTrainerTests();
        if (cancelled) return;
        if (result.items.length) {
          setAssessments(result.items);
          if (legacy.length) localStorage.removeItem('learniverse_admin_assessments');
          return;
        }
        if (legacy.length) {
          for (const test of legacy) await saveTrainerTest(test);
          if (cancelled) return;
          setAssessments(legacy);
          localStorage.removeItem('learniverse_admin_assessments');
          return;
        }
        setAssessments([]);
      } catch (error) {
        if (cancelled) return;
        if (legacy.length) {
          setAssessments(legacy);
          setAssessmentStorageError('Could not reach the database. Existing browser-saved tests are shown as a temporary fallback and have not been synchronized.');
        } else {
          setAssessmentStorageError(error instanceof Error ? error.message : 'Could not load trainer tests from the database.');
        }
      }
    };
    void loadPersistentAssessments();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('learniverse_admin_my_questions', JSON.stringify(myQuestions));
    } catch (e) {
      console.error(e);
    }
  }, [myQuestions]);

  // Dynamic user detection from localStorage session
  const [adminUser] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('learniverse_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) return u.name;
        if (u.full_name) return u.full_name;
        if (u.username) return u.username;
      }
      const savedStudent = localStorage.getItem('learniverse_student');
      if (savedStudent) {
        const s = JSON.parse(savedStudent);
        if (s.name) return s.name;
        if (s.fullName) return s.fullName;
      }
    } catch {
      // Fall back to the generic admin label if browser storage is malformed.
    }
    return 'Admin';
  });

  // Navbar Active Tab ('home' | 'questions')
  const [activeNav, setActiveNav] = useState<'home' | 'questions'>('home');

  // Main Screen Navigation State
  // 'dashboard' | 'role-catalog' | 'wizard' | 'section-details' | 'review-publish'
  const [currentView, setCurrentView] = useState<'dashboard' | 'role-catalog' | 'wizard' | 'section-details' | 'review-publish'>('dashboard');

  // Active Assessment being created or edited
  const [activeRoleTitle, setActiveRoleTitle] = useState('Full Stack Developer');
  const [activeSections, setActiveSections] = useState<AssessmentSection[]>([]);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);

  // Modals Visibility
  const [isCreationModeOpen, setIsCreationModeOpen] = useState(false);
  const [isSectionTypeModalOpen, setIsSectionTypeModalOpen] = useState(false);
  const [isAIPoweredModalOpen, setIsAIPoweredModalOpen] = useState(false);
  const [isQuestionPickerOpen, setIsQuestionPickerOpen] = useState(false);

  // Section Editing State (for Screenshot 6 drilldown)
  const [editingSection, setEditingSection] = useState<AssessmentSection | null>(null);

  // 1. Create Assessment Click -> Opens Creation Mode Modal (Screenshot 2)
  const handleOpenCreateModal = () => {
    setIsCreationModeOpen(true);
  };

  // 2. Select Role-Based Mode -> Goes to Role Catalog (Screenshot 3)
  const handleSelectRoleBased = () => {
    setIsCreationModeOpen(false);
    setActiveNav('home');
    setCurrentView('role-catalog');
  };

  // 3. Select AI-Powered Mode -> Opens AI Modal (Screenshot 10)
  const handleSelectAIPowered = () => {
    setIsCreationModeOpen(false);
    setIsAIPoweredModalOpen(true);
  };

  // 4. Select Custom Mode -> Directly opens wizard with empty/default custom section
  const handleSelectCustom = () => {
    setIsCreationModeOpen(false);
    setActiveNav('home');
    setActiveRoleTitle('Custom Assessment');
    setActiveSections([
      {
        id: `sec-custom-${Date.now()}`,
        name: 'Technical Competency Assessment',
        type: 'MCQ',
        timeLimit: 30,
        questionsCount: 20,
        score: 40,
        questionBreakdown: [
          { id: 'qb-c1', topic: 'CS Fundamentals', subTopic: 'Syntax & Logic', difficulty: 'Easy', tags: 'CORE', count: 20 }
        ]
      }
    ]);
    setEditingAssessmentId(null);
    setCurrentView('wizard');
  };

  // 5. Role Catalog Selection -> Loads selected role sections & goes to wizard (Screenshot 4 & 5)
  const handleRoleSelected = (role: RoleTemplate) => {
    setActiveRoleTitle(role.title);
    setActiveSections(role.sections);
    setEditingAssessmentId(null);
    setCurrentView('wizard');
  };

  // 6. AI Generation Result -> Loads generated sections & goes to wizard
  const handleAIGeneratedRole = (generatedRole: RoleTemplate) => {
    setActiveRoleTitle(generatedRole.title);
    setActiveSections(generatedRole.sections);
    setEditingAssessmentId(null);
    setCurrentView('wizard');
  };

  // 7. Add New Section of chosen type (Screenshot 11)
  const handleSectionTypeChosen = (type: SectionType) => {
    const newSec: AssessmentSection = {
      id: `sec-${Date.now()}`,
      name: `New ${type} Assessment Section`,
      type,
      timeLimit: 25,
      questionsCount: 10,
      score: 20,
      questionBreakdown: [
        { id: `qb-${Date.now()}`, topic: 'DSA', subTopic: 'Basics', difficulty: 'Medium', tags: '-', count: 10 }
      ]
    };
    const updated = [...activeSections, newSec];
    setActiveSections(updated);
    // Directly drill down to edit this section
    setEditingSection(newSec);
    setCurrentView('section-details');
  };

  // 8. Edit Section Details (Screenshot 6 Dedicated View)
  const handleEditSection = (section: AssessmentSection) => {
    setEditingSection(section);
    setCurrentView('section-details');
  };

  const handleSaveSection = (updatedSection: AssessmentSection) => {
    setActiveSections(activeSections.map(s => s.id === updatedSection.id ? updatedSection : s));
    setEditingSection(updatedSection);
  };

  // 9. Add Question from Question Picker into current editing section (Screenshots 7, 8, 9)
  const handleAddQuestionToSection = (question: any) => {
    if (!editingSection) return;

    const currentSelected = editingSection.selectedQuestionIds || [];
    const isAlreadyAdded = currentSelected.includes(question.id);

    const updatedIds = isAlreadyAdded
      ? currentSelected.filter(id => id !== question.id)
      : [...currentSelected, question.id];

    // Update question breakdown item count dynamically
    const existingBreakdown = [...editingSection.questionBreakdown];
    const matchTopicIdx = existingBreakdown.findIndex(
      b => b.topic.toLowerCase() === question.topic.toLowerCase() && b.difficulty === question.difficulty
    );

    if (matchTopicIdx >= 0) {
      existingBreakdown[matchTopicIdx] = {
        ...existingBreakdown[matchTopicIdx],
        count: isAlreadyAdded 
          ? Math.max(1, existingBreakdown[matchTopicIdx].count - 1)
          : existingBreakdown[matchTopicIdx].count + 1
      };
    } else if (!isAlreadyAdded) {
      existingBreakdown.push({
        id: `qb-${Date.now()}`,
        topic: question.topic,
        subTopic: question.subTopic || 'Core',
        difficulty: question.difficulty || 'Medium',
        tags: question.tags || '-',
        count: 1
      });
    }

    const totalQuestions = existingBreakdown.reduce((sum, b) => sum + b.count, 0);

    const updatedSection: AssessmentSection = {
      ...editingSection,
      selectedQuestionIds: updatedIds,
      questionBreakdown: existingBreakdown,
      questionsCount: totalQuestions,
      score: totalQuestions
    };

    setEditingSection(updatedSection);
    handleSaveSection(updatedSection);
  };

  // 10. Edit an existing assessment from the dashboard
  const handleEditExistingAssessment = (asmt: AdminAssessment) => {
    setEditingAssessmentId(asmt.id);
    setActiveRoleTitle(asmt.title);
    setActiveSections(asmt.sections || []);
    setCurrentView('wizard');
  };

  // 11. Delete an assessment
  const handleDeleteAssessment = async (id: string) => {
    try {
      await deleteTrainerTest(id);
      setAssessments(current => current.filter(a => a.id !== id));
      setAssessmentStorageError('');
    } catch (error) {
      setAssessmentStorageError(error instanceof Error ? error.message : 'Could not delete the saved test.');
    }
  };

  // 12. Final Publish Complete
  const persistAssessment = async (assessment: AdminAssessment): Promise<boolean> => {
    const savedAssessment = {
      ...assessment,
      id: editingAssessmentId || assessment.id || crypto.randomUUID(),
    };
    try {
      await saveTrainerTest(savedAssessment);
      setAssessments(current => {
        const exists = current.some(a => a.id === savedAssessment.id);
        return exists ? current.map(a => a.id === savedAssessment.id ? savedAssessment : a) : [savedAssessment, ...current];
      });
      setAssessmentStorageError('');
      setCurrentView('dashboard');
      return true;
    } catch (error) {
      setAssessmentStorageError(error instanceof Error ? error.message : 'The test could not be saved to the database.');
      return false;
    }
  };

  // 13. Custom Question Authoring
  const handleAddCustomQuestion = (newQ: QuestionItem) => {
    setMyQuestions([newQ, ...myQuestions]);
  };

  const handleDeleteCustomQuestion = (id: string) => {
    setMyQuestions(myQuestions.filter(q => q.id !== id));
  };

  const handleUpdateCustomQuestion = (updatedQ: QuestionItem) => {
    setMyQuestions(myQuestions.map(q => q.id === updatedQ.id ? updatedQ : q));
  };

  // Refresh from the shared database rather than restoring a browser-only sample list.
  const handleRefreshAssessments = async () => {
    try {
      const result = await listTrainerTests();
      setAssessments(result.items);
      setAssessmentStorageError('');
    } catch (error) {
      setAssessmentStorageError(error instanceof Error ? error.message : 'Could not refresh tests from the database.');
    }
  };

  return (
    <div className={`font-sans text-slate-900 flex flex-col ${hideNavbar ? 'w-full' : 'min-h-screen bg-slate-50/60'}`}>
      {/* Top Navbar with Learniverse AI Branding */}
      {!hideNavbar && (
        <AdminNavbar 
          userName={adminUser} 
          activeNav={activeNav}
          onNavChange={(tab) => {
            setActiveNav(tab);
            if (tab === 'home' && currentView === 'section-details') {
              setCurrentView('wizard');
            }
          }}
          onNavigateHome={() => {
            setActiveNav('home');
            setCurrentView('dashboard');
          }}
        />
      )}

      {/* Main Screen Router */}
      <main className={`flex-1 ${hideNavbar ? 'p-0' : ''}`}>
        {hideNavbar && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-4 mb-6">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setActiveNav('home');
                  setCurrentView('dashboard');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeNav === 'home'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Assessments & Tests</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
                  {assessments.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveNav('questions')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeNav === 'questions'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Question Bank</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
                  {myQuestions.length}
                </span>
              </button>
            </div>

            {currentView !== 'dashboard' && activeNav === 'home' && (
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
              >
                <span>← Back to Tests Dashboard</span>
              </button>
            )}
          </div>
        )}
        {assessmentStorageError && <div role="alert" className="mx-auto mt-4 max-w-7xl rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">Database status: {assessmentStorageError}</div>}
        {/* If 'My Questions' tab is active, show Question Bank Manager */}
        {activeNav === 'questions' ? (
          <MyQuestionsManager
            questions={myQuestions}
            onAddQuestion={handleAddCustomQuestion}
            onDeleteQuestion={handleDeleteCustomQuestion}
            onUpdateQuestion={handleUpdateCustomQuestion}
          />
        ) : (
          <>
            {/* VIEW 1: My Assessments Dashboard (Screenshot 1) */}
            {currentView === 'dashboard' && (
              <MyAssessmentsDashboard
                userName={adminUser}
                assessments={assessments}
                onCreateClick={handleOpenCreateModal}
                onEditAssessment={handleEditExistingAssessment}
                onDeleteAssessment={handleDeleteAssessment}
                onRefresh={handleRefreshAssessments}
              />
            )}

            {/* VIEW 2: Role-Based Catalog Selector (Screenshot 3) */}
            {currentView === 'role-catalog' && (
              <RoleCatalogSelector
                onBack={() => setCurrentView('dashboard')}
                onSelectRole={handleRoleSelected}
              />
            )}

            {/* VIEW 3: Assessment Stepper Wizard - Step 1: Section Details (Screenshot 4 & 5) */}
            {currentView === 'wizard' && (
              <SectionStepperWizard
                roleTitle={activeRoleTitle}
                sections={activeSections}
                onBack={() => setCurrentView(editingAssessmentId ? 'dashboard' : 'role-catalog')}
                onUpdateSections={setActiveSections}
                onOpenCreateSectionType={() => setIsSectionTypeModalOpen(true)}
                onEditSection={handleEditSection}
                onProceedToReview={() => setCurrentView('review-publish')}
              />
            )}

            {/* VIEW 4: Dedicated Section Details Screen (Screenshot 6) */}
            {currentView === 'section-details' && editingSection && (
              <SectionDetailsView
                section={editingSection}
                onBack={() => setCurrentView('wizard')}
                onSave={handleSaveSection}
                onOpenQuestionPicker={() => setIsQuestionPickerOpen(true)}
              />
            )}

            {/* VIEW 5: Final Review & Publish - Steps 2 & 3 */}
            {currentView === 'review-publish' && (
              <FinalReviewPublish
                roleTitle={activeRoleTitle}
                sections={activeSections}
                onBackToSections={() => setCurrentView('wizard')}
                onPublishComplete={persistAssessment}
                onSaveDraft={persistAssessment}
              />
            )}
          </>
        )}
      </main>

      {/* MODAL 1: Creation Mode Modal (Screenshot 2) */}
      <CreationModeModal
        isOpen={isCreationModeOpen}
        onClose={() => setIsCreationModeOpen(false)}
        onSelectRoleBased={handleSelectRoleBased}
        onSelectAIPowered={handleSelectAIPowered}
        onSelectCustom={handleSelectCustom}
      />

      {/* MODAL 2: Section Type Selector with 8 types (Screenshot 11) */}
      <SectionTypeModal
        isOpen={isSectionTypeModalOpen}
        onClose={() => setIsSectionTypeModalOpen(false)}
        onSelectType={handleSectionTypeChosen}
      />

      {/* MODAL 3: Question Picker Modal with filters & library (Screenshots 7, 8, 9) */}
      {editingSection && (
        <QuestionPickerModal
          isOpen={isQuestionPickerOpen}
          onClose={() => setIsQuestionPickerOpen(false)}
          sectionTitle={editingSection.name}
          onAddQuestion={handleAddQuestionToSection}
          selectedQuestionIds={editingSection.selectedQuestionIds || []}
          myQuestions={myQuestions}
        />
      )}

      {/* MODAL 4: AI-Powered Assessment Modal with JD parser (Screenshot 10) */}
      <AIPoweredModal
        isOpen={isAIPoweredModalOpen}
        onClose={() => setIsAIPoweredModalOpen(false)}
        onGenerate={handleAIGeneratedRole}
      />
    </div>
  );
};

export default AdminAssessmentHub;
