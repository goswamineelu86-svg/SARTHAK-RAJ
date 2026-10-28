import React, { useState } from 'react';
import {
  Table as TableIcon,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Filter,
  Sparkles
} from 'lucide-react';
import { TableFaqData, FaqItem, TableRow } from '../../types';

interface DataTablesFaqTabProps {
  data: TableFaqData;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const DataTablesFaqTab: React.FC<DataTablesFaqTabProps> = ({
  data,
  onRegenerate,
  isGenerating
}) => {
  const [tableSearch, setTableSearch] = useState<string>('');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-3': true
  });
  const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);

  const columns: string[] = data?.columns || [];
  const rows: TableRow[] = data?.rows || [];
  const faqs: FaqItem[] = data?.faqs || [];

  // Filter rows
  const filteredRows = tableSearch.trim() === ''
    ? rows
    : rows.filter(r =>
        Object.values(r).some(val =>
          val.toLowerCase().includes(tableSearch.toLowerCase())
        )
      );

  // Filter FAQs
  const filteredFaqs = faqSearch.trim() === ''
    ? faqs
    : faqs.filter(f =>
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(faqSearch.toLowerCase())
      );

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllFaqs = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    faqs.forEach(f => {
      next[f.id] = expand;
    });
    setExpandedFaqs(next);
  };

  const handleCopyFaq = (faq: FaqItem) => {
    navigator.clipboard.writeText(`Q: ${faq.question}\n\nA: ${faq.answer}\nSource: ${faq.sourceRef}`);
    setCopiedFaqId(faq.id);
    setTimeout(() => setCopiedFaqId(null), 2000);
  };

  const handleExportCsv = () => {
    if (columns.length === 0 || rows.length === 0) return;
    const header = columns.join(',');
    const csvRows = rows.map(r => {
      return columns.map((_, colIdx) => `"${(r[`col${colIdx}`] || '').replace(/"/g, '""')}"`).join(',');
    });
    const csvContent = [header, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyApex-Data-Matrix-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-slate-100 overflow-hidden">
      {/* Scrollable Container with both Table and FAQ sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* SECTION 1: Comparative Data Table */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {data?.tableTitle || 'Comparative Technical Data Matrix'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter table rows..."
                  className="bg-[#11131c] border border-[#222738] rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                onClick={handleExportCsv}
                title="Download CSV"
                className="px-2.5 py-1 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[11px] text-slate-300 flex items-center gap-1 transition"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-[#222738] overflow-hidden bg-[#13151f] shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#181b28] border-b border-[#252b40] text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                    {columns.map((col, cIdx) => (
                      <th key={cIdx} className="py-3 px-3.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2333]">
                  {filteredRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-[#191d2c] transition-colors group"
                    >
                      {columns.map((_, cIdx) => {
                        const cellVal = row[`col${cIdx}`] || '';
                        const isFirst = cIdx === 0;

                        return (
                          <td
                            key={cIdx}
                            className={`py-3 px-3.5 leading-relaxed ${
                              isFirst
                                ? 'font-semibold text-violet-200 whitespace-nowrap'
                                : 'text-slate-300'
                            }`}
                          >
                            {cellVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRows.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs">
                No matching rows found in matrix.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Matching Q&A Accordions */}
        <div className="space-y-3 pt-4 border-t border-[#1e2230]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-violet-400" />
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Matching Study Question-and-Answer Accordions
                </h3>
                <span className="text-[11px] text-slate-400">
                  Grounded high-yield conceptual inquiries
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search FAQ questions..."
                  className="bg-[#11131c] border border-[#222738] rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                onClick={() => toggleAllFaqs(true)}
                className="px-2 py-1 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[10px] text-slate-300"
              >
                Expand All
              </button>
              <button
                onClick={() => toggleAllFaqs(false)}
                className="px-2 py-1 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-[10px] text-slate-300"
              >
                Collapse
              </button>
            </div>
          </div>

          {/* Accordion Cards */}
          <div className="space-y-2.5">
            {filteredFaqs.map(faq => {
              const isExpanded = !!expandedFaqs[faq.id];
              const isCopied = copiedFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? 'bg-[#151724] border-violet-500/40 shadow-sm'
                      : 'bg-[#12141e] border-[#1e2333] hover:bg-[#171a26]'
                  }`}
                >
                  <div
                    onClick={() => toggleFaq(faq.id)}
                    className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-800/40 font-mono mt-0.5 shrink-0">
                        {faq.category}
                      </span>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-100 leading-snug">
                        {faq.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyFaq(faq);
                        }}
                        title="Copy Q&A"
                        className="p-1 rounded hover:bg-[#23283c] text-slate-400 hover:text-slate-200 transition"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <div className="p-1 rounded text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-[#1e2334] animate-fadeIn">
                      <p className="text-xs text-slate-300 leading-relaxed pl-1">
                        {faq.answer}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-[#1e2334]/60 pt-2">
                        <span className="flex items-center gap-1 text-violet-300/80">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                          Source Grounding: {faq.sourceRef}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
