import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckSquare,
  Square,
  Plus,
  Eye,
  Trash2,
  FileCheck,
  Sparkles,
  X,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { SourceDocument } from '../types';

interface WorkspaceMiddlePanelProps {
  sources: SourceDocument[];
  onToggleSource: (id: string) => void;
  onToggleAllSources: (select: boolean) => void;
  onAddSource: (source: SourceDocument) => void;
  onDeleteSource: (id: string) => void;
  onPreviewSource: (source: SourceDocument) => void;
}

export const WorkspaceMiddlePanel: React.FC<WorkspaceMiddlePanelProps> = ({
  sources,
  onToggleSource,
  onToggleAllSources,
  onAddSource,
  onDeleteSource,
  onPreviewSource
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [pasteTitle, setPasteTitle] = useState<string>('');
  const [pasteContent, setPasteContent] = useState<string>('');
  const [pasteType, setPasteType] = useState<'pdf' | 'docx' | 'txt' | 'md'>('md');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeSources = sources.filter(s => s.selected);
  const totalActiveWords = activeSources.reduce((acc, curr) => acc + curr.wordCount, 0);

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
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 850;

        const newDoc: SourceDocument = {
          id: `src-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: file.name,
          type,
          wordCount,
          uploadedAt: 'Just now',
          selected: true,
          content: text || `Lecture notes for ${file.name}\n\nIndexed in StudyApex active grounding memory.`,
          keyTakeaways: [
            `Extracted core concepts from ${file.name}.`,
            'Indexed in real-time study context.'
          ]
        };
        onAddSource(newDoc);
      };

      reader.readAsText(file);
    });
  };

  const handleCreatePastedSource = () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;

    const wordCount = pasteContent.trim().split(/\s+/).length;
    const newDoc: SourceDocument = {
      id: `src-${Date.now()}`,
      title: pasteTitle.endsWith(`.${pasteType}`) ? pasteTitle : `${pasteTitle}.${pasteType}`,
      type: pasteType,
      wordCount,
      uploadedAt: 'Just now',
      selected: true,
      content: pasteContent,
      keyTakeaways: [
        `Summary extracted from ${pasteTitle}.`,
        'Active in real-time reasoning context.'
      ]
    };

    onAddSource(newDoc);
    setPasteTitle('');
    setPasteContent('');
    setIsPasteModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0f17] border-r border-[#1a1e2d] text-slate-200 overflow-hidden select-none">
      {/* Middle Panel Header */}
      <div className="p-3.5 border-b border-[#1a1e2d] bg-[#10131e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs font-bold text-white tracking-wide uppercase">
            Workspace & Document Upload
          </h2>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-700/40">
          {sources.length} Documents
        </span>
      </div>

      {/* 1. Drag & Drop Upload Box with "Paste Notes" Action Link */}
      <div className="p-3.5 border-b border-[#1a1e2d] bg-[#0f121d]">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-950/30 scale-[1.01] shadow-lg glow-violet-sm'
              : 'border-[#22273a] bg-[#131624] hover:border-violet-500/50 hover:bg-[#161a2b]'
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

          <UploadCloud
            className={`w-7 h-7 mx-auto mb-1.5 transition-colors ${
              isDragging ? 'text-violet-400 animate-bounce' : 'text-slate-400'
            }`}
          />

          <h3 className="text-xs font-semibold text-slate-200">
            Drag & drop study documents
          </h3>

          <p className="text-[11px] text-slate-400 mt-0.5">
            PDF, TXT, DOCX, Markdown
          </p>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400">or</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPasteModalOpen(true);
              }}
              className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2 transition"
            >
              Paste Notes
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scrollable List of Uploaded Sources showing checked items */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span>Uploaded Sources ({sources.length})</span>
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

        {/* Source Items */}
        {sources.map(doc => {
          const isSelected = doc.selected;
          const isPdf = doc.type === 'pdf';
          const isMd = doc.type === 'md';
          const isDocx = doc.type === 'docx';

          return (
            <div
              key={doc.id}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#151928] border-violet-500/40 shadow-sm'
                  : 'bg-[#11131e] border-[#1c2030] opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Checked/Unchecked Toggle */}
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

                {/* Document Information */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onPreviewSource(doc)}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-slate-100 truncate hover:text-violet-300 transition">
                      {doc.title.replace(/\.(pdf|docx|txt|md)$/i, '')}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-[#1e2336] text-violet-300 uppercase border border-[#272f48]">
                      {doc.type}
                    </span>
                  </div>

                  {/* Active word counters: 4,658 words, 5,248 words, etc. */}
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-mono text-emerald-400 font-semibold">
                      {doc.wordCount.toLocaleString()} words
                    </span>
                    <span>•</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onPreviewSource(doc)}
                    title="Preview Document Text"
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
          <div className="text-center py-10 border border-dashed border-[#22273a] rounded-xl p-4 text-xs text-slate-500">
            No study documents uploaded. Use the upload tray above or paste lecture notes.
          </div>
        )}
      </div>

      {/* 3. Active Grounding Context Summary at Bottom */}
      <div className="p-3.5 border-t border-[#1a1e2d] bg-[#0e111a]">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>Active Grounding Context:</span>
          </span>
          <span className="font-mono font-bold text-violet-300">
            {activeSources.length} of {sources.length} Sources selected
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Total Grounded Words:</span>
          <span className="text-emerald-400 font-semibold">
            {totalActiveWords.toLocaleString()} words
          </span>
        </div>
      </div>

      {/* Paste Notes Modal */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141d] border border-[#222738] rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222738] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-400" />
                Paste Lecture Notes into Workspace
              </h3>
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Source Name</label>
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="e.g. Advanced Bioenergetics Handout"
                  className="w-full bg-[#0d0e14] border border-[#222738] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Note Content</label>
                <textarea
                  rows={6}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Paste text notes, outlines, formulas, or summaries..."
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
                      onClick={() => setPasteType(t)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition ${
                        pasteType === t ? 'bg-violet-600 text-white font-bold' : 'bg-[#1a1e2d] text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasteModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] text-xs text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePastedSource}
                    disabled={!pasteTitle.trim() || !pasteContent.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-xs font-semibold text-white shadow-md transition"
                  >
                    Add Document
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
