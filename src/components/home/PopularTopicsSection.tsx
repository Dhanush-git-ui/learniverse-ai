
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDSATopics } from '@/services/TopicService';
import * as LucideIcons from 'lucide-react';

const PopularTopicsSection = () => {
  // Get a subset of DSA topics to display
  const popularTopics = getDSATopics().slice(0, 4);

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Popular Topics</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Start learning with these frequently accessed topics in Data Structures & Algorithms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTopics.map((topic, index) => (
            <Link
              key={topic.title}
              to={`/topics/${topic.slug}`}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 transition-all duration-300 transform hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 animate-fade-in-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {renderIcon(topic.icon)}
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                  {topic.category}
                </div>
              </div>
              
              <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{topic.title}</h3>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">
                  {topic.questions.length} questions
                </div>
                
                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
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
            className="border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 px-6 py-2 rounded-xl text-lg font-semibold transition-all duration-300"
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
