import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Presentation,
  Copy,
  Check,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';
import { SlideDeckData, Slide } from '../../types';

interface SlideDeckTabProps {
  data: SlideDeckData;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const SlideDeckTab: React.FC<SlideDeckTabProps> = ({
  data,
  onRegenerate,
  isGenerating
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const slides = data?.slides || [];
  const currentSlide: Slide | undefined = slides[currentSlideIndex];

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length, isFullscreen]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsNarrating(false);
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsNarrating(false);
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleToggleNarration = () => {
    if (!currentSlide || !window.speechSynthesis) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSlide.voiceNarration);
      utterance.rate = 1.0;
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      window.speechSynthesis.speak(utterance);
      setIsNarrating(true);
    }
  };

  const handleCopyOutline = () => {
    let outline = `# ${data?.deckTitle || 'Lecture Deck'}\n\n`;
    slides.forEach(s => {
      outline += `## Slide ${s.slideNumber}: ${s.title}\n`;
      outline += `_${s.subtitle}_\n\n`;
      s.bullets.forEach(b => {
        outline += `- ${b}\n`;
      });
      outline += `\n**Voice Narration:**\n> "${s.voiceNarration}"\n\n---\n\n`;
    });
    navigator.clipboard.writeText(outline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`h-full flex flex-col bg-[#0f1115] text-slate-100 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#0a0c10]' : ''}`}>
      {/* Top Deck Header & Toolbar */}
      <div className="p-3 border-b border-[#1e2230] bg-[#141720]/80 backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Presentation className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-slate-200">
            {data?.deckTitle || 'Study Presentation Slides'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-900/40 text-violet-300 border border-violet-600/40 font-mono">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyOutline}
            title="Copy Deck Outline"
            className="px-2.5 py-1 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[11px] text-slate-300 flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-400" />}
            <span>Copy Deck</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Present Fullscreen'}
            className="px-2.5 py-1 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[11px] text-slate-300 flex items-center gap-1 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-violet-400" /> : <Maximize2 className="w-3.5 h-3.5 text-violet-400" />}
            <span>{isFullscreen ? 'Exit' : 'Present'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        {/* Left Thumbnails Strip (desktop) */}
        {!isFullscreen && (
          <div className="w-full md:w-44 overflow-y-auto space-y-2 pr-1 border-r border-[#1e2230]/60 hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">
              Slides ({slides.length})
            </span>
            {slides.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsNarrating(false);
                  setCurrentSlideIndex(idx);
                }}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  idx === currentSlideIndex
                    ? 'bg-violet-950/40 border-violet-500 shadow-sm ring-1 ring-violet-500/50'
                    : 'bg-[#141722] border-[#1e2333] hover:bg-[#1a1e2d]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Slide {slide.slideNumber}</span>
                  <span className="text-violet-400 font-mono">0{slide.slideNumber}</span>
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-2">
                  {slide.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Center Main Slide Canvas */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {currentSlide ? (
            <div className="flex-1 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#131622] to-[#10121a] border border-[#222738] shadow-2xl relative overflow-hidden">
              {/* Subtle Violet Radial Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Slide Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#222738] pb-4 mb-5">
                  <div>
                    <span className="text-xs font-mono font-semibold text-violet-400 tracking-wider uppercase">
                      {currentSlide.subtitle}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
                      {currentSlide.title}
                    </h2>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1e2234] text-violet-300 border border-violet-500/30 shrink-0">
                    {currentSlide.slideNumber} / {slides.length}
                  </span>
                </div>

                {/* Bullets & Visuals Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-2">
                  {/* Bullets List */}
                  <div className="lg:col-span-2 space-y-3">
                    {currentSlide.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 group">
                        <span className="w-2 h-2 rounded-full bg-violet-400 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                        <p className="text-sm text-slate-200 leading-relaxed font-normal">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Key Visual Callout Box */}
                  {currentSlide.keyVisual && (
                    <div className="p-4 rounded-xl bg-[#171b29] border border-violet-500/30 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold mb-2">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{currentSlide.keyVisual.title}</span>
                        </div>
                        <div className="text-2xl font-black text-white tracking-tight font-mono my-2 text-violet-200">
                          {currentSlide.keyVisual.value}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 border-t border-[#232738] pt-2 mt-2">
                        {currentSlide.keyVisual.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Structural Voice Narration String */}
              <div className="mt-6 p-4 rounded-xl bg-[#10121a] border border-[#212638] relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-violet-400" />
                      Structural Voice Narration String
                    </span>
                  </div>

                  <button
                    onClick={handleToggleNarration}
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      isNarrating
                        ? 'bg-rose-900/60 text-rose-200 border border-rose-500/40'
                        : 'bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40'
                    }`}
                  >
                    {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isNarrating ? 'Stop Voice' : 'Read Voice Narration'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed pl-3 border-l-2 border-violet-500">
                  "{currentSlide.voiceNarration}"
                </p>
              </div>

              {/* Slide Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1e2333]">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] disabled:opacity-30 text-xs text-slate-300 flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => {
                        if (window.speechSynthesis) window.speechSynthesis.cancel();
                        setIsNarrating(false);
                        setCurrentSlideIndex(dotIdx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        dotIdx === currentSlideIndex
                          ? 'w-6 bg-violet-400'
                          : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-xs text-white font-medium flex items-center gap-1 transition shadow"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No presentation slides generated yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
