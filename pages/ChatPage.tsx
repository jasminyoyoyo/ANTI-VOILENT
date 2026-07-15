import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  Battery,
  Bot,
  ChevronRight,
  ExternalLink,
  Link2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Send,
  Shield,
  Signal,
  Sparkles,
  User,
} from 'lucide-react';
import { getCurrentAiProviderLabel, sendRoutedSupportMessage } from '../services/aiRouter';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ChatMessage, RoutingResult } from '../types';
import { Link } from 'react-router-dom';

const SUGGESTED_PROMPTS = [
  'I need a safe first step.',
  "I'm scared to leave.",
  'I am not sure if this is abuse.',
  'I need help for a friend.',
  'How can I stay safer tonight?',
  'What should I prepare before leaving?',
];

const WELCOME_MESSAGE =
  "Hello. I'm Beacon. You can start small here. You do not need to explain everything at once. This chat is designed to feel discreet, but messages may be processed by AI services to generate a response. If you are in immediate danger in Australia, call 000.";

const ChatPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: WELCOME_MESSAGE,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestRouting, setLatestRouting] = useState<RoutingResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (location.state && location.state.autoStartVoice) {
      setActiveTab('voice');
      setTimeout(() => {
        startVoiceSession();
      }, 500);
    }
  }, [location]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await sendRoutedSupportMessage(history, userMessage.text);
      setLatestRouting(response.routing);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm listening. Please tell me more.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setLatestRouting(null);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. If it feels safer, try again in a moment or move to the safety plan page for practical next steps.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(inputText);
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    if (isLoading) return;
    setInputText(prompt);
    await sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceSession = async () => {
    setLiveError(null);
    setLiveError(
      getCurrentAiProviderLabel() === 'gemini'
        ? 'Voice mode is temporarily unavailable in this build. Text AI is configured, but live voice needs a dedicated Gemini voice implementation.'
        : 'Voice mode is not migrated to Xiaomi MiMo yet. Text AI support is ready first.'
    );
  };

  const startTimer = () => {
    setCallDuration(0);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = window.setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanupVoiceSession = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setIsLiveConnected(false);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      cleanupVoiceSession();
    };
  }, []);

  const showIntro = messages.length === 1 && messages[0]?.text === WELCOME_MESSAGE;
  const showCrisisCard = latestRouting && (latestRouting.riskLevel === 'high' || latestRouting.riskLevel === 'imminent');

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4">
        <div className="flex gap-6">
          <button
            onClick={() => {
              if (isLiveConnected) cleanupVoiceSession();
              setActiveTab('text');
            }}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'text' ? 'border-beacon-500 text-beacon-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Text Support
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'voice' ? 'border-beacon-500 text-beacon-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Safe Call <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700">SOS</span>
          </button>
        </div>
      </div>

      {activeTab === 'text' && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
            <AlertTriangle size={14} />
            <span>For safety, avoid sharing identifying details if you can. Clear browser history after use only if that is safe for you.</span>
          </div>
        </div>
      )}

      {activeTab === 'text' && (
        <>
          <div className="flex-1 overflow-y-auto">
            {showIntro && (
              <div className="border-b border-slate-200 bg-gradient-to-br from-beacon-50 via-white to-sky-50 px-4 py-8">
                <div className="mx-auto max-w-5xl">
                  <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-beacon-100 bg-white/90 px-3 py-1.5 text-sm font-medium text-beacon-600 shadow-sm">
                        <Sparkles size={15} />
                        Calm, private first steps
                      </div>
                      <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                        You do not have to tell the whole story
                        <span className="block text-beacon-500">to get support.</span>
                      </h1>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                        Beacon can help you think through options, name what is happening, and decide on a safer next step. This is support
                        guidance, not emergency response.
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Shield size={16} className="text-beacon-500" />
                            Good for first steps
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Ask what to do next, how to stay safer tonight, or how to support a friend.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <AlertTriangle size={16} className="text-rose-600" />
                            In immediate danger
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            If you are at immediate risk, threatened, or injured, call <span className="font-semibold text-rose-700">000</span>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-medium text-beacon-600">
                        <ChevronRight size={15} />
                        Suggested ways to start
                      </div>
                      <div className="mt-4 grid gap-3">
                        {SUGGESTED_PROMPTS.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handleSuggestedPrompt(prompt)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-beacon-100 hover:bg-beacon-50 hover:text-beacon-600"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mx-auto max-w-5xl space-y-6 p-4">
              {showCrisisCard && (
                <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 text-rose-600" size={20} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Crisis mode</p>
                      <h3 className="mt-2 text-xl font-bold text-rose-900">
                        {latestRouting?.riskLevel === 'imminent' ? 'Immediate safety risk detected' : 'High safety risk detected'}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-rose-900">
                        Beacon is switching to a safety-first response. Human support may help more than AI right now.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href="tel:000"
                          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          <Phone size={15} />
                          Call 000
                        </a>
                        <a
                          href="tel:1800737732"
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                        >
                          <Phone size={15} />
                          Call 1800RESPECT
                        </a>
                        <a
                          href="https://www.1800respect.org.au/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                        >
                          <ExternalLink size={15} />
                          Connect to human
                        </a>
                        <Link
                          to="/safety-plan"
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                        >
                          <Shield size={15} />
                          Safety plan now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[88%] gap-3 md:max-w-[72%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        msg.role === 'user' ? 'bg-beacon-500' : 'bg-teal-600'
                      }`}
                    >
                      {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                    </div>
                    <div
                      className={`rounded-2xl p-4 shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-tr-none bg-beacon-500 text-white'
                          : msg.isError
                            ? 'rounded-tl-none border border-red-200 bg-red-50 text-red-800'
                            : 'rounded-tl-none border border-slate-100 bg-white text-slate-800'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div className={msg.isError ? '' : 'prose-sm'}>
                          <MarkdownRenderer content={msg.text} />
                        </div>
                      )}

                      {showCrisisCard && msg.id === messages[messages.length - 1]?.id && msg.role === 'model' && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-rose-100 pt-4">
                          <a
                            href="tel:000"
                            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                          >
                            <Phone size={14} />
                            Emergency support
                          </a>
                          <a
                            href="tel:1800737732"
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                          >
                            <Phone size={14} />
                            Connect to human
                          </a>
                          <Link
                            to="/safety-plan"
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                          >
                            <Link2 size={14} />
                            Safety plan now
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex flex-row gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mx-auto max-w-5xl">
              {showCrisisCard && (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Human escalation available</p>
                      <p className="mt-1 text-sm text-rose-900">Use one of these options now if AI is not enough for the situation.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="tel:000"
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                      >
                        <Phone size={14} />
                        Call 000
                      </a>
                      <a
                        href="tel:1800737732"
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                      >
                        <Phone size={14} />
                        1800RESPECT
                      </a>
                      <Link
                        to="/safety-plan"
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                      >
                        <Shield size={14} />
                        Safety plan now
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {!showIntro && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:border-beacon-100 hover:bg-beacon-50 hover:text-beacon-600"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="max-h-32 flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-beacon-500"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className="flex items-center justify-center rounded-xl bg-beacon-500 px-4 text-white transition-colors hover:bg-beacon-600 disabled:bg-slate-300"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'voice' && (
        <div className="relative flex flex-1 flex-col overflow-hidden bg-gray-900 text-white">
          <div className="flex justify-between px-6 py-3 text-sm text-gray-400">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex gap-2">
              <Signal size={16} />
              <Battery size={16} />
            </div>
          </div>

          <div className="z-10 flex flex-1 flex-col items-center justify-center">
            <div
              className={`mb-6 flex h-32 w-32 items-center justify-center rounded-full transition-all duration-1000 ${
                isLiveConnected ? 'bg-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'bg-gray-800'
              }`}
            >
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-gray-700 bg-gray-600">
                <User size={64} className="text-gray-400" />
              </div>
            </div>

            <h2 className="mb-2 text-3xl font-medium text-white">Support line</h2>
            <p className="mb-4 max-w-sm px-6 text-center text-sm leading-6 text-gray-400">
              Voice mode is intended as a fast-access support surface, but it still needs a dedicated live audio implementation in this build.
            </p>
            <p className="mb-12 text-lg text-gray-400">{isLiveConnected ? formatTime(callDuration) : liveError ? 'Call unavailable' : 'Ready to call...'}</p>

            {liveError && <div className="mb-6 max-w-md px-6 text-center text-sm text-red-400">{liveError}</div>}

            <div className="w-full max-w-xs px-8">
              {!isLiveConnected ? (
                <div className="flex justify-center">
                  <button
                    onClick={startVoiceSession}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-600"
                  >
                    <Phone size={36} fill="currentColor" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 justify-items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleToggleMute}
                      className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                        isMuted ? 'bg-white text-gray-900' : 'bg-gray-700/50 text-white hover:bg-gray-700'
                      }`}
                    >
                      {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
                    </button>
                    <span className="text-xs text-gray-400">Mute</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={cleanupVoiceSession}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-600"
                    >
                      <PhoneOff size={32} fill="currentColor" />
                    </button>
                    <span className="text-xs text-gray-400">End</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 h-64 w-full bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
