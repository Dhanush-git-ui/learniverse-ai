import React from 'react';
import { Lightbulb } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: string;
  textSize?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconSize = 'w-7 h-7',
  textSize = 'text-xl sm:text-[22px]',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Lightbulb icon in vibrant royal blue matching reference image */}
      <Lightbulb className={`${iconSize} text-[#2563eb] stroke-[2.3] flex-shrink-0`} />
      
      {/* Brand typography: "Learn" in black, "iverse" in vibrant blue */}
      <span className={`${textSize} font-black tracking-tight leading-none`}>
        <span className="text-slate-950 dark:text-white">Learn</span>
        <span className="text-[#2563eb]">iverse</span>
      </span>
    </div>
  );
};

export default Logo;
