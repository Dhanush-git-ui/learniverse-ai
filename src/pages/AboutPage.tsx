
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lightbulb, BookOpen, Code, GraduationCap, BrainCircuit } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-32 sm:px-6 lg:px-8 space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About LearnIverse</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            LearnIverse is a modern educational platform designed to make learning complex subjects 
            more accessible through AI-powered conversations and personalized guidance.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              At LearnIverse, we believe that education should be accessible, engaging, and tailored to each individual's 
              learning needs. Our mission is to revolutionize education by combining cutting-edge AI technology with 
              proven educational principles.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're passionate about helping students master complex subjects like Mathematics and 
              Data Structures & Algorithms through interactive, conversation-based learning experiences.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 flex items-center justify-center">
            <div className="w-full max-w-md flex flex-col items-center">
              <Lightbulb className="w-20 h-20 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Illuminating Complex Concepts</h3>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">How We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <BrainCircuit className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Dual AI Perspective</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Get explanations from both expert and peer-level AI to ensure comprehensive understanding.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Progressive Learning</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Our system adapts to your level of understanding, progressively increasing difficulty as you improve.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                  <GraduationCap className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Practical Application</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Learn through real-world examples and applications that make abstract concepts concrete.
              </p>
            </div>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-8 flex items-center justify-center order-last md:order-first">
            <div className="w-full max-w-md flex flex-col items-center">
              <Code className="w-20 h-20 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Built By Educators & Engineers</h3>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              LearnIverse was created by a dedicated team of educators, engineers, and AI researchers 
              with a shared vision of making education more effective and accessible.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our experts in Mathematics and Computer Science have designed the curriculum to focus on 
              the most critical concepts while ensuring the learning experience is engaging and productive.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
