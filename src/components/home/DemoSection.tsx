
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Experience Coding Through Conversation</h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Engage with our AI teachers and get personalized explanations on algorithms, data structures, and programming concepts that adapt to your level of understanding.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 border border-blue-100 p-2 rounded-xl mr-3 text-blue-600">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Technical precision</h4>
                  <p className="text-slate-500 text-sm">Accurate explanations of algorithm complexity and code logic</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-emerald-50 border border-emerald-100 p-2 rounded-xl mr-3 text-emerald-600">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Code review</h4>
                  <p className="text-slate-500 text-sm">Get feedback on your code and suggestions for improvement</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-50 border border-purple-100 p-2 rounded-xl mr-3 text-purple-600">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Simplified explanations</h4>
                  <p className="text-slate-500 text-sm">Complex concepts broken down by your Code Buddy</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
              asChild
            >
              <Link to="/topics">
                <span>Start Coding Now</span>
                <ArrowRight className="ml-2 h-4 w-4" />
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
