
import { BookOpen, BrainCircuit, BarChart3, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-blue-500" />,
    title: "Interactive Learning",
    description: "Engage with AI teachers that adapt explanations to your understanding level"
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-purple-500" />,
    title: "Dual AI Perspective",
    description: "Get explanations from both teacher and peer AI for comprehensive understanding"
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
    title: "Progressive Difficulty",
    description: "Master concepts through 5 questions of increasing complexity"
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-purple-500" />,
    title: "Smart Hints",
    description: "Receive targeted hints without full solutions to guide your learning"
  }
];

const FeaturesSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How LearnIverse Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform combines AI-driven conversations with structured learning to make complex concepts easier to understand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="glass-card rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-sm">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
