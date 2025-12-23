import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, Navigation, Building2, BadgeCheck, Phone, ShieldCheck } from 'lucide-react';
import { findNearbyResources } from '../services/geminiService';
import { UserLocation, GroundingSource } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ResourceMap from '../components/ResourceMap';

// Mock Data for "Verified Partners" - This represents the Business Model (B2B/Lead Gen)
// These would be lawyers or NGOs who pay or partner to be listed prominently.
const VERIFIED_PARTNERS = [
  {
    id: 1,
    name: "Bright Horizon Legal Aid",
    type: "Legal Aid",
    description: "Specialized in domestic abuse restraining orders. Pro bono options available.",
    phone: "400-123-4567",
    isSponsored: true
  },
  {
    id: 2,
    name: "SafeHarbor Psychology",
    type: "Therapy",
    description: "Trauma-informed counseling for women and children. 24/7 Crisis line.",
    phone: "400-987-6543",
    isSponsored: true
  }
];

const ResourcesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [results, setResults] = useState<{text: string, sources: GroundingSource[]} | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Location access denied. Results may not be local.");
        }
      );
    } else {
      setLocationError("Geolocation not supported.");
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await findNearbyResources(location, query);
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults({ text: "Sorry, I couldn't fetch resources at this moment. Please verify your internet connection.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  const triggerQuickSearch = (term: string) => {
    setQuery(term);
    setLoading(true);
    findNearbyResources(location, term)
      .then(data => setResults(data))
      .catch(() => setResults({ text: "Could not fetch resources.", sources: [] }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="text-violet-600" />
        Local Resources
      </h1>
      
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'domestic violence shelter' or 'legal aid office'"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Find Help'}
          </button>
        </form>

        <div className="mt-6">
          <span className="text-sm text-slate-500 block mb-2 font-medium">Quick Filters (Prioritizing Government Data):</span>
          <div className="flex flex-wrap gap-2">
             <button
              onClick={() => triggerQuickSearch('Government Women\'s Federation and Legal Aid')}
              className="flex items-center gap-1 text-xs sm:text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-2 rounded-md transition-colors font-semibold"
            >
              <Building2 size={14} />
              Official Government Aid
            </button>
            <button
              onClick={() => triggerQuickSearch('Police Stations Public Security Bureau')}
              className="text-xs sm:text-sm bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md border border-slate-200 transition-colors"
            >
              Police / Public Security
            </button>
             <button
              onClick={() => triggerQuickSearch('Free Legal Aid Centers')}
              className="text-xs sm:text-sm bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md border border-slate-200 transition-colors"
            >
              Free Legal Aid
            </button>
            <button
              onClick={() => triggerQuickSearch('Domestic Violence Shelters')}
              className="text-xs sm:text-sm bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md border border-slate-200 transition-colors"
            >
              Shelters
            </button>
          </div>
        </div>
        {locationError && <p className="text-xs text-amber-600 mt-2">{locationError}</p>}
      </div>

      {/* Verified Partners Section (Business Model: Service Marketplace) */}
      {!results && !loading && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" />
            Verified Support Specialists
            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-2">Vetted</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VERIFIED_PARTNERS.map(partner => (
              <div key={partner.id} className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                  VERIFIED
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <BadgeCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{partner.name}</h3>
                    <p className="text-xs text-emerald-600 font-medium mb-1">{partner.type}</p>
                    <p className="text-sm text-slate-600 mb-3">{partner.description}</p>
                    <a href={`tel:${partner.phone}`} className="inline-flex items-center gap-1 text-sm bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 transition-colors">
                      <Phone size={14} />
                      Call Specialist
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="animate-pulse space-y-4 p-6 bg-white rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
             <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-64 bg-slate-200 rounded mt-4"></div>
        </div>
      )}

      {/* Map & Results */}
      {results && !loading && (
        <div className="space-y-6">
          
          {/* Map Component */}
          <ResourceMap 
            userLocation={location} 
            resources={results.sources} 
          />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Navigation size={20} className="text-teal-600"/>
              AI Insights & Detailed List
            </h2>
            
            <div className="prose-sm mb-6">
              <MarkdownRenderer content={results.text} />
            </div>

            {results.sources.length > 0 ? (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Source Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
                    >
                      <span className="text-slate-700 font-medium truncate pr-2 group-hover:text-violet-800">{source.title}</span>
                      <ExternalLink size={16} className="text-slate-400 group-hover:text-violet-500 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-400 italic">No direct map links found. Please read the descriptions above.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;