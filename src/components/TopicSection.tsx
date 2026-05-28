
import { BarChart3, BrainCircuit } from 'lucide-react';
import TopicCard from './TopicCard';
import { Topic } from '@/models/Topic';

interface TopicSectionProps {
  title: string;
  category: 'Mathematics' | 'DSA';
  topics: Topic[];
}

const TopicSection = ({ title, category, topics }: TopicSectionProps) => {
  const isMath = category === 'Mathematics';
  const Icon = isMath ? BarChart3 : BrainCircuit;
  const textColor = isMath ? 'text-blue-600' : 'text-purple-600';
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Icon className={`h-8 w-8 ${textColor}`} />
          <h2 className={`text-2xl font-bold ${textColor}`}>{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              className={`animate-fade-in-up animate-delay-${index * 100}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicSection;
