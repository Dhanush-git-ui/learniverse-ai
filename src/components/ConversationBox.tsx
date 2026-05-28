
import { useState } from 'react';
import { Topic, Question } from '@/models/Topic';
import ConversationHeader from './conversation/ConversationHeader';
import ConversationMessages from './conversation/ConversationMessages';
import MessageInput from './conversation/MessageInput';

interface Message {
  id: string;
  type: 'teacher' | 'peer' | 'user';
  content: string;
  name: string;

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

  const generateTeacherResponse = (userMessage: string, question?: Question): string => {
    if (!question) {
      return "I'd be happy to help you understand this coding concept. Could you tell me which specific part you're having trouble with?";
    }
    
    const userMessageLower = userMessage.toLowerCase();
    
    // Check for specific coding-related keywords
    if (userMessageLower.includes("time complexity") || userMessageLower.includes("big o")) {
      if (userMessageLower.includes("merge sort")) {
        return "The time complexity of merge sort is O(n log n). This is because the array is divided into halves recursively (log n) and merging takes O(n) at each level. It's one of the most efficient general-purpose sorting algorithms available.";
      } else if (userMessageLower.includes("quick sort")) {
        return "Quick sort has an average time complexity of O(n log n), but its worst-case scenario is O(n²) when the pivot selection is poor. The space complexity is O(log n) due to the recursive call stack.";
      }
    }
    
    if (userMessageLower.includes("stack") && userMessageLower.includes("queue")) {
      return "A stack is a LIFO (Last In, First Out) data structure, while a queue is a FIFO (First In, First Out) data structure. In a stack, operations happen at one end (like push and pop), while a queue has operations at both ends (enqueue at rear, dequeue from front). Stacks are used for function calls and backtracking, while queues are used for breadth-first search and task scheduling.";
    }
    
    // Check if the user message contains keywords from the question solution
    const solutionKeywords = question.solution.toLowerCase().split(' ');
    
    const keywordMatches = solutionKeywords.filter(word => 
      word.length > 5 && userMessageLower.includes(word)
    ).length;
    
    const accuracy = keywordMatches / (solutionKeywords.length * 0.3); // Only need 30% of keywords for a "perfect" answer
    
    if (accuracy > 0.7) {
      return "Excellent answer! Your approach is correct. " + question.solution.split('.')[0] + ". Let me expand on why this works: " + question.solution.split('.').slice(1, 3).join('.');
    } else if (accuracy > 0.3) {
      return "You're on the right track! " + question.solution.split('.')[0] + ". However, consider also that " + question.solution.split('.').slice(1, 2).join('.');
    } else {
      // Extract a hint from the solution
      let hint = question.hints && question.hints.length > 0 
        ? question.hints[0] 
        : "Think about the core principles involved in this algorithm or data structure.";
        
      return "Let me help guide your thinking on this coding problem. " + hint + " Remember that " + question.solution.split('.')[0] + ".";
    }
  };

  const generatePeerResponse = (teacherResponse: string, question?: Question, userMessage?: string): string => {
    if (!question) {
      return "I found it helpful to break this coding problem down into smaller steps! Think about the edge cases too.";
    }
    
    const userMessageLower = userMessage?.toLowerCase() || "";
    
    // Check for incorrect statements in user message
    if (userMessageLower.includes("merge sort") && userMessageLower.includes("o(n²)")) {
      return "Hmm, that's not quite right about merge sort. Think about how the divide-and-conquer approach affects complexity. When we split the array in half each time, what pattern does that create?";
    }
    
    if (userMessageLower.includes("binary search tree") && userMessageLower.includes("heap") && 
        (userMessageLower.includes("same") || userMessageLower.includes("identical"))) {
      return "They're both tree structures, but they serve different purposes! Consider how elements are ordered in a BST versus a heap. In a BST, what's the relationship between a parent node and its children?";
    }
    
    // Code validation hints
    if (userMessageLower.includes("reverse") && userMessageLower.includes("linked list") && 
        (userMessageLower.includes("def ") || userMessageLower.includes("function"))) {
      if (userMessageLower.includes("current.next = current.prev")) {
        return "I see what you're trying to do with the linked list reversal, but there's an issue with your pointer reassignment. When you modify current.next, you lose the reference to the next node! Try using a temporary variable to keep track of the next node before you change the pointers.";
      }
    }
    
    if (teacherResponse.includes("Excellent")) {
      return "Great job with that coding problem! I struggled with this concept at first too. The way you approached breaking down the algorithm makes perfect sense.";
    } else if (teacherResponse.includes("right track")) {
      return "I think I see where you're going with this algorithm! When I solved it, I found it helpful to " + 
        (question.hints && question.hints.length > 1 ? question.hints[1] : "trace through the execution with a small example input.");
    } else {
      return "Don't worry, this coding concept can be tricky! I had to try a few different approaches. Maybe try to " + 
        (question.hints && question.hints.length > 0 ? question.hints[0] : "draw out the data structure and visualize how the algorithm transforms it step by step.");
    }
  };

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
      
      // Get teacher response and optionally append reference sources
      // 1. Get the data from the server
      const { teacher_answer, peer_answer, sources } = data;
      
      // 2. Format sources if present
      let teacherResponseWithSources = teacher_answer;
      if (sources && Array.isArray(sources) && sources.length > 0) {
        const sourcesList = sources
          .map((src: any) => `- **${src.book}**, Ch. ${src.chapter}: ${src.topic}`)
          .join('\n');
        teacherResponseWithSources += `\n\n**Sources Referenced:**\n${sourcesList}`;
      }
      
      // 3. Create the messages
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: teacherResponseWithSources,
        name: topicName
      };
      
      const peerMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'peer',
        content: peer_answer || generatePeerResponse(teacherResponseWithSources, currentQuestion, userMessage.content),
        name: "AI Peer"
      };
      
      // 4. Update state
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
