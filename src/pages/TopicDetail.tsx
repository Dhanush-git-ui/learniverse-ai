
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Book, ExternalLink, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ConversationBox from '@/components/ConversationBox';
import QuestionCard from '@/components/QuestionCard';
import ProgressIndicator from '@/components/ProgressIndicator';

interface TopicDetails {
  title: string;
  description: string;
  category: 'Mathematics' | 'DSA';
  questions: {
    id: number;
    text: string;
    difficulty: 'easy' | 'medium' | 'hard'; // Changed from UI display values to API values
  }[];
  resources: {
    title: string;
    description: string;
    link: string;
  }[];
}

const TopicDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [topicDetails, setTopicDetails] = useState<TopicDetails | null>(null);
  
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockTopicData: Record<string, TopicDetails> = {
      'linear-algebra': {
        title: 'Linear Algebra',
        description: 'Master matrices, vectors, and linear transformations through interactive examples.',
        category: 'Mathematics',
        questions: [
          {
            id: 1,
            text: 'Find the eigenvalues and eigenvectors of the matrix A = [[3, 1, 1], [1, 3, 1], [1, 1, 3]].',
            difficulty: 'easy' // Changed from 'Beginner' to 'easy'
          },
          {
            id: 2,
            text: 'Determine if the given set of vectors {(1,2,3), (4,5,6), (7,8,9)} forms a basis for R³. Justify your answer.',
            difficulty: 'easy' // Changed from 'Beginner' to 'easy'
          },
          {
            id: 3,
            text: 'Find the rank and nullity of the matrix A = [[2, 4, 6], [1, 2, 3], [3, 6, 9]] and verify the Rank-Nullity theorem.',
            difficulty: 'medium' // Changed from 'Intermediate' to 'medium'
          },
          {
            id: 4,
            text: 'Diagonalize the matrix A = [[4, -3, 0], [2, -1, 0], [0, 0, 2]] if possible. If not, explain why.',
            difficulty: 'medium' // Changed from 'Intermediate' to 'medium'
          },
          {
            id: 5,
            text: 'Determine the Jordan canonical form of the matrix A = [[3, 1, 0], [0, 3, 0], [0, 0, 4]].',
            difficulty: 'hard' // Changed from 'Advanced' to 'hard'
          }
        ],
        resources: [
          {
            title: 'Eigenvalues and Eigenvectors: A Comprehensive Guide',
            description: 'Mathematics Reference',
            link: '#'
          },
          {
            title: 'Matrix Diagonalization Techniques',
            description: 'Linear Algebra Handbook',
            link: '#'
          }
        ]
      },
      'binary-trees': {
        title: 'Binary Trees',
        description: 'Understand tree traversals, balancing, and optimization techniques with practice problems.',
        category: 'DSA',
        questions: [
          {
            id: 1,
            text: 'Implement a function to determine if a binary tree is balanced. A balanced tree is defined as a tree such that the heights of the two subtrees of any node never differ by more than one.',
            difficulty: 'easy' // Changed from 'Beginner' to 'easy'
          },
          {
            id: 2,
            text: 'Write an algorithm to perform an in-order traversal of a binary tree without using recursion.',
            difficulty: 'easy' // Changed from 'Beginner' to 'easy'
          },
          {
            id: 3,
            text: 'Implement a function to convert a sorted array to a balanced binary search tree with minimal height.',
            difficulty: 'medium' // Changed from 'Intermediate' to 'medium'
          },
          {
            id: 4,
            text: 'Implement a function to find the lowest common ancestor of two nodes in a binary tree.',
            difficulty: 'medium' // Changed from 'Intermediate' to 'medium'
          },
          {
            id: 5,
            text: 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization should work, but you need to ensure that the original binary tree can be reconstructed from the serialized data.',
            difficulty: 'hard' // Changed from 'Advanced' to 'hard'
          }
        ],
        resources: [
          {
            title: 'Tree Traversal Algorithms',
            description: 'DSA Fundamentals',
            link: '#'
          },
          {
            title: 'Advanced Binary Tree Techniques',
            description: 'Algorithm Reference',
            link: '#'
          }
        ]
      }
    };
    
    // Set the topic details based on the slug
    if (slug && mockTopicData[slug]) {
      setTopicDetails(mockTopicData[slug]);
      // Reset state when topic changes
      setCurrentQuestion(1);
      setCompletedQuestions([]);
    }
  }, [slug]);
  
  if (!topicDetails) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading topic details...</p>
        </div>
      </div>
    );
  }
  
  const handleQuestionSubmit = (answer: string) => {
    // In a real app, this would send the answer to an API for evaluation
    console.log(`Question ${currentQuestion} answer:`, answer);
    
    // Mark the current question as completed
    if (!completedQuestions.includes(currentQuestion)) {
      setCompletedQuestions([...completedQuestions, currentQuestion]);
    }
    
    // Move to the next question if not at the end
    if (currentQuestion < topicDetails.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handleRequestHint = () => {
    // In a real app, this would fetch a hint from an API
    console.log(`Requesting hint for question ${currentQuestion}`);
  };
  
  const currentQuestionData = topicDetails.questions[currentQuestion - 1];
  
  // Let's define some example hints for each question since they're not in the mock data
  const getHintsForQuestion = (questionId: number): string[] => {
    const hintsMap: Record<number, string[]> = {
      1: ["Try thinking about the characteristic equation.", "Remember that eigenvalues are scalars."],
      2: ["Consider whether these vectors are linearly independent.", "Check if they span R³."],
      3: ["Calculate the dimension of the row space.", "Remember that rank + nullity = number of columns."],
      4: ["Find the eigenvalues and eigenvectors first.", "A matrix is diagonalizable if it has n linearly independent eigenvectors."],
      5: ["Look at the repeated eigenvalues.", "Jordan blocks correspond to generalized eigenvectors."]
    };
    
    return hintsMap[questionId] || ["Think about the problem carefully.", "Review the fundamentals related to this question."];
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/topics" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to Topics</span>
            </Link>
          </div>
          
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{topicDetails.title}</h1>
            <div className="ml-4 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {topicDetails.category}
            </div>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
            {topicDetails.description}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <span>Interactive learning session - Answer questions to test your understanding</span>
              </div>
              
              <QuestionCard
                questionNumber={currentQuestion}
                totalQuestions={topicDetails.questions.length}
                difficulty={currentQuestionData.difficulty}
                question={currentQuestionData.text}
                hints={getHintsForQuestion(currentQuestionData.id)}
                onSubmit={handleQuestionSubmit}
                onRequestHint={handleRequestHint}
              />
              
              <div className="h-[400px]">
                <ConversationBox 
                  sessionTitle={`${topicDetails.title} Interactive Session`}
                  initialMessages={[
                    {
                      id: '1',
                      type: 'teacher' as const,
                      content: `Welcome to ${topicDetails.title}! I'll be your guide through this topic. We'll explore concepts like matrices, vectors, eigenvalues, and more through a series of increasingly challenging problems.`
                    },
                    {
                      id: '2',
                      type: 'peer' as const,
                      content: `${topicDetails.category === 'Mathematics' ? 'Linear algebra' : 'Binary trees'} is actually used everywhere - from computer graphics to machine learning algorithms. It's super practical!`
                    },
                    {
                      id: '3',
                      type: 'teacher' as const,
                      content: `Let's start with our first question. It's about finding eigenvalues and eigenvectors, which are special values and directions associated with a matrix. Ready to begin?`
                    }
                  ]}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <ProgressIndicator
                currentQuestion={currentQuestion}
                totalQuestions={topicDetails.questions.length}
                completedQuestions={completedQuestions}
              />
              
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Reference Materials</h3>
                </div>
                
                <div className="space-y-4">
                  {topicDetails.resources.map((resource, index) => (
                    <a 
                      key={index}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{resource.title}</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{resource.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ for learners everywhere
          </div>
          <div className="mt-4 text-xs text-gray-400">
            © 2023 LearnIverse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TopicDetail;
