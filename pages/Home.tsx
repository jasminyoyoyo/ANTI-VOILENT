import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Map, Shield, EyeOff, Info, X } from 'lucide-react';

const Home: React.FC = () => {
  const [showSecurityGuide, setShowSecurityGuide] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-violet-50 py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
            You deserve to be <span className="text-violet-600">safe</span>.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            If you are experiencing violence at home, you are not alone. Beacon provides immediate resources, legal guidance, and safety planning powered by AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/chat" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 md:text-lg shadow-sm transition-all">
              <MessageCircle className="mr-2" />
              Chat with Advocate AI
            </Link>
             <Link to="/resources" className="inline-flex items-center justify-center px-8 py-3 border border-violet-200 text-base font-medium rounded-md text-violet-700 bg-white hover:bg-violet-50 md:text-lg shadow-sm transition-all">
              <Map className="mr-2" />
              Find Legal Help
            </Link>
          </div>
        </div>
      </section>

      {/* Immediate Help Banner */}
      <section className="bg-rose-100 border-y border-rose-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
                <h3 className="text-lg font-bold text-rose-800 flex items-center justify-center sm:justify-start gap-2">
                    <Phone size={20} />
                    In Immediate Danger?
                </h3>
                <p className="text-rose-700 text-sm mt-1">
                    If you are injured or afraid for your life, call emergency services immediately.
                </p>
            </div>
            <a href="tel:110" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors">
                Call Emergency
            </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">How We Can Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 mb-4">
                    <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Safety Planning</h3>
                <p className="text-slate-600 mb-4">Create a personalized, step-by-step plan to keep yourself and your children safe, whether you stay or leave.</p>
                <Link to="/safety-plan" className="text-violet-600 font-medium hover:underline">Start planning &rarr;</Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 mb-4">
                    <Map size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Government Aid</h3>
                <p className="text-slate-600 mb-4">Locate official shelters, Women's Federation offices, and police stations using verified maps.</p>
                <Link to="/resources" className="text-violet-600 font-medium hover:underline">Search map &rarr;</Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 mb-4">
                    <MessageCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">24/7 AI Support</h3>
                <p className="text-slate-600 mb-4">Talk to our empathetic AI advocate to understand your rights and get emotional support anytime.</p>
                <Link to="/chat" className="text-violet-600 font-medium hover:underline">Start chat &rarr;</Link>
            </div>
        </div>
      </section>

      {/* Disguise Mode Instructions */}
      <section className="bg-slate-800 text-slate-300 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-700 rounded-full mb-4 text-slate-100">
            <EyeOff size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Disguise Mode Safety Guide</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            You can switch this app into "Weather App" mode instantly. Here is how to control it once disguised:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <h3 className="font-bold text-white mb-2">To Exit Disguise:</h3>
              <p>Tap the <span className="font-bold text-sky-300">Refresh Icon</span> (top right) <span className="font-bold text-white bg-slate-600 px-1 rounded">3 times</span> quickly.</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
               <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                 To Trigger SOS:
                 <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Emergency</span>
               </h3>
              <p>Tap the large <span className="font-bold text-sky-300">Weather Icon</span> (center) <span className="font-bold text-white bg-slate-600 px-1 rounded">5 times</span>. This will immediately open the Voice Call screen.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;