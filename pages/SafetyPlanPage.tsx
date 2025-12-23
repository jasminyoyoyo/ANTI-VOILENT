import React, { useState } from 'react';
import { CheckCircle, ClipboardList, Shield } from 'lucide-react';
import { generateSafetyPlan } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';

const SafetyPlanPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    livingSituation: '',
    children: '',
    transport: '',
    support: ''
  });
  const [plan, setPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateSafetyPlan(formData);
      setPlan(result);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
          <Shield size={32} className="text-violet-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Safety Planning</h1>
        <p className="text-slate-600 mt-2">A personalized guide to keeping you and your family safe.</p>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-violet-600 p-4 text-white">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <ClipboardList /> Tell us about your situation
            </h2>
            <p className="text-violet-100 text-sm mt-1">This information is not saved remotely.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Living Situation</label>
              <select
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-violet-500"
                value={formData.livingSituation}
                onChange={(e) => handleInputChange('livingSituation', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="living with abuser">Living with the abuser</option>
                <option value="planning to leave">Planning to leave soon</option>
                <option value="already left">Already left</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Are children involved?</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., Yes, two ages 5 and 8"
                value={formData.children}
                onChange={(e) => handleInputChange('children', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Access to Transportation</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., Have own car, rely on bus, no transport"
                value={formData.transport}
                onChange={(e) => handleInputChange('transport', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Support Network</label>
              <textarea
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., Parents nearby, one close friend, isolated"
                rows={3}
                value={formData.support}
                onChange={(e) => handleInputChange('support', e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !formData.livingSituation}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg shadow-md transition-all flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Generate My Plan'
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="text-teal-500" /> Your Safety Plan
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-slate-500 hover:text-violet-600 underline"
            >
              Edit Details
            </button>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <MarkdownRenderer content={plan} />
          </div>

          <div className="mt-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm font-medium text-center">
              Please try to memorize the key parts of this plan. If it's safe, take a screenshot, but ensure your photo gallery is secure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyPlanPage;