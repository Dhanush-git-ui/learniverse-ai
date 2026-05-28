
import { useState } from 'react';
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
  initialMessages?: Message[];
  sessionTitle?: string;
  onSendMessage?: (message: string) => void;
  currentQuestion?: Question;
  topic?: Topic;
}

const ConversationBox = ({ 
  initialMessages = [], 
  sessionTitle = "Interactive Learning Session",
  onSendMessage,
  currentQuestion,
  topic
}: ConversationBoxProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const topicName = topic?.name || "General Topic";
    const topicCategory = topic?.category || "DSA";

    if (onSendMessage) {
      onSendMessage(message);
    }

    try {
      // Call the FastAPI RAG Backend via proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          topic: topicName,
          category: topicCategory,
          history: messages.map(msg => ({
            role: msg.type,
            content: msg.content
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get responses and structured sources from the server
      const { teacher_answer, peer_answer, sources } = data;
      
      // Create teacher message containing structured sources
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: teacher_answer || "I could not generate an answer for this question.",
        name: topicName,
        sources: sources && Array.isArray(sources) ? (sources as Source[]) : []
      };
      
      // Create peer message
      const peerMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'peer',
        content: peer_answer || "I'm not sure about that one, let's wait for the teacher.",
        name: "AI Peer"
      };
      
      // Update state with both replies
      setMessages(prev => [...prev, teacherMessage, peerMessage]);
    } catch (error) {
      console.error("Failed to fetch response from AI backend:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: "I'm sorry, I had trouble reaching the tutoring backend. Please verify that the FastAPI server is running on port 8000 and your GEMINI_API_KEY is configured in the `.env` file."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full animate-fade-in">
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
