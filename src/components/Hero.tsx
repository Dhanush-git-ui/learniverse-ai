
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-70"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-70"></div>
      </div>

      <div className="container relative mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block">Master</span>
                <span className="text-purple-600">Data Structures</span> 
                <span className="block">& Algorithms</span>
                <span className="block text-3xl sm:text-4xl text-gray-500 mt-2">through conversation</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                An interactive platform where AI mentors explain complex algorithms step-by-step, 
                challenge your understanding, and guide your coding journey.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                asChild
              >
                <Link to="/topics">
                  Explore Topics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200 px-8 py-6 rounded-lg text-lg transition-all duration-300"
                asChild
              >
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end animate-fade-in">
            <div className="relative w-full max-w-md">
              <div className="glass-card purple-glass rounded-2xl p-5 shadow-xl transform rotate-2 animate-float">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Teacher AI</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Explaining Concepts</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm mb-4">
                    Let me explain Binary Search. How comfortable are you with logarithmic time complexity?
                  </p>
                  <div className="py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 mb-4">
                    I understand sorting, but I'm unsure why binary search is O(log n).
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    Great question! In every step, we divide the remaining search area in half. Dividing n by 2 repeatedly takes log2(n) steps.
                  </p>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card blue-glass rounded-2xl p-5 shadow-xl transform -rotate-1 animate-float animate-delay-300">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Peer AI</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    Think of it like tearing a dictionary in half repeatedly! In just 20 tears, you could find 1 item out of a million pages!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
