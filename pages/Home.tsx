import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  EyeOff,
  FileSearch,
  LockKeyhole,
  Map,
  MessageCircle,
  Phone,
  Shield,
  Siren,
  Sparkles,
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden px-4 pt-10 pb-16 sm:pt-16 sm:pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/55 blur-3xl"></div>
          <div className="absolute right-[-5rem] top-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-3 py-1.5 text-sm font-medium text-violet-700 shadow-sm">
                <LockKeyhole size={15} />
                Private, trauma-informed support
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A safer first step when
                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
                  home does not feel safe.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Beacon helps people affected by domestic and family violence find private guidance, practical safety planning,
                and trusted support options in Australia without overwhelming them at the worst moment.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/chat"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_15px_40px_rgba(124,58,237,0.28)] transition hover:bg-violet-700"
                >
                  <MessageCircle size={18} />
                  Talk safely now
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <Map size={18} />
                  Find trusted support
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">Fast exit</span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">Disguise mode</span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">Safety planning</span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">Australia-focused support</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/78 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Start Here</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">What do you need right now?</h2>
                </div>
                <Sparkles className="text-violet-500" size={22} />
              </div>

              <div className="mt-6 space-y-4">
                <Link
                  to="/resources"
                  className="group block rounded-2xl border border-rose-200 bg-rose-50 p-5 transition hover:border-rose-300 hover:bg-rose-100/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-rose-500 p-2.5 text-white shadow-sm">
                      <Siren size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">I need help now</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Go straight to emergency contacts, national services, police support, and fast local help options.
                      </p>
                    </div>
                    <ArrowRight className="mt-1 text-rose-500 transition group-hover:translate-x-1" size={18} />
                  </div>
                </Link>

                <Link
                  to="/chat"
                  className="group block rounded-2xl border border-violet-200 bg-violet-50 p-5 transition hover:border-violet-300 hover:bg-violet-100/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-violet-500 p-2.5 text-white shadow-sm">
                      <MessageCircle size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">I need a calm first step</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Use the private support chat if you need help thinking through what to do next.
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                        Not sure if this is abuse? The risk check can help.
                        <ArrowRight size={15} />
                      </p>
                    </div>
                    <ArrowRight className="mt-1 text-violet-500 transition group-hover:translate-x-1" size={18} />
                  </div>
                </Link>

                <Link
                  to="/safety-plan"
                  className="group block rounded-2xl border border-sky-200 bg-sky-50 p-5 transition hover:border-sky-300 hover:bg-sky-100/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-sky-500 p-2.5 text-white shadow-sm">
                      <Shield size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">I want to make a safe plan</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Build a practical plan for leaving, staying safer tonight, children, transport, and digital safety.
                      </p>
                    </div>
                    <ArrowRight className="mt-1 text-sky-500 transition group-hover:translate-x-1" size={18} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-rose-200 bg-rose-50/90 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-rose-800 sm:justify-start">
              <Phone size={19} />
              In immediate danger?
            </h3>
            <p className="mt-1 text-sm text-rose-700">
              If you are injured, threatened, or afraid for your life, call emergency services immediately.
            </p>
          </div>
          <a
            href="tel:000"
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-rose-700"
          >
            Call 000
          </a>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">Three Core Paths</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Designed to reduce confusion at a hard moment</h2>
            <p className="mt-3 mx-auto max-w-2xl text-slate-600">
              Instead of making you search through lots of features, Beacon tries to get you to the right next step quickly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-violet-100 p-3 text-violet-600">
                <Map size={22} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Trusted support access</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Find relevant support services and reduce the friction between needing help and contacting the right place.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-violet-100 p-3 text-violet-600">
                <BookOpenCheck size={22} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Actionable safety planning</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Turn fear and uncertainty into a practical plan covering transport, emergency items, trusted contacts, and digital safety.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-violet-100 p-3 text-violet-600">
                <MessageCircle size={22} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Private guided support</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use a calm, low-pressure chat space when you are not ready to call, disclose everything, or decide immediately.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:col-span-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-violet-100 p-3 text-violet-600">
                    <FileSearch size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Need help naming what is happening?</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Take a gentle risk check if you are unsure whether a relationship feels controlling, intimidating, or unsafe.
                  </p>
                </div>
                <Link
                  to="/risk-check"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  Start risk check
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 text-slate-200 shadow-[0_25px_70px_rgba(2,6,23,0.18)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-slate-100">
              <EyeOff size={15} />
              Discreet mode
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">Designed for privacy under pressure</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Beacon can switch into a weather screen quickly so the interface looks ordinary if someone walks in. The goal is not
              to be clever. The goal is to give the user a safer exit.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">To exit disguise</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Tap the <span className="font-semibold text-sky-300">menu icon</span> in the top right
                <span className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-semibold text-white">3 times</span> quickly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                SOS trigger
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Emergency
                </span>
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Tap the <span className="font-semibold text-sky-300">large temperature display</span>
                <span className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-semibold text-white">5 times</span> to jump straight to the voice help screen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
