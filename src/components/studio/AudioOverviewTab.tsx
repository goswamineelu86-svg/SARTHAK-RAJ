import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Sparkles,
  Headphones,
  User,
  Check,
  FastForward
} from 'lucide-react';
import { AudioOverviewData, AudioSegment } from '../../types';

interface AudioOverviewTabProps {
  data: AudioOverviewData;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const AudioOverviewTab: React.FC<AudioOverviewTabProps> = ({
  data,
  onRegenerate,
  isGenerating
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // References for speech synthesis and timers
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const segmentProgressInterval = useRef<any>(null);
  const segmentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const segments = data?.segments || [];
  const currentSegment = segments[currentSegmentIndex] || segments[0];

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (segmentProgressInterval.current) {
        clearInterval(segmentProgressInterval.current);
      }
    };
  }, []);

  // Handle Speech Synthesis Playback
  const playSegment = (index: number) => {
    if (!window.speechSynthesis || segments.length === 0) return;

    window.speechSynthesis.cancel();
    if (index >= segments.length) {
      setIsPlaying(false);
      setCurrentSegmentIndex(0);
      return;
    }

    const seg = segments[index];
    setCurrentSegmentIndex(index);

    // Auto-scroll to active segment
    if (segmentRefs.current[index]) {
      segmentRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const utterance = new SpeechSynthesisUtterance(seg.text);
    utterance.rate = playbackSpeed;

    // Pitch differentiation for co-hosts
    if (seg.speaker.includes('Evelyn')) {
      utterance.pitch = 1.15; // Crisp, analytical slightly higher pitch
    } else {
      utterance.pitch = 0.95; // Deeper, conversational tone
    }

    // Try finding good browser voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (seg.speaker.includes('Evelyn')) {
        const femaleVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira')));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male') || v.name.includes('George')));
        if (maleVoice) utterance.voice = maleVoice;
      }
    }

    utterance.onend = () => {
      if (index + 1 < segments.length) {
        playSegment(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentSegmentIndex(0);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      playSegment(currentSegmentIndex);
    }
  };

  const handleSkipBack = () => {
    const prev = Math.max(0, currentSegmentIndex - 1);
    playSegment(prev);
  };

  const handleSkipForward = () => {
    const next = Math.min(segments.length - 1, currentSegmentIndex + 1);
    playSegment(next);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      playSegment(currentSegmentIndex);
    }
  };

  const handleExportTranscript = () => {
    const transcriptText = segments
      .map(s => `[${s.timestamp}] ${s.speaker} (${s.emotion}):\n${s.text}\n`)
      .join('\n');
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyApex-Audio-Overview-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTranscript = () => {
    const transcriptText = segments
      .map(s => `[${s.timestamp}] ${s.speaker}: ${s.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(transcriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Estimate progress
  const progressPercent = segments.length > 0 ? ((currentSegmentIndex + 1) / segments.length) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-slate-100 overflow-hidden">
      {/* Top Banner / Episode Header */}
      <div className="p-4 border-b border-[#1e2230] bg-[#141720]/80 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                <Headphones className="w-3 h-3 text-violet-400" />
                Two-Host Deep Dive
              </span>
              <span className="text-xs text-slate-400">
                {segments.length} dialogue turns • ~{Math.round(data?.durationSeconds / 60 || 4)} min
              </span>
            </div>
            <h2 className="text-base font-semibold text-white tracking-tight leading-snug">
              {data?.title || 'Interactive Study Audio Overview'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {data?.summary}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopyTranscript}
              title="Copy Transcript"
              className="p-1.5 rounded-lg bg-[#1a1e2b] hover:bg-[#252a3d] border border-[#232738] text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleExportTranscript}
              title="Export Transcript"
              className="p-1.5 rounded-lg bg-[#1a1e2b] hover:bg-[#252a3d] border border-[#232738] text-slate-300 hover:text-white transition text-xs"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Co-Host Badges */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1e2230]/60">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#181c28] border border-violet-500/30 text-xs text-violet-200">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-semibold text-violet-300">Dr. Evelyn Vance</span>
            <span className="text-[10px] text-slate-400">Deep Dive Analyst</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#181c28] border border-indigo-500/30 text-xs text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-semibold text-indigo-300">Leo Miller</span>
            <span className="text-[10px] text-slate-400">Curious Synthesizer</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Audio Player Station */}
      <div className="px-4 py-3.5 border-b border-[#1e2230] bg-[#11131a]">
        <div className="flex items-center justify-between gap-4 mb-2">
          {/* Currently speaking indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 h-5 px-2 bg-violet-950/40 border border-violet-600/30 rounded-md">
              <span className={`w-1 h-3 rounded-full bg-violet-400 ${isPlaying ? 'animate-wave-1' : ''}`} />
              <span className={`w-1 h-4 rounded-full bg-violet-400 ${isPlaying ? 'animate-wave-2' : ''}`} />
              <span className={`w-1 h-2 rounded-full bg-violet-400 ${isPlaying ? 'animate-wave-3' : ''}`} />
              <span className={`w-1 h-5 rounded-full bg-violet-400 ${isPlaying ? 'animate-wave-4' : ''}`} />
              <span className={`w-1 h-3 rounded-full bg-violet-400 ${isPlaying ? 'animate-wave-5' : ''}`} />
            </div>

            <div className="text-xs">
              <span className="text-slate-400">Speaking: </span>
              <span className="font-medium text-violet-300">
                {currentSegment?.speaker || 'Ready to start'}
              </span>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#171a25] p-0.5 rounded-lg border border-[#222738] text-[11px]">
            {[1.0, 1.25, 1.5].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-0.5 rounded font-mono transition ${
                  playbackSpeed === speed
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed === 1.0 ? '1x' : `${speed}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Scrub Bar */}
        <div className="w-full bg-[#1e2333] h-2 rounded-full overflow-hidden cursor-pointer relative group">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Player Transport Controls */}
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[11px] font-mono text-slate-400">
            {currentSegment?.timestamp || '0:00'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkipBack}
              disabled={currentSegmentIndex === 0}
              className="p-1.5 rounded-full hover:bg-[#1f2434] text-slate-300 hover:text-white transition disabled:opacity-40"
              title="Previous Turn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center glow-violet shadow-lg transition transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={handleSkipForward}
              disabled={currentSegmentIndex === segments.length - 1}
              className="p-1.5 rounded-full hover:bg-[#1f2434] text-slate-300 hover:text-white transition disabled:opacity-40"
              title="Next Turn"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {segments[segments.length - 1]?.timestamp || '3:35'}
          </span>
        </div>
      </div>

      {/* Transcript Dialogue Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold px-1 flex items-center justify-between">
          <span>Dual-Host Interactive Transcript</span>
          <span>Click any turn to listen</span>
        </div>

        {segments.map((segment, idx) => {
          const isHostA = segment.speaker.includes('Evelyn');
          const isCurrent = idx === currentSegmentIndex;

          return (
            <div
              key={idx}
              ref={el => {
                segmentRefs.current[idx] = el;
              }}
              onClick={() => playSegment(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#181a28] border-violet-500 shadow-md glow-violet-sm ring-1 ring-violet-500/40'
                  : 'bg-[#13151e] border-[#1d2130] hover:bg-[#171924] hover:border-[#2a2f45]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isHostA
                        ? 'bg-violet-900/60 text-violet-300 border border-violet-500/40'
                        : 'bg-indigo-900/60 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {isHostA ? 'EV' : 'LM'}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-semibold ${
                        isHostA ? 'text-violet-300' : 'text-indigo-300'
                      }`}
                    >
                      {segment.speaker}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1c2030] text-slate-400 border border-[#272c42]">
                    {segment.emotion}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {segment.timestamp}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed pl-8">
                {segment.text}
              </p>

              {segment.keyTakeaway && (
                <div className="mt-2.5 ml-8 px-2 py-1 rounded bg-[#1a1e2c] border border-violet-500/20 text-[11px] text-violet-300/90 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-violet-400 shrink-0" />
                  <span>{segment.keyTakeaway}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
