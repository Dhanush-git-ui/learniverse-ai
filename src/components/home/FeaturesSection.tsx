
import { BookOpen, BrainCircuit, BarChart3, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    title: "Interactive Learning",
    description: "Engage with AI teachers that adapt explanations to your understanding level"
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-indigo-600" />,
    title: "Dual AI Perspective",
    description: "Get explanations from both teacher and peer AI for comprehensive understanding"
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-sky-600" />,
    title: "Progressive Difficulty",
    description: "Master concepts through 5 questions of increasing complexity"
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-blue-500" />,
    title: "Smart Hints",
    description: "Receive targeted hints without full solutions to guide your learning"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-slate-50/70 border-y border-slate-200/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How LearnIverse Works</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our platform combines AI-driven conversations with structured learning to make complex concepts easier to understand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="bg-white rounded-2xl p-6 text-center border border-slate-200/80 shadow-sm transform transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
