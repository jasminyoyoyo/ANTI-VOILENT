import React, { useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, RefreshCw, Settings2 } from 'lucide-react';
import { getActiveAiProvider, isAiConfigured, testAiConnection, type AiConnectionResult } from '../services/geminiService';

const AiTestPage: React.FC = () => {
  const [result, setResult] = useState<AiConnectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const provider = getActiveAiProvider();
  const configured = isAiConfigured();

  const handleTest = async () => {
    setLoading(true);
    try {
      const next = await testAiConnection();
      setResult(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-beacon-100 text-beacon-600 px-3 py-1 text-sm font-medium">
          <Settings2 size={16} />
          AI Diagnostics
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">AI Connection Test</h1>
        <p className="mt-2 text-slate-600">
          Use this page to check which AI provider is active and whether the current API key can reach the official endpoint.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active Provider</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{provider}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Key Present</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{configured ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-beacon-500 px-5 py-3 text-white font-medium hover:bg-beacon-600 disabled:bg-slate-300 transition-colors"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Activity size={18} />}
          {loading ? 'Testing...' : 'Run Connection Test'}
        </button>

        {result && (
          <div
            className={`rounded-2xl border p-5 ${
              result.ok
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-rose-200 bg-rose-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.ok ? (
                <CheckCircle2 className="text-emerald-600 mt-0.5" size={20} />
              ) : (
                <CircleAlert className="text-rose-600 mt-0.5" size={20} />
              )}
              <div>
                <p className={`font-semibold ${result.ok ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {result.ok ? 'Connection successful' : 'Connection failed'}
                </p>
                <p className="mt-1 text-sm text-slate-700">Provider: {result.provider}</p>
                <p className="mt-1 text-sm text-slate-700">HTTP Status: {result.status ?? 'n/a'}</p>
                <div className="mt-3 rounded-xl bg-white/80 border border-white/70 p-3 text-sm text-slate-800 whitespace-pre-wrap break-words">
                  {result.message}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This check uses the same provider and API key your app is currently configured to use in <code>.env.local</code>.
        </div>
      </div>
    </div>
  );
};

export default AiTestPage;
