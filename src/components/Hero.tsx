
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white pt-16">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100/70 blur-3xl opacity-70"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-sky-100/70 blur-3xl opacity-70"></div>
      </div>

      <div className="container relative mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                <span className="block">Master</span>
                <span className="text-blue-600">Data Structures</span> 
                <span className="block">& Algorithms</span>
                <span className="block text-3xl sm:text-4xl text-slate-500 mt-2 font-medium">through conversation</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                An interactive platform where AI mentors explain complex algorithms step-by-step, 
                challenge your understanding, and guide your coding journey.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                asChild
              >
                <Link to="/topics">
                  Explore Topics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 px-8 py-6 rounded-xl text-lg font-semibold transition-all duration-300"
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
              <div className="glass-card blue-glass rounded-2xl p-5 shadow-xl transform rotate-2 animate-float">
                <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-600">Teacher AI</p>
                      <p className="text-xs text-slate-500">Explaining Concepts</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                    Let me explain Binary Search. How comfortable are you with logarithmic time complexity?
                  </p>
                  <div className="py-3 px-4 bg-slate-50 border border-slate-200/60 rounded-lg text-sm text-slate-700 mb-4">
                    I understand sorting, but I'm unsure why binary search is O(log n).
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Great question! In every step, we divide the remaining search area in half. Dividing n by 2 repeatedly takes log2(n) steps.
                  </p>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-5 shadow-xl transform -rotate-1 animate-float animate-delay-300 border border-slate-200">
                <div className="bg-white rounded-xl p-4 border border-blue-50 shadow-sm">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0 bg-sky-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-sky-600">Peer AI</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
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
