/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

// Declarations for external PDF.js library loaded via index.html
declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

interface SourceDoc {
  n: number;
  title: string;
  text: string;
  on: boolean;
}

interface ChatMsg {
  r: 'u' | 'a';
  t: string;
  live?: boolean;
  err?: boolean;
  retrievedChunks?: any[];
  ragMetrics?: {
    totalChunksInCorpus?: number;
    chunksRetrieved?: number;
    topScore?: number;
    latencyMs?: number;
  };
}

interface StudioItem {
  k: string;
  title: string;
  icon: string;
  html: string;
  raw: string;
  d?: any;
  lines?: Array<{ host: string; text: string }>;
  i?: number;   // active index for slides/flashcards
  f?: boolean;  // flip state for flashcards
  qi?: number;  // active quiz question index
  sc?: number;  // quiz score
  pk?: number;  // selected option in quiz (-1 = none)
  err?: boolean;
}

const SAMPLE_TEXT = `Photosynthesis is the process by which green plants make food using sunlight. It takes place mainly in the chloroplasts, which contain a green pigment called chlorophyll. Chlorophyll absorbs light energy from the Sun and uses it to convert carbon dioxide and water into glucose. Oxygen is released as a by-product of photosynthesis through tiny pores called stomata. The roots absorb water from the soil, and the xylem carries this water up to the leaves. Carbon dioxide enters the leaf through the stomata from the air. The glucose produced is either used for energy or stored as starch in the plant. Photosynthesis is essential for life on Earth because it supplies oxygen and forms the base of every food chain.`;

const PALETTE = ['#e03131', '#f08c00', '#2f9e44', '#1c7ed6', '#7048e8', '#d6336c'];

const ICONS: Record<string, string> = {
  audio: '🎧',
  slides: '🖼️',
  video: '🎬',
  mind: '🧠',
  report: '📄',
  flash: '🗂️',
  quiz: '❓',
  info: '📊',
  table: '📋',
  brief: '📄',
  study: '🎓',
  faq: '❓',
  time: '⏱️',
  note: '📝'
};

const LABELS: Record<string, string> = {
  audio: 'Audio Overview',
  slides: 'Slide Deck',
  video: 'Video Overview',
  mind: 'Mind Map',
  report: 'Reports',
  flash: 'Flashcards',
  quiz: 'Quiz',
  info: 'Infographic',
  table: 'Data Table',
  brief: 'Briefing Doc',
  study: 'Study Guide',
  faq: 'FAQ',
  time: 'Timeline',
  note: 'Saved note'
};

const SVG_PATHS: Record<string, string> = {
  audio: 'M5 10v4M9 6v12M13 9v6M17 4v16',
  slides: 'M3 5h18v14H3zM10 5v14',
  video: 'M3 7h12v10H3zM15 11l6-3v8l-6-3',
  mind: 'M3 12h5M8 12l6-6h6M8 12l6 6h6',
  report: 'M6 3h9l4 4v14H6zM9 12h7M9 16h7',
  flash: 'M8 7h12v13H8zM4 4h12',
  quiz: 'M3 4h18v16H3zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.7M12 17v.01',
  info: 'M5 20V10M11 20V4M17 20v-7',
  table: 'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14'
};

const JSON_PROMPTS: Record<string, string> = {
  audio: `TASK: Write a friendly two-host podcast script (hosts Alex and Sam) explaining the key ideas for a class 10 student. 12-16 lines, each under 40 words, accurate to the sources, no citations. Return ONLY JSON: {"lines":[{"host":"Alex","text":"..."}]}`,
  mind: `TASK: Build a mind map. Return ONLY JSON: {"title":"central topic","branches":[{"name":"branch","points":["2-4 short points"]}]} with 4-6 branches.`,
  slides: `TASK: Create a slide deck of 6-8 slides. Return ONLY JSON: {"slides":[{"title":"","bullets":["2-4 short bullets"],"narration":"2 sentences a narrator would say"}]}`,
  video: `TASK: Create a slide deck of 6-8 slides. Return ONLY JSON: {"slides":[{"title":"","bullets":["2-4 short bullets"],"narration":"2 sentences a narrator would say"}]}`,
  flash: `TASK: Create 10 flashcards. Return ONLY JSON: {"cards":[{"front":"term or question","back":"short answer"}]}`,
  quiz: `TASK: Create a 6-question multiple-choice quiz. Return ONLY JSON: {"questions":[{"q":"","options":["A","B","C","D"],"answer":0,"why":"one-sentence explanation"}]} where answer is the index (0-3) of the correct option.`,
  info: `TASK: Design an infographic. Return ONLY JSON: {"title":"","tagline":"","stats":[{"value":"short number or word","label":""}],"sections":[{"icon":"one emoji","heading":"","text":"one sentence"}],"steps":["ordered short steps if the topic is a process, otherwise an empty list"],"terms":["6 key terms"]} with 3 stats and 4-5 sections.`,
  table: `TASK: Build a data table comparing the key items in the sources. Return ONLY JSON: {"title":"","columns":["3-5 column names"],"rows":[["cells"]]} with 5-8 rows.`
};

const TEXT_PROMPTS: Record<string, string> = {
  brief: 'TASK: Write a Briefing Doc: a 2-sentence overview, then 6-8 key points as bullets with citations, then a "Terms to know" list.',
  study: 'TASK: Write a Study Guide with three headed sections: "Short-answer questions" (6 questions each followed by its answer), "Essay prompts" (3), and "Glossary" (8 key terms with definitions). Add citations.',
  faq: 'TASK: Write an FAQ of 8 questions students commonly ask about these sources, each with a concise answer and citations.',
  time: 'TASK: Build a timeline or ordered sequence of the events or steps in the sources, as a numbered list with one short line each and citations.'
};

export default function App() {
  // State from localStorage
  const [nbTitle, setNbTitle] = useState<string>('Untitled notebook');
  const [theme, setTheme] = useState<string>('aurora');
  const [mode, setMode] = useState<string>('dark');
  const [sources, setSources] = useState<SourceDoc[]>([]);
  const [nextN, setNextN] = useState<number>(1);

  // App UI State
  const [activePane, setActivePane] = useState<'p1' | 'p2' | 'p3'>('p2');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [sourceTitleInput, setSourceTitleInput] = useState<string>('');
  const [sourceTextInput, setSourceTextInput] = useState<string>('');
  const [pendingPdfText, setPendingPdfText] = useState<string>('');
  const [isPdfLoadedReadOnly, setIsPdfLoadedReadOnly] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [queryInput, setQueryInput] = useState<string>('');
  const [guideData, setGuideData] = useState<{ summary: string; questions: string[] } | null>(null);
  const [studioOutputs, setStudioOutputs] = useState<StudioItem[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dialog State
  const [dialogContent, setDialogContent] = useState<{ title: string; text: string } | null>(null);

  // Audio Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAudioLineIdx, setActiveAudioLineIdx] = useState<number>(-1);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sync theme attributes on document root
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lensbook');
      if (saved) {
        const j = JSON.parse(saved);
        if (j.title) setNbTitle(j.title);
        if (j.theme) setTheme(j.theme);
        if (j.mode) setMode(j.mode);
        if (j.src && Array.isArray(j.src)) {
          setSources(j.src);
          const maxN = j.src.reduce((max: number, s: any) => Math.max(max, s.n || 0), 0);
          setNextN(maxN + 1);
          if (j.src.length > 0) setActivePane('p2');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.mode = mode;
  }, [theme, mode]);

  const saveToStorage = (newSources: SourceDoc[], newTitle?: string, newTheme?: string, newMode?: string) => {
    try {
      localStorage.setItem('lensbook', JSON.stringify({
        title: newTitle !== undefined ? newTitle : nbTitle,
        theme: newTheme !== undefined ? newTheme : theme,
        mode: newMode !== undefined ? newMode : mode,
        src: newSources
      }));
    } catch {
      // Session storage if quota exceeded
    }
  };

  // Build RAG source text representation for prompt
  const buildSourcePromptText = (q?: string) => {
    const active = sources.filter(s => s.on);
    if (active.length === 0) return 'No active sources selected.';

    const totalLen = active.reduce((acc, s) => acc + s.text.length, 0);
    const LIMIT = 120000;

    if (totalLen <= LIMIT) {
      return active.map(s => `[S${s.n}] ${s.title}\n${s.text}`).join('\n\n---\n\n');
    }

    // High performance client-side chunk selection if document is very large
    const chunks: Array<{ n: number; title: string; text: string }> = [];
    active.forEach(s => {
      const text = s.text;
      let i = 0;
      while (i < text.length) {
        let e = Math.min(text.length, i + 1600);
        if (e < text.length) {
          const b = text.lastIndexOf('\n', e);
          if (b > i + 800) e = b;
          else {
            const d = text.lastIndexOf('. ', e);
            if (d > i + 800) e = d + 1;
          }
        }
        chunks.push({ n: s.n, title: s.title, text: text.slice(i, e).trim() });
        i = e;
      }
    });

    // Score chunks by token presence
    const queryTokens = (q || '').toLowerCase().match(/[a-z0-9\u0900-\u097f]{3,}/g) || [];
    const scored = chunks.map(c => {
      const lower = c.text.toLowerCase();
      let score = 0;
      queryTokens.forEach(tok => {
        if (lower.includes(tok)) score += 1;
      });
      return { c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 40).map(s => s.c);

    return active.map(s => {
      const docChunks = top.filter(c => c.n === s.n);
      if (docChunks.length === 0) return '';
      return `[S${s.n}] ${s.title} (selected excerpts)\n` + docChunks.map(c => c.text).join('\n…\n');
    }).filter(Boolean).join('\n\n---\n\n');
  };

  const getBasePrompt = (q?: string) => {
    return `You are a study assistant inside a notebook app. Use ONLY the sources below. Never invent facts. Cite each claim with its source tag like [S1] or [S1][S2]. Write clearly for a class 10 student, in the same language as the sources or question. If the text shows page markers like [p. 12], mention the page after the source tag, for example [S1] (p. 12).\n\nSOURCES:\n${buildSourcePromptText(q)}\n\n`;
  };

  // Run call through backend RAG endpoint
  const runAi = async (p: string, isJson: boolean) => {
    const res = await fetch('/api/gemini/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: p,
        json: isJson,
        sources: sources.filter(s => s.on).map(s => ({
          id: 'S' + s.n,
          title: s.title,
          content: s.text,
          wordCount: s.text.split(/\s+/).length,
          selected: true
        }))
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return isJson ? (data.data || data) : { text: data.text || '' };
  };

  // PDF Text Extraction using PDF.js
  const extractPdfText = async (file: File) => {
    if (!window.pdfjsLib) {
      throw new Error('PDF reader library not loaded. Check connection.');
    }
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    showToast('Reading PDF…');
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer, isEvalSupported: false }).promise;
    const numPages = Math.min(pdf.numPages, 500);

    let fullText = '';
    for (let p = 1; p <= numPages; p++) {
      if (p % 5 === 0 || p === numPages) {
        showToast(`Reading page ${p} of ${numPages}…`);
      }
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      let pageStr = '';
      content.items.forEach((item: any) => {
        pageStr += item.str + (item.hasEOL ? '\n' : ' ');
      });
      fullText += `[p. ${p}]\n` + pageStr + '\n\n';
    }

    return {
      text: fullText.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(),
      pages: pdf.numPages,
      read: numPages
    };
  };

  // Handle file selection (PDF, TXT, MD, CSV)
  const handleLoadFile = async (file?: File) => {
    if (!file) return;
    const nameWithoutExt = file.name.replace(/\.\w+$/, '');
    setShowAddForm(true);
    setPendingPdfText('');
    setIsPdfLoadedReadOnly(false);

    const isPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf';

    if (isPdf) {
      try {
        const result = await extractPdfText(file);
        if (result.text.replace(/\[p\. \d+\]/g, '').trim().length < 40) {
          showToast('No readable text found. This looks like a scanned PDF.');
          return;
        }
        if (!sourceTitleInput) setSourceTitleInput(nameWithoutExt);
        setPendingPdfText(result.text);
        setSourceTextInput(`PDF loaded: ${result.read} of ${result.pages} pages, about ${Math.round(result.text.length / 1000)}k characters. Press Add to use it as a source.`);
        setIsPdfLoadedReadOnly(true);
        showToast(result.read < result.pages ? `Read first ${result.read} of ${result.pages} pages.` : `Read all ${result.pages} pages! Press Add.`);
      } catch (err: any) {
        showToast(err.message || 'Could not read this PDF');
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceTextInput(reader.result as string);
        if (!sourceTitleInput) setSourceTitleInput(nameWithoutExt);
      };
      reader.readAsText(file);
    }
  };

  // Add source button handler
  const handleAddSourceConfirm = () => {
    const title = sourceTitleInput.trim();
    const text = (pendingPdfText || sourceTextInput).trim();

    if (text.length < 40) {
      showToast('Paste at least a few sentences.');
      return;
    }
    if (sources.length >= 8) {
      showToast('Maximum 8 sources allowed.');
      return;
    }

    const newDoc: SourceDoc = {
      n: nextN,
      title: title || (text.slice(0, 30) + '…'),
      text: text.slice(0, 2000000),
      on: true
    };

    const updated = [...sources, newDoc];
    setSources(updated);
    setNextN(nextN + 1);
    saveToStorage(updated);

    // Reset Form
    setPendingPdfText('');
    setIsPdfLoadedReadOnly(false);
    setSourceTitleInput('');
    setSourceTextInput('');
    setShowAddForm(false);
    setActivePane('p2');

    if (text.length > 120000) {
      showToast('Large document indexed with RAG search.');
    } else {
      showToast('Source added!');
    }
  };

  // Toggle Source active status
  const handleToggleSource = (n: number) => {
    const updated = sources.map(s => s.n === n ? { ...s, on: !s.on } : s);
    setSources(updated);
    saveToStorage(updated);
  };

  // Remove source
  const handleRemoveSource = (n: number) => {
    const updated = sources.filter(s => s.n !== n);
    setSources(updated);
    saveToStorage(updated);
  };

  // Send Chat message
  const handleSendChat = async (qText?: string) => {
    const q = (qText || queryInput).trim();
    if (!q || isBusy) return;

    const hasActive = sources.some(s => s.on);
    if (!hasActive) {
      showToast('Add or select a source first');
      return;
    }

    setIsBusy(true);
    setQueryInput('');

    const newMsgs: ChatMsg[] = [...messages, { r: 'u', t: q }];
    const assistantMsgIndex = newMsgs.length;
    newMsgs.push({ r: 'a', t: '', live: true });
    setMessages(newMsgs);

    try {
      const activeSources = sources.filter(s => s.on).map(s => ({
        id: 'S' + s.n,
        n: s.n,
        title: s.title,
        content: s.text,
        wordCount: s.text.split(/\s+/).length,
        selected: true
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          history: newMsgs.slice(-8, -2).map(x => ({
            sender: x.r === 'u' ? 'user' : 'assistant',
            text: x.t
          })),
          sources: activeSources
        })
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => {
        const copy = [...prev];
        if (copy[assistantMsgIndex]) {
          copy[assistantMsgIndex] = {
            r: 'a',
            t: data.reply || 'Answer synthesized from active sources.',
            live: false,
            retrievedChunks: data.retrievedChunks,
            ragMetrics: data.ragMetrics
          };
        }
        return copy;
      });
    } catch (err: any) {
      setMessages(prev => {
        const copy = [...prev];
        if (copy[assistantMsgIndex]) {
          copy[assistantMsgIndex] = {
            r: 'a',
            t: err.message || 'Something went wrong. Please check your query or sources.',
            live: false,
            err: true
          };
        }
        return copy;
      });
    } finally {
      setIsBusy(false);
    }
  };

  // Notebook guide generator
  const handleGenerateGuide = async () => {
    if (isBusy) return;
    const hasActive = sources.some(s => s.on);
    if (!hasActive) {
      showToast('Add or select a source first');
      return;
    }

    setIsBusy(true);
    showToast('Synthesizing notebook guide…');

    try {
      const p = getBasePrompt() + 'Return ONLY JSON: {"summary":"a 3-4 sentence summary with [S#] citations","questions":["3 short questions a student could ask about these sources"]}';
      const j = await runAi(p, true);
      setGuideData({
        summary: j.summary || 'Summary synthesized from uploaded materials.',
        questions: (j.questions || []).slice(0, 3)
      });
    } catch (err: any) {
      showToast(err.message || 'Guide generation failed');
    } finally {
      setIsBusy(false);
    }
  };

  // Studio generator function
  const handleGenerateStudio = async (k: string) => {
    if (isBusy) return;
    if (k === 'report') k = 'brief';

    const hasActive = sources.some(s => s.on);
    if (!hasActive) {
      showToast('Add or select a source first');
      return;
    }

    setIsBusy(true);

    const newItem: StudioItem = {
      k,
      title: LABELS[k] || k,
      icon: ICONS[k] || '✨',
      html: 'Generating…',
      raw: '',
      i: 0,
      f: false,
      qi: 0,
      sc: 0,
      pk: -1
    };

    setStudioOutputs(prev => [newItem, ...prev]);

    try {
      if (JSON_PROMPTS[k]) {
        const json = await runAi(getBasePrompt() + JSON_PROMPTS[k], true);
        newItem.d = json;

        if (k === 'audio') {
          newItem.lines = (json.lines || []).filter((l: any) => l && l.text);
          newItem.raw = (newItem.lines || []).map(l => `${l.host}: ${l.text}`).join('\n');
          newItem.html = 'aud';
        } else if (k === 'mind') {
          newItem.raw = json.title + '\n' + (json.branches || []).map((b: any) => `${b.name}: ${b.points.join('; ')}`).join('\n');
        } else if (k === 'slides' || k === 'video') {
          newItem.raw = (json.slides || []).map((s: any, idx: number) => `${idx + 1}. ${s.title}\n` + (s.bullets || []).map((b: string) => '- ' + b).join('\n')).join('\n\n');
        } else if (k === 'flash') {
          newItem.raw = (json.cards || []).map((c: any) => `${c.front} => ${c.back}`).join('\n');
        } else if (k === 'quiz') {
          newItem.raw = (json.questions || []).map((q: any, idx: number) => `${idx + 1}. ${q.q}\n` + q.options.map((opt: string, optIdx: number) => `   ${'ABCD'[optIdx]}. ${opt}`).join('\n')).join('\n');
        } else if (k === 'info') {
          newItem.raw = json.title + '\n' + (json.sections || []).map((s: any) => `${s.heading}: ${s.text}`).join('\n');
        } else if (k === 'table') {
          newItem.raw = [(json.columns || []).join('\t'), ...((json.rows || []).map((r: string[]) => r.join('\t')))].join('\n');
        }

        setStudioOutputs(prev => [newItem, ...prev.slice(1)]);
      } else {
        const textRes = await runAi(getBasePrompt() + (TEXT_PROMPTS[k] || ''), false);
        newItem.raw = textRes.text;
        newItem.html = textRes.text;
        setStudioOutputs(prev => [newItem, ...prev.slice(1)]);
      }
    } catch (err: any) {
      newItem.err = true;
      newItem.html = err.message || 'Generation error. Please retry.';
      setStudioOutputs(prev => [newItem, ...prev.slice(1)]);
    } finally {
      setIsBusy(false);
    }
  };

  // SpeechSynthesis for Audio Overview
  const handlePlayAudio = (item: StudioItem) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const lines = item.lines || [];
    let idx = 0;

    const speakNext = () => {
      if (idx >= lines.length) {
        setIsPlayingAudio(false);
        setActiveAudioLineIdx(-1);
        return;
      }

      setActiveAudioLineIdx(idx);
      const cur = lines[idx];
      idx++;

      const utter = new SpeechSynthesisUtterance(cur.text);
      utter.pitch = /^sam/i.test(cur.host) ? 1.25 : 0.92;
      utter.rate = 0.98;
      utter.onend = speakNext;
      utter.onerror = speakNext;
      window.speechSynthesis.speak(utter);
    };

    speakNext();
  };

  const handleStopAudio = () => {
    setIsPlayingAudio(false);
    setActiveAudioLineIdx(-1);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play Slide / Video Narration
  const handlePlaySlideNarration = (item: StudioItem) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const slides = item.d?.slides || [];
    let curSlideIdx = 0;

    const speakNextSlide = () => {
      if (curSlideIdx >= slides.length) {
        return;
      }
      setStudioOutputs(prev => prev.map(o => o === item ? { ...o, i: curSlideIdx } : o));
      const s = slides[curSlideIdx];
      curSlideIdx++;

      const utter = new SpeechSynthesisUtterance(s.narration || s.title);
      utter.rate = 0.97;
      utter.onend = () => {
        if (curSlideIdx < slides.length) {
          speakNextSlide();
        }
      };
      utter.onerror = utter.onend;
      window.speechSynthesis.speak(utter);
    };

    speakNextSlide();
  };

  // Inline Citation formatter
  const renderFormattedText = (text: string) => {
    // Replace markdown bold
    const parts = text.split(/(\[S\d+\]|\[\d+\]|\*\*[^*]+\*\*)/g);

    return parts.map((part, idx) => {
      const sMatch = part.match(/\[S?(\d+)\]/);
      if (sMatch) {
        const n = parseInt(sMatch[1], 10);
        return (
          <button
            key={idx}
            className="cit"
            onClick={() => {
              const src = sources.find(s => s.n === n);
              if (src) {
                setDialogContent({ title: `S${src.n}: ${src.title}`, text: src.text });
              } else {
                showToast(`Source [S${n}] cited`);
              }
            }}
            title={`View Source ${n}`}
          >
            {n}
          </button>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return <b key={idx}>{part.slice(2, -2)}</b>;
      }

      return <span key={idx}>{part}</span>;
    });
  };

  // Render markdown paragraphs and lists
  const renderMarkdownBlocks = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((l, idx) => {
          const trimmed = l.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;
          if (trimmed.startsWith('#')) {
            const hText = trimmed.replace(/^#+\s*/, '');
            return <h4 key={idx} className="font-editorial text-lg text-current my-1">{renderFormattedText(hText)}</h4>;
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-xs leading-relaxed">
                {renderFormattedText(trimmed.slice(2))}
              </li>
            );
          }
          const numMatch = trimmed.match(/^\d+[.)]\s+(.*)/);
          if (numMatch) {
            return (
              <li key={idx} className="ml-4 list-decimal text-xs leading-relaxed">
                {renderFormattedText(numMatch[1])}
              </li>
            );
          }
          return <p key={idx} className="text-xs leading-relaxed">{renderFormattedText(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Copy helper
  const handleCopyText = (raw: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(raw).then(() => showToast('Copied'));
    } else {
      showToast('Copy not allowed here');
    }
  };

  // Delete studio item
  const handleDeleteStudioItem = (idx: number) => {
    setStudioOutputs(prev => prev.filter((_, i) => i !== idx));
  };

  // Save Assistant message to notes
  const handleSaveToNotes = (msgText: string) => {
    const noteItem: StudioItem = {
      k: 'note',
      title: 'Saved note',
      icon: '📝',
      html: msgText,
      raw: msgText
    };
    setStudioOutputs(prev => [noteItem, ...prev]);
    showToast('Saved to Studio notes');
  };

  return (
    <div className="flex flex-col h-full w-full select-none overflow-hidden">
      {/* ── TOP HEADER ── */}
      <header className="top">
        {/* Logo */}
        <div className="logo cursor-pointer" onClick={() => setActivePane('p2')}>
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M16.5 16.5L23 23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          LensBook
        </div>

        {/* Editable Title */}
        <input
          id="ttl"
          value={nbTitle}
          onChange={(e) => {
            setNbTitle(e.target.value);
            saveToStorage(sources, e.target.value);
          }}
          aria-label="Notebook title"
        />

        {/* Theme Dropdown */}
        <select
          id="thm"
          className="btn"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            saveToStorage(sources, undefined, e.target.value);
          }}
          aria-label="Theme"
        >
          <option value="aurora">Aurora</option>
          <option value="sunset">Sunset</option>
          <option value="forest">Forest</option>
          <option value="ocean">Ocean</option>
        </select>

        {/* Dark / Light Mode Toggle */}
        <button
          className="btn"
          id="mode"
          onClick={() => {
            const nextMode = mode === 'dark' ? 'light' : 'dark';
            setMode(nextMode);
            saveToStorage(sources, undefined, undefined, nextMode);
          }}
          aria-label="Toggle dark mode"
        >
          {mode === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      {/* ── MAIN 3-PANEL VIEW ── */}
      <main className="lensbook-main">
        {/* ── PANEL 1: SOURCES ── */}
        <section
          className={`pn ${activePane === 'p1' ? 'show' : ''}`}
          id="p1"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleLoadFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <h2>
            <span>Sources</span>
            <span id="cnt" className="mute" style={{ font: "500 14px 'DM Sans'" }}>
              {sources.length > 0 ? `${sources.filter(s => s.on).length} of ${sources.length} selected` : ''}
            </span>
          </h2>

          <div className="sc">
            {/* + Add Source Button */}
            <button
              className="btn pri"
              id="addb"
              style={{ width: '100%' }}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              + Add source
            </button>

            {/* Collapsible Add Form */}
            {showAddForm && (
              <div className="af" id="af">
                <input
                  type="text"
                  id="st"
                  placeholder="Source title"
                  value={sourceTitleInput}
                  onChange={(e) => setSourceTitleInput(e.target.value)}
                  aria-label="Source title"
                />

                <textarea
                  id="sx"
                  placeholder="Paste your chapter, notes or article here…"
                  value={sourceTextInput}
                  readOnly={isPdfLoadedReadOnly}
                  onChange={(e) => setSourceTextInput(e.target.value)}
                  aria-label="Source text"
                />

                <div className="row">
                  <button className="btn pri" id="sadd" onClick={handleAddSourceConfirm}>
                    Add
                  </button>

                  <button className="btn" id="sup" onClick={() => fileInputRef.current?.click()}>
                    Upload PDF or text
                  </button>

                  <button
                    className="btn"
                    id="ssm"
                    onClick={() => {
                      setPendingPdfText('');
                      setIsPdfLoadedReadOnly(false);
                      setSourceTitleInput('Photosynthesis chapter');
                      setSourceTextInput(SAMPLE_TEXT);
                    }}
                  >
                    Sample
                  </button>

                  <button
                    className="btn"
                    id="scn"
                    onClick={() => {
                      setPendingPdfText('');
                      setIsPdfLoadedReadOnly(false);
                      setShowAddForm(false);
                      setSourceTextInput('');
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <input
                  type="file"
                  id="sf"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf,.txt,.md,.csv,text/plain"
                  className="hide"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleLoadFile(e.target.files[0]);
                    }
                  }}
                  aria-label="Upload text or PDF file"
                />
              </div>
            )}

            {/* Source List */}
            <div id="sl" style={{ marginTop: '12px' }}>
              {sources.length === 0 ? (
                <p className="mute">No sources yet. Paste text, upload a .txt file, or try the sample.</p>
              ) : (
                sources.map((s) => (
                  <div key={s.n} className="si">
                    <input
                      type="checkbox"
                      checked={s.on}
                      onChange={() => handleToggleSource(s.n)}
                      aria-label={`Use ${s.title}`}
                    />
                    <div
                      className="t"
                      onClick={() => setDialogContent({ title: `S${s.n}: ${s.title}`, text: s.text })}
                    >
                      <b>{s.title}</b>
                      <small>
                        S{s.n} · {s.text.split(/\s+/).length.toLocaleString()} words · ~{Math.ceil(s.text.length / 800)} RAG chunks
                      </small>
                    </div>
                    <button
                      className="btn"
                      onClick={() => handleRemoveSource(s.n)}
                      aria-label="Remove source"
                      style={{ padding: '2px 8px', minHeight: '28px', border: 0 }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── PANEL 2: CHAT ── */}
        <section className={`pn ${activePane === 'p2' ? 'show' : ''}`} id="p2">
          <h2>
            <span>Chat</span>
            <button className="btn" id="gd" onClick={handleGenerateGuide} disabled={isBusy}>
              {isBusy && !queryInput ? 'Working…' : 'Notebook guide'}
            </button>
          </h2>

          {/* Messages */}
          <div className="msgs" id="ms">
            {sources.length === 0 && messages.length === 0 ? (
              <div className="empty">
                <div style={{ fontSize: '44px' }}>📚</div>
                <h3>Add a source to begin</h3>
                <p className="mute">
                  Paste a chapter or upload a PDF or text file. Then ask questions, listen to an audio overview, or build a study guide.
                </p>
                <button
                  className="btn pri"
                  onClick={() => {
                    setShowAddForm(true);
                    setActivePane('p1');
                  }}
                >
                  + Add source
                </button>
              </div>
            ) : (
              <>
                {/* Optional Notebook Guide Card */}
                {guideData && (
                  <div className="guide">
                    <h3>Notebook guide</h3>
                    <div className="text-sm leading-relaxed">{renderMarkdownBlocks(guideData.summary)}</div>
                  </div>
                )}

                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`m ${m.r === 'u' ? 'u' : 'a'}${m.err ? ' err' : ''}`}
                  >
                    {m.t ? (
                      renderMarkdownBlocks(m.t)
                    ) : (
                      <span className="mute">Thinking & retrieving source chunks…</span>
                    )}

                    {/* Grounding & Save to notes footer */}
                    {!m.live && m.t && !m.err && m.r === 'a' && (
                      <div className="ma">
                        {m.ragMetrics && (
                          <span
                            className="rag-pill cursor-pointer"
                            onClick={() => {
                              if (m.retrievedChunks && m.retrievedChunks.length > 0) {
                                const chunk = m.retrievedChunks[0];
                                setDialogContent({
                                  title: `RAG Grounded Passage (${chunk.scorePercentage}% match)`,
                                  text: `Source: ${chunk.sourceTitle}\nChunk #${chunk.chunkIndex + 1}\n\n${chunk.text}`
                                });
                              }
                            }}
                            title="Click to inspect retrieved RAG passages"
                          >
                            ⚡ RAG Grounded ({m.ragMetrics.chunksRetrieved || 2} chunks, {m.ragMetrics.topScore || 95}% match)
                          </span>
                        )}

                        <button
                          className="btn"
                          style={{ minHeight: '28px', padding: '2px 10px', fontSize: '11px' }}
                          onClick={() => handleSaveToNotes(m.t)}
                        >
                          Save to notes
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Dynamic Suggestion Chips */}
          <div className="sgs" id="sg">
            {sources.length > 0 &&
              (guideData?.questions || [
                'Summarize these sources',
                'What are the key terms?',
                'Give me 5 practice questions'
              ]).map((q, idx) => (
                <button
                  key={idx}
                  className="btn"
                  onClick={() => handleSendChat(q)}
                  disabled={isBusy}
                >
                  {q}
                </button>
              ))}
          </div>

          {/* Bottom Chat Bar */}
          <div className="cp">
            <input
              id="q"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              aria-label="Ask about your sources"
              placeholder="Ask about your sources…"
              disabled={isBusy}
            />
            <button
              className="btn pri"
              id="go"
              onClick={() => handleSendChat()}
              disabled={!queryInput.trim() || isBusy}
            >
              Send
            </button>
          </div>
        </section>

        {/* ── PANEL 3: STUDIO ── */}
        <section className={`pn ${activePane === 'p3' ? 'show' : ''}`} id="p3">
          <h2>Studio</h2>

          <div className="sc">
            {/* Studio Action Tiles Grid */}
            <div className="tiles" id="tl">
              {[
                { k: 'audio', label: 'Audio Overview', color: '#4263eb' },
                { k: 'slides', label: 'Slide Deck', color: '#c2255c' },
                { k: 'video', label: 'Video Overview', color: '#12b886' },
                { k: 'mind', label: 'Mind Map', color: '#7048e8' },
                { k: 'report', label: 'Reports', color: '#a61e4d', isNew: true },
                { k: 'flash', label: 'Flashcards', color: '#f08c00' },
                { k: 'quiz', label: 'Quiz', color: '#1098ad' },
                { k: 'info', label: 'Infographic', color: '#fd7e14' },
                { k: 'table', label: 'Data Table', color: '#4263eb' }
              ].map((item) => (
                <button
                  key={item.k}
                  className="tile"
                  style={{ '--ic': item.color } as any}
                  onClick={() => handleGenerateStudio(item.k)}
                  disabled={isBusy || sources.filter(s => s.on).length === 0}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={SVG_PATHS[item.k]} />
                  </svg>
                  <span>{item.label}</span>
                  {item.isNew && <span className="nw">New!</span>}
                </button>
              ))}

              {/* Report types row below tiles */}
              <div className="row" style={{ gridColumn: '1 / -1', alignItems: 'center', marginTop: '6px' }}>
                <span className="mute" style={{ fontSize: '13px' }}>
                  Report types:
                </span>
                {[
                  { k: 'brief', label: 'Briefing' },
                  { k: 'study', label: 'Study guide' },
                  { k: 'faq', label: 'FAQ' },
                  { k: 'time', label: 'Timeline' }
                ].map((rep) => (
                  <button
                    key={rep.k}
                    className="btn"
                    style={{ minHeight: '30px', padding: '3px 10px', fontSize: '12px' }}
                    onClick={() => handleGenerateStudio(rep.k)}
                    disabled={isBusy || sources.filter(s => s.on).length === 0}
                  >
                    {rep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Outputs List */}
            <div id="ot" style={{ marginTop: '14px' }}>
              {studioOutputs.map((out, outIdx) => {
                const d = out.d;
                return (
                  <article key={outIdx} className="out">
                    <header>
                      <span>
                        {out.icon} {out.title}
                      </span>
                      <span>
                        {/* Audio Controls */}
                        {out.k === 'audio' && out.lines && (
                          <>
                            <button
                              className="btn"
                              onClick={() => handlePlayAudio(out)}
                              disabled={isPlayingAudio}
                            >
                              Play
                            </button>
                            <button className="btn" onClick={handleStopAudio}>
                              Stop
                            </button>
                          </>
                        )}

                        {/* Video Controls */}
                        {out.k === 'video' && d?.slides && (
                          <button className="btn" onClick={handleStopAudio}>
                            Stop
                          </button>
                        )}

                        {/* Copy button */}
                        <button className="btn" onClick={() => handleCopyText(out.raw)}>
                          Copy
                        </button>

                        {/* Delete button */}
                        <button
                          className="btn"
                          onClick={() => handleDeleteStudioItem(outIdx)}
                          aria-label="Delete"
                          style={{ padding: '2px 8px' }}
                        >
                          ✕
                        </button>
                      </span>
                    </header>

                    <div className="body">
                      {/* Audio Dialogue */}
                      {out.k === 'audio' && out.lines && (
                        <div className="space-y-1">
                          {out.lines.map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className={`al ${/^sam/i.test(line.host) ? 'B' : 'A'}${activeAudioLineIdx === lIdx ? ' on' : ''}`}
                            >
                              <b>{line.host}:</b> {line.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mind Map */}
                      {out.k === 'mind' && d && (
                        <div className="mm">
                          <div className="mc">{d.title || 'Mind map'}</div>
                          <div className="mg">
                            {(d.branches || []).map((b: any, bIdx: number) => (
                              <div
                                key={bIdx}
                                className="mb"
                                style={{ '--c': PALETTE[bIdx % 6] } as any}
                              >
                                <b>{b.name}</b>
                                <ul>
                                  {(b.points || []).map((p: string, pIdx: number) => (
                                    <li key={pIdx}>{p}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Slide Deck & Video Overview */}
                      {(out.k === 'slides' || out.k === 'video') && d?.slides && (
                        <div>
                          {(() => {
                            const curIdx = out.i || 0;
                            const s = d.slides[curIdx] || { title: '', bullets: [] };
                            return (
                              <>
                                <div className="sl">
                                  <h4>{s.title}</h4>
                                  <ul>
                                    {(s.bullets || []).map((b: string, bIdx: number) => (
                                      <li key={bIdx}>{b}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="nv">
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      const prev = Math.max(0, curIdx - 1);
                                      setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? { ...o, i: prev } : o));
                                    }}
                                    disabled={curIdx <= 0}
                                  >
                                    Prev
                                  </button>

                                  <span className="mute">
                                    {curIdx + 1} / {d.slides.length}
                                  </span>

                                  {out.k === 'video' && (
                                    <button
                                      className="btn pri"
                                      onClick={() => handlePlaySlideNarration(out)}
                                    >
                                      Play narration
                                    </button>
                                  )}

                                  <button
                                    className="btn"
                                    onClick={() => {
                                      const next = Math.min(d.slides.length - 1, curIdx + 1);
                                      setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? { ...o, i: next } : o));
                                    }}
                                    disabled={curIdx >= d.slides.length - 1}
                                  >
                                    Next
                                  </button>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* Flashcards */}
                      {out.k === 'flash' && d?.cards && (
                        <div>
                          {(() => {
                            const curIdx = out.i || 0;
                            const isFlipped = !!out.f;
                            const card = d.cards[curIdx] || { front: '', back: '' };
                            return (
                              <>
                                <div
                                  className={`fcd ${isFlipped ? 'bk' : ''}`}
                                  onClick={() => {
                                    setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? { ...o, f: !isFlipped } : o));
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  aria-label="Flip card"
                                >
                                  {isFlipped ? card.back : card.front}
                                </div>

                                <div className="nv">
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      const prev = Math.max(0, curIdx - 1);
                                      setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? { ...o, i: prev, f: false } : o));
                                    }}
                                    disabled={curIdx <= 0}
                                  >
                                    Prev
                                  </button>

                                  <span className="mute">
                                    {curIdx + 1} / {d.cards.length}
                                  </span>

                                  <button
                                    className="btn"
                                    onClick={() => {
                                      const next = Math.min(d.cards.length - 1, curIdx + 1);
                                      setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? { ...o, i: next, f: false } : o));
                                    }}
                                    disabled={curIdx >= d.cards.length - 1}
                                  >
                                    Next
                                  </button>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* Quiz */}
                      {out.k === 'quiz' && d?.questions && (
                        <div>
                          {(() => {
                            const questions = d.questions;
                            const qi = out.qi || 0;
                            const score = out.sc || 0;
                            const selectedChoice = out.pk !== undefined ? out.pk : -1;

                            if (qi >= questions.length) {
                              return (
                                <div>
                                  <h4>Score: {score} / {questions.length}</h4>
                                  <p>{score / questions.length >= 0.8 ? 'Excellent work! You mastered this source.' : 'Review the sources and try again.'}</p>
                                  <button
                                    className="btn pri"
                                    onClick={() => {
                                      setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? { ...o, qi: 0, sc: 0, pk: -1 } : o));
                                    }}
                                  >
                                    Retry
                                  </button>
                                </div>
                              );
                            }

                            const q = questions[qi];
                            const correctAns = +q.answer;

                            return (
                              <div>
                                <p><b>{qi + 1}. {q.q}</b></p>
                                {q.options.map((opt: string, optIdx: number) => {
                                  let optionClass = 'qo';
                                  if (selectedChoice >= 0) {
                                    if (optIdx === correctAns) optionClass += ' ok';
                                    else if (optIdx === selectedChoice) optionClass += ' no';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      className={`btn ${optionClass}`}
                                      onClick={() => {
                                        if (selectedChoice >= 0) return;
                                        const isCorrect = optIdx === correctAns;
                                        setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? {
                                          ...o,
                                          pk: optIdx,
                                          sc: isCorrect ? score + 1 : score
                                        } : o));
                                      }}
                                    >
                                      {'ABCD'[optIdx]}. {opt}
                                    </button>
                                  );
                                })}

                                {selectedChoice >= 0 && (
                                  <div style={{ marginTop: '8px' }}>
                                    <p className="mute text-xs">{q.why || ''}</p>
                                    <button
                                      className="btn pri"
                                      onClick={() => {
                                        setStudioOutputs(prevArr => prevArr.map((o, idx) => idx === outIdx ? {
                                          ...o,
                                          qi: qi + 1,
                                          pk: -1
                                        } : o));
                                      }}
                                    >
                                      {qi + 1 < questions.length ? 'Next' : 'See score'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Infographic */}
                      {out.k === 'info' && d && (
                        <div className="ig">
                          <div className="hd">
                            <h4>{d.title || ''}</h4>
                            <div>{d.tagline || ''}</div>
                          </div>

                          <div className="st">
                            {(d.stats || []).map((s: any, sIdx: number) => (
                              <div key={sIdx}>
                                <b>{s.value}</b>
                                <small>{s.label}</small>
                              </div>
                            ))}
                          </div>

                          <div className="sc2">
                            {(d.sections || []).map((sec: any, secIdx: number) => (
                              <div key={secIdx}>
                                <i>{sec.icon || '✨'}</i>
                                <span>
                                  <b>{sec.heading}</b>
                                  <br />
                                  {sec.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          {(d.steps || []).length > 0 && (
                            <div className="sc2">
                              {d.steps.map((st: string, stIdx: number) => (
                                <div key={stIdx}>
                                  <i>{stIdx + 1}</i>
                                  <span>{st}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="fl">
                            {(d.terms || []).map((term: string, tIdx: number) => (
                              <span key={tIdx}>{term}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Data Table */}
                      {out.k === 'table' && d && (
                        <div className="ov">
                          <b>{d.title || ''}</b>
                          <table className="dt">
                            <thead>
                              <tr>
                                {(d.columns || []).map((col: string, cIdx: number) => (
                                  <th key={cIdx}>{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(d.rows || []).map((row: string[], rIdx: number) => (
                                <tr key={rIdx}>
                                  {row.map((cell: string, cellIdx: number) => (
                                    <td key={cellIdx}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Markdown Reports / Text */}
                      {!d && out.html && out.html !== 'aud' && (
                        <div>{renderMarkdownBlocks(out.html)}</div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── RESPONSIVE MOBILE TABS ── */}
      <nav className="tabs">
        <button
          className={activePane === 'p1' ? 'on' : ''}
          onClick={() => setActivePane('p1')}
        >
          Sources
        </button>
        <button
          className={activePane === 'p2' ? 'on' : ''}
          onClick={() => setActivePane('p2')}
        >
          Chat
        </button>
        <button
          className={activePane === 'p3' ? 'on' : ''}
          onClick={() => setActivePane('p3')}
        >
          Studio
        </button>
      </nav>

      {/* ── SOURCE / RAG CHUNK INSPECTION DIALOG ── */}
      {dialogContent && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDialogContent(null)}
        >
          <div
            className="pn"
            style={{ maxWidth: '640px', width: '92%', maxHeight: '80vh', padding: '18px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px', font: "400 24px 'Instrument Serif', serif" }}>
              {dialogContent.title}
            </h3>

            <div id="dtx" style={{ flex: 1, overflowY: 'auto' }}>
              {dialogContent.text}
            </div>

            <div className="row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
              <button className="btn pri" onClick={() => setDialogContent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING TOAST NOTIFICATION ── */}
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
