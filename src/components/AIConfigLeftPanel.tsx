import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Presentation,
  CheckCircle2,
  Clock,
  Table as TableIcon,
  Send,
  Zap,
  Sliders,
  Check,
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  Headphones,
  GitFork
} from 'lucide-react';
import { StudioTab } from '../types';

interface AIConfigLeftPanelProps {
  onSelectFeatureTab?: (tab: StudioTab) => void;
  onExecutePromptCommand?: (prompt: string) => void;
  activeModelName?: string;
  onModelChange?: (model: string) => void;
}

export const AIConfigLeftPanel: React.FC<AIConfigLeftPanelProps> = ({
  onSelectFeatureTab,
  onExecutePromptCommand,
  activeModelName = 'Gemini 3.5 Flash',
  onModelChange
}) => {
  const [promptText, setPromptText] = useState<string>('');
  const [recentCommandStatus, setRecentCommandStatus] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string>('slide_deck');

  const features = [
    {
      id: 'slide_deck',
      tabKey: 'slides' as StudioTab,
      name: 'Slide Deck Tab',
      icon: Presentation,
      color: 'text-violet-400',
      badge: 'Visual Slides',
      description: 'Outputs individual presentation slide structures complete with core slide bullets and structural voice narration strings.'
    },
    {
      id: 'quiz_exam',
      tabKey: 'quiz' as StudioTab,
      name: 'Quiz & Exam Engine',
      icon: CheckCircle2,
      color: 'text-indigo-400',
      badge: 'Interactive Mock Test',
      description: 'A fully working mock test platform allowing users to select answer options, receive immediate evaluation feedback keys, and track historical results score metrics.'
    },
    {
      id: 'timeline_infographics',
      tabKey: 'timeline' as StudioTab,
      name: 'Timeline & Infographics Tab',
      icon: Clock,
      color: 'text-purple-400',
      badge: 'Milestone Progress',
      description: 'Maps textual events chronologically in a visual progress chart array.'
    },
    {
      id: 'data_tables_faq',
      tabKey: 'tables_faq' as StudioTab,
      name: 'Data Tables & FAQ Tab',
      icon: TableIcon,
      color: 'text-cyan-400',
      badge: 'Comparative Matrix',
      description: 'Compiles source insights into clear scannable column layouts and matching question-and-answer accordions.'
    }
  ];

  const handleSendPrompt = () => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    if (onExecutePromptCommand) {
      onExecutePromptCommand(trimmed);
    }

    setRecentCommandStatus(`Configured: "${trimmed.slice(0, 32)}${trimmed.length > 32 ? '...' : ''}"`);
    setPromptText('');
    setTimeout(() => {
      setRecentCommandStatus(null);
    }, 4000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0d13] border-r border-[#1a1e2d] text-slate-200 overflow-hidden select-none">
      {/* Branding Header */}
      <div className="p-4 border-b border-[#1a1e2d] bg-[#0e111a] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-950/50 glow-violet-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">StudyApex</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800/50">
                CONFIG
              </span>
            </div>
            <p className="text-[10px] text-slate-400">NotebookLM Educational Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-600/30 text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ready</span>
        </div>
      </div>

      {/* 1. AI Configuration Panel (Active Model: Gemini 3.5 Flash) */}
      <div className="p-3.5 border-b border-[#1a1e2d] bg-[#10131d]/70">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            AI Model Configuration
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Status: Online</span>
        </div>

        {/* Active Model Card */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#141724] to-[#121520] border border-violet-500/30 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span className="text-xs font-bold text-white font-mono tracking-tight">
                {activeModelName}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-700/40 font-semibold">
              Active Model
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Multi-modal reasoning engine grounding complex curricular queries directly into active uploaded documents with sub-second synthesis.
          </p>

          <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-[#1e2334] text-[10px] text-slate-400 font-mono">
            <span>Context: <strong>1M Tokens</strong></span>
            <span>•</span>
            <span>Temperature: <strong>0.7</strong></span>
            <span>•</span>
            <span className="text-violet-300 font-semibold">Grounding: ON</span>
          </div>
        </div>
      </div>

      {/* 2. Section Defining Features: Slide Deck, Quiz & Exam, Timeline & Infographics, Data Tables & FAQ */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Engine Feature Definitions
          </span>
          <span className="text-[10px] text-slate-500">Click to switch</span>
        </div>

        {features.map(feat => {
          const Icon = feat.icon;
          const isSelected = selectedFeature === feat.id;

          return (
            <div
              key={feat.id}
              onClick={() => {
                setSelectedFeature(feat.id);
                if (onSelectFeatureTab) {
                  onSelectFeatureTab(feat.tabKey);
                }
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-[#151928] border-violet-500 shadow-md glow-violet-sm ring-1 ring-violet-500/40'
                  : 'bg-[#11141e] border-[#1c2030] hover:bg-[#161a27] hover:border-[#282f45]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-[#1a1f30] ${feat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-violet-300 transition">
                    {feat.name}
                  </h4>
                </div>

                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#1a1e2d] text-slate-300 border border-[#242a3e]">
                  {feat.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status toast if command submitted */}
      {recentCommandStatus && (
        <div className="mx-3.5 mb-1 px-3 py-1.5 rounded-lg bg-violet-950/80 border border-violet-500/40 text-[11px] text-violet-300 flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{recentCommandStatus}</span>
        </div>
      )}

      {/* 3. Bottom Prompt Input Area */}
      <div className="p-3.5 border-t border-[#1a1e2d] bg-[#0d0f17]">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-300">
            <Zap className="w-3 h-3 text-violet-400" />
            AI Prompt & Adaptation Line
          </span>
          <span className="text-[10px] text-slate-500">Live Agent Input</span>
        </div>

        <div className="relative flex items-center bg-[#131622] border border-[#22273a] focus-within:border-violet-500 rounded-xl p-1 transition-all shadow-md focus-within:shadow-violet-950/30">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendPrompt();
            }}
            placeholder="Make changes, add new features, ask for anything"
            className="w-full bg-transparent border-0 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            onClick={handleSendPrompt}
            disabled={!promptText.trim()}
            title="Execute configuration prompt"
            className="w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition shadow-sm active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-0.5">
          <span>Active Framework: <strong>AI Studio</strong></span>
          <span className="text-violet-400/80 font-mono">Press Enter</span>
        </div>
      </div>
    </div>
  );
};
