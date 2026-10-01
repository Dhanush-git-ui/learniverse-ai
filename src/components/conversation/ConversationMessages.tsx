
import { useRef, useEffect } from 'react';
import TeacherMessage from '../TeacherMessage';
import PeerMessage from '../PeerMessage';

interface Source {
  book: string;
  chapter: string;
  topic: string;
  score?: number;
  content_type?: string;
}

interface Message {
  id: string;
  type: 'teacher' | 'peer' | 'user';
  content: string;
  sources?: Source[];
}

interface ConversationMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ConversationMessages = ({ messages, isLoading }: ConversationMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="overflow-y-auto p-3 space-y-3 bg-white dark:bg-gray-800"
    >
      {messages.map((message) => (
        message.type === 'teacher' ? (
          <TeacherMessage key={message.id} content={message.content} sources={message.sources} />
        ) : message.type === 'peer' ? (
          <PeerMessage key={message.id} content={message.content} />
        ) : (
          <div key={message.id} className="ml-auto max-w-[80%] py-2 px-3 text-sm bg-blue-500 text-white rounded-t-xl rounded-bl-xl">
            {message.content}
          </div>
        )
      ))}
      
      {isLoading && (
        <div className="flex space-x-1.5 p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg w-20">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      )}
    </div>
  );
};

export default ConversationMessages;
