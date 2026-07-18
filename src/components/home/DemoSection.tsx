
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConversationBox from '@/components/ConversationBox';

const initialMessages = [
  {
    id: '1',
    type: 'teacher' as const,
    content: "Welcome to LearnIverse! I'll be your Code Teacher guiding you through data structures, algorithms, and other programming concepts. What would you like to learn today?"
  },
  {
    id: '2',
    type: 'user' as const,
    content: "I'm struggling with understanding the time complexity of binary search."
  },
  {
    id: '3',
    type: 'teacher' as const,
    content: "Binary search has a time complexity of O(log n). This is because with each comparison, you eliminate half of the remaining elements. For example, if you have 16 elements, you'll need at most 4 comparisons (log₂16 = 4) to find your target or determine it doesn't exist."
  },
  {
    id: '4',
    type: 'user' as const,
    content: "Why is it faster than linear search?"
  },
  {
    id: '5',
    type: 'teacher' as const,
    content: "Binary search is faster than linear search for large sorted datasets because it reduces the search space by half with each comparison. Linear search checks each element one by one (O(n)), while binary search quickly narrows down the search area (O(log n)). For example, to find an element in a sorted array of 1 million items, linear search might need up to 1 million comparisons, while binary search would need at most 20."
  },
  {
    id: '6',
    type: 'peer' as const,
    content: "It helped me to visualize binary search as looking up a name in a phone book! You wouldn't check every page - you'd open to the middle, see if your name comes before or after, then only look in that half. That's why it's so much faster!"
  }
];

const DemoSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Experience Coding Through Conversation</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Engage with our AI teachers and get personalized explanations on algorithms, data structures, and programming concepts that adapt to your level of understanding.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Technical precision</h4>
                  <p className="text-gray-600 dark:text-gray-300">Accurate explanations of algorithm complexity and code logic</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Code review</h4>
                  <p className="text-gray-600 dark:text-gray-300">Get feedback on your code and suggestions for improvement</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Simplified explanations</h4>
                  <p className="text-gray-600 dark:text-gray-300">Complex concepts broken down by your Code Buddy</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link to="/topics">
                Start Coding Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="h-[600px]">
            <ConversationBox initialMessages={initialMessages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
