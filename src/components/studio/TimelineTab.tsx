import React, { useState } from 'react';
import {
  Clock,
  Activity,
  Sparkles,
  TrendingUp,
  Filter,
  CheckCircle,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TimelineData, TimelineEvent, InfographicMetric } from '../../types';

interface TimelineTabProps {
  data: TimelineData;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  data,
  onRegenerate,
  isGenerating
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const events: TimelineEvent[] = data?.events || [];
  const infographics: InfographicMetric[] = data?.infographics || [];

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-slate-100 overflow-hidden">
      {/* Top Banner / Filter Toolbar */}
      <div className="p-3 border-b border-[#1e2230] bg-[#141720]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-slate-200">
            {data?.timelineTitle || 'Chronological Progression & Milestones'}
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-[#10121a] p-1 rounded-xl border border-[#222738]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Infographics Array + Chronological Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Infographics Stat Cards Array */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            Key Infographics & Benchmark Metrics
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {infographics.map((info, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-gradient-to-br from-[#151825] to-[#12141e] border border-[#22273a] hover:border-violet-500/40 transition-all shadow-md group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-xl group-hover:bg-violet-600/15 transition-all" />

                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>{info.label}</span>
                  <span className="text-emerald-400 font-mono text-[10px]">
                    {info.trend}
                  </span>
                </div>

                <div className="text-xl font-black text-white font-mono my-1 tracking-tight text-violet-200">
                  {info.value}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-1">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chronological Progression Chart Array */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              Chronological Timeline Sequence ({filteredEvents.length} Milestones)
            </span>
            <span className="text-[10px] text-slate-500">
              Interactive historical progression
            </span>
          </div>

          <div className="relative pl-6 md:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-indigo-500 before:to-purple-800">
            {filteredEvents.map((event, idx) => {
              const isSelected = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-950/40 border-violet-500 shadow-md ring-1 ring-violet-500/40'
                      : 'bg-[#141722] border-[#1e2333] hover:bg-[#191d2c] hover:border-[#2f354d]'
                  }`}
                >
                  {/* Timeline Node Bullet */}
                  <div className="absolute -left-6 md:-left-8 top-5 w-4 h-4 rounded-full bg-[#0f1115] border-2 border-violet-500 flex items-center justify-center transform -translate-x-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  </div>

                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-violet-300 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40">
                      {event.epoch}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c2030] text-slate-400 border border-[#272c42]">
                        {event.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          event.impact === 'Critical'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-700/40'
                            : 'bg-indigo-950/40 text-indigo-300 border-indigo-700/40'
                        }`}
                      >
                        {event.impact}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
