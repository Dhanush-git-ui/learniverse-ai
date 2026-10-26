import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Users, 
  Send, 
  Layers, 
  Award,
  Sparkles
} from 'lucide-react';
import { AssessmentSection, AdminAssessment } from '../../types/adminAssessment';

interface FinalReviewPublishProps {
  roleTitle: string;
  sections: AssessmentSection[];
  onBackToSections: () => void;
  onPublishComplete: (assessment: AdminAssessment) => Promise<boolean>;
  onSaveDraft: (assessment: AdminAssessment) => Promise<boolean>;
}

export const FinalReviewPublish: React.FC<FinalReviewPublishProps> = ({
  roleTitle,
  sections,
  onBackToSections,
  onPublishComplete,
  onSaveDraft,
}) => {
  const [currentStep, setCurrentStep] = useState<'review' | 'publish'>('review');
  const [copiedLink, setCopiedLink] = useState(false);
  const [studentEmails, setStudentEmails] = useState('');
  const [enableProctoring, setEnableProctoring] = useState(true);
  const [fullScreenLock, setFullScreenLock] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const totalSections = sections.length;
  const totalTime = sections.reduce((sum, s) => sum + s.timeLimit, 0);
  const totalScore = sections.reduce((sum, s) => sum + s.score, 0);
  const totalQuestions = sections.reduce((sum, s) => sum + s.questionsCount, 0);

  const [assessmentId] = useState(() => `drive-${Date.now().toString(36)}`);
  const shareableUrl = `${window.location.origin}/assessment?drive=${assessmentId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const buildAssessment = (status: AdminAssessment['status']): AdminAssessment => ({
      id: assessmentId,
      title: roleTitle,
      publishedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) + ', 03:00 PM',
      startTime: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) + ', 04:00 PM',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) + ', 11:50 PM',
      totalScore,
      totalTime,
      status,
      sections,
      createdBy: 'Learniverse Admin'
    });

  const saveAssessment = async (status: AdminAssessment['status']) => {
    setSaving(true);
    setSaveError('');
    try {
      const saved = status === 'Draft'
        ? await onSaveDraft(buildAssessment(status))
        : await onPublishComplete(buildAssessment(status));
      if (!saved) setSaveError(`Could not save the ${status.toLowerCase()} assessment. Please try again.`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save this assessment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSections}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {roleTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentStep === 'review' ? 'Step 2 of 3: Final Assessment Review' : 'Step 3 of 3: Publish & Invite Candidates'}
            </p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-6 text-xs text-slate-600">
          <div>Sections: <strong className="font-bold text-slate-900">{totalSections}</strong></div>
          <div>Time: <strong className="font-bold text-slate-900">{totalTime} mins</strong></div>
          <div>Total Score: <strong className="font-bold text-slate-900">{totalScore}</strong></div>
        </div>
      </div>

      {currentStep === 'review' ? (
        /* STEP 2: REVIEW */
        <div className="mt-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Assessment Breakdown Summary</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-6 text-center">
              <div>
                <div className="text-xs text-slate-500">Modules</div>
                <div className="text-xl font-bold text-slate-800">{totalSections} Sections</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Total Questions</div>
                <div className="text-xl font-bold text-slate-800">{totalQuestions} Questions</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Allocated Duration</div>
                <div className="text-xl font-bold text-slate-800">{totalTime} Mins</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Maximum Marks</div>
                <div className="text-xl font-bold text-slate-800">{totalScore} Points</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Section Overview
              </div>
              {sections.map((sec, i) => (
                <div 
                  key={sec.id}
                  className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">{sec.name}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold uppercase text-[10px]">
                      {sec.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-slate-600">
                    <span>{sec.questionsCount} Questions</span>
                    <span>{sec.timeLimit} Mins</span>
                    <span className="font-bold text-slate-800">{sec.score} Pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {saveError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={onBackToSections}
              className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              &larr; Back to Section Details
            </button>

            <div className="flex items-center gap-3">
            <button type="button" disabled={saving} onClick={() => void saveAssessment('Draft')} className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={() => setCurrentStep('publish')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <span>Continue to Publish & Invite</span>
              <span>&rarr;</span>
            </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 3: PUBLISH & INVITE */
        <div className="mt-8 space-y-6">
          {/* Shareable Link Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Candidate Test Link
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Share this secure link with candidates or college placement cells to enter the test.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-800 font-mono"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Proctoring & Security Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Proctoring & Anti-Cheat Rules</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fullScreenLock}
                  onChange={(e) => setFullScreenLock(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-800">Full-Screen Mode Enforcement</div>
                  <div className="text-slate-500 mt-0.5">Auto-submits after 3 tab switches or exiting full-screen.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableProctoring}
                  onChange={(e) => setEnableProctoring(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-800">Webcam Random Snapshots</div>
                  <div className="text-slate-500 mt-0.5">Captures periodic photos every 30 seconds for audit log.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Candidate Email List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Candidate Roster (Optional)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Enter candidate emails or roll numbers separated by commas or newlines to restrict access.
            </p>
            <textarea
              rows={3}
              value={studentEmails}
              onChange={(e) => setStudentEmails(e.target.value)}
              placeholder="e.g. 21BCE1001@college.edu, candidate2@gmail.com..."
              className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Publish Actions */}
          {saveError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentStep('review')}
              className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              &larr; Back to Review
            </button>

            <button
              disabled={saving}
              onClick={() => void saveAssessment('In Progress')}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>{saving ? 'Saving…' : 'Publish & Launch Assessment'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
