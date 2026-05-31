import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, HelpCircle, CheckSquare, Sparkles, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/home/FeaturesSection';
import DemoSection from '@/components/home/DemoSection';
import PopularTopicsSection from '@/components/home/PopularTopicsSection';
import Footer from '@/components/Footer';

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const steps = [
    { icon: <BookOpen className="w-6 h-6 text-blue-500" />, title: "1. Choose Topic", desc: "Select from our curated list of Mathematics or DSA courses." },
    { icon: <Sparkles className="w-6 h-6 text-purple-500" />, title: "2. Learn Concept", desc: "Interact with the Teacher AI to understand core formulas or patterns." },
    { icon: <CheckSquare className="w-6 h-6 text-emerald-500" />, title: "3. Answer Question", desc: "Test your understanding with conceptual practice problems." },
    { icon: <HelpCircle className="w-6 h-6 text-amber-500" />, title: "4. Get Hint / Help", desc: "Stuck? Ask the Peer AI for simplified analogies or request targeted hints." },
    { icon: <Trophy className="w-6 h-6 text-indigo-500" />, title: "5. Review Progress", desc: "Track completion, gain mastery level badges, and keep up your daily streak." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <Hero />
      
      {/* Learning Journey Stepper */}
      <section className="py-16 bg-slate-50/50 dark:bg-gray-900/50 border-y border-slate-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">The Interactive Learning Journey</h2>
            <p className="text-slate-600 dark:text-slate-400">Step-by-step master complex concepts through structured dialogues.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-150 dark:border-gray-700 shadow-sm relative">
                <div className="w-12 h-12 rounded-full bg-slate-55 bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{step.desc}</p>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-300 dark:text-gray-700 font-bold z-10 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <DemoSection />
      <PopularTopicsSection />
      <Footer />
    </div>
  );
};

export default Index;