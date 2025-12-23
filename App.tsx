import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import QuickExit from './components/QuickExit';
import WeatherDisguise from './components/WeatherDisguise';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import ResourcesPage from './pages/ResourcesPage';
import SafetyPlanPage from './pages/SafetyPlanPage';

const AppContent: React.FC = () => {
  const [isDisguised, setIsDisguised] = useState(false);

  if (isDisguised) {
    return <WeatherDisguise onExitDisguise={() => setIsDisguised(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-200 selection:text-violet-900">
      <Navbar onEnableDisguise={() => setIsDisguised(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/safety-plan" element={<SafetyPlanPage />} />
        </Routes>
      </main>
      <QuickExit />
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">Beacon is an AI-powered support tool. It is not a replacement for professional legal counsel or emergency services.</p>
          <p>&copy; {new Date().getFullYear()} Beacon. Built for safety and support.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;