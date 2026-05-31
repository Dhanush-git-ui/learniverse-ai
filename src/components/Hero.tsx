import { ArrowRight, Lightbulb, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-950 dark:to-gray-900 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100/40 dark:bg-indigo-900/10 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-slate-100/40 dark:bg-slate-900/10 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>Dual AI Teacher & Peer Perspectives</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Learn Math and DSA <br />
                through <span className="text-indigo-600 dark:text-indigo-400">guided AI conversations</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                An interactive tutor that breaks down calculus, algebra, and algorithmic complexities step-by-step. Ask questions, view peers' ideas, and master topics dynamically.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-lg text-lg transition-transform hover:scale-[1.02]"
                asChild
              >
                <Link to="/topics">
                  Explore Topics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-8 py-6 rounded-lg text-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How It Works
              </Button>
            </div>
          </div>
          
          {/* Live Product Preview UI */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden text-sm">
              {/* Product Preview Top bar */}
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 ml-2">Topic: Binary Search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full font-medium">
                    Mastery: Improving
                  </span>
                </div>
              </div>
              
              {/* Preview Body */}
              <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                <div className="flex items-start space-x-2">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-full text-indigo-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-indigo-600">Teacher AI</div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-r-lg rounded-bl-lg mt-1 text-slate-800 dark:text-slate-200">
                      Let's find the time complexity of Binary Search. What happens to the size of the search array at each step?
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 justify-end">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-400">You (Student)</div>
                    <div className="bg-indigo-600 text-white p-2.5 rounded-l-lg rounded-br-lg mt-1 inline-block">
                      It is divided by 2 or halved at each step.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full text-amber-600">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-amber-600">Peer AI</div>
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 p-2.5 rounded-r-lg rounded-bl-lg mt-1 text-slate-800 dark:text-slate-200">
                      Yes! Since the range splits in half every time, we solve it in O(log₂ n) steps.
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Input simulation */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Session Progress</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Question 3 of 5 (60%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-indigo-600 h-full w-[60%]"></div>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="Since it is halved, we can express the number of operations..." 
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-800 rounded-lg text-xs" 
                  />
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700">
                    Submit
                  </button>
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