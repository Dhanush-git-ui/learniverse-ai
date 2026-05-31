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