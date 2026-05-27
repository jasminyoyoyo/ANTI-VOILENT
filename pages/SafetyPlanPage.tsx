import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  ClipboardList,
  LockKeyhole,
  NotebookPen,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { generateSafetyPlan } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';

const SAFE_NOTES_STORAGE_KEY = 'beacon_safe_notes_v1';

type SafeNote = {
  id: string;
  text: string;
  createdAt: string;
};

type Option = {
  id: string;
  label: string;
  helper: string;
};

const URGENCY_OPTIONS: Option[] = [
  { id: 'tonight', label: 'Stay safer tonight', helper: '今晚怎么更安全 / what to do if things get worse tonight' },
  { id: 'leave_soon', label: 'Leave soon', helper: '准备离开 / planning an exit in the near future' },
  { id: 'children', label: 'Children involved', helper: '孩子在场 / children may need extra planning' },
  { id: 'monitoring', label: 'Phone or tech monitoring', helper: '手机被查 / device, location, or message safety' },
  { id: 'friend', label: 'Helping someone else', helper: '帮助别人 / supporting a friend or family member' },
];

const SITUATION_OPTIONS: Option[] = [
  { id: 'violence', label: 'Physical violence', helper: '打人、推人、扇耳光 / hitting, pushing, slapping' },
  { id: 'threats', label: 'Threats or intimidation', helper: '威胁、恐吓 / threats, fear, coercion' },
  { id: 'monitoring', label: 'Phone or location monitoring', helper: '查手机、定位、跟踪 / checking phone or tracking' },
  { id: 'money', label: 'Money or document control', helper: '控制钱、证件、银行卡 / financial or document control' },
  { id: 'children_saw', label: 'Children saw or heard it', helper: '孩子看到或听到 / children witnessed conflict or abuse' },
  { id: 'nowhere_safe', label: 'No safe place nearby', helper: '附近没有安全去处 / nowhere obvious to go' },
];

const ACCESS_OPTIONS: Option[] = [
  { id: 'phone', label: 'A charged phone', helper: '手机可用 / you can call or message someone' },
  { id: 'transport', label: 'Transport', helper: '车、公交、朋友接送 / car, taxi, bus, or trusted ride' },
  { id: 'spare_key', label: 'Spare keys', helper: '备用钥匙 / backup key for leaving or returning' },
  { id: 'trusted_person', label: 'Trusted person', helper: '可信的人 / friend, aunt, teacher, neighbour' },
  { id: 'documents', label: 'Important documents', helper: '证件、银行卡、药物 / ID, bank cards, medicine' },
  { id: 'safe_device', label: 'Safer device', helper: '比较安全的设备 / another phone or computer' },
];

const BARRIER_OPTIONS: Option[] = [
  { id: 'children', label: 'Children make leaving harder', helper: '孩子相关安排 / childcare or safety complications' },
  { id: 'money', label: 'No money access', helper: '没有钱 / limited financial freedom' },
  { id: 'transport', label: 'No easy transport', helper: '交通困难 / difficult to get away quickly' },
  { id: 'monitoring', label: 'Phone is monitored', helper: '手机被监控 / calls, texts, or location may be checked' },
  { id: 'isolation', label: 'No trusted person nearby', helper: '孤立无援 / no local support' },
  { id: 'fear', label: 'Too scared to act fast', helper: '很害怕 / fear makes action harder' },
];

const NOTE_SUGGESTIONS = [
  'He checked my phone today. / 他今天查我手机了。',
  'Children saw the argument. / 孩子看到了争吵。',
  "I hid a spare key. / 我藏了一把备用钥匙。",
  "A trusted friend knows. / 一个可信的朋友知道这件事。",
];

const STEP_LABELS = ['Urgency', 'Situation', 'Access', 'Details'];

const toggleValue = (values: string[], next: string) =>
  values.includes(next) ? values.filter((value) => value !== next) : [...values, next];

const OptionChip: React.FC<{
  option: Option;
  selected: boolean;
  onClick: () => void;
}> = ({ option, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[1.25rem] border px-4 py-3 text-left transition ${
      selected
        ? 'border-violet-300 bg-violet-50 text-violet-900'
        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-violet-200 hover:bg-violet-50'
    }`}
  >
    <div className="text-sm font-semibold">{option.label}</div>
    <div className="mt-1 text-xs leading-5 text-slate-500">{option.helper}</div>
  </button>
);

const SafetyPlanPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');
  const [situationTags, setSituationTags] = useState<string[]>([]);
  const [accessTags, setAccessTags] = useState<string[]>([]);
  const [barrierTags, setBarrierTags] = useState<string[]>([]);
  const [details, setDetails] = useState({
    livingSituation: '',
    children: '',
    transport: '',
    support: '',
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [safeNotes, setSafeNotes] = useState<SafeNote[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SAFE_NOTES_STORAGE_KEY);
      if (saved) {
        setSafeNotes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Could not load safe notes', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAFE_NOTES_STORAGE_KEY, JSON.stringify(safeNotes));
    } catch (error) {
      console.error('Could not save safe notes', error);
    }
  }, [safeNotes]);

  const notesSummary = useMemo(
    () =>
      safeNotes.length > 0
        ? safeNotes.map((note) => `${new Date(note.createdAt).toLocaleDateString()}: ${note.text}`).join(' | ')
        : '',
    [safeNotes]
  );

  const selectedUrgencyLabel = useMemo(
    () => URGENCY_OPTIONS.find((option) => option.id === selectedUrgency)?.label ?? '',
    [selectedUrgency]
  );

  const plannerSummary = useMemo(
    () => [
      selectedUrgency ? `Urgency selected: ${selectedUrgencyLabel}` : 'Choose what feels most urgent',
      situationTags.length > 0 ? `${situationTags.length} situation tag(s) selected` : 'Choose what is happening',
      accessTags.length > 0 ? `${accessTags.length} access option(s) selected` : 'Choose what you can access',
      barrierTags.length > 0 ? `${barrierTags.length} barrier(s) selected` : 'Choose what makes this harder',
      safeNotes.length > 0 ? `${safeNotes.length} private note(s) saved` : 'No private notes saved yet',
    ],
    [accessTags.length, barrierTags.length, safeNotes.length, selectedUrgency, selectedUrgencyLabel, situationTags.length]
  );

  const handleDetailChange = (field: keyof typeof details, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNote = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setSafeNotes((prev) => [
      {
        id: Date.now().toString(),
        text: trimmed,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    setSafeNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleClearNotes = () => {
    setSafeNotes([]);
  };

  const canMoveForward =
    (step === 0 && Boolean(selectedUrgency)) ||
    (step === 1 && situationTags.length > 0) ||
    (step === 2 && accessTags.length > 0) ||
    step === 3;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateSafetyPlan({
        ...details,
        urgency: selectedUrgencyLabel,
        situationTags: situationTags.join(', '),
        accessTags: accessTags.join(', '),
        barrierTags: barrierTags.join(', '),
        notesSummary,
      });
      setPlan(result);
      setShowPlan(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 pb-20">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700">
              <Shield size={15} />
              Guided Safety Planner
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Build a safer next step
              <span className="block text-violet-600">without knowing what to write first.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              This planner guides you step by step. You can tap options instead of typing everything yourself.
              <span className="block mt-2 text-base">这个页面是引导式的，不需要你一开始就知道该写什么。</span>
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles size={16} className="text-violet-600" />
                  What this helps with
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tonight, leaving soon, children, digital safety, trusted people, and practical preparation.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                  <Shield size={16} className="text-amber-700" />
                  Important
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  If you are in immediate danger, call 000. This planner is for guided next steps, not emergency response.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-[0_18px_55px_rgba(2,6,23,0.18)]">
            <div className="flex items-center gap-2 text-sm font-medium text-sky-300">
              <ChevronRight size={15} />
              How this works
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">1. Choose what feels most urgent</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Pick the path that feels closest to your situation right now.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">2. Tap options instead of typing everything</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Use the guided options first, then add details only if you want to.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">3. Keep quiet notes over time</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Private notes can help Beacon remember patterns when building a plan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
            <ClipboardList size={16} />
            Guided planner
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STEP_LABELS.map((label, index) => (
              <div
                key={label}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  index === step ? 'bg-violet-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-slate-900">What feels most urgent right now?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Choose one to start. You can still add other details later.</p>
              <div className="mt-4 grid gap-3">
                {URGENCY_OPTIONS.map((option) => (
                  <OptionChip
                    key={option.id}
                    option={option}
                    selected={selectedUrgency === option.id}
                    onClick={() => setSelectedUrgency(option.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-slate-900">What is happening?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Tap anything that fits. You do not need perfect words.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SITUATION_OPTIONS.map((option) => (
                  <OptionChip
                    key={option.id}
                    option={option}
                    selected={situationTags.includes(option.id)}
                    onClick={() => setSituationTags((prev) => toggleValue(prev, option.id))}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">What do you have access to?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Choose what could realistically help if you needed support quickly.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {ACCESS_OPTIONS.map((option) => (
                    <OptionChip
                      key={option.id}
                      option={option}
                      selected={accessTags.includes(option.id)}
                      onClick={() => setAccessTags((prev) => toggleValue(prev, option.id))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">What makes this harder?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">These barriers help Beacon give more realistic steps.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {BARRIER_OPTIONS.map((option) => (
                    <OptionChip
                      key={option.id}
                      option={option}
                      selected={barrierTags.includes(option.id)}
                      onClick={() => setBarrierTags((prev) => toggleValue(prev, option.id))}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Add details only if they help</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If you are not sure what to type, you can keep these short. The planner already has your guided selections.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Current living situation</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  value={details.livingSituation}
                  onChange={(e) => handleDetailChange('livingSituation', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="living with abuser">Living with the abuser</option>
                  <option value="planning to leave">Planning to leave soon</option>
                  <option value="already left">Already left</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Children details</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  placeholder="For example: one child, age 8 / 例如：一个孩子，8岁"
                  value={details.children}
                  onChange={(e) => handleDetailChange('children', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Transport details</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  placeholder="For example: bus nearby, cousin can drive / 例如：附近有公交，表姐可以开车"
                  value={details.transport}
                  onChange={(e) => handleDetailChange('transport', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Trusted people or support</label>
                <textarea
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  placeholder="For example: aunt nearby, teacher, one close friend / 例如：姨妈在附近，老师，一个可信的朋友"
                  rows={4}
                  value={details.support}
                  onChange={(e) => handleDetailChange('support', e.target.value)}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !selectedUrgency}
                className="flex w-full items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)] transition hover:bg-violet-700 disabled:bg-slate-300"
              >
                {loading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : 'Build my guided plan'}
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-40"
            >
              Back
            </button>
            {step < STEP_LABELS.length - 1 && (
              <button
                type="button"
                disabled={!canMoveForward}
                onClick={() => setStep((prev) => Math.min(STEP_LABELS.length - 1, prev + 1))}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:bg-slate-300"
              >
                Continue
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CheckCircle size={16} className="text-emerald-600" />
              Planner summary
            </div>
            <div className="mt-4 space-y-3">
              {plannerSummary.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <LockKeyhole size={16} className="text-violet-600" />
              Private notes
            </div>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Quietly remember things over time</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These notes can help Beacon make the plan more specific later. In this MVP, they stay only on this device in your browser.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {NOTE_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddNote(suggestion)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                placeholder="For example: He checked my messages today. / 例如：他今天查了我的消息。"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-sm focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleAddNote(newNote)}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <NotebookPen size={15} />
                Save note
              </button>
              {safeNotes.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearNotes}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                >
                  <Trash2 size={15} />
                  Clear notes
                </button>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {safeNotes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  No private notes yet.
                </div>
              ) : (
                safeNotes.map((note) => (
                  <div key={note.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{note.text}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {showPlan && (
        <section className="mx-auto mt-10 max-w-5xl space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">Your plan</p>
                <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
                  <CheckCircle className="text-teal-500" />
                  Guided safety plan ready
                </h2>
              </div>
              <button onClick={() => setShowPlan(false)} className="text-sm font-medium text-slate-500 underline hover:text-violet-600">
                Hide plan
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            {safeNotes.length > 0 && (
              <div className="mb-6 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">Included in this plan</p>
                <p className="mt-1 text-sm text-violet-900">
                  Beacon used {safeNotes.length} saved private note{safeNotes.length > 1 ? 's' : ''} to make this plan more specific.
                </p>
              </div>
            )}
            <div className="prose prose-slate max-w-none">
              <MarkdownRenderer content={plan} />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-medium leading-6 text-amber-900">
              Try to remember the key parts of this plan. If saving it could create risk, avoid storing it in a place someone else can
              easily see. Use only the parts that feel safe and realistic for you.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default SafetyPlanPage;
