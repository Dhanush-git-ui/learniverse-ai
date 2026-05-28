
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Topic } from '@/models/Topic';
import * as LucideIcons from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  className?: string;
}

const TopicCard = ({ topic, className = '' }: TopicCardProps) => {
  // Dynamically get the icon component from Lucide
  // @ts-ignore - This is safe as we're controlling the icon names
  const IconComponent = LucideIcons[topic.icon];
  
  return (
    <Link 
      to={`/topics/${topic.slug}`}
      className={`block p-6 rounded-xl glass-card transition-all hover:shadow-lg hover:scale-105 ${
        topic.category === 'Mathematics' ? 'blue-glass' : 'purple-glass'
      } ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
          topic.category === 'Mathematics' 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
            : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
        }`}>
          {IconComponent && <IconComponent className="h-6 w-6" />}
        </div>
        <div className="text-xs font-medium px-2 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          {topic.category}
        </div>
      </div>
      
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{topic.title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">{topic.description}</p>
      
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
  );
};

export default TopicCard;
