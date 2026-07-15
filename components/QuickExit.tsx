import React from 'react';
import { LogOut } from 'lucide-react';

const QuickExit: React.FC = () => {
  const handleExit = () => {
    // Redirect to a neutral site immediately and replace history
    window.location.replace('https://www.google.com');
  };

  return (
    <button
      onClick={handleExit}
      className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full border border-[#8c3f2e] bg-[#fbfbf7]/94 px-4 py-3 font-semibold text-[#8c3f2e] backdrop-blur-xl transition-all hover:bg-[#f2e5df] sm:px-5"
      aria-label="Quick Exit to Google"
    >
      <LogOut size={22} />
      <span className="text-xs uppercase tracking-[0.16em] sm:text-sm">Quick Exit</span>
    </button>
  );
};

export default QuickExit;
