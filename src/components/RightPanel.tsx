import React, { useState } from 'react';
import {
  MessageSquare,
  Headphones,
  GitFork,
  Presentation,
  CheckCircle2,
  Clock,
  Table as TableIcon,
  Sparkles,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import {
  StudioTab,
  AudioOverviewData,
  MindMapData,
  SlideDeckData,
  QuizData,
  TimelineData,
  TableFaqData,
  QuizAttempt,
  SourceDocument,
  ChatMessage
} from '../types';
import { AudioOverviewTab } from './studio/AudioOverviewTab';
import { MindMapTab } from './studio/MindMapTab';
import { SlideDeckTab } from './studio/SlideDeckTab';
import { QuizEngineTab } from './studio/QuizEngineTab';
import { TimelineTab } from './studio/TimelineTab';
import { DataTablesFaqTab } from './studio/DataTablesFaqTab';
import { MainCenter } from './MainCenter';

interface RightPanelProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  audioData: AudioOverviewData;
  mindMapData: MindMapData;
  slideDeckData: SlideDeckData;
  quizData: QuizData;
  timelineData: TimelineData;
  tableFaqData: TableFaqData;
  historicalAttempts: QuizAttempt[];
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
  onRegenerateTab: (tab: StudioTab, focusPrompt?: string) => Promise<void>;
  isGenerating: boolean;
  activeSources: SourceDocument[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isSendingMessage: boolean;
  onClearChat: () => void;
  onPreviewSource: (source: SourceDocument) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  activeTab,
  onTabChange,
  audioData,
  mindMapData,
  slideDeckData,
  quizData,
  timelineData,
  tableFaqData,
  historicalAttempts,
  onSaveQuizAttempt,
  onRegenerateTab,
  isGenerating,
  activeSources,
  messages,
  onSendMessage,
  isSendingMessage,
  onClearChat,
  onPreviewSource
}) => {
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  const [customFocusPrompt, setCustomFocusPrompt] = useState<string>('');

  // Primary 5 tabs as requested: Workspace Chat, Audio Overview, Mind Map, Slide Deck, Quiz
  const tabConfigs = [
    { id: 'chat' as StudioTab, label: 'Workspace Chat', icon: MessageSquare, badge: 'Grounded' },
    { id: 'audio' as StudioTab, label: 'Audio Overview', icon: Headphones, badge: 'Deep Dive' },
    { id: 'mindmap' as StudioTab, label: 'Mind Map', icon: GitFork, badge: 'Tree' },
    { id: 'slides' as StudioTab, label: 'Slide Deck', icon: Presentation, badge: 'Narration' },
    { id: 'quiz' as StudioTab, label: 'Quiz', icon: CheckCircle2, badge: 'Live Keys' },
  ];

  const handleTriggerRegenerate = async () => {
    if (activeTab === 'chat') return;
    await onRegenerateTab(activeTab, customFocusPrompt);
    setShowPromptInput(false);
    setCustomFocusPrompt('');
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0d14] overflow-hidden">
      {/* Top Header & Feature Navigation Bar */}
      <div className="p-3 border-b border-[#1a1e2d] bg-[#0e111a]">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500/50" />
            <h1 className="text-xs font-bold text-white tracking-wide uppercase">
              Studio Feature Engine
            </h1>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-950/80 text-violet-300 font-mono border border-violet-800/40">
              gemini-3.5-flash
            </span>
          </div>

          {/* Quick Regenerate & Focus Trigger */}
          {activeTab !== 'chat' && (
            <button
              onClick={() => setShowPromptInput(!showPromptInput)}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-lg bg-[#161a29] hover:bg-[#202538] border border-[#24293c] text-[11px] text-violet-300 flex items-center gap-1.5 transition disabled:opacity-40"
            >
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>{isGenerating ? 'Synthesizing...' : 'Re-generate'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Custom Focus Prompt Flyout */}
        {showPromptInput && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-[#151928] border border-violet-500/30 animate-fadeIn space-y-2">
            <span className="text-[11px] text-slate-300 font-medium block">
              Direct Gemini Focus for <strong className="text-violet-300">{activeTab}</strong>:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customFocusPrompt}
                onChange={(e) => setCustomFocusPrompt(e.target.value)}
                placeholder="e.g. 'Focus on cellular bioenergetics and ATP yields'..."
                className="flex-1 bg-[#0f1118] border border-[#232738] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTriggerRegenerate();
                }}
              />
              <button
                onClick={handleTriggerRegenerate}
                disabled={isGenerating}
                className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
              >
                Run
              </button>
            </div>
          </div>
        )}

        {/* Top Navigation Bar: Workspace Chat, Audio Overview, Mind Map, Slide Deck, Quiz */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {tabConfigs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-violet-950/70 border-violet-500 text-white shadow-md glow-violet-sm'
                    : 'bg-[#131624] border-[#1d2234] text-slate-400 hover:bg-[#181d2c] hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-violet-600 text-white font-mono ml-0.5">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Tab Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-[#0b0d14]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">
              Gemini 3.5 Flash Synthesis in Progress
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Analyzing active sources ({activeSources.length} files) to structure the {activeTab} engine...
            </p>
          </div>
        )}

        {/* Tab 1: Workspace Chat */}
        {activeTab === 'chat' && (
          <MainCenter
            messages={messages}
            onSendMessage={onSendMessage}
            isSending={isSendingMessage}
            activeSources={activeSources}
            onClearChat={onClearChat}
            onPreviewSource={onPreviewSource}
          />
        )}

        {/* Tab 2: Audio Overview (Deep Dive Podcast Feature Module) */}
        {activeTab === 'audio' && (
          <AudioOverviewTab
            data={audioData}
            onRegenerate={() => onRegenerateTab('audio')}
            isGenerating={isGenerating}
          />
        )}

        {/* Tab 3: Mind Map */}
        {activeTab === 'mindmap' && (
          <MindMapTab
            data={mindMapData}
            onRegenerate={() => onRegenerateTab('mindmap')}
            isGenerating={isGenerating}
          />
        )}

        {/* Tab 4: Slide Deck */}
        {activeTab === 'slides' && (
          <SlideDeckTab
            data={slideDeckData}
            onRegenerate={() => onRegenerateTab('slides')}
            isGenerating={isGenerating}
          />
        )}

        {/* Tab 5: Quiz & Exam */}
        {activeTab === 'quiz' && (
          <QuizEngineTab
            data={quizData}
            onRegenerate={() => onRegenerateTab('quiz')}
            isGenerating={isGenerating}
            historicalAttempts={historicalAttempts}
            onSaveAttempt={onSaveQuizAttempt}
          />
        )}

        {/* Timeline (accessible if triggered) */}
        {activeTab === 'timeline' && (
          <TimelineTab
            data={timelineData}
            onRegenerate={() => onRegenerateTab('timeline')}
            isGenerating={isGenerating}
          />
        )}

        {/* Data Tables & FAQ (accessible if triggered) */}
        {activeTab === 'tables_faq' && (
          <DataTablesFaqTab
            data={tableFaqData}
            onRegenerate={() => onRegenerateTab('tables_faq')}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};
