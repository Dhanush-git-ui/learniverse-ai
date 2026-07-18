import { User } from 'lucide-react';
import { renderMarkdown } from '@/utils/markdown';

interface Source {
  book: string;
  chapter: string;
  topic: string;
  score?: number;
  content_type?: string;
}

interface TeacherMessageProps {
  content: string;
  sources?: Source[];
  className?: string;
}

const TeacherMessage = ({ content, sources, className = '' }: TeacherMessageProps) => {
  return (
    <div className={`flex items-start space-x-3 max-w-[85%] ${className}`}>
      <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex flex-col w-full">
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Code Teacher</div>
        <div className="py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-r-xl rounded-bl-xl text-gray-800 dark:text-gray-200">
          {renderMarkdown(content)}
        </div>
        
        {/* Context window sources display is removed */}
      </div>
    </div>
  );
};

export default TeacherMessage;
