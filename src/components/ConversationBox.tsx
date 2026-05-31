import { useState, useEffect } from 'react';
import { Topic, Question } from '@/models/Topic';
import ConversationHeader from './conversation/ConversationHeader';
import ConversationMessages from './conversation/ConversationMessages';
import MessageInput from './conversation/MessageInput';

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
  name?: string;
  sources?: Source[];
}

interface ConversationBoxProps {
  sessionTitle?: string;
  onSendMessage?: (message: string) => void;
  currentQuestion?: Question;
  topic?: Topic;
}

const ConversationBox = ({ 
  sessionTitle = "Interactive Learning Session",
  onSendMessage,
  currentQuestion,
  topic
}: ConversationBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const topicSlug = topic?.slug || 'general';

  // Load chat history from localStorage on topic changes
  useEffect(() => {
    const savedHistory = localStorage.getItem(`learniverse_history_${topicSlug}`);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
        setMessages([]);
      }
    } else {
      // Set initial greeting
      const greet: Message = {
        id: 'greet',
        type: 'teacher',
        content: `Welcome! Let's explore the topic of **${topic?.title || "General Science"}**. I will guide you through concepts, and you can submit answers to questions. Ask me for hints or simple summaries anytime!`
      };
      setMessages([greet]);
    }
  }, [topicSlug, topic?.title]);

  // Sync messages with localstorage
  const saveMessages = (updated: Message[]) => {
    setMessages(updated);
    localStorage.setItem(`learniverse_history_${topicSlug}`, JSON.stringify(updated));
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message
    };
    
    const newMessages = [...messages, userMessage];
    saveMessages(newMessages);
    setIsLoading(true);

    const topicName = topic?.name || topic?.title || "General Topic";
    const topicCategory = topic?.category || "DSA";

    if (onSendMessage) {
      onSendMessage(message);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          topic: topicName,
          category: topicCategory,
          history: newMessages.map(msg => ({
            role: msg.type,
            content: msg.content
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }
      
      const data = await response.json();
      const { teacher_answer, peer_answer, sources } = data;
      
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: teacher_answer || "I am analyzing this question. Can you share your current approach?",
        name: topicName,
        sources: sources && Array.isArray(sources) ? (sources as Source[]) : []
      };
      
      const peerMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'peer',
        content: peer_answer || "Think about the step-by-step logic we just used!",
        name: "Peer AI"
      };
      
      saveMessages([...newMessages, teacherMessage, peerMessage]);
    } catch (error) {
      console.error("API error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: "🚨 **tutoring backend unreachable.** I couldn't reach the AI model server. Check that your FastAPI server is running on `port 8000` and `GEMINI_API_KEY` is loaded."
      };
      
      saveMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    localStorage.removeItem(`learniverse_history_${topicSlug}`);
    const greet: Message = {
      id: 'greet',
      type: 'teacher',
      content: `Session reset. Ask me anything about **${topic?.title}**!`
    };
    setMessages([greet]);
  };

  return (
    <div className="border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      <ConversationHeader 
        sessionTitle={sessionTitle} 
        onResetConversation={handleResetConversation} 
      />
      
      <ConversationMessages 
        messages={messages} 
        isLoading={isLoading} 
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ConversationBox;