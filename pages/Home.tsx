import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, FileSearch, Map, MessageCircle, Phone, Shield } from 'lucide-react';

const actions = [
  {
    icon: MessageCircle,
    title: 'Talk',
    text: 'Start with one sentence.',
    to: '/chat',
  },
  {
    icon: BookOpenCheck,
    title: 'Plan',
    text: 'Make a safer next step.',
    to: '/safety-plan',
  },
  {
    icon: FileSearch,
    title: 'Check',
    text: 'Notice patterns gently.',
    to: '/risk-check',
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen px-5 py-10 sm:px-8">
      <main className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-5xl flex-col justify-between">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-medium text-[#242424]">
            <Shield size={24} strokeWidth={1.45} />
            Beacon
          </Link>

          <a
            href="tel:000"
            className="inline-flex items-center gap-2 rounded-full border border-[#d8c6bd] px-4 py-2 text-sm font-medium text-[#9a5a45] transition hover:bg-[#f8f0eb]"
          >
            <Phone size={15} strokeWidth={1.45} />
            000
          </a>
        </header>

        <section className="py-16 text-center sm:py-20">
          <p className="mx-auto mb-7 max-w-sm text-xs font-medium uppercase tracking-[0.32em] text-[#77736b]">
            private support
          </p>

          <h1 className="mx-auto max-w-4xl text-[clamp(3.6rem,10vw,8.6rem)] font-normal leading-[0.92] tracking-normal text-[#242424]">
            Quiet help.
            <span className="block text-[#5f6f86]">One next step.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-[#66635d]">
            Talk, plan, check, or find support. Nothing more than you need.
          </p>

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[1rem] border border-[#d8d6cf] bg-[#fbfaf6]">
            <img
              src="/images/beacon-minimal-line.svg"
              alt="Minimal line illustration for quiet safety support"
              className="aspect-[16/7] w-full object-cover"
            />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {actions.map((item, index) => (
            <Link
              key={item.title}
              to={item.to}
              className={`group rounded-[1rem] border p-5 transition ${
                index === 0
                  ? 'border-[#242424] bg-[#242424] text-[#fbfaf6] hover:bg-[#343434]'
                  : 'border-[#d8d6cf] bg-[#fbfaf6]/72 text-[#242424] hover:bg-[#eeeee7]'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <item.icon
                  size={22}
                  strokeWidth={1.45}
                  className={index === 0 ? 'text-[#fbfaf6]' : index === 1 ? 'text-[#5f6f86]' : 'text-[#9a5a45]'}
                />
                <ArrowRight size={15} strokeWidth={1.45} className="transition group-hover:translate-x-1" />
              </div>
              <h2 className="mt-8 text-2xl font-normal">{item.title}</h2>
              <p className={`mt-2 text-sm ${index === 0 ? 'text-[#dcd8cf]' : 'text-[#66635d]'}`}>{item.text}</p>
            </Link>
          ))}
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-[#d8d6cf] pt-5 text-sm text-[#66635d] sm:flex-row">
          <span>In immediate danger, call 000.</span>
          <Link to="/resources" className="inline-flex items-center gap-2 text-[#242424]">
            <Map size={15} strokeWidth={1.45} />
            Find support
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Home;
