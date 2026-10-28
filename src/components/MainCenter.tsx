import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ChatMessage, SourceDocument } from '../types';

interface MainCenterProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  activeSources: SourceDocument[];
  onClearChat: () => void;
  onPreviewSource: (source: SourceDocument) => void;
}

export const MainCenter: React.FC<MainCenterProps> = ({
  messages,
  onSendMessage,
  isSending,
  activeSources,
  onClearChat,
  onPreviewSource
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [readingMessageId, setReadingMessageId] = useState<string | null>(null);
  const [citationPopup, setCitationPopup] = useState<{
    sourceIndex: number;
    title: string;
    excerpt: string;
    sourceObj?: SourceDocument;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Dynamic chip actions requested by user:
  const chipActions = [
    { label: '✨ Summarize these sources', prompt: 'Summarize the core concepts and interconnections across all my active sources.' },
    { label: '🔑 What are the key terms?', prompt: 'What are the essential high-yield key terms and definitions in these sources?' },
    { label: '❓ Give me 5 practice questions', prompt: 'Give me 5 practice questions with detailed answer keys based on these sources.' },
    { label: '🧠 Conceptual breakdown', prompt: 'Create a conceptual breakdown linking the fundamental mechanisms described in the materials.' },
    { label: '⚖️ Compare contrasting theories', prompt: 'Compare and contrast the distinct operational paradigms across the active documents.' }
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Handle Speech Reader for assistant replies
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (readingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setReadingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for smoother speech
      const cleanText = text.replace(/[*#_`\[\]]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.onend = () => setReadingMessageId(null);
      utterance.onerror = () => setReadingMessageId(null);
      window.speechSynthesis.speak(utterance);
      setReadingMessageId(msgId);
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;
    setInputText('');
    await onSendMessage(trimmed);
  };

  const handleChipClick = async (prompt: string) => {
    if (isSending) return;
    await onSendMessage(prompt);
  };

  // Helper to render message text and turn bracketed citation numbers [1], [2] into interactive pills
  const renderMessageContent = (text: string) => {
    // Split text by markdown headings, boldings, and citation patterns
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const sourceNum = parseInt(match[1], 10);
        const sourceDoc = activeSources[sourceNum - 1];

        return (
          <button
            key={index}
            onClick={() => {
              if (sourceDoc) {
                setCitationPopup({
                  sourceIndex: sourceNum,
                  title: sourceDoc.title,
                  excerpt: sourceDoc.keyTakeaways?.[0] || sourceDoc.content.slice(0, 200) + '...',
                  sourceObj: sourceDoc
                });
              }
            }}
            className="inline-flex items-center mx-1 px-1.5 py-0.2 rounded-md bg-violet-950/80 hover:bg-violet-900 border border-violet-500/50 text-[11px] font-mono font-bold text-violet-300 transition hover:scale-105 shadow-sm"
            title={`View citation for Source [${sourceNum}]: ${sourceDoc?.title || 'Active Document'}`}
          >
            [{sourceNum}]
          </button>
        );
      }

      // Render standard markdown lines
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#090a0f] text-slate-100 overflow-hidden relative">
      {/* Top Workspace Header Bar */}
      <div className="p-3 border-b border-[#1e2230] bg-[#0f1116]/90 backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold text-white">Workspace Chat</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              Grounded in <strong className="text-violet-300">{activeSources.length} sources</strong>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {activeSources.slice(0, 3).map((s, idx) => (
              <span
                key={s.id}
                onClick={() => onPreviewSource(s)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#181c28] border border-[#24293c] text-slate-300 truncate max-w-[140px] cursor-pointer hover:border-violet-500/40"
              >
                [{idx + 1}] {s.title}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearChat}
            title="Clear Chat History"
            className="px-2 py-1 rounded-lg bg-[#151824] hover:bg-[#1d2232] border border-[#222738] text-[11px] text-slate-400 hover:text-slate-200 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Citation Inspector Floating Flyout */}
      {citationPopup && (
        <div className="absolute top-12 left-4 right-4 z-30 p-3.5 rounded-xl bg-[#141724] border border-violet-500/50 shadow-2xl backdrop-blur-lg animate-fadeIn flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
              {citationPopup.sourceIndex}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Source Grounding: {citationPopup.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-950 text-violet-300 font-mono">
                  Grounded Citation
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">
                "{citationPopup.excerpt}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {citationPopup.sourceObj && (
              <button
                onClick={() => {
                  onPreviewSource(citationPopup.sourceObj!);
                  setCitationPopup(null);
                }}
                className="px-2 py-1 rounded-lg bg-[#1e2334] hover:bg-[#282f46] text-xs text-violet-300 font-medium transition"
              >
                Full Doc
              </button>
            )}
            <button
              onClick={() => setCitationPopup(null)}
              className="px-2 py-1 rounded-lg text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Dialogue Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* NotebookLM Style Source Overview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12141f] to-[#0f1118] border border-violet-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white">
              StudyApex Notebook Grounding Active
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            All responses are synthesized directly from your active sources (
            <span className="text-violet-300 font-medium">
              {activeSources.map(s => s.title).join(', ')}
            </span>
            ). Use bracketed citations like <span className="font-mono text-violet-400">[1]</span> to inspect grounded passages, or click the chips below to jumpstart your study session.
          </p>
        </div>

        {/* Message Stream */}
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          const isReading = readingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} group`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md text-white mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 transition-all ${
                  isUser
                    ? 'bg-violet-600 text-white rounded-tr-none shadow-md'
                    : 'bg-[#131622] border border-[#202538] text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-3 mb-2 border-b border-[#22273a] pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-violet-300">StudyApex Co-Pilot</span>
                      {msg.usedRealModel && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-violet-950 text-violet-300 font-mono border border-violet-800/40">
                          gemini-3.8-flash
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleToggleSpeech(msg.id, msg.text)}
                        title={isReading ? 'Stop Reading' : 'Read Aloud'}
                        className="p-1 rounded hover:bg-[#202538] text-slate-400 hover:text-white transition"
                      >
                        {isReading ? <VolumeX className="w-3.5 h-3.5 text-violet-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        title="Copy message"
                        className="p-1 rounded hover:bg-[#202538] text-slate-400 hover:text-white transition"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-xs md:text-sm leading-relaxed space-y-1.5">
                  {renderMessageContent(msg.text)}
                </div>

                <div
                  className={`text-[10px] mt-2 font-mono ${
                    isUser ? 'text-violet-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#1e2334] border border-[#2c334a] flex items-center justify-center shrink-0 text-slate-300 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 shadow-md text-white animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#131622] border border-violet-500/30 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>Grounding across active sources with Gemini 3.8 Flash...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Anchored Input Line with Dynamic Instant Chip Selectors */}
      <div className="p-3 md:p-4 border-t border-[#1e2230] bg-[#0c0e14] space-y-2.5">
        {/* Dynamic Instant Chip Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {chipActions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.prompt)}
              disabled={isSending}
              className="px-2.5 py-1 rounded-full bg-[#151824] hover:bg-[#1e2336] border border-[#24293c] hover:border-violet-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm flex items-center gap-1 disabled:opacity-50 active:scale-95"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Text Box Input Area */}
        <div className="relative flex items-center bg-[#141724] border border-[#23283c] focus-within:border-violet-500 rounded-2xl p-1.5 transition-all shadow-lg focus-within:shadow-violet-950/20">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeSources.length === 0
                ? 'Upload sources on the left to start grounded inquiry...'
                : `Ask StudyApex anything about your ${activeSources.length} sources...`
            }
            className="w-full bg-transparent border-0 px-3 py-1.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-32"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md glow-violet-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>Shift + Enter for new line • Enter to submit</span>
          <span className="font-mono text-violet-400">
            {activeSources.length} active documents selected
          </span>
        </div>
      </div>
    </div>
  );
};
