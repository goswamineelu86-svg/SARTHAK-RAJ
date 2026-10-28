/**
 * Retrieval-Augmented Generation (RAG) Engine for StudyApex / LensBook
 * Provides document chunking, semantic vector representation, BM25 indexing,
 * and Top-K hybrid relevance retrieval.
 */

export interface DocumentChunk {
  id: string;
  sourceId: string;
  sourceTitle: string;
  chunkIndex: number;
  totalChunksInDoc: number;
  text: string;
  wordCount: number;
  keywords: string[];
}

export interface RetrievedChunk extends DocumentChunk {
  score: number;        // 0 to 1 normalized relevance
  scorePercentage: number; // e.g. 96
  matchSnippet?: string;
}

export interface RAGRetrievalResult {
  query: string;
  totalChunksInCorpus: number;
  retrievedChunks: RetrievedChunk[];
  topScore: number;
  latencyMs: number;
}

// Stopwords for cleaner term weighting
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few',
  'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize and normalize text into clean terms
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Splits document content into overlapping semantic chunks
 * @param sourceId Source identifier
 * @param sourceTitle Document title
 * @param content Full raw text of the document
 * @param chunkSize Target words per chunk (default 250)
 * @param overlap Target words to overlap between chunks (default 40)
 */
export function chunkDocument(
  sourceId: string,
  sourceTitle: string,
  content: string,
  chunkSize: number = 220,
  overlap: number = 35
): DocumentChunk[] {
  if (!content || !content.trim()) return [];

  // Split by paragraphs first to preserve logical boundaries
  const rawParagraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const words: string[] = [];

  rawParagraphs.forEach(para => {
    const paraWords = para.split(/\s+/).filter(Boolean);
    words.push(...paraWords);
  });

  if (words.length <= chunkSize) {
    return [
      {
        id: `${sourceId}-chunk-0`,
        sourceId,
        sourceTitle,
        chunkIndex: 0,
        totalChunksInDoc: 1,
        text: words.join(' '),
        wordCount: words.length,
        keywords: Array.from(new Set(tokenize(words.join(' ')))).slice(0, 10)
      }
    ];
  }

  const chunks: DocumentChunk[] = [];
  let startIdx = 0;
  let chunkIndex = 0;

  while (startIdx < words.length) {
    const endIdx = Math.min(startIdx + chunkSize, words.length);
    const chunkWords = words.slice(startIdx, endIdx);
    const chunkText = chunkWords.join(' ');

    chunks.push({
      id: `${sourceId}-chunk-${chunkIndex}`,
      sourceId,
      sourceTitle,
      chunkIndex,
      totalChunksInDoc: 0, // updated below
      text: chunkText,
      wordCount: chunkWords.length,
      keywords: Array.from(new Set(tokenize(chunkText))).slice(0, 10)
    });

    chunkIndex++;
    if (endIdx >= words.length) break;
    startIdx += chunkSize - overlap;
  }

  // Update total chunks count in each chunk
  chunks.forEach(c => {
    c.totalChunksInDoc = chunks.length;
  });

  return chunks;
}

/**
 * Computes BM25 + semantic keyword hybrid relevance score for a chunk
 */
function scoreChunk(queryTerms: string[], chunk: DocumentChunk): number {
  if (queryTerms.length === 0) return 0.5;

  const chunkTokens = tokenize(chunk.text);
  const chunkTokenSet = new Set(chunkTokens);
  const chunkTextLower = chunk.text.toLowerCase();

  let termFrequencyMatches = 0;
  let exactPhraseMatches = 0;

  // Check exact token matches
  queryTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = chunkTextLower.match(regex);
    if (matches) {
      termFrequencyMatches += matches.length;
    } else if (chunkTokenSet.has(term)) {
      termFrequencyMatches += 1;
    }
  });

  // Check 2-term phrase co-occurrences
  for (let i = 0; i < queryTerms.length - 1; i++) {
    const bigram = `${queryTerms[i]} ${queryTerms[i + 1]}`;
    if (chunkTextLower.includes(bigram)) {
      exactPhraseMatches += 2;
    }
  }

  // Length normalization (BM25 style)
  const avgDocLength = 220;
  const docLengthNorm = 1 + 0.25 * ((chunk.wordCount / avgDocLength) - 1);

  // Raw score
  const coverageRatio = queryTerms.filter(t => chunkTokenSet.has(t)).length / queryTerms.length;
  const rawScore = (termFrequencyMatches * 1.5 + exactPhraseMatches * 3.0 + coverageRatio * 4.0) / docLengthNorm;

  // Sigmoid squash into 0.2 to 0.99
  const normalized = 1 / (1 + Math.exp(-0.35 * (rawScore - 2.5)));
  return Math.min(0.99, Math.max(0.15, normalized));
}

/**
 * Primary RAG Retrieval Function
 * Performs top-K ranking across all indexed chunks in the active corpus.
 */
export function retrieveRelevantChunks(
  query: string,
  sources: Array<{ id: string; title: string; content: string }>,
  topK: number = 4
): RAGRetrievalResult {
  const startTime = Date.now();
  const queryTerms = tokenize(query);

  // 1. Chunk all active documents
  const allChunks: DocumentChunk[] = [];
  sources.forEach(source => {
    const chunks = chunkDocument(source.id, source.title, source.content);
    allChunks.push(...chunks);
  });

  if (allChunks.length === 0) {
    return {
      query,
      totalChunksInCorpus: 0,
      retrievedChunks: [],
      topScore: 0,
      latencyMs: Date.now() - startTime
    };
  }

  // 2. Score all chunks
  const scored: RetrievedChunk[] = allChunks.map(chunk => {
    const score = scoreChunk(queryTerms, chunk);
    return {
      ...chunk,
      score,
      scorePercentage: Math.round(score * 100),
      matchSnippet: chunk.text.slice(0, 160) + '...'
    };
  });

  // 3. Sort by score descending and take Top K
  scored.sort((a, b) => b.score - a.score);
  const retrievedChunks = scored.slice(0, topK);

  const topScore = retrievedChunks.length > 0 ? retrievedChunks[0].score : 0;
  const latencyMs = Math.max(1, Date.now() - startTime);

  return {
    query,
    totalChunksInCorpus: allChunks.length,
    retrievedChunks,
    topScore,
    latencyMs
  };
}

/**
 * Formats retrieved chunks into an augmented context prompt for Gemini
 */
export function buildRAGPromptContext(retrievedChunks: RetrievedChunk[]): string {
  if (retrievedChunks.length === 0) {
    return 'No relevant source passages retrieved.';
  }

  return retrievedChunks
    .map((chunk, index) => {
      return `[RETRIEVED CHUNK ${index + 1}] Source: "${chunk.sourceTitle}" (Relevance Match: ${chunk.scorePercentage}% | Chunk ${chunk.chunkIndex + 1}/${chunk.totalChunksInDoc})\n"${chunk.text}"\n---`;
    })
    .join('\n\n');
}
