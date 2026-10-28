import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Check,
  Eye,
  Trash2,
  Key,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Plus,
  FileCheck,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Info,
  X
} from 'lucide-react';
import { SourceDocument } from '../types';

interface LeftPanelProps {
  sources: SourceDocument[];
  onToggleSource: (id: string) => void;
  onToggleAllSources: (select: boolean) => void;
  onAddSource: (source: SourceDocument) => void;
  onDeleteSource: (id: string) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  hasEnvKey: boolean;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  sources,
  onToggleSource,
  onToggleAllSources,
  onAddSource,
  onDeleteSource,
  apiKey,
  onSaveApiKey,
  hasEnvKey
}) => {
  const [keyInput, setKeyInput] = useState<string>(apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [keySavedNotification, setKeySavedNotification] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<SourceDocument | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Source form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newType, setNewType] = useState<'pdf' | 'docx' | 'txt' | 'md'>('md');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeSources = sources.filter(s => s.selected);
  const totalActiveWords = activeSources.reduce((acc, curr) => acc + curr.wordCount, 0);

  const handleSaveKey = () => {
    onSaveApiKey(keyInput.trim());
    setKeySavedNotification(true);
    setTimeout(() => setKeySavedNotification(false), 2500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase();
      const type: 'pdf' | 'docx' | 'txt' | 'md' =
        ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : ext === 'md' ? 'md' : 'txt';

      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 650;

        const newDoc: SourceDocument = {
          id: `src-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: file.name,
          type,
          wordCount,
          uploadedAt: 'Just now',
          selected: true,
          content: text || `Content from ${file.name}\n\nKey academic notes uploaded into StudyApex workspace.`,
          keyTakeaways: [
            `Extracted core concepts from ${file.name}.`,
            'Included in active context grounding for all studio tools.'
          ]
        };
        onAddSource(newDoc);
      };

      reader.readAsText(file);
    });
  };

  const handleCreateCustomSource = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const wordCount = newContent.trim().split(/\s+/).length;
    const newDoc: SourceDocument = {
      id: `src-${Date.now()}`,
      title: newTitle.endsWith(`.${newType}`) ? newTitle : `${newTitle}.${newType}`,
      type: newType,
      wordCount,
      uploadedAt: 'Just now',
      selected: true,
      content: newContent,
      keyTakeaways: [
        `Summary extracted from ${newTitle}.`,
        'Active in real-time Gemini reasoning context.'
      ]
    };

    onAddSource(newDoc);
    setNewTitle('');
    setNewContent('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1115] border-r border-[#1e2230] text-slate-200 overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-3.5 border-b border-[#1e2230] bg-[#12141c] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center glow-violet-sm shadow-md">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">StudyApex</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-950/60 text-violet-300 font-mono border border-violet-800/40">
                Core
              </span>
            </div>
            <p className="text-[10px] text-slate-400">NotebookLM Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-600/30 text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* 1. Active Gemini API Key Text Box Area */}
      <div className="p-3 border-b border-[#1e2230] bg-[#131620]/60">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-violet-400" />
            <span>Gemini API Key</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {apiKey ? (
              <span className="text-violet-400 font-semibold">Custom Key</span>
            ) : hasEnvKey ? (
              <span className="text-emerald-400">Env Connected</span>
            ) : (
              <span className="text-amber-400">Auto-Simulated</span>
            )}
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type={showKey ? 'text' : 'password'}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={hasEnvKey ? 'Environment key active (optional override)' : 'Paste your GEMINI_API_KEY...'}
            className="w-full bg-[#0d0e14] border border-[#232738] rounded-lg pl-2.5 pr-16 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveKey();
            }}
          />

          <div className="absolute right-1 flex items-center gap-1">
            <button
              onClick={() => setShowKey(!showKey)}
              title={showKey ? 'Hide key' : 'Show key'}
              className="p-1 text-slate-400 hover:text-slate-200 transition"
            >
              {showKey ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleSaveKey}
              className="px-2 py-0.5 rounded bg-violet-600 hover:bg-violet-500 text-white font-medium text-[11px] shadow-sm transition"
            >
              {keySavedNotification ? <Check className="w-3 h-3 text-white" /> : 'Set'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
          <span>Target Model: <strong>gemini-3.8-flash</strong></span>
          {apiKey && (
            <button
              onClick={() => {
                setKeyInput('');
                onSaveApiKey('');
              }}
              className="text-slate-400 hover:text-rose-400 transition underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. Functional Drag-and-Drop Document Upload Tray Mockup */}
      <div className="p-3 border-b border-[#1e2230] bg-[#11131c]">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-950/30 scale-[1.02] shadow-lg glow-violet-sm'
              : 'border-[#24293c] bg-[#141724]/70 hover:border-violet-500/50 hover:bg-[#181c2c]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.md,.docx"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <UploadCloud className={`w-6 h-6 mx-auto mb-1.5 transition-colors ${isDragging ? 'text-violet-400' : 'text-slate-400'}`} />
          <h4 className="text-xs font-semibold text-slate-200">
            Drag & drop study documents
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            PDF, TXT, DOCX, Markdown • Instant word counter
          </p>

          <div className="flex items-center justify-center gap-2 mt-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-md bg-[#1e2334] hover:bg-violet-900/40 border border-[#2b3149] hover:border-violet-500/50 text-[10px] text-violet-300 font-medium flex items-center gap-1 transition"
            >
              <Plus className="w-3 h-3" />
              <span>Paste Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Upload Status Tracking List Showing Files with Active Word Counters */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span>Sources ({sources.length})</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleAllSources(true)}
              className="text-[10px] text-violet-400 hover:text-violet-300"
            >
              Select All
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => onToggleAllSources(false)}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Source Cards */}
        {sources.map(doc => {
          const isSelected = doc.selected;

          return (
            <div
              key={doc.id}
              className={`p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#151825] border-violet-500/40 shadow-sm'
                  : 'bg-[#12141d] border-[#1d2130] opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <button
                  onClick={() => onToggleSource(doc.id)}
                  className="mt-0.5 text-violet-400 hover:text-violet-300 shrink-0"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 fill-violet-950 text-violet-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-slate-200 truncate hover:text-violet-300 transition">
                      {doc.title}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-[#1d2232] text-violet-300 uppercase border border-[#272d42]">
                      {doc.type}
                    </span>
                  </div>

                  {/* Active Word Counter & Time */}
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="font-mono text-emerald-400 font-semibold">
                      {doc.wordCount.toLocaleString()} words
                    </span>
                    <span>•</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    title="Preview Document"
                    className="p-1 rounded hover:bg-[#202538] text-slate-400 hover:text-slate-200 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSource(doc.id)}
                    title="Remove Source"
                    className="p-1 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sources.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-[#222738] rounded-xl p-4">
            No study sources uploaded. Drag & drop notes above or paste curriculum text.
          </div>
        )}
      </div>

      {/* Footer Grounding Context Counter Status */}
      <div className="p-3 border-t border-[#1e2230] bg-[#12141c]">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>Active Grounding Context:</span>
          </span>
          <span className="font-mono font-bold text-violet-300">
            {activeSources.length} of {sources.length} Sources
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Total Grounded Words:</span>
          <span className="text-emerald-400 font-semibold">{totalActiveWords.toLocaleString()} words</span>
        </div>
      </div>

      {/* Source Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141d] border border-[#222738] rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#222738] flex items-center justify-between bg-[#151824]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-sm">
                  {previewDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg hover:bg-[#202538] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 border-b border-[#202538] pb-2">
                <span>Format: <strong>{previewDoc.type.toUpperCase()}</strong></span>
                <span>•</span>
                <span>Word Count: <strong className="text-emerald-400">{previewDoc.wordCount.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Added: <strong>{previewDoc.uploadedAt}</strong></span>
              </div>

              {previewDoc.keyTakeaways && previewDoc.keyTakeaways.length > 0 && (
                <div className="p-3 rounded-xl bg-[#171a28] border border-violet-500/30">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    Key Grounded Takeaways
                  </span>
                  <ul className="space-y-1 text-xs text-slate-200 list-disc list-inside">
                    {previewDoc.keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="leading-relaxed">{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Source Content
                </span>
                <div className="p-3 rounded-xl bg-[#0c0d12] border border-[#1e2334] text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto">
                  {previewDoc.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paste Notes / Add Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141d] border border-[#222738] rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222738] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-400" />
                Add Study Notes to Grounding Context
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Organic Chemistry Stereoisomers Notes"
                  className="w-full bg-[#0d0e14] border border-[#222738] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes Content</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste lecture transcript, reading excerpt, or formulas here..."
                  className="w-full bg-[#0d0e14] border border-[#222738] rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Type:</span>
                  {(['md', 'txt', 'pdf', 'docx'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition ${
                        newType === t ? 'bg-violet-600 text-white font-bold' : 'bg-[#1a1e2d] text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] text-xs text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateCustomSource}
                    disabled={!newTitle.trim() || !newContent.trim()}
                    className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-xs font-semibold text-white shadow-md transition"
                  >
                    Add to Sources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
