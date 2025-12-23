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
      className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
      aria-label="Quick Exit to Google"
    >
      <LogOut size={24} />
      <span className="uppercase tracking-wider text-sm">Quick Exit</span>
    </button>
  );
};

export default QuickExit;