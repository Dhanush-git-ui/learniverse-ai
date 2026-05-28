
import { HelpCircle } from 'lucide-react';

interface PeerMessageProps {
  content: string;
  className?: string;
}

const PeerMessage = ({ content, className = '' }: PeerMessageProps) => {
  return (
    <div className={`flex items-start space-x-3 max-w-[80%] ${className}`}>
      <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
        <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex flex-col">
        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Code Buddy</div>
        <div className="py-3 px-4 bg-purple-50 dark:bg-purple-900/20 rounded-r-xl rounded-bl-xl text-gray-800 dark:text-gray-200">
          {content}
        </div>
      </div>
    </div>
  );
};

export default PeerMessage;
