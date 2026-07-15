import React, { Suspense, lazy, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import QuickExit from './components/QuickExit';

const WeatherDisguise = lazy(() => import('./components/WeatherDisguise'));
const Home = lazy(() => import('./pages/Home'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const SafetyPlanPage = lazy(() => import('./pages/SafetyPlanPage'));
const AiTestPage = lazy(() => import('./pages/AiTestPage'));
const RiskCheckPage = lazy(() => import('./pages/RiskCheckPage'));

const PageFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#e6dfcd] border-t-[#587252]"></div>
      <p className="text-sm text-[#687164]">Loading Beacon...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const [isDisguised, setIsDisguised] = useState(false);

  if (isDisguised) {
    return (
      <Suspense fallback={<PageFallback />}>
        <WeatherDisguise onExitDisguise={() => setIsDisguised(false)} />
      </Suspense>
    );
  }

  return (
    <div className="storybook-shell min-h-screen font-sans text-[#242424] selection:bg-[#dfe3ea] selection:text-[#242424]">
      <Navbar onEnableDisguise={() => setIsDisguised(true)} />
      <main>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/risk-check" element={<RiskCheckPage />} />
            <Route path="/safety-plan" element={<SafetyPlanPage />} />
            <Route path="/ai-test" element={<AiTestPage />} />
          </Routes>
        </Suspense>
      </main>
      <QuickExit />
      
      <footer className="mt-12 border-t border-[#d9d9cf] bg-[#fbfbf7]/88 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[#62675f]">
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
