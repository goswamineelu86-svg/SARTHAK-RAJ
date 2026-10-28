import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Search,
  Maximize2,
  Minimize2,
  BookOpen,
  Plus,
  Copy,
  Check,
  Lightbulb,
  Code2,
  GraduationCap
} from 'lucide-react';
import { MindMapData, MindMapNode } from '../../types';

interface MindMapTabProps {
  data: MindMapData;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const MindMapTab: React.FC<MindMapTabProps> = ({
  data,
  onRegenerate,
  isGenerating
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-core': true,
    'cat-bio': true,
    'cat-quantum': true,
    'cat-macro': true
  });
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isAddingConcept, setIsAddingConcept] = useState<boolean>(false);
  const [newConceptName, setNewConceptName] = useState<string>('');
  const [newConceptNotes, setNewConceptNotes] = useState<string>('');
  const [newConceptFormula, setNewConceptFormula] = useState<string>('');

  const root = data?.root;

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allIds: Record<string, boolean> = {};
    const traverse = (node: MindMapNode) => {
      allIds[node.id] = true;
      if (node.children) node.children.forEach(traverse);
    };
    if (root) traverse(root);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes({ [root?.id || 'root']: true });
  };

  const handleCopyMarkdown = () => {
    if (!root) return;
    let md = `# ${root.name}\n\n${root.description || ''}\n\n`;
    const traverseMd = (node: MindMapNode, depth: number) => {
      const indent = '  '.repeat(depth);
      md += `${indent}- **${node.name}** ${node.badge ? `\`[${node.badge}]\`` : ''}\n`;
      if (node.notes) md += `${indent}  - Notes: ${node.notes}\n`;
      if (node.formula) md += `${indent}  - Formula: \`${node.formula}\`\n`;
      if (node.examTip) md += `${indent}  - Exam Tip: 💡 ${node.examTip}\n`;
      if (node.children) {
        node.children.forEach(child => traverseMd(child, depth + 1));
      }
    };
    if (root.children) {
      root.children.forEach(child => traverseMd(child, 0));
    }
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render node recursively
  const renderNode = (node: MindMapNode, depth: number = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const isMatch =
      searchQuery.trim() !== '' &&
      (node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.notes && node.notes.toLowerCase().includes(searchQuery.toLowerCase())));

    return (
      <div key={node.id} className="relative">
        <div
          onClick={() => setSelectedNode(node)}
          className={`group flex items-start gap-2 py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
            isSelected
              ? 'bg-violet-950/40 border-violet-500 shadow-md ring-1 ring-violet-500/40'
              : isMatch
              ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/30'
              : 'bg-[#141722] border-[#1e2333] hover:bg-[#1a1e2d] hover:border-violet-500/30'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Expand/Collapse Toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-1 rounded hover:bg-[#252b40] text-slate-400 hover:text-slate-200 mt-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          ) : (
            <div className="w-5.5 h-5.5 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium ${depth === 0 ? 'text-violet-300 font-bold text-sm' : depth === 1 ? 'text-slate-100 font-semibold' : 'text-slate-200'}`}>
                {node.name}
              </span>

              {node.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-violet-900/40 text-violet-300 border border-violet-700/40">
                  {node.badge}
                </span>
              )}
            </div>

            {node.summary && depth <= 1 && (
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {node.summary}
              </p>
            )}

            {node.notes && depth >= 2 && (
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                {node.notes}
              </p>
            )}
          </div>
        </div>

        {/* Children branch rendering */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 pl-2 border-l border-violet-500/20 ml-3">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-slate-100 overflow-hidden">
      {/* Controls & Search Toolbar */}
      <div className="p-3 border-b border-[#1e2230] bg-[#141720]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, formulas, notes..."
            className="w-full bg-[#11131c] border border-[#222738] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={expandAll}
            title="Expand All"
            className="px-2 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[11px] text-slate-300 flex items-center gap-1 transition"
          >
            <Maximize2 className="w-3 h-3 text-violet-400" />
            <span>Expand</span>
          </button>

          <button
            onClick={collapseAll}
            title="Collapse All"
            className="px-2 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[11px] text-slate-300 flex items-center gap-1 transition"
          >
            <Minimize2 className="w-3 h-3 text-slate-400" />
            <span>Collapse</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            title="Export Markdown"
            className="px-2 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[11px] text-slate-300 flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-violet-400" />}
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Tree + Right Study Note Inspector */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Hierarchical Tree Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 border-r border-[#1e2230]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              Hierarchical Study Tree
            </span>
            <span className="text-[10px] text-slate-500">
              Select node for deep study details
            </span>
          </div>

          {root ? (
            renderNode(root, 0)
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              No mind map structure available.
            </div>
          )}
        </div>

        {/* Selected Node Granular Inspector */}
        <div className="w-full md:w-[320px] bg-[#12141d] p-4 overflow-y-auto border-t md:border-t-0 border-[#1e2230] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Concept Deep Study Note
              </h3>
            </div>

            {selectedNode ? (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3 rounded-xl bg-[#171a25] border border-violet-500/30">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-violet-200">
                      {selectedNode.name}
                    </span>
                    {selectedNode.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-600/40 font-mono">
                        {selectedNode.badge}
                      </span>
                    )}
                  </div>
                  {selectedNode.summary && (
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {selectedNode.summary}
                    </p>
                  )}
                </div>

                {selectedNode.notes && (
                  <div className="p-3 rounded-xl bg-[#151722] border border-[#212638]">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                      Granular Mechanism Notes
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedNode.notes}
                    </p>
                  </div>
                )}

                {selectedNode.formula && (
                  <div className="p-3 rounded-xl bg-[#151722] border border-[#212638]">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      Governing Equation / Formula
                    </div>
                    <div className="p-2 rounded bg-[#0d0e14] border border-[#232738] font-mono text-xs text-emerald-300 break-all">
                      {selectedNode.formula}
                    </div>
                  </div>
                )}

                {selectedNode.examTip && (
                  <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30">
                    <div className="text-[11px] font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      High-Yield Exam Strategy
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedNode.examTip}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl border border-dashed border-[#232738] text-slate-500 text-xs">
                <Layers className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                Select any concept node in the tree to inspect granular formulas, study notes, and exam tips.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e2230]">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Branch Coverage</span>
              <span className="font-mono text-violet-300 font-semibold">100% Grounded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
