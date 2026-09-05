
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
  const IconComponent = LucideIcons[topic.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  
  return (
    <Link 
      to={`/topics/${topic.slug}`}
      className={`block p-6 rounded-2xl bg-white border border-slate-200/80 transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 group ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          {IconComponent && <IconComponent className="h-6 w-6" />}
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
          {topic.category}
        </div>
      </div>
      
      <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{topic.title}</h3>
      <p className="mt-2 text-slate-600 text-sm line-clamp-2 leading-relaxed">{topic.description}</p>
      
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
  );
};

export default TopicCard;
