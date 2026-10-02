
import { Lightbulb } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 bg-white border-t border-slate-100 text-slate-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Lightbulb className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-lg font-black text-slate-900 tracking-tight">Learniverse</span>
          </div>
          
          <div className="text-sm text-slate-500">
            Made with ❤️ for learners everywhere
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Help</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Learniverse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
