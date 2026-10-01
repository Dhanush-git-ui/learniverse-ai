
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

const MessageInput = ({ onSendMessage, isLoading, hasMessages }: MessageInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 ${hasMessages ? 'border-t' : ''}`}>
      <div className="flex items-end space-x-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Ask Socratic Chat about this topic..."
          aria-label="Ask Socratic Chat"
          autoFocus
          className="min-h-[44px] max-h-28 resize-none rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || inputValue.trim() === ''}
          aria-label="Send question"
          className="bg-blue-500 hover:bg-blue-600 text-white h-11 w-11 rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
