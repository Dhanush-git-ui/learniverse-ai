
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationHeaderProps {
  sessionTitle: string;
  onResetConversation: () => void;
  tutorMode: 'teacher' | 'peer' | 'both';
  setTutorMode: (mode: 'teacher' | 'peer' | 'both') => void;
}

const ConversationHeader = ({ 
  sessionTitle, 
  onResetConversation,
  tutorMode,
  setTutorMode
}: ConversationHeaderProps) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-800 dark:text-gray-100">{sessionTitle}</h3>
      </div>
      
      <div className="flex items-center space-x-3 self-end sm:self-auto">
        <div className="flex items-center bg-gray-105/80 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
          <button
            onClick={() => setTutorMode('teacher')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              tutorMode === 'teacher' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Code Teacher
          </button>
          <button
            onClick={() => setTutorMode('peer')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              tutorMode === 'peer' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-655 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Code Buddy
          </button>
          <button
            onClick={() => setTutorMode('both')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              tutorMode === 'both' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-655 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Both
          </button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Reset conversation"
          onClick={onResetConversation}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
