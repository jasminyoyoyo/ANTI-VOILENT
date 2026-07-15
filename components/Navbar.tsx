import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, MapPin, BookOpen, EyeOff, Activity, ScanSearch } from 'lucide-react';

interface NavbarProps {
  onEnableDisguise: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onEnableDisguise }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-[#dfe3ea] text-[#242424]'
        : 'text-[#66635d] hover:bg-[#eeeee7] hover:text-[#242424]'
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-[#d9d9cf] bg-[#f6f6f0]/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-[#242424]">
              <ShieldCheck size={27} strokeWidth={1.6} className="line-drawing text-[#5f6f86]" />
              <span>Beacon</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-3">
             <button 
               onClick={onEnableDisguise}
               className="rounded-full p-2 text-[#66635d] transition-colors hover:bg-[#eeeee7] hover:text-[#242424]"
               title="Enable Disguise Mode"
             >
               <EyeOff size={20} />
             </button>
             <NavLink to="/resources" className={navLinkClass}>
              <MapPin size={18} />
              <span className="hidden sm:inline">Resources</span>
            </NavLink>
             <NavLink to="/risk-check" className={navLinkClass}>
              <ScanSearch size={18} />
              <span className="hidden sm:inline">Risk Check</span>
            </NavLink>
             <NavLink to="/safety-plan" className={navLinkClass}>
              <BookOpen size={18} />
              <span className="hidden sm:inline">Safety Plan</span>
            </NavLink>
            <NavLink to="/ai-test" className={({ isActive }) => `${navLinkClass({ isActive })} hidden lg:flex`}>
              <Activity size={18} />
              <span>AI Test</span>
            </NavLink>
            <Link to="/chat" className="flex items-center gap-1 rounded-full border border-[#242424] bg-[#242424] p-2 text-sm font-semibold text-[#f5f4ef] transition-colors hover:bg-[#343434] sm:px-4">
              <HeartHandshake size={18} />
              <span className="hidden sm:inline">Chat Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
