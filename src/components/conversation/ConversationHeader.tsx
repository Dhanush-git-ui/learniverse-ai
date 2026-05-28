
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationHeaderProps {
  sessionTitle: string;
  onResetConversation: () => void;
}

const ConversationHeader = ({ sessionTitle, onResetConversation }: ConversationHeaderProps) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 flex items-center">
      <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="font-medium text-gray-800 dark:text-gray-100">{sessionTitle}</h3>
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-auto text-gray-500 hover:text-gray-700"
        aria-label="Reset conversation"
        onClick={onResetConversation}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
