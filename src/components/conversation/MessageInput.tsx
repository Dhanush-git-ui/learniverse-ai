import { useState } from 'react';
import { Send, HelpCircle, BookOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (text = inputValue) => {
    const trimmed = text.trim();
    if (trimmed === '') return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (actionType: 'explain' | 'example' | 'format') => {
    if (actionType === 'explain') {
      handleSendMessage("Teacher AI, could you explain the theory behind this step again in simpler terms?");
    } else if (actionType === 'example') {
      handleSendMessage("Peer AI, can you give me an everyday example or analogy of this concept to help visualize it?");
    } else if (actionType === 'format') {
      setInputValue(prev => prev + "\n```javascript\n// Write your code here\n\n```");
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800 space-y-3">
      {/* Quick Action Suggestion Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickAction('explain')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>🔄 Explain Concept</span>
        </button>
        
        <button
          onClick={() => handleQuickAction('example')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 rounded-full text-xs font-semibold hover:bg-purple-100 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>💡 Give Example</span>
        </button>

        <button
          onClick={() => handleQuickAction('format')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-slate-50 dark:bg-gray-700 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-gray-650 rounded-full text-xs font-semibold hover:bg-slate-100 transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
          <span>💻 Format Code</span>
        </button>
      </div>

      <div className="flex items-end space-x-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your answer, or use the quick buttons for explanations..."
          className="min-h-[60px] resize-none rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={isLoading || inputValue.trim() === ''}
          className="bg-indigo-65 bg-indigo-600 hover:bg-indigo-700 text-white h-[60px] w-[60px] rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;