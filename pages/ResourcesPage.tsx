import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  HeartHandshake,
  Home,
  MapPin,
  Navigation,
  Phone,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Waypoints,
} from 'lucide-react';
import { findNearbyResources } from '../services/geminiService';
import { GroundingSource, UserLocation } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ResourceMap from '../components/ResourceMap';

type ResourcePath = {
  title: string;
  description: string;
  query: string;
  icon: React.ReactNode;
  accent: string;
  panelClassName: string;
};

const TRUSTED_STARTING_POINTS = [
  {
    name: '1800RESPECT',
    type: 'National crisis and counselling support',
    description: '24/7 support for domestic, family and sexual violence, including phone and online counselling.',
    contact: 'Call 1800 737 732',
    href: 'tel:1800737732',
  },
  {
    name: 'Emergency Services',
    type: 'Immediate danger or urgent medical risk',
    description: 'If someone is threatening you, hurting you, or you feel unsafe right now, call emergency services immediately.',
    contact: 'Call 000',
    href: 'tel:000',
  },
  {
    name: 'Community Legal Centres',
    type: 'Protection orders and practical legal help',
    description: 'A good first step for family violence legal support, tenancy concerns, immigration issues, and referrals.',
    contact: 'Find a local legal centre',
    href: 'https://clcs.org.au/',
  },
];

const RESOURCE_PATHS: ResourcePath[] = [
  {
    title: 'Emergency help now',
    description: 'Police, hospitals, 1800RESPECT, crisis support, and urgent family violence response options.',
    query: '1800RESPECT crisis accommodation police hospital domestic violence support Australia',
    icon: <ShieldAlert size={18} />,
    accent: 'Urgent',
    panelClassName: 'border-rose-200 bg-rose-50 hover:border-rose-300 hover:bg-rose-100/70',
  },
  {
    title: 'Legal support',
    description: 'Protection orders, tenancy, immigration concerns, child safety, and family violence legal advice.',
    query: 'community legal centre legal aid domestic violence Australia protection order family violence',
    icon: <Scale size={18} />,
    accent: 'Legal',
    panelClassName: 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100/70',
  },
  {
    title: 'Emergency accommodation',
    description: 'Shelters, crisis housing, safe accommodation, and short-term refuge pathways.',
    query: 'women shelter refuge crisis accommodation domestic violence Australia',
    icon: <Home size={18} />,
    accent: 'Stay safe',
    panelClassName: 'border-sky-200 bg-sky-50 hover:border-sky-300 hover:bg-sky-100/70',
  },
  {
    title: 'Counselling and recovery',
    description: 'Trauma-informed counselling, mental health care, family support, and ongoing recovery services.',
    query: 'domestic violence counselling trauma support family violence Australia',
    icon: <Stethoscope size={18} />,
    accent: 'Care',
    panelClassName: 'border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100/70',
  },
  {
    title: 'Community and cultural support',
    description: 'Support services for migrants, young people, First Nations communities, and local community organisations.',
    query: 'family violence migrant support aboriginal support youth services Australia',
    icon: <HeartHandshake size={18} />,
    accent: 'Community',
    panelClassName: 'border-violet-200 bg-violet-50 hover:border-violet-300 hover:bg-violet-100/70',
  },
];

const NEXT_STEP_GUIDES = [
  {
    title: 'Calling a hotline',
    description:
      'You can usually speak confidentially, explain as much or as little as you want, and ask what support exists before giving personal details.',
    icon: <Phone size={18} />,
  },
  {
    title: 'Getting legal help',
    description:
      'A legal service may help you understand protection orders, housing issues, family law options, and what evidence might be useful.',
    icon: <Scale size={18} />,
  },
  {
    title: 'Looking for accommodation',
    description:
      'A refuge or crisis accommodation service may ask about immediate safety, children, transport, and whether you have somewhere safe tonight.',
    icon: <Home size={18} />,
  },
  {
    title: 'Starting counselling',
    description:
      'Counselling can help with emotional safety, trauma support, planning, and coping after a controlling or violent relationship.',
    icon: <FileCheck2 size={18} />,
  },
];

const ResourcesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [results, setResults] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastSearchLabel, setLastSearchLabel] = useState<string>('');
  const resultsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setLocationError('Location access denied. We can still suggest trusted Australian support services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported on this device.');
    }
  }, []);

  useEffect(() => {
    if ((loading || results) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, results]);

  const runSearch = async (term: string, label?: string) => {
    if (!term.trim()) return;

    setQuery(term);
    setLastSearchLabel(label ?? term);
    setLoading(true);

    try {
      const data = await findNearbyResources(location, term);
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults({
        text: "Sorry, Beacon couldn't fetch live resource guidance right now. Please try again or start with 1800RESPECT, a hospital, or emergency services if you are in danger.",
        sources: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runSearch(query);
  };

  return (
    <div className="px-4 py-8 pb-20">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-violet-200/40 blur-3xl"></div>
          <div className="absolute bottom-[-3rem] right-[-2rem] h-56 w-56 rounded-full bg-sky-200/35 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-3 py-1.5 text-sm font-medium text-violet-700 shadow-sm">
              <MapPin size={15} />
              Australia-focused support guidance
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Find the right support
              <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
                without sorting through everything alone.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Beacon starts with trusted Australian pathways first, then helps you narrow down what kind of support makes the most sense
              right now.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-rose-500 p-3 text-white shadow-sm">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-rose-600">Immediate safety</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">If you are in danger, call 000 now.</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    If someone is threatening you, hurting you, preventing you from leaving, or you need urgent medical help, emergency
                    services are the fastest option.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="tel:000"
                      className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-rose-700"
                    >
                      Call 000
                    </a>
                    <button
                      type="button"
                      onClick={() => runSearch(RESOURCE_PATHS[0].query, RESOURCE_PATHS[0].title)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      See urgent support options
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-[0_18px_55px_rgba(2,6,23,0.18)]">
              <div className="flex items-center gap-2 text-sm font-medium text-sky-300">
                <Sparkles size={16} />
                Calm next steps
              </div>
              <h2 className="mt-3 text-2xl font-bold text-white">Not ready to call someone yet?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                You can start with a private support chat or build a safety plan first. You do not need to decide everything at once.
              </p>
              <div className="mt-5 space-y-3">
                <Link
                  to="/chat"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Talk through the next step
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/safety-plan"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Build a safety plan
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">Support Paths</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Choose the kind of help you need</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            These pathways are designed to reduce decision fatigue. Start with the category that feels closest to what you need right now.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {RESOURCE_PATHS.map((path) => (
            <button
              key={path.title}
              type="button"
              onClick={() => runSearch(path.query, path.title)}
              className={`group rounded-[1.6rem] border p-5 text-left transition ${path.panelClassName}`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white/90 p-3 text-slate-900 shadow-sm">{path.icon}</div>
                <div className="flex-1">
                  <div className="inline-flex rounded-full border border-black/5 bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {path.accent}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{path.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{path.description}</p>
                </div>
                <ArrowRight className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">What Happens Next</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">A first contact usually does not mean losing control.</h2>
          <p className="mt-3 text-slate-600">
            Many people hesitate because they do not know what will happen after they call, ask a question, or contact a service.
            These are common first-step experiences.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {NEXT_STEP_GUIDES.map((guide) => (
            <div key={guide.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
              <div className="inline-flex rounded-2xl bg-white p-3 text-violet-600 shadow-sm">{guide.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
            <Search size={16} />
            Search by need
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Describe what kind of support would help.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Try needs like legal help, shelter, counselling, police support, migrant support, or help for a friend.
          </p>

          <form onSubmit={handleSearch} className="mt-5 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="For example: legal help after family violence, crisis accommodation, counselling near me"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-400"
            >
              {loading ? 'Searching...' : 'Get support suggestions'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Quick prompts</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => runSearch('support for a friend experiencing domestic violence in Australia')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                Help for a friend
              </button>
              <button
                type="button"
                onClick={() => runSearch('domestic violence support for migrants and international students in Australia')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                Migrant support
              </button>
              <button
                type="button"
                onClick={() => runSearch('technology safety stalking surveillance domestic violence Australia')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:col-span-2"
              >
                Digital safety
              </button>
            </div>
          </div>

          {locationError ? (
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{locationError}</p>
          ) : (
            <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Location is enabled, so Beacon can give more local guidance when available.
            </p>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Beacon suggests starting points only. Always confirm addresses, opening hours, and eligibility before attending.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Waypoints size={16} className="text-emerald-600" />
            How to use this page
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Start with a category, then use the results cards below.</h2>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-violet-100 p-2 text-violet-700">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">1. Choose a support path</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Tap a category like legal help, accommodation, counselling, or migrant support. The page will jump straight to the results section.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-violet-100 p-2 text-violet-700">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">2. Read the resource cards first</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Each card tells you why that service helps, and gives you direct actions like call or visit website.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-violet-100 p-2 text-violet-700">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">3. Use the AI guidance as extra context</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    The paragraph guidance is there to help you choose, but the main action is in the resource cards and links.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <ShieldCheck size={16} className="text-emerald-600" />
              Trusted starting points
            </div>
            <div className="mt-4 space-y-4">
              {TRUSTED_STARTING_POINTS.map((item) => (
                <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.type}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      {item.href.startsWith('http') ? <ExternalLink size={15} /> : <Phone size={15} />}
                      {item.contact}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(loading || results) && (
        <section ref={resultsRef} className="mx-auto mt-10 max-w-6xl">
          {loading && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-200"></div>
                  <div className="h-4 w-40 rounded bg-slate-200"></div>
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                <div className="mt-4 h-72 rounded-3xl bg-slate-200"></div>
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">Results</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {lastSearchLabel ? `Support guidance for ${lastSearchLabel}` : 'Support guidance'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResults(null)}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                  >
                    Clear results
                  </button>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-slate-200 overflow-hidden">
                  <ResourceMap userLocation={location} resources={results.sources} />
                </div>
              </div>

              {results.sources.length > 0 && (
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Resource cards</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Start here. These cards are the most direct way to use this page.
                  </p>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {results.sources.map((source, idx) => (
                      <div key={`${source.title}-${idx}`} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                              {source.type ?? 'support'}
                            </p>
                            <h4 className="mt-2 text-lg font-bold text-slate-900">{source.title}</h4>
                          </div>
                          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                            Option {idx + 1}
                          </div>
                        </div>

                        {source.description && (
                          <p className="mt-3 text-sm leading-6 text-slate-600">{source.description}</p>
                        )}

                        {source.whyThisHelps && (
                          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">Why this helps</p>
                            <p className="mt-1 text-sm leading-6 text-violet-900">{source.whyThisHelps}</p>
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3">
                          {source.phone && (
                            <a
                              href={`tel:${source.phone}`}
                              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                            >
                              <Phone size={15} />
                              Call
                            </a>
                          )}
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50"
                          >
                            <ExternalLink size={15} />
                            Visit website
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Navigation size={20} className="text-teal-600" />
                  AI guidance and next support options
                </h3>

                <div className="prose prose-slate mt-5 max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900">
                  <MarkdownRenderer content={results.text} />
                </div>

                {results.sources.length > 0 ? (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Source links</h4>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {results.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 transition hover:border-violet-300 hover:bg-violet-50"
                        >
                          <span className="truncate pr-3 text-sm font-medium text-slate-700">{source.title}</span>
                          <ExternalLink size={16} className="text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No direct map links were returned for this search. Use the guidance above as a starting point and confirm details
                    before attending.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="mx-auto mt-10 max-w-6xl rounded-[1.75rem] border border-slate-200 bg-slate-950 px-6 py-6 text-slate-200 shadow-[0_18px_55px_rgba(2,6,23,0.16)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Safety note</p>
            <h2 className="mt-2 text-xl font-bold text-white">If searching feels overwhelming, start smaller.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              You can move to chat for a calmer first step, or create a safety plan before contacting anyone directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Go to chat
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/safety-plan"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Build a safety plan
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
