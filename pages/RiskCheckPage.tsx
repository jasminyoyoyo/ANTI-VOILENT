import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, ExternalLink, Phone, ShieldAlert, Sparkles } from 'lucide-react';
import { assessRiskCheckAnswers, RiskCheckAnswerValue } from '../services/riskEngine';

type Question = {
  id: string;
  prompt: string;
  helper: string;
  emergency?: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: 'fear',
    prompt: 'Do you feel afraid of your partner or someone at home?',
    helper: 'Fear, walking on eggshells, or changing your behaviour to avoid conflict can matter.',
    emergency: true,
  },
  {
    id: 'control',
    prompt: 'Does someone control where you go, who you speak to, or how you spend time?',
    helper: 'Control can include checking your phone, restricting movement, or deciding things for you.',
  },
  {
    id: 'isolation',
    prompt: 'Have you been pushed away from friends, family, school, or work?',
    helper: 'Isolation can be emotional, social, cultural, or financial.',
  },
  {
    id: 'threats',
    prompt: 'Has someone threatened to hurt you, the children, pets, or themselves?',
    helper: 'Threats, intimidation, and coercion are serious warning signs.',
    emergency: true,
  },
  {
    id: 'monitoring',
    prompt: 'Do you think someone monitors your phone, messages, location, or online activity?',
    helper: 'Technology-facilitated abuse can include stalking, spyware, forced password access, or location tracking.',
  },
  {
    id: 'money',
    prompt: 'Does someone control money, transport, documents, or your ability to leave?',
    helper: 'Financial control often makes it harder to act safely even when someone wants to leave.',
  },
];

const ANSWER_META: Record<RiskCheckAnswerValue, { label: string }> = {
  no: { label: 'No' },
  sometimes: { label: 'Sometimes' },
  yes: { label: 'Yes' },
};

const RiskCheckPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, RiskCheckAnswerValue>>({});
  const answeredCount = Object.keys(answers).length;

  const result = useMemo(() => {
    if (answeredCount !== QUESTIONS.length) return null;
    const routing = assessRiskCheckAnswers(answers);

    if (routing.riskLevel === 'imminent' || routing.riskLevel === 'high') {
      return {
        routing,
        title: 'There may be strong signs of abuse or escalating risk.',
        tone: 'rose' as const,
        summary:
          'What you described may point to coercive control, threats, or violence. You deserve support, and it may help to focus on immediate safety and trusted services.',
        nextSteps: [
          'If you are in immediate danger, call 000.',
          'Use the safety plan page to prepare a safer next step.',
          'Consider contacting 1800RESPECT or a local domestic violence service.',
        ],
      };
    }

    if (routing.riskLevel === 'medium') {
      return {
        routing,
        title: 'There may be meaningful signs of control or abuse.',
        tone: 'amber' as const,
        summary:
          'Even if things feel confusing or inconsistent, these patterns can still matter. Support does not require things to become worse first.',
        nextSteps: [
          'Talk through what is happening in chat if you want a calmer first step.',
          'Look at legal, counselling, or community support options.',
          'Start a safety plan if leaving or staying safer is already on your mind.',
        ],
      };
    }

    return {
      routing,
      title: 'Your answers do not strongly suggest high risk right now, but your feelings still matter.',
      tone: 'emerald' as const,
      summary:
        'This check is only a guide, not a diagnosis. If something feels wrong, controlling, or unsafe, it is still worth talking through and learning what support exists.',
      nextSteps: [
        'Use chat if you want to explore whether something feels healthy or not.',
        'Look at digital safety and support resources if your situation changes.',
        'Come back to this check any time if things start to feel more serious.',
      ],
    };
  }, [answers, answeredCount]);

  const handleAnswer = (questionId: string, value: RiskCheckAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const resultToneClass =
    result?.tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : result?.tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-emerald-200 bg-emerald-50 text-emerald-900';

  return (
    <div className="px-4 py-8 pb-20">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700">
            <Sparkles size={15} />
            Gentle self-check
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Not sure if this counts as abuse?
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            This short check looks for patterns like fear, control, isolation, threats, and monitoring. You can use it privately to help
            name what may be happening.
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 text-amber-600" size={18} />
            <div>
              This check is not a diagnosis and does not replace emergency services. If someone is threatening you, hurting you, or you
              feel unsafe right now, call <span className="font-semibold">000</span>.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">Progress</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {answeredCount} of {QUESTIONS.length} answered
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">
          {QUESTIONS.map((question, index) => (
            <div key={question.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{question.prompt}</h3>
                    {question.emergency && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">
                        High concern
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{question.helper}</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {(Object.keys(ANSWER_META) as RiskCheckAnswerValue[]).map((value) => {
                      const selected = answers[question.id] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleAnswer(question.id, value)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                            selected
                              ? 'border-violet-300 bg-violet-50 text-violet-800'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-200 hover:bg-violet-50'
                          }`}
                        >
                          {ANSWER_META[value].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {result && (
        <section className="mx-auto mt-8 max-w-5xl">
          <div className={`rounded-[1.75rem] border p-6 shadow-sm ${resultToneClass}`}>
            <div className="flex items-start gap-3">
              {result.tone === 'rose' ? (
                <ShieldAlert className="mt-1 text-rose-600" size={22} />
              ) : (
                <CheckCircle2 className="mt-1 text-emerald-600" size={22} />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em]">Result</p>
                <h2 className="mt-2 text-2xl font-bold">{result.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7">{result.summary}</p>
              </div>
            </div>

            <div className="mt-6">
              {result.routing.needsHumanEscalation && (
                <div className="mb-5 rounded-2xl border border-rose-200 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Human escalation</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href="tel:000"
                      className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      <Phone size={15} />
                      Emergency support
                    </a>
                    <a
                      href="tel:1800737732"
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                    >
                      <Phone size={15} />
                      Connect to human
                    </a>
                    <a
                      href="https://www.1800respect.org.au/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                    >
                      <ExternalLink size={15} />
                      Human support options
                    </a>
                  </div>
                </div>
              )}

              <h3 className="text-sm font-semibold uppercase tracking-[0.22em]">Suggested next steps</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {result.nextSteps.map((step) => (
                  <div key={step} className="rounded-2xl border border-white/60 bg-white/60 p-4 text-sm leading-6 text-slate-700">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Talk it through
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50"
              >
                Find support
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/safety-plan"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50"
              >
                Build a safety plan
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RiskCheckPage;
