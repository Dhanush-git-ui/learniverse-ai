
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Book, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationBox from '@/components/ConversationBox';
import QuestionCard from '@/components/QuestionCard';
import ProgressIndicator from '@/components/ProgressIndicator';
import { getTopicBySlug } from '@/services/TopicService';
import { useToast } from "@/hooks/use-toast";

// Interface for tracking user answers and performance
interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  attemptedAt: Date;
  hintsUsed: number;
}

const TopicDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  const topic = getTopicBySlug(slug || '');
  
  useEffect(() => {
    // Reset start time and hints when question changes
    setStartTime(new Date());
    setShowFeedback(false);
    setHintsUsedForCurrentQuestion(0);
  }, [currentQuestionIndex]);

  // Calculate session progress when userAnswers change
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
        <p className="text-gray-600 dark:text-gray-300 mb-6">The topic you're looking for doesn't exist or has been moved.</p>
        <Button 
          variant="default" 
          onClick={() => navigate('/topics')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Browse All Topics
        </Button>
      </div>
    );
  }
  
  const currentQuestion = topic.questions[currentQuestionIndex];
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Show completion message when all questions are done
      toast({
        title: "Topic Completed!",
        description: `You've completed all questions in this topic. Correct: ${sessionProgress.totalCorrect}/${sessionProgress.totalAttempted}`,
      });
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const analyzeAnswer = (userAnswer: string): boolean => {
    // This is a simple keyword-based analysis that would be replaced by a more sophisticated 
    // server-side analysis in the future
    const solution = currentQuestion.solution.toLowerCase();
    const answer = userAnswer.toLowerCase();
    
    const solutionKeywords = solution
      .split(/[\s,.;:!?()[\]{}'"]+/)
      .filter(word => word.length > 3);
      
    const answerKeywords = answer
      .split(/[\s,.;:!?()[\]{}'"]+/)
      .filter(word => word.length > 3);
    
    // Count matching keywords
    let matchCount = 0;
    for (const keyword of solutionKeywords) {
      if (answerKeywords.includes(keyword)) {
        matchCount++;
      }
    }
    
    // If more than 40% of keywords match, consider it correct
    // (This is a basic heuristic - server-side would use NLP)
    const accuracy = solutionKeywords.length > 0 
      ? matchCount / solutionKeywords.length 
      : 0;
      
    return accuracy > 0.4;
  };

  const handleSubmitAnswer = (answer: string) => {
    const endTime = new Date();
    const timeTaken = startTime 
      ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) 
      : 0;
    
    // Analyze the answer
    const isCorrect = analyzeAnswer(answer);
    
    // Create user answer record
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeTaken,
      attemptedAt: new Date(),
      hintsUsed: hintsUsedForCurrentQuestion
    };
    
    // Update state
    setUserAnswers(prev => [...prev, userAnswer]);
    
    // Show feedback
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    // Mark as completed
    if (!completedQuestions.includes(currentQuestionIndex + 1)) {
      setCompletedQuestions(prev => [...prev, currentQuestionIndex + 1]);
    }
    
    // Show appropriate toast
    toast({
      title: isCorrect ? "Correct!" : "Not quite right",
      description: isCorrect 
        ? "Great job! Your answer is correct." 
        : "Review the feedback to improve your answer.",
      variant: isCorrect ? "default" : "destructive",
    });
    
    // In a real implementation, this data would be sent to the server
    console.log("User answer data:", userAnswer);
  };

  const handleRequestHint = () => {
    setHintsUsedForCurrentQuestion(prev => prev + 1);
    console.log("User requested hint for question:", currentQuestionIndex + 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              onClick={() => navigate('/topics')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
          </div>
          
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                topic.category === 'Mathematics' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                  : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
              }`}>
                {/* We'll dynamically load the icon here based on topic.icon */}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{topic.title}</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {topic.description}
            </p>
          </header>
          
          {/* Session progress summary */}
          {userAnswers.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Your Progress</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {sessionProgress.totalCorrect}/{sessionProgress.totalAttempted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round((completedQuestions.length / topic.questions.length) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Time</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {sessionProgress.averageTime}s
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
                <div className={`mb-6 p-4 rounded-lg ${
                  feedbackType === 'correct' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30'
                }`}>
                  <div className={`flex items-center ${
                    feedbackType === 'correct' 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  } text-sm font-medium mb-2`}>
                    {feedbackType === 'correct' 
                      ? <CheckCircle className="h-4 w-4 mr-2" />
                      : <XCircle className="h-4 w-4 mr-2" />
                    }
                    <span>
                      {feedbackType === 'correct' 
                        ? 'Correct Answer!' 
                        : 'Not Quite Right'
                      }
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    {feedbackType === 'correct' 
                      ? 'Great job! Your answer demonstrates a good understanding of the concept.' 
                      : `The correct approach is: ${currentQuestion.solution}`
                    }
                  </p>
                </div>
              )}
              
              <div className="flex justify-between mb-8">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === topic.questions.length - 1 && !completedQuestions.includes(currentQuestionIndex + 1)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <Book className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Learning Resources</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {topic.category === 'Mathematics' 
                    ? "Information for this topic has been extracted from Wisconsin University's Calculus notes."
                    : "Information for this topic has been extracted from Alagappa University's DSA Module."}
                  The AI teacher has been trained on this content to provide accurate and helpful explanations.
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 h-[600px]">
              <ConversationBox 
                sessionTitle={`${topic.title} - Question ${currentQuestionIndex + 1}`}
                
                currentQuestion={currentQuestion}
                topic={topic}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TopicDetailPage;
