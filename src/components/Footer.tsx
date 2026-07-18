
import { Lightbulb } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Lightbulb className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-lg font-bold">LearnIverse</span>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ for learners everywhere
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Help</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          © 2023 LearnIverse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
