
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      } dark:bg-gray-900/80 dark:backdrop-blur-md`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className={`flex items-center space-x-2 text-blue-600 transition-transform hover:scale-105 ${
                isActive('/top-100-codes') ? '-ml-4' : ''
              }`}
            >
              <Lightbulb className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">Learn<span className="text-blue-600">Iverse</span></span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
            }`}>
              Home
            </Link>
            <Link to="/topics" className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/topics') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
            }`}>
              Topics
            </Link>
            <Link to="/how-it-works" className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/how-it-works') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
            }`}>
              How It Works
            </Link>
            <Link to="/about" className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
            }`}>
              About
            </Link>
            <Link to="/top-100-codes" className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/top-100-codes') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
            }`}>
              Top 100 Codes
            </Link>
            <Link to="/assessment" className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/assessment') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
            }`}>
              Placement Test
            </Link>
          </nav>
          
          <div className="hidden md:block">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md shadow-blue-500/20"
              asChild
            >
              <Link to="/topics">Get Started</Link>
            </Button>
          </div>
          
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
