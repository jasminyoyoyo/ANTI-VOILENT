import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpenCheck, FileSearch, Map, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

const actions = [
  { icon: MessageCircle, title: 'Talk it through', text: 'Start with one sentence and take the conversation at your pace.', action: 'Open chat', to: '/chat' },
  { icon: BookOpenCheck, title: 'Make a safety plan', text: 'Write down practical steps for now, later, or when things change.', action: 'Start a plan', to: '/safety-plan' },
  { icon: FileSearch, title: 'Check what is happening', text: 'Notice patterns and think through risk without rushing a decision.', action: 'Begin check', to: '/risk-check' },
  { icon: Map, title: 'Find support nearby', text: 'Look for services and other ways to get help outside Beacon.', action: 'View support', to: '/resources' },
];

const Home: React.FC = () => (
  <div className="home-page">
    <section className="home-intro" aria-labelledby="home-title">
      <div className="home-intro__copy">
        <p className="home-kicker"><ShieldCheck aria-hidden="true" size={18} strokeWidth={1.7} />Private, low-pressure support</p>
        <h1 id="home-title">Choose only what feels useful now.</h1>
        <p className="home-lede">You do not need to explain everything or make a big decision. Pick one small next step, or leave at any time.</p>
      </div>
      <aside className="home-emergency" aria-label="Emergency information">
        <p>If you are in immediate danger</p>
        <a href="tel:000"><Phone aria-hidden="true" size={18} strokeWidth={1.7} />Call 000</a>
        <span>Use the Quick Exit button whenever you need to leave this page quickly.</span>
      </aside>
    </section>

    <section className="home-actions" aria-labelledby="actions-title">
      <div className="home-actions__heading">
        <h2 id="actions-title">What would help?</h2>
        <p>Each option opens a separate, focused step.</p>
      </div>
      <ol className="home-action-list">
        {actions.map((item, index) => (
          <li className="home-action" key={item.title}>
            <span className="home-action__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="home-action__icon" aria-hidden="true"><item.icon size={24} strokeWidth={1.55} /></span>
            <div className="home-action__copy"><h3>{item.title}</h3><p>{item.text}</p></div>
            <Link className="home-action__link" to={item.to} aria-label={`${item.action}: ${item.title}`}>
              {item.action}<ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
            </Link>
          </li>
        ))}
      </ol>
    </section>
    <p className="home-privacy-note">Beacon does not replace emergency, legal, medical, or specialist support.</p>
  </div>
);

export default Home;
