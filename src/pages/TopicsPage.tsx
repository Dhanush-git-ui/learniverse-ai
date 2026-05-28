
import { useState } from 'react';
import { Search, Book, BrainCircuit, Sigma, ArrowUpRight, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import TopicSection from '@/components/TopicSection';
import Footer from '@/components/Footer';
import { getDSATopics, getMathTopics } from '@/services/TopicService';

const TopicsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mathTopics = getMathTopics();
  const dsaTopics = getDSATopics();
  
  const filteredMathTopics = mathTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDsaTopics = dsaTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Learning Topics</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Browse our comprehensive collection of Mathematics and Data Structures & Algorithms topics, 
              each with interactive examples and step-by-step learning.
            </p>
          </header>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <Button
              variant="outline"
              className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full px-4 py-2"
            >
              <Book className="h-4 w-4" />
              <span>{mathTopics.length + dsaTopics.length}+ Topics</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full px-4 py-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>AI Teachers</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full px-4 py-2"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Step-by-Step</span>
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="space-y-8">
            <TabsList className="flex justify-center space-x-4">
              <TabsTrigger value="all" className="px-6 py-2 rounded-full data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-white">
                All Topics
              </TabsTrigger>
              <TabsTrigger value="math" className="px-6 py-2 rounded-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-100">
                <Sigma className="h-4 w-4 mr-2" />
                Mathematics
              </TabsTrigger>
              <TabsTrigger value="dsa" className="px-6 py-2 rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-100">
                <BrainCircuit className="h-4 w-4 mr-2" />
                DSA
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-16 animate-fade-in mt-8">
              {filteredMathTopics.length > 0 && (
                <TopicSection 
                  title="Mathematics" 
                  category="Mathematics" 
                  topics={filteredMathTopics} 
                />
              )}
              
              {filteredDsaTopics.length > 0 && (
                <TopicSection 
                  title="Data Structures & Algorithms" 
                  category="DSA" 
                  topics={filteredDsaTopics} 
                />
              )}
              
              {filteredMathTopics.length === 0 && filteredDsaTopics.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">No topics found matching "{searchQuery}"</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="math" className="animate-fade-in mt-8">
              {filteredMathTopics.length > 0 ? (
                <TopicSection 
                  title="Mathematics" 
                  category="Mathematics" 
                  topics={filteredMathTopics} 
                />
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">No mathematics topics found matching "{searchQuery}"</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="dsa" className="animate-fade-in mt-8">
              {filteredDsaTopics.length > 0 ? (
                <TopicSection 
                  title="Data Structures & Algorithms" 
                  category="DSA" 
                  topics={filteredDsaTopics} 
                />
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">No DSA topics found matching "{searchQuery}"</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TopicsPage;
