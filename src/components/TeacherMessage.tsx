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
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Teacher AI</div>
        <div className="py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-r-xl rounded-bl-xl text-gray-800 dark:text-gray-200">
          {renderMarkdown(content)}
        </div>
        
        {/* Render structured sources referenced */}
        {sources && sources.length > 0 && (
          <div className="mt-3 flex flex-col space-y-1">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Sources Referenced:
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {sources.map((src, idx) => {
                const type = src.content_type || 'general';
                const badgeColor = 
                  type === 'theorem' ? 'bg-amber-50/80 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40' :
                  type === 'activity' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40' :
                  'bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/40';

                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col px-3 py-2 rounded-lg border text-xs font-medium ${badgeColor} max-w-[280px] shadow-sm transition-all hover:shadow-md`}
                    title={`Chroma Relevance Score: ${src.score}`}
                  >
                    <span className="font-semibold truncate">{src.book}</span>
                    <span className="text-[10px] opacity-90 mt-0.5">
                      Ch. {src.chapter} • {src.topic}
                    </span>
                    {src.score !== undefined && src.score > 0 && (
                      <span className="text-[9px] opacity-75 mt-1 border-t border-current/10 pt-0.5">
                        Distance Metric: {src.score}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMessage;
