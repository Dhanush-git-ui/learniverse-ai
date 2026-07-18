
import { useState } from 'react';
import { HelpCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  hints: string[];
  onSubmit: (answer: string) => void;
  onRequestHint: () => void;
}

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  difficulty,
  question,
  hints = [],
  onSubmit,
  onRequestHint
}: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Map API difficulty to UI display text
  const difficultyText = 
    difficulty === 'easy' ? 'Beginner' :
    difficulty === 'medium' ? 'Intermediate' : 'Advanced';

  const difficultyColor = 
    difficultyText === 'Beginner' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' :
    difficultyText === 'Intermediate' ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
    'text-red-500 bg-red-50 dark:bg-red-900/20';

  const handleSubmit = () => {
    if (answer.trim() === '') {
      toast({
        title: "Empty answer",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(answer);
      setIsSubmitting(false);
      
      toast({
        title: "Answer submitted",
        description: "Your answer has been sent for evaluation.",
      });
    }, 500);
  };

  const handleRequestHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prevIndex => prevIndex + 1);
    }
    
    onRequestHint();
    
    toast({
      title: "Hint activated",
      description: `Hint ${currentHintIndex + 1} of ${hints.length} provided.`,
    });
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor}`}>
          {difficultyText}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Question {questionNumber}
        </h3>
        <div className="text-gray-700 dark:text-gray-200">
          {question}
        </div>
      </div>
      
      {showHint && hints.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
          <div className="flex items-center text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-2">
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>Hint {currentHintIndex + 1} of {hints.length}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-200 text-sm">
            {hints[currentHintIndex]}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="min-h-[100px] resize-y border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleRequestHint}
          disabled={showHint && currentHintIndex >= hints.length - 1}
          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          {!showHint ? "Get a hint" : "Next hint"}
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || answer.trim() === ''}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;
