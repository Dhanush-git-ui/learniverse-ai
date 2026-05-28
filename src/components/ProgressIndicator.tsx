
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  completedQuestions: number[];
}

const ProgressIndicator = ({
  currentQuestion,
  totalQuestions,
  completedQuestions
}: ProgressIndicatorProps) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Your Progress
      </h3>
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Question {currentQuestion} of {totalQuestions}
        </div>
        
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {completedQuestions.length}/{totalQuestions} Completed
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const questionNumber = index + 1;
          const isCompleted = completedQuestions.includes(questionNumber);
          const isCurrent = questionNumber === currentQuestion;
          
          return (
            <div 
              key={index}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-blue-500' : 
                isCurrent ? 'bg-blue-200 dark:bg-blue-800' : 
                'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          );
        })}
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const questionNumber = index + 1;
          const isCompleted = completedQuestions.includes(questionNumber);
          const isCurrent = questionNumber === currentQuestion;
          
          return (
            <div 
              key={index}
              className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 
                isCurrent ? 'border-blue-500 text-blue-500' : 
                'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
              }`}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                questionNumber
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-6 text-xs text-gray-500 dark:text-gray-400">
        <div>Beginner</div>
        <div>Intermediate</div>
        <div>Advanced</div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
