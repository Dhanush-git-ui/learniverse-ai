import { HelpCircle } from 'lucide-react';
import { renderMarkdown } from '@/utils/markdown';

interface PeerMessageProps {
  content: string;
  className?: string;
}

const PeerMessage = ({ content, className = '' }: PeerMessageProps) => {
  return (
    <div className={`flex items-start space-x-2 max-w-[90%] ${className}`}>
      <div className="flex-shrink-0 bg-sky-100 p-1.5 rounded-full border border-sky-200">
        <HelpCircle className="h-4 w-4 text-sky-600" />
      </div>
      <div className="flex flex-col">
        <div className="text-xs font-semibold text-sky-600 mb-1">Code Buddy</div>
        <div className="py-2 px-3 text-sm bg-sky-50/80 border border-sky-100 rounded-r-2xl rounded-bl-2xl text-slate-800 shadow-sm">
          {renderMarkdown(content)}
        </div>
      </div>
    </div>
  );
};

export default PeerMessage;
