import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, MapPin, BookOpen, EyeOff } from 'lucide-react';

interface NavbarProps {
  onEnableDisguise: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onEnableDisguise }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-violet-700 font-bold text-xl">
              <ShieldCheck size={28} />
              <span>Beacon</span>
            </Link>
          </div>
          <div className="flex space-x-1 sm:space-x-4 items-center">
             <button 
               onClick={onEnableDisguise}
               className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
               title="Enable Disguise Mode"
             >
               <EyeOff size={20} />
             </button>
             <Link to="/resources" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50">
              <MapPin size={18} />
              <span className="hidden sm:inline">Resources</span>
            </Link>
             <Link to="/safety-plan" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50">
              <BookOpen size={18} />
              <span className="hidden sm:inline">Safety Plan</span>
            </Link>
            <Link to="/chat" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-colors">
              <HeartHandshake size={18} />
              <span>Chat Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;