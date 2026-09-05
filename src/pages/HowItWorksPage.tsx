import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Cpu, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Code, 
  Sparkles, 
  Database,
  ArrowLeft,
  ChevronRight,
  BookMarked
} from 'lucide-react';

interface ConceptDemo {
  id: string;
  name: string;
  category: 'DSA';
  teacher: string;
  peer: string;
}

const conceptsData: ConceptDemo[] = [
  {
    id: 'recursion',
    name: 'Recursion',
    category: 'DSA',
    teacher: 'Recursion is a fundamental programming technique where a function references itself to solve subproblems. A valid recursive implementation requires a base case to terminate execution and a recurrence relation that reduces the problem size. Formally, for a function f(n), recursion decomposes n until n reaches the base case, preventing stack overflow.',
    peer: "Think of recursion like Russian nesting dolls (Matryoshka dolls). You open the biggest doll, only to find a slightly smaller version of the same doll inside. You keep opening them (recursive calls) until you reach the absolute smallest doll (the base case) which has a tiny prize inside. Then you close them all back up one by one!"
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'DSA',
    teacher: 'Binary search is an optimal O(log n) search algorithm applicable to sorted contiguous structures. In each step, the algorithm compares the target value against the median element. If unequal, the half containing the target is kept while the other half is discarded. This reduces search space logarithmically: T(n) = T(n/2) + O(1).',
    peer: "It's like looking up a word in a real, physical dictionary. You don't flip through page by page from the start. You open it right in the middle. If your word starts with 'P' and you opened it at 'M', you throw away the first half of the book and repeat the middle-split on the remaining pages!"
  }
];

const HowItWorksPage = () => {
  const [selectedConcept, setSelectedConcept] = useState<string>('recursion');
  const [activeTab, setActiveTab] = useState<'teacher' | 'peer'>('teacher');

  const currentConcept = conceptsData.find(c => c.id === selectedConcept) || conceptsData[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-32 sm:px-6 lg:px-8 space-y-24">
        {/* Header Hero */}
        <section className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Dual-Persona RAG Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            How <span className="text-blue-500">LearnIverse</span> Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            LearnIverse leverages Retrieval-Augmented Generation (RAG) to ground AI responses in peer-reviewed textbooks, delivering explanations from two distinct virtual mentors.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
              <Link to="/topics">Start Learning</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </section>

        {/* Interactive Comparison Simulator */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dual-Persona Simulator</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose a concept below to compare how our two AI personas explain the exact same academic topics in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Concept Selector Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block px-1">Select a Concept</span>
              {conceptsData.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    selectedConcept === concept.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm font-semibold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                      {concept.category}
                    </span>
                    <span>{concept.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            {/* Persona Switcher & Visual Display */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex border-b border-slate-200 pb-4">
                <button
                  onClick={() => setActiveTab('teacher')}
                  className={`flex-1 pb-3 text-center font-semibold transition-all relative ${
                    activeTab === 'teacher'
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>Teacher AI</span>
                  </div>
                  {activeTab === 'teacher' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button
                  onClick={() => setActiveTab('peer')}
                  className={`flex-1 pb-3 text-center font-semibold transition-all relative ${
                    activeTab === 'peer'
                      ? 'text-sky-600 font-bold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Peer AI</span>
                  </div>
                  {activeTab === 'peer' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"></span>}
                </button>
              </div>

              {/* Persona Content Box */}
              <div className="min-h-[160px] flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    {activeTab === 'teacher' ? 'Structured Academic Explanation' : 'Intuitive & Analogy-based explanation'}
                  </h4>
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                    {activeTab === 'teacher' ? currentConcept.teacher : currentConcept.peer}
                  </p>
                </div>

                <div className="mt-8 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <BookMarked className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>
                    {activeTab === 'teacher' 
                      ? `Grounded response with precise definitions, formulas, and asymptotic bounds.` 
                      : `Conceptual comparison designed to build intuition before writing code or proofs.`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Pipeline Flow */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our 4-Step RAG Architecture</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              How queries travel from your keyboard, ground themselves in vetted textbooks, and translate into structured answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 relative border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">User Submits Query</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  You ask a question about DSA inside the dashboard.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 p-2 rounded-lg">
                POST /api/chat
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 relative border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">Textbook Retrieval</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  SentenceTransformers embeds the query, searching ChromaDB for matching textbook passages.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 p-2 rounded-lg">
                ChromaDB Vector Match
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 relative border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">Dual Prompt Injection</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Textbook context and history are injected into custom prompt templates for the two roles.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 p-2 rounded-lg">
                Gemini 3.5 Flash LLM
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 relative border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-slate-900">Grounded Explanation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The frontend displays both replies along with the textbook chapters referenced as citations.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 p-2 rounded-lg">
                Citations & Sources
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Under the Hood</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              LearnIverse is powered by modern tools, ensuring speed, security, and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl mb-4">
                <Cpu className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Google Gemini API</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Generates natural, context-grounded student-teacher dialogues via the Gemini 3.5 Flash model.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl mb-4">
                <Database className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Chroma Vector DB</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A persistent local vector database indexing high-fidelity textbook passages for DSA.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl mb-4">
                <Code className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">FastAPI & Python</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Powers the core RAG orchestration pipeline, tokenization, embeddings, and query services.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
