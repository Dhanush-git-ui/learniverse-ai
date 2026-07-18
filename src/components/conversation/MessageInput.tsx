
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
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
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
      <div className="flex items-end space-x-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your answer or ask a question..."
          className="min-h-[60px] resize-none rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || inputValue.trim() === ''}
          className="bg-blue-500 hover:bg-blue-600 text-white h-[60px] w-[60px] rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
