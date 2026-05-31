
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Award, CheckCircle } from 'lucide-react';
import { Topic } from '@/models/Topic';
import * as LucideIcons from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  className?: string;
}

const TopicCard = ({ topic, className = '' }: TopicCardProps) => {
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [completedCount, setCompletedCount] = useState(0);

  // Dynamically get the icon component from Lucide
  const IconComponent = LucideIcons[topic.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;

  // Retrieve learning progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`learniverse_progress_${topic.slug}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.completedQuestions && Array.isArray(data.completedQuestions)) {
          const completedCount = data.completedQuestions.length;
          setCompletedCount(completedCount);
          if (completedCount === topic.questions.length) {
            setStatus('completed');
          } else if (completedCount > 0) {
            setStatus('in_progress');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [topic.slug, topic.questions.length]);

  // Derive difficulty from the questions list
  const getDifficultyLabel = () => {
    const hasHard = topic.questions.some(q => q.difficulty === 'hard');
    return hasHard ? 'Advanced' : 'Intermediate';
  };

  const getDifficultyColor = (label: string) => {
    if (label === 'Advanced') return 'text-red-500 bg-red-50 dark:bg-red-950/20';
    return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
  };

  const getStatusText = () => {
    if (status === 'completed') return 'Completed';
    if (status === 'in_progress') return `In Progress (${completedCount}/${topic.questions.length})`;
    return 'Not Started';
  };

  const getStatusColor = () => {
    if (status === 'completed') return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25';
    if (status === 'in_progress') return 'text-indigo-65 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-900';
  };

  return (
    <Link 
      to={`/topics/${topic.slug}`}
      className={`block p-6 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-all hover:shadow-md hover:scale-[1.02] ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
          topic.category === 'Mathematics' 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' 
            : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30'
        }`}>
          {IconComponent && <IconComponent className="h-6 w-6" />}
        </div>
        <div className="flex space-x-2">
          <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-50 dark:bg-gray-700 text-slate-500 dark:text-slate-300">
            {topic.category}
          </div>
        </div>
      </div>
      
      <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{topic.title}</h3>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{topic.description}</p>
      
      {/* Dynamic Metadata details */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-700/50 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{topic.questions.length * 4} mins est.</span>
        </div>
        <div className="flex items-center space-x-1">
          <Award className="w-3.5 h-3.5" />
          <span className={`px-1.5 py-0.5 rounded font-medium ${getDifficultyColor(getDifficultyLabel())}`}>
            {getDifficultyLabel()}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-400">
          {topic.questions.length} Concepts
        </div>
        
        <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <span>{status === 'not_started' ? 'Start Learning' : 'Continue'}</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;