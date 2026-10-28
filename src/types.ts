export interface SourceDocument {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'txt' | 'md';
  wordCount: number;
  uploadedAt: string;
  selected: boolean;
  content: string;
  keyTakeaways: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Array<{ index: number; id: string; title: string; scorePercentage?: number; chunkId?: string }>;
  retrievedChunks?: Array<{
    id: string;
    sourceId: string;
    sourceTitle: string;
    chunkIndex: number;
    totalChunksInDoc: number;
    text: string;
    scorePercentage: number;
    wordCount: number;
  }>;
  ragMetrics?: {
    totalChunksInCorpus: number;
    chunksRetrieved: number;
    topScore: number;
    latencyMs: number;
  };
  usedRealModel?: boolean;
}

export interface AudioSegment {
  speaker: string;
  text: string;
  timestamp: string;
  emotion: 'Curious' | 'Analytical' | 'Astonished' | 'Insightful' | 'Thoughtful';
  keyTakeaway: string;
}

export interface AudioOverviewData {
  title: string;
  topic: string;
  durationSeconds: number;
  summary: string;
  segments: AudioSegment[];
}

export interface MindMapNode {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  summary?: string;
  notes?: string;
  formula?: string;
  examTip?: string;
  children?: MindMapNode[];
}

export interface MindMapData {
  root: MindMapNode;
}

export interface SlideVisual {
  type: 'metric' | 'comparison' | 'framework';
  title: string;
  value: string;
  caption: string;
}

export interface Slide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  keyVisual: SlideVisual;
  voiceNarration: string;
}

export interface SlideDeckData {
  deckTitle: string;
  slides: Slide[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  sourceRef: string;
}

export interface QuizData {
  quizTitle: string;
  estimatedMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  score: number;
  total: number;
  percentage: number;
  mode: 'practice' | 'timed';
  timeSpentSeconds: number;
  userAnswers: Record<string, number>;
}

export interface TimelineEvent {
  id: string;
  epoch: string;
  title: string;
  description: string;
  category: 'Discovery' | 'Mechanism' | 'Synthesis' | 'Policy';
  impact: 'Critical' | 'High' | 'Standard';
}

export interface InfographicMetric {
  metric: string;
  value: string;
  label: string;
  trend: string;
  description: string;
}

export interface TimelineData {
  timelineTitle: string;
  events: TimelineEvent[];
  infographics: InfographicMetric[];
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sourceRef: string;
}

export interface TableRow {
  col0: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  [key: string]: string;
}

export interface TableFaqData {
  tableTitle: string;
  columns: string[];
  rows: TableRow[];
  faqs: FaqItem[];
}

export type StudioTab = 'chat' | 'audio' | 'mindmap' | 'slides' | 'quiz' | 'timeline' | 'tables_faq';
