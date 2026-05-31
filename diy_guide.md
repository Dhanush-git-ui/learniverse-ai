# DIY Implementation Guide: LearnIverse Upgrades

This guide provides the exact file paths, explanation of changes, and copy-pasteable code blocks to complete the 9 upgrades to the **LearnIverse** platform. Open this file in your editor for a side-by-side view.

---

### Step 1: SEO, Title, and Metadata
**File to modify:** [`index.html`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/index.html)

Replace the `<head>` section to remove the generic "Lovable Generated Project" title, descriptions, and update Open Graph meta tags.

**Replace lines 3 to 10 with:**
```html
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LearnIverse AI - Learn Math & DSA through Guided AI Conversations</title>
    <meta name="description" content="Master Mathematics and Data Structures & Algorithms through personalized, step-by-step conversations with an AI Teacher and Peer." />
    <meta name="author" content="LearnIverse" />
    <meta property="og:title" content="LearnIverse AI - Math & DSA Tutoring" />
    <meta property="og:description" content="Guided step-by-step AI conversations to master complex topics." />
    <meta property="og:image" content="/og-image.png" />
    <link rel="icon" type="image/svg+xml" href="/placeholder.svg" />
  </head>
```

---

### Step 2: Styling and Clean Design Panels
**File to modify:** [`src/index.css`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/index.css)

Let's clean up the "glass-card", "blue-glass", and "purple-glass" classes. Instead of neon colors, fuzzy background blurs, and floating shadows, we will define clean, structured panel card layouts.

**Replace lines 83 to 109 with:**
```css
  /* Cleaner Premium Panels */
  .glass-card {
    @apply bg-white dark:bg-gray-800/90 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl transition-all;
  }

  /* Solid Indigo / Slate Accents instead of generic gradients */
  .blue-glass {
    @apply bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm;
  }

  .purple-glass {
    @apply bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm;
  }
```

---

### Step 3: Navigation Fixes (Mobile Menu and Streak Icon)
**File to modify:** [`src/components/Navbar.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/Navbar.tsx)

We will add a state hook to control the mobile menu drawer/dropdown, implement the trigger handler, and display a daily study streak flame counter loaded from `localStorage`.

**Replace the entire file with:**
```tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, Menu, X, Flame } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [streak, setStreak] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch streak value from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('learniverse_user_stats');
    if (savedProgress) {
      try {
        const stats = JSON.parse(savedProgress);
        if (stats.streak) setStreak(stats.streak);
      } catch (e) {
        console.error(e);
      }
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 transition-transform hover:scale-105">
              <Lightbulb className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight">LearnIverse</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/') ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-white'
            }`}>
              Home
            </Link>
            <Link to="/topics" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/topics') ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-white'
            }`}>
              Topics
            </Link>
            <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/about') ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-white'
            }`}>
              About
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-orange-500 font-semibold text-sm bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/30">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{streak} Day Streak</span>
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
              asChild
            >
              <Link to="/topics">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="flex items-center space-x-1 text-orange-500 font-semibold text-xs bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/30">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{streak}d</span>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none p-1"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Home
          </Link>
          <Link
            to="/topics"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Topics
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            About
          </Link>
          <div className="pt-4">
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              asChild
            >
              <Link to="/topics" onClick={() => setIsOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
```

---

### Step 4: Strong Hero Section and Real Product Preview
**File to modify:** [`src/components/Hero.tsx`](file:///c:/Users/dhanu\Downloads\learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/Hero.tsx)

We will modify the main heading to instantly explain the value proposition, change "How It Works" to link to the page section `#how-it-works`, and replace the abstract floating cards with a mock representation of the learning interface.

**Replace the entire file with:**
```tsx
import { ArrowRight, Lightbulb, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-950 dark:to-gray-900 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100/40 dark:bg-indigo-900/10 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-slate-100/40 dark:bg-slate-900/10 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>Dual AI Teacher & Peer Perspectives</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Learn Math and DSA <br />
                through <span className="text-indigo-600 dark:text-indigo-400">guided AI conversations</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                An interactive tutor that breaks down calculus, algebra, and algorithmic complexities step-by-step. Ask questions, view peers' ideas, and master topics dynamically.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-lg text-lg transition-transform hover:scale-[1.02]"
                asChild
              >
                <Link to="/topics">
                  Explore Topics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-8 py-6 rounded-lg text-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How It Works
              </Button>
            </div>
          </div>
          
          {/* Live Product Preview UI */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden text-sm">
              {/* Product Preview Top bar */}
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 ml-2">Topic: Binary Search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full font-medium">
                    Mastery: Improving
                  </span>
                </div>
              </div>
              
              {/* Preview Body */}
              <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                <div className="flex items-start space-x-2">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-full text-indigo-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-indigo-600">Teacher AI</div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-r-lg rounded-bl-lg mt-1 text-slate-800 dark:text-slate-200">
                      Let's find the time complexity of Binary Search. What happens to the size of the search array at each step?
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 justify-end">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-400">You (Student)</div>
                    <div className="bg-indigo-600 text-white p-2.5 rounded-l-lg rounded-br-lg mt-1 inline-block">
                      It is divided by 2 or halved at each step.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full text-amber-600">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-amber-600">Peer AI</div>
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 p-2.5 rounded-r-lg rounded-bl-lg mt-1 text-slate-800 dark:text-slate-200">
                      Yes! Since the range splits in half every time, we solve it in O(log₂ n) steps.
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Input simulation */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Session Progress</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Question 3 of 5 (60%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-indigo-600 h-full w-[60%]"></div>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="Since it is halved, we can express the number of operations..." 
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-800 rounded-lg text-xs" 
                  />
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
```

---

### Step 5: Visual Learning Flow & Stepper on Homepage
**Files to modify:** 
- Add ID to [`src/components/home/FeaturesSection.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/home/FeaturesSection.tsx)
- Insert stepper into [`src/pages/Index.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/Index.tsx)

First, add `id="how-it-works"` on the section tag in `FeaturesSection.tsx` around line 29:
```tsx
    <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-800">
```

Now, update `Index.tsx` to include the visual stepper that demonstrates the learning flow:

**Replace the contents of `src/pages/Index.tsx` with:**
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, HelpCircle, CheckSquare, Sparkles, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/home/FeaturesSection';
import DemoSection from '@/components/home/DemoSection';
import PopularTopicsSection from '@/components/home/PopularTopicsSection';
import Footer from '@/components/Footer';

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const steps = [
    { icon: <BookOpen className="w-6 h-6 text-blue-500" />, title: "1. Choose Topic", desc: "Select from our curated list of Mathematics or DSA courses." },
    { icon: <Sparkles className="w-6 h-6 text-purple-500" />, title: "2. Learn Concept", desc: "Interact with the Teacher AI to understand core formulas or patterns." },
    { icon: <CheckSquare className="w-6 h-6 text-emerald-500" />, title: "3. Answer Question", desc: "Test your understanding with conceptual practice problems." },
    { icon: <HelpCircle className="w-6 h-6 text-amber-500" />, title: "4. Get Hint / Help", desc: "Stuck? Ask the Peer AI for simplified analogies or request targeted hints." },
    { icon: <Trophy className="w-6 h-6 text-indigo-500" />, title: "5. Review Progress", desc: "Track completion, gain mastery level badges, and keep up your daily streak." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <Hero />
      
      {/* Learning Journey Stepper */}
      <section className="py-16 bg-slate-50/50 dark:bg-gray-900/50 border-y border-slate-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">The Interactive Learning Journey</h2>
            <p className="text-slate-600 dark:text-slate-400">Step-by-step master complex concepts through structured dialogues.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-150 dark:border-gray-700 shadow-sm relative">
                <div className="w-12 h-12 rounded-full bg-slate-55 bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{step.desc}</p>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-300 dark:text-gray-700 font-bold z-10 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <DemoSection />
      <PopularTopicsSection />
      <Footer />
    </div>
  );
};

export default Index;
```

---

### Step 6: Make Topic Cards More Dynamic and Informative
**File to modify:** [`src/components/TopicCard.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/TopicCard.tsx)

We will update the card interface to show Difficulty level, estimate time, and fetch completion status from `localStorage` so it turns to "Continue" if already started.

**Replace the entire file with:**
```tsx
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
```

---

### Step 7: Clear Chat Role Labels ("Teacher AI" and "Peer AI")
**Files to modify:** 
- [`src/components/TeacherMessage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/TeacherMessage.tsx) (Change "Code Teacher" to "Teacher AI")
- [`src/components/PeerMessage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/PeerMessage.tsx) (Change "Code Buddy" to "Peer AI")

For **`TeacherMessage.tsx`**, modify line 25:
```diff
-        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Code Teacher</div>
+        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Teacher AI</div>
```

For **`PeerMessage.tsx`**, modify line 16:
```diff
-        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Code Buddy</div>
+        <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Peer AI</div>
```

---

### Step 8: Upgrade Chat with AI Actions (Explain, Example) and Math Answers
**Files to modify:** 
- [`src/components/conversation/MessageInput.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/conversation/MessageInput.tsx)
- [`src/components/ConversationBox.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/ConversationBox.tsx)

We will add quick-action buttons ("Explain Concept" and "Give Example") below the chat input, and support formatting of code blocks and math symbols.

**Replace `src/components/conversation/MessageInput.tsx` with:**
```tsx
import { useState } from 'react';
import { Send, HelpCircle, BookOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (text = inputValue) => {
    const trimmed = text.trim();
    if (trimmed === '') return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (actionType: 'explain' | 'example' | 'format') => {
    if (actionType === 'explain') {
      handleSendMessage("Teacher AI, could you explain the theory behind this step again in simpler terms?");
    } else if (actionType === 'example') {
      handleSendMessage("Peer AI, can you give me an everyday example or analogy of this concept to help visualize it?");
    } else if (actionType === 'format') {
      setInputValue(prev => prev + "\n```javascript\n// Write your code here\n\n```");
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800 space-y-3">
      {/* Quick Action Suggestion Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickAction('explain')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>🔄 Explain Concept</span>
        </button>
        
        <button
          onClick={() => handleQuickAction('example')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 rounded-full text-xs font-semibold hover:bg-purple-100 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>💡 Give Example</span>
        </button>

        <button
          onClick={() => handleQuickAction('format')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-slate-50 dark:bg-gray-700 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-gray-650 rounded-full text-xs font-semibold hover:bg-slate-100 transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
          <span>💻 Format Code</span>
        </button>
      </div>

      <div className="flex items-end space-x-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your answer, or use the quick buttons for explanations..."
          className="min-h-[60px] resize-none rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={isLoading || inputValue.trim() === ''}
          className="bg-indigo-65 bg-indigo-600 hover:bg-indigo-700 text-white h-[60px] w-[60px] rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
```

Now let's verify [`src/components/ConversationBox.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/ConversationBox.tsx) to make sure conversation history is loaded on mount and preserved inside `localStorage` for the selected topic slug.

**Replace the entire file with:**
```tsx
import { useState, useEffect } from 'react';
import { Topic, Question } from '@/models/Topic';
import ConversationHeader from './conversation/ConversationHeader';
import ConversationMessages from './conversation/ConversationMessages';
import MessageInput from './conversation/MessageInput';

interface Source {
  book: string;
  chapter: string;
  topic: string;
  score?: number;
  content_type?: string;
}

interface Message {
  id: string;
  type: 'teacher' | 'peer' | 'user';
  content: string;
  name?: string;
  sources?: Source[];
}

interface ConversationBoxProps {
  sessionTitle?: string;
  onSendMessage?: (message: string) => void;
  currentQuestion?: Question;
  topic?: Topic;
}

const ConversationBox = ({ 
  sessionTitle = "Interactive Learning Session",
  onSendMessage,
  currentQuestion,
  topic
}: ConversationBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const topicSlug = topic?.slug || 'general';

  // Load chat history from localStorage on topic changes
  useEffect(() => {
    const savedHistory = localStorage.getItem(`learniverse_history_${topicSlug}`);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
        setMessages([]);
      }
    } else {
      // Set initial greeting
      const greet: Message = {
        id: 'greet',
        type: 'teacher',
        content: `Welcome! Let's explore the topic of **${topic?.title || "General Science"}**. I will guide you through concepts, and you can submit answers to questions. Ask me for hints or simple summaries anytime!`
      };
      setMessages([greet]);
    }
  }, [topicSlug, topic?.title]);

  // Sync messages with localstorage
  const saveMessages = (updated: Message[]) => {
    setMessages(updated);
    localStorage.setItem(`learniverse_history_${topicSlug}`, JSON.stringify(updated));
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message
    };
    
    const newMessages = [...messages, userMessage];
    saveMessages(newMessages);
    setIsLoading(true);

    const topicName = topic?.name || topic?.title || "General Topic";
    const topicCategory = topic?.category || "DSA";

    if (onSendMessage) {
      onSendMessage(message);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          topic: topicName,
          category: topicCategory,
          history: newMessages.map(msg => ({
            role: msg.type,
            content: msg.content
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }
      
      const data = await response.json();
      const { teacher_answer, peer_answer, sources } = data;
      
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: teacher_answer || "I am analyzing this question. Can you share your current approach?",
        name: topicName,
        sources: sources && Array.isArray(sources) ? (sources as Source[]) : []
      };
      
      const peerMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'peer',
        content: peer_answer || "Think about the step-by-step logic we just used!",
        name: "Peer AI"
      };
      
      saveMessages([...newMessages, teacherMessage, peerMessage]);
    } catch (error) {
      console.error("API error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: "🚨 **tutoring backend unreachable.** I couldn't reach the AI model server. Check that your FastAPI server is running on `port 8000` and `GEMINI_API_KEY` is loaded."
      };
      
      saveMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    localStorage.removeItem(`learniverse_history_${topicSlug}`);
    const greet: Message = {
      id: 'greet',
      type: 'teacher',
      content: `Session reset. Ask me anything about **${topic?.title}**!`
    };
    setMessages([greet]);
  };

  return (
    <div className="border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      <ConversationHeader 
        sessionTitle={sessionTitle} 
        onResetConversation={handleResetConversation} 
      />
      
      <ConversationMessages 
        messages={messages} 
        isLoading={isLoading} 
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ConversationBox;
```

---

### Step 9: Tracking Progress, Mastery, and Streaks
**File to modify:** [`src/pages/TopicDetailPage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/TopicDetailPage.tsx)

We will modify this file to:
1. Load state from `localStorage` to check completed questions.
2. Calculate user's Mastery Level ("Beginner", "Improving", "Confident").
3. Display a study journey status bar inside the topic sheet.
4. Add a Streak Incrementor when completing a question or topic.
5. Create a Summary Card when the topic is completed, showing stats and the "Next Recommended Topic" button.

**Replace the entire file with:**
```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Book, HelpCircle, CheckCircle, XCircle, Award, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationBox from '@/components/ConversationBox';
import QuestionCard from '@/components/QuestionCard';
import ProgressIndicator from '@/components/ProgressIndicator';
import { getTopicBySlug, getAllTopics } from '@/services/TopicService';
import { useToast } from "@/hooks/use-toast";

interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  attemptedAt: string;
  hintsUsed: number;
}

const TopicDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const topic = getTopicBySlug(slug || '');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [hintsUsedForCurrentQuestion, setHintsUsedForCurrentQuestion] = useState(0);
  const [sessionProgress, setSessionProgress] = useState({
    totalCorrect: 0,
    totalAttempted: 0,
    averageTime: 0
  });

  // Load progress on mount
  useEffect(() => {
    if (!topic) return;
    const progressKey = `learniverse_progress_${topic.slug}`;
    const saved = localStorage.getItem(progressKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completedQuestions) setCompletedQuestions(parsed.completedQuestions);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (parsed.lastActiveIndex !== undefined) setCurrentQuestionIndex(parsed.lastActiveIndex);
      } catch (e) {
        console.error(e);
      }
    } else {
      setCompletedQuestions([]);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    }
  }, [slug]);

  // Set start timers
  useEffect(() => {
    setStartTime(new Date());
    setShowFeedback(false);
    setHintsUsedForCurrentQuestion(0);
  }, [currentQuestionIndex]);

  // Save progress changes
  const saveProgressToStorage = (updatedCompleted: number[], updatedAnswers: UserAnswer[]) => {
    if (!topic) return;
    const progressKey = `learniverse_progress_${topic.slug}`;
    localStorage.setItem(progressKey, JSON.stringify({
      completedQuestions: updatedCompleted,
      userAnswers: updatedAnswers,
      lastActiveIndex: currentQuestionIndex
    }));
  };

  // Calculate statistics
  useEffect(() => {
    if (userAnswers.length > 0) {
      const totalCorrect = userAnswers.filter(a => a.isCorrect).length;
      const totalTime = userAnswers.reduce((sum, a) => sum + a.timeTaken, 0);
      setSessionProgress({
        totalCorrect,
        totalAttempted: userAnswers.length,
        averageTime: Math.round(totalTime / userAnswers.length)
      });
    }
  }, [userAnswers]);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Topic Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The topic you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate('/topics')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Browse All Topics
        </Button>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentQuestionIndex];

  // Helper to trigger recommended next topic
  const getNextRecommendedTopic = () => {
    const list = getAllTopics();
    const nextIdx = list.findIndex(t => t.slug === topic.slug) + 1;
    return list[nextIdx] || list[0];
  };

  // Determine Mastery Label
  const getMasteryLabel = () => {
    const ratio = sessionProgress.totalAttempted > 0 
      ? sessionProgress.totalCorrect / sessionProgress.totalAttempted 
      : 0;
    if (ratio >= 0.8) return 'Confident';
    if (ratio >= 0.4) return 'Improving';
    return 'Beginner';
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    const endTime = new Date();
    const timeTaken = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    
    // Evaluate answer with basic keyword matching
    const isCorrect = currentQuestion.solution.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 4)
      .some(keyword => answer.toLowerCase().includes(keyword));

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeTaken,
      attemptedAt: new Date().toISOString(),
      hintsUsed: hintsUsedForCurrentQuestion
    };

    const updatedAnswers = [...userAnswers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setUserAnswers(updatedAnswers);

    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);

    const questionNumber = currentQuestionIndex + 1;
    let updatedCompleted = [...completedQuestions];
    if (!completedQuestions.includes(questionNumber)) {
      updatedCompleted.push(questionNumber);
      setCompletedQuestions(updatedCompleted);
    }

    saveProgressToStorage(updatedCompleted, updatedAnswers);

    // Trigger streak progression
    const statsKey = 'learniverse_user_stats';
    const savedStats = localStorage.getItem(statsKey);
    let streakCount = 1;
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        streakCount = (stats.streak || 1) + 1;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(statsKey, JSON.stringify({ streak: streakCount }));

    toast({
      title: isCorrect ? "Correct answer!" : "Review solution!",
      description: isCorrect ? "Excellent explanation!" : "Look at the suggested formula.",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleRequestHint = () => {
    setHintsUsedForCurrentQuestion(prev => prev + 1);
  };

  const isTopicCompleted = completedQuestions.length === topic.questions.length;

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-gray-950">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <Button 
              variant="ghost" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
              onClick={() => navigate('/topics')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>

            {/* Streak indicator badge */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Session Mode: Active</span>
            </div>
          </div>
          
          <header className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {topic.category} Study Guide
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{topic.title}</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">
                  {topic.description}
                </p>
              </div>
              <div className="flex items-center space-x-4 bg-slate-50 dark:bg-gray-900 p-4 rounded-lg border border-slate-100 dark:border-gray-800 min-w-[200px]">
                <Award className="w-8 h-8 text-indigo-500" />
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Mastery Status</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{getMasteryLabel()}</div>
                </div>
              </div>
            </div>

            {/* Visual step guide to represent journey */}
            <div className="mt-6 pt-4 border-t border-slate-150 dark:border-gray-700/50 flex flex-wrap gap-2 text-xs font-medium text-slate-400">
              <span className="text-indigo-65 text-indigo-600 dark:text-indigo-400">Choose topic</span>
              <span>→</span>
              <span className={completedQuestions.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Learn concept</span>
              <span>→</span>
              <span className={userAnswers.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Answer question</span>
              <span>→</span>
              <span>Review progress</span>
            </div>
          </header>
          
          {isTopicCompleted ? (
            /* End-of-Topic Summary Card */
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-800 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Congratulations! Topic Mastered</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You completed all {topic.questions.length} question modules in **{topic.title}**.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-gray-700 py-6 max-w-md mx-auto text-sm">
                <div>
                  <div className="text-slate-45 text-slate-400 font-semibold">Score</div>
                  <div className="text-xl font-extrabold text-emerald-600">{sessionProgress.totalCorrect} / {topic.questions.length}</div>
                </div>
                <div>
                  <div className="text-slate-45 text-slate-400 font-semibold">Mastery</div>
                  <div className="text-xl font-extrabold text-indigo-65 text-indigo-600">{getMasteryLabel()}</div>
                </div>
                <div>
                  <div className="text-slate-45 text-slate-400 font-semibold">Avg. Speed</div>
                  <div className="text-xl font-extrabold text-slate-800 dark:text-white">{sessionProgress.averageTime}s</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Button
                  onClick={() => {
                    localStorage.removeItem(`learniverse_progress_${topic.slug}`);
                    setCompletedQuestions([]);
                    setUserAnswers([]);
                    setCurrentQuestionIndex(0);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restart Topic
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => navigate(`/topics/${getNextRecommendedTopic().slug}`)}
                >
                  Next Recommended Topic
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <ProgressIndicator 
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={topic.questions.length}
                    completedQuestions={completedQuestions}
                  />
                </div>
                
                <div className="mb-6">
                  <QuestionCard
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={topic.questions.length}
                    difficulty={currentQuestion.difficulty}
                    question={currentQuestion.prompt}
                    hints={currentQuestion.hints || []}
                    onSubmit={handleSubmitAnswer}
                    onRequestHint={handleRequestHint}
                  />
                </div>
                
                {showFeedback && (
                  <div className={`mb-6 p-4 rounded-lg border ${
                    feedbackType === 'correct' 
                      ? 'bg-emerald-50/50 border-emerald-25 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-350' 
                      : 'bg-red-50/60 border-red-200 dark:bg-red-950/20 text-red-800 dark:text-red-300'
                  }`}>
                    <div className="flex items-center text-sm font-semibold mb-1">
                      {feedbackType === 'correct' ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      <span>{feedbackType === 'correct' ? 'Correct Answer!' : 'Incorrect Approach'}</span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed mt-1">
                      {feedbackType === 'correct' 
                        ? 'Great job! Your answer matches the conceptual solution. Continue to the next question or view explainers.'
                        : `Solution: ${currentQuestion.solution}`
                      }
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between mb-8">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === topic.questions.length - 1}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/2 h-[600px]">
                <ConversationBox 
                  sessionTitle={`${topic.title} - Step ${currentQuestionIndex + 1}`}
                  currentQuestion={currentQuestion}
                  topic={topic}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TopicDetailPage;
```

---

### Step 10: Verify and Run Locally
To verify the modifications:
1. Ensure the backend FastAPI server is running:
   ```powershell
   python -m uvicorn app:app --reload --port 8000
   ```
2. Build or run the Vite dev server:
   ```powershell
   npm run dev
   ```
3. Test mobile menus by reducing viewport width to under 768px.
4. Try out the "Explain Concept" and "Give Example" buttons in the chat interface.
5. Verify progress percentages increment correctly as questions are answered.
