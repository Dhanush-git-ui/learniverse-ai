import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Book, HelpCircle, CheckCircle, XCircle, Award, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationBox from '@/components/ConversationBox';
import QuestionCard from '@/components/QuestionCard';
import ProgressIndicator from '@/components/ProgressIndicator';
import { getTopicBySlug, getAllTopics } from '@/services/TopicService';
import { useToast } from "@/hooks/use-toast";

interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  attemptedAt: string;
  hintsUsed: number;
}

const TopicDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const topic = getTopicBySlug(slug || '');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [hintsUsedForCurrentQuestion, setHintsUsedForCurrentQuestion] = useState(0);
  const [sessionProgress, setSessionProgress] = useState({
    totalCorrect: 0,
    totalAttempted: 0,
    averageTime: 0
  });

  // Load progress on mount
  useEffect(() => {
    if (!topic) return;
    const progressKey = `learniverse_progress_${topic.slug}`;
    const saved = localStorage.getItem(progressKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completedQuestions) setCompletedQuestions(parsed.completedQuestions);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (parsed.lastActiveIndex !== undefined) setCurrentQuestionIndex(parsed.lastActiveIndex);
      } catch (e) {
        console.error(e);
      }
    } else {
      setCompletedQuestions([]);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    }
  }, [slug]);

  // Set start timers
  useEffect(() => {
    setStartTime(new Date());
    setShowFeedback(false);
    setHintsUsedForCurrentQuestion(0);
  }, [currentQuestionIndex]);

  // Save progress changes
  const saveProgressToStorage = (updatedCompleted: number[], updatedAnswers: UserAnswer[]) => {
    if (!topic) return;
    const progressKey = `learniverse_progress_${topic.slug}`;
    localStorage.setItem(progressKey, JSON.stringify({
      completedQuestions: updatedCompleted,
      userAnswers: updatedAnswers,
      lastActiveIndex: currentQuestionIndex
    }));
  };

  // Calculate statistics
  useEffect(() => {
    if (userAnswers.length > 0) {
      const totalCorrect = userAnswers.filter(a => a.isCorrect).length;
      const totalTime = userAnswers.reduce((sum, a) => sum + a.timeTaken, 0);
      setSessionProgress({
        totalCorrect,
        totalAttempted: userAnswers.length,
        averageTime: Math.round(totalTime / userAnswers.length)
      });
    }
  }, [userAnswers]);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Topic Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The topic you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate('/topics')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Browse All Topics
        </Button>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentQuestionIndex];

  // Helper to trigger recommended next topic
  const getNextRecommendedTopic = () => {
    const list = getAllTopics();
    const nextIdx = list.findIndex(t => t.slug === topic.slug) + 1;
    return list[nextIdx] || list[0];
  };

  // Determine Mastery Label
  const getMasteryLabel = () => {
    const ratio = sessionProgress.totalAttempted > 0 
      ? sessionProgress.totalCorrect / sessionProgress.totalAttempted 
      : 0;
    if (ratio >= 0.8) return 'Confident';
    if (ratio >= 0.4) return 'Improving';
    return 'Beginner';
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    const endTime = new Date();
    const timeTaken = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    
    // Evaluate answer with basic keyword matching
    const isCorrect = currentQuestion.solution.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 4)
      .some(keyword => answer.toLowerCase().includes(keyword));

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeTaken,
      attemptedAt: new Date().toISOString(),
      hintsUsed: hintsUsedForCurrentQuestion
    };

    const updatedAnswers = [...userAnswers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setUserAnswers(updatedAnswers);

    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);

    const questionNumber = currentQuestionIndex + 1;
    let updatedCompleted = [...completedQuestions];
    if (!completedQuestions.includes(questionNumber)) {
      updatedCompleted.push(questionNumber);
      setCompletedQuestions(updatedCompleted);
    }

    saveProgressToStorage(updatedCompleted, updatedAnswers);

    // Trigger streak progression
    const statsKey = 'learniverse_user_stats';
    const savedStats = localStorage.getItem(statsKey);
    let streakCount = 1;
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        streakCount = (stats.streak || 1) + 1;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(statsKey, JSON.stringify({ streak: streakCount }));

    toast({
      title: isCorrect ? "Correct answer!" : "Review solution!",
      description: isCorrect ? "Excellent explanation!" : "Look at the suggested formula.",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleRequestHint = () => {
    setHintsUsedForCurrentQuestion(prev => prev + 1);
  };

  const isTopicCompleted = completedQuestions.length === topic.questions.length;

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-gray-950">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <Button 
              variant="ghost" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
              onClick={() => navigate('/topics')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>

            {/* Streak indicator badge */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Session Mode: Active</span>
            </div>
          </div>
          
          <header className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {topic.category} Study Guide
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{topic.title}</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">
                  {topic.description}
                </p>
              </div>
              <div className="flex items-center space-x-4 bg-slate-50 dark:bg-gray-900 p-4 rounded-lg border border-slate-100 dark:border-gray-800 min-w-[200px]">
                <Award className="w-8 h-8 text-indigo-500" />
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Mastery Status</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{getMasteryLabel()}</div>
                </div>
              </div>
            </div>

            {/* Visual step guide to represent journey */}
            <div className="mt-6 pt-4 border-t border-slate-150 dark:border-gray-700/50 flex flex-wrap gap-2 text-xs font-medium text-slate-400">
              <span className="text-indigo-65 text-indigo-600 dark:text-indigo-400">Choose topic</span>
              <span>→</span>
              <span className={completedQuestions.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Learn concept</span>
              <span>→</span>
              <span className={userAnswers.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Answer question</span>
              <span>→</span>
              <span>Review progress</span>
            </div>
          </header>
          
          {isTopicCompleted ? (
            /* End-of-Topic Summary Card */
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-800 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Congratulations! Topic Mastered</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You completed all {topic.questions.length} question modules in **{topic.title}**.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-gray-700 py-6 max-w-md mx-auto text-sm">
                <div>
                  <div className="text-slate-45 text-slate-400 font-semibold">Score</div>
                  <div className="text-xl font-extrabold text-emerald-600">{sessionProgress.totalCorrect} / {topic.questions.length}</div>
                </div>
                <div>
                  <div className="text-slate-45 text-slate-400 font-semibold">Mastery</div>
                  <div className="text-xl font-extrabold text-indigo-65 text-indigo-600">{getMasteryLabel()}</div>
                </div>
                <div>
                  <div className="text-slate-45 text-slate-400 font-semibold">Avg. Speed</div>
                  <div className="text-xl font-extrabold text-slate-800 dark:text-white">{sessionProgress.averageTime}s</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Button
                  onClick={() => {
                    localStorage.removeItem(`learniverse_progress_${topic.slug}`);
                    setCompletedQuestions([]);
                    setUserAnswers([]);
                    setCurrentQuestionIndex(0);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restart Topic
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => navigate(`/topics/${getNextRecommendedTopic().slug}`)}
                >
                  Next Recommended Topic
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <ProgressIndicator 
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={topic.questions.length}
                    completedQuestions={completedQuestions}
                  />
                </div>
                
                <div className="mb-6">
                  <QuestionCard
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={topic.questions.length}
                    difficulty={currentQuestion.difficulty}
                    question={currentQuestion.prompt}
                    hints={currentQuestion.hints || []}
                    onSubmit={handleSubmitAnswer}
                    onRequestHint={handleRequestHint}
                  />
                </div>
                
                {showFeedback && (
                  <div className={`mb-6 p-4 rounded-lg border ${
                    feedbackType === 'correct' 
                      ? 'bg-emerald-50/50 border-emerald-25 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-350' 
                      : 'bg-red-50/60 border-red-200 dark:bg-red-950/20 text-red-800 dark:text-red-300'
                  }`}>
                    <div className="flex items-center text-sm font-semibold mb-1">
                      {feedbackType === 'correct' ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      <span>{feedbackType === 'correct' ? 'Correct Answer!' : 'Incorrect Approach'}</span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed mt-1">
                      {feedbackType === 'correct' 
                        ? 'Great job! Your answer matches the conceptual solution. Continue to the next question or view explainers.'
                        : `Solution: ${currentQuestion.solution}`
                      }
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between mb-8">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === topic.questions.length - 1}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/2 h-[600px]">
                <ConversationBox 
                  sessionTitle={`${topic.title} - Step ${currentQuestionIndex + 1}`}
                  currentQuestion={currentQuestion}
                  topic={topic}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TopicDetailPage;