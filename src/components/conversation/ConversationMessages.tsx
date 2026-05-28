
import { useRef, useEffect } from 'react';
import TeacherMessage from '../TeacherMessage';
import PeerMessage from '../PeerMessage';

interface Message {
  id: string;
  type: 'teacher' | 'peer' | 'user';
  content: string;
}

interface ConversationMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ConversationMessages = ({ messages, isLoading }: ConversationMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 my-8 px-4">
          <p className="mb-2">Welcome to your interactive learning session!</p>
          <p>Ask questions about the problem, request hints, or share your approach to solving it.</p>
        </div>
      )}
      
      {messages.map((message) => (
        message.type === 'teacher' ? (
          <TeacherMessage key={message.id} content={message.content} />
        ) : message.type === 'peer' ? (
          <PeerMessage key={message.id} content={message.content} />
        ) : (
          <div key={message.id} className="ml-auto max-w-[80%] py-3 px-4 bg-blue-500 text-white rounded-t-xl rounded-bl-xl">
            {message.content}
          </div>
        )
      ))}
      
      {isLoading && (
        <div className="flex space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-24">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ConversationMessages;
