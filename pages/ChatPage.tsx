import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertTriangle, Mic, MicOff, Volume2, PhoneOff, Phone, Signal, Battery } from 'lucide-react';
import { sendSupportMessage } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ChatMessage } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { useLocation } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  
  // Text Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello. I am Beacon. I'm here to listen without judgment. Everything you say here is private to your device. I can help you find official government resources or just listen. How can I support you today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Chat State (Phone Call Simulation)
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<number | null>(null);
  
  // Audio Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for auto-start trigger from Disguise mode
  useEffect(() => {
    if (location.state && location.state.autoStartVoice) {
      setActiveTab('voice');
      // Slight delay to ensure render is complete before asking for mic
      setTimeout(() => {
        startVoiceSession();
      }, 500);
    }
  }, [location]);

  // --- Text Chat Logic ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendSupportMessage(history, userMessage.text);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm listening. Please tell me more."
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Voice Chat Logic (Gemini Live) ---

  // Helper for Audio PCM Blob creation
  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      // Clamp values
      const s = Math.max(-1, Math.min(1, data[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return {
      data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  // Helper for Base64 decoding
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startVoiceSession = async () => {
    setLiveError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLiveConnected(true);
            startTimer();
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (isMuted) return; 
              
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64Audio && outputAudioContextRef.current) {
              setIsPlayingAudio(true);
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                audioSourcesRef.current.delete(source);
                if (audioSourcesRef.current.size === 0) {
                  setIsPlayingAudio(false);
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
               stopAllAudio();
            }
          },
          onclose: () => {
            setIsLiveConnected(false);
            cleanupVoiceSession();
          },
          onerror: (e) => {
            console.error("Live API Error", e);
            setLiveError("Call failed. Retrying...");
            cleanupVoiceSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "You are 'Sarah', a supportive friend. The user is likely in a difficult situation. Speak calmly, briefly, and supportively. Do not sound robotic. If they are silent, just wait or ask 'Are you there?'. Focus on listening.",
        },
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start voice session", err);
      setLiveError("Microphone access denied.");
    }
  };

  const startTimer = () => {
    setCallDuration(0);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stopAllAudio = () => {
     for (const source of audioSourcesRef.current.values()) {
        source.stop();
        audioSourcesRef.current.delete(source);
     }
     nextStartTimeRef.current = 0;
     setIsPlayingAudio(false);
  };

  const cleanupVoiceSession = () => {
    stopAllAudio();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    setIsLiveConnected(false);
    sessionPromiseRef.current = null;
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  useEffect(() => {
    return () => {
      cleanupVoiceSession();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Tab Switcher */}
      <div className="bg-white border-b border-slate-200 px-4">
        <div className="flex gap-6">
          <button 
            onClick={() => { if(isLiveConnected) cleanupVoiceSession(); setActiveTab('text'); }}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'text' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Text Chat
          </button>
          <button 
            onClick={() => setActiveTab('voice')}
            className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'voice' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Safe Call <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full">SOS</span>
          </button>
        </div>
      </div>

      {activeTab === 'text' && (
        <div className="bg-amber-50 border-b border-amber-100 p-2 text-center text-xs text-amber-800 flex items-center justify-center gap-2">
          <AlertTriangle size={14} />
          <span>Chat history is not saved on server. Clear local browser history after use.</span>
        </div>
      )}

      {/* --- TEXT MODE --- */}
      {activeTab === 'text' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-violet-600' : 'bg-teal-600'}`}>
                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-violet-600 text-white rounded-tr-none' 
                      : msg.isError 
                        ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-none'
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className={msg.isError ? '' : 'prose-sm'}>
                         <MarkdownRenderer content={msg.text} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="flex flex-row gap-3">
                   <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                     <Bot size={16} className="text-white" />
                   </div>
                   <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-t border-slate-200 p-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent max-h-32"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- VOICE MODE (PHONE UI) --- */}
      {activeTab === 'voice' && (
        <div className="flex-1 flex flex-col bg-gray-900 relative overflow-hidden text-white">
          
          {/* Status Bar Simulation */}
          <div className="flex justify-between px-6 py-3 text-gray-400 text-sm">
            <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <div className="flex gap-2">
              <Signal size={16} />
              <Battery size={16} />
            </div>
          </div>

          {/* Main Call Interface */}
          <div className="flex-1 flex flex-col items-center justify-center z-10">
            <div className={`w-32 h-32 rounded-full mb-6 flex items-center justify-center transition-all duration-1000 ${isLiveConnected && isPlayingAudio ? 'bg-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'bg-gray-800'}`}>
               <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-600 flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
               </div>
            </div>
            
            <h2 className="text-3xl font-medium text-white mb-2">Sarah</h2>
            <p className="text-gray-400 text-lg mb-12">
              {isLiveConnected ? formatTime(callDuration) : (liveError ? "Call Failed" : "Ready to call...")}
            </p>
            
            {liveError && (
              <div className="mb-6 text-red-400 text-sm">
                {liveError}
              </div>
            )}

            {/* Controls */}
            <div className="w-full max-w-xs px-8">
              {!isLiveConnected ? (
                 <div className="flex justify-center">
                   <button
                      onClick={startVoiceSession}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    >
                      <Phone size={36} fill="currentColor" />
                    </button>
                 </div>
              ) : (
                <div className="grid grid-cols-2 gap-8 justify-items-center">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleToggleMute}
                      className={`rounded-full w-16 h-16 flex items-center justify-center transition-colors ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-700/50 text-white hover:bg-gray-700'}`}
                    >
                      {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
                    </button>
                    <span className="text-xs text-gray-400">Mute</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={cleanupVoiceSession}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    >
                      <PhoneOff size={32} fill="currentColor" />
                    </button>
                    <span className="text-xs text-gray-400">End</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Subtle background noise visualizer or gradient */}
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;