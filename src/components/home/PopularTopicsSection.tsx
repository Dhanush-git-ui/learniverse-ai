
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDSATopics, getMathTopics } from '@/services/TopicService';
import * as LucideIcons from 'lucide-react';

const PopularTopicsSection = () => {
  // Get a subset of topics to display
  const mathTopics = getMathTopics().slice(0, 2);
  const dsaTopics = getDSATopics().slice(0, 2);
  const popularTopics = [...mathTopics, ...dsaTopics];

  const renderIcon = (iconName: string) => {
    // Dynamically get the icon component from Lucide
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Popular Topics</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start learning with these frequently accessed topics in Mathematics and Data Structures & Algorithms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTopics.map((topic, index) => (
            <Link
              key={topic.title}
              to={`/topics/${topic.slug}`}
              className={`glass-card rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fade-in-up ${
                topic.category === 'Mathematics' ? 'blue-glass' : 'purple-glass'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  topic.category === 'Mathematics' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                }`}>
                  {renderIcon(topic.icon)}
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  {topic.category}
                </div>
              </div>
              
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{topic.title}</h3>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {topic.questions.length} questions
                </div>
                
                <div className={`flex items-center text-sm font-medium ${
                  topic.category === 'Mathematics' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-purple-600 dark:text-purple-400'
                }`}>
                  <span>Start learning</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg text-lg transition-all duration-300"
            asChild
          >
            <Link to="/topics">
              View All Topics
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularTopicsSection;
