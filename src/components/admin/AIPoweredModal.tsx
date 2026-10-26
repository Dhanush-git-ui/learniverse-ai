import React, { useState } from 'react';
import { X, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { RoleTemplate, AssessmentSection } from '../../types/adminAssessment';

interface AIPoweredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (generatedRole: RoleTemplate) => void;
}

const SAMPLE_JDS = [
  {
    label: 'Full Stack Engineer',
    text: 'Looking for a Senior Full Stack Engineer proficient in React, Node.js, TypeScript, PostgreSQL, and REST APIs. Candidate should have solid knowledge of System Design, Data Structures and Algorithms, and Docker containerization.'
  },
  {
    label: 'Java Spring Boot Specialist',
    text: 'Enterprise Backend Developer with 3+ years experience in Java 17+, Spring Boot, Hibernate, Kafka, microservices architecture, and SQL query optimization. Hands-on unit testing with JUnit and Mockito required.'
  },
  {
    label: 'Data Scientist & ML',
    text: 'Data Scientist responsible for building predictive machine learning models, exploratory data analysis using Python, Pandas, Scikit-learn, PyTorch, and SQL data warehousing pipelines.'
  }
];

export const AIPoweredModal: React.FC<AIPoweredModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = jobDescription.toLowerCase();

      // Intelligent dynamic section generation based on JD keywords
      const sections: AssessmentSection[] = [];

      // 1. Technical MCQ Section
      if (lower.includes('java') || lower.includes('spring')) {
        sections.push({
          id: `sec-ai-java-${Date.now()}`,
          name: 'Java & Spring Boot Core MCQ',
          type: 'MCQ',
          timeLimit: 30,
          questionsCount: 25,
          score: 50,
          questionBreakdown: [
            { id: 'qb-ai-1', topic: 'Java', subTopic: 'OOP & Collections', difficulty: 'Medium', tags: 'CORE', count: 15 },
            { id: 'qb-ai-2', topic: 'CS Fundamentals', subTopic: 'Concurrency & GC', difficulty: 'Hard', tags: 'JVM', count: 10 }
          ]
        });
      } else if (lower.includes('react') || lower.includes('frontend') || lower.includes('javascript') || lower.includes('full stack')) {
        sections.push({
          id: `sec-ai-fe-${Date.now()}`,
          name: 'Front End Technical MCQ Test',
          type: 'MCQ',
          timeLimit: 25,
          questionsCount: 41,
          score: 41,
          questionBreakdown: [
            { id: 'qb-ai-1', topic: 'HTML and CSS', subTopic: 'Tags & Flexbox', difficulty: 'Easy', tags: '-', count: 25 },
            { id: 'qb-ai-2', topic: 'Javascript', subTopic: 'Async & Closures', difficulty: 'Medium', tags: '-', count: 16 }
          ]
        });
      } else {
        sections.push({
          id: `sec-ai-gen-${Date.now()}`,
          name: 'Core Technical Competency Evaluation',
          type: 'MCQ',
          timeLimit: 30,
          questionsCount: 25,
          score: 50,
          questionBreakdown: [
            { id: 'qb-ai-1', topic: 'CS Fundamentals', subTopic: 'Architecture', difficulty: 'Medium', tags: 'CORE', count: 25 }
          ]
        });
      }

      // 2. Database / SQL Section
      if (lower.includes('sql') || lower.includes('postgres') || lower.includes('database') || lower.includes('data')) {
        sections.push({
          id: `sec-ai-sql-${Date.now()}`,
          name: 'SQL and Database Expertise Test',
          type: 'SQL',
          timeLimit: 25,
          questionsCount: 30,
          score: 30,
          questionBreakdown: [
            { id: 'qb-ai-sql', topic: 'SQL', subTopic: 'Indexing & Complex Joins', difficulty: 'Medium', tags: '-', count: 30 }
          ]
        });
      }

      // 3. Coding / DSA Section
      sections.push({
        id: `sec-ai-code-${Date.now()}`,
        name: 'Competitive Programming & Algorithmic Skills',
        type: 'Coding',
        timeLimit: 45,
        questionsCount: 38,
        score: 38,
        questionBreakdown: [
          { id: 'qb-ai-dsa', topic: 'DSA', subTopic: 'Optimization & Data Structures', difficulty: 'Hard', tags: 'ALGO', count: 38 }
        ]
      });

      // Role Title Extraction
      let derivedTitle = 'AI Tailored Assessment';
      if (lower.includes('full stack')) derivedTitle = 'Full Stack Developer';
      else if (lower.includes('data scientist')) derivedTitle = 'Data Scientist';
      else if (lower.includes('java')) derivedTitle = 'Java Developer';
      else if (lower.includes('backend')) derivedTitle = 'Backend Developer';
      else if (lower.includes('frontend')) derivedTitle = 'Frontend Developer';

      const generatedRole: RoleTemplate = {
        id: `ai-role-${Date.now()}`,
        title: derivedTitle,
        sectionsCount: sections.length,
        experience: '2-4Yrs',
        description: 'Auto-generated assessment matching provided Job Description requirements.',
        sections
      };

      setIsAnalyzing(false);
      onGenerate(generatedRole);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xs border border-slate-200 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button matching Screenshot 10 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-100" />
            <span>AI-Powered Assessment</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            Paste a job description and let AI draft a ready-to-review assessment, tailored to the role.
          </p>
        </div>

        {/* Quick Sample JD selector */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-500 shrink-0 font-medium">Quick load:</span>
          {SAMPLE_JDS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => setJobDescription(sample.text)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 shrink-0 cursor-pointer transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Text Area Card matching Screenshot 10 */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 mb-6">
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Job Description
          </label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value.slice(0, 8000))}
            placeholder="Paste the job description here..."
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all shadow-2xs"
          />
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            <span>Include role requirements and skills for better assessment suggestions.</span>
            <span className="font-medium text-slate-500">{jobDescription.length} / 8000</span>
          </div>
        </div>

        {/* PROCEED Button matching Screenshot 10 */}
        <div>
          <button
            onClick={handleProceed}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing JD & Generating Sections...</span>
              </>
            ) : (
              <span>PROCEED</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
