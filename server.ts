import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { retrieveRelevantChunks, buildRAGPromptContext } from './src/utils/ragEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health / status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    model: 'gemini-3.8-flash',
    hasEnvKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Helper to get GoogleGenAI client
function getGenAIClient(customKey?: string) {
  const key = customKey?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Format source summaries for prompt context
function buildSourcesContext(sources: Array<{ id: string; title: string; content: string; wordCount: number }>) {
  if (!sources || sources.length === 0) {
    return 'No active sources selected.';
  }
  return sources
    .map((s, idx) => `[Source ${idx + 1}: "${s.title}" (${s.wordCount} words)]\n${s.content}\n---`)
    .join('\n\n');
}

// POST /api/rag/retrieve - Direct RAG Chunk Retrieval Endpoint
app.post('/api/rag/retrieve', (req, res) => {
  try {
    const { query, sources = [], topK = 4 } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required for retrieval' });
    }
    const ragResult = retrieveRelevantChunks(query, sources, topK);
    return res.json(ragResult);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'RAG retrieval error' });
  }
});

// POST /api/gemini/run - Universal RAG Execution for Chat, Studio, and Guide
app.post('/api/gemini/run', async (req, res) => {
  try {
    const { prompt, json = false, sources = [], query = '', customKey } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAIClient(customKey);

    if (ai) {
      try {
        const config: any = {
          temperature: json ? 0.3 : 0.7,
        };
        if (json) {
          config.responseMimeType = 'application/json';
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config,
        });

        const rawText = response.text || '';
        if (json) {
          try {
            const clean = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
            const parsed = JSON.parse(clean);
            return res.json({ data: parsed, text: rawText, usedRealModel: true });
          } catch (pe) {
            console.warn('JSON parse error from Gemini live response, trying heuristic extraction:', pe);
            const firstBrace = rawText.indexOf('{');
            const lastBrace = rawText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
              const sub = rawText.slice(firstBrace, lastBrace + 1);
              const parsed = JSON.parse(sub);
              return res.json({ data: parsed, text: rawText, usedRealModel: true });
            }
          }
        }
        return res.json({ text: rawText, usedRealModel: true });
      } catch (geminiError: any) {
        console.warn('Gemini live call error in /api/gemini/run:', geminiError?.message);
      }
    }

    // High fidelity fallback simulation if Gemini is offline
    if (json) {
      if (prompt.includes('"lines"') || prompt.includes('podcast script')) {
        return res.json({
          data: {
            lines: [
              { host: "Alex", text: "Welcome back! Today we are diving into our active study sources, breaking down the core mechanisms in clear steps." },
              { host: "Sam", text: "Right! And what's immediately striking is how the foundational concepts link directly to real-world processes." },
              { host: "Alex", text: "Exactly. The author emphasizes that energy transformations follow strict conservation rules, rather than occurring randomly." },
              { host: "Sam", text: "So if a student is reviewing for an exam, isolating the rate-limiting step is their highest leverage move." },
              { host: "Alex", text: "Spot on, Sam. Keep that equilibrium in mind as we review the remaining chapters!" }
            ]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"branches"') || prompt.includes('mind map')) {
        return res.json({
          data: {
            title: "Core Curriculum Mind Map",
            branches: [
              { name: "Foundational Principles", points: ["Energy transformations and conservation", "Thermodynamic and electrochemical gradients", "Critical state boundaries"] },
              { name: "Primary Mechanisms", points: ["Catalytic pathway acceleration", "Feedback loops and regulatory allostery", "Substrate binding thresholds"] },
              { name: "Experimental Evidence", points: ["Empirical verification protocols", "Comparative cross-study baselines", "Margin of error evaluation"] },
              { name: "High-Yield Applications", points: ["Exam problem patterns", "Industrial and clinical parallels", "System performance modeling"] }
            ]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"slides"') || prompt.includes('slide deck')) {
        return res.json({
          data: {
            slides: [
              { title: "Introduction & Theoretical Scope", bullets: ["Overview of primary materials", "Key definitions and scope boundaries", "Guiding questions"], narration: "Welcome to this module. We establish the foundational context and structural themes." },
              { title: "Core Mechanisms & Dynamics", bullets: ["Primary operational sequence", "Step-by-step pathway traversal", "Critical equilibrium factors"], narration: "Here we examine how each mechanism drives the overall system forward." },
              { title: "Quantitative & Analytical Models", bullets: ["Underlying mathematical formulations", "Parameter sensitivities", "Observable performance metrics"], narration: "Notice how small shifts in critical parameters trigger dramatic phase changes." },
              { title: "Summary & Synthesis", bullets: ["Integration across modules", "High-yield exam review tips", "Recommended next steps"], narration: "In conclusion, keep these three anchor concepts in mind as you synthesize your notes." }
            ]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"cards"') || prompt.includes('flashcards')) {
        return res.json({
          data: {
            cards: [
              { front: "What is the primary driving gradient in chemiosmosis?", back: "The electrochemical proton-motive force (Δp) generated across the inner mitochondrial membrane." },
              { front: "What does the Bloch sphere represent in quantum computing?", back: "A geometrical representation of the pure state space of a two-level quantum system (qubit)." },
              { front: "What is the primary objective of Quantitative Tightening (QT)?", back: "To contract central bank balance sheets and drain excess liquidity to tame inflation." },
              { front: "How do enzymes lower activation energy?", back: "By stabilizing the transition state and orienting substrates into optimal reactive geometries." },
              { front: "What is quantum superposition?", back: "The capacity of a quantum state to exist simultaneously as a linear combination of basis states (|0⟩ and |1⟩)." }
            ]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"questions"') || prompt.includes('quiz')) {
        return res.json({
          data: {
            questions: [
              { q: "Which complex in oxidative phosphorylation bypasses the initial proton pump?", options: ["Complex I", "Complex II (Succinate dehydrogenase)", "Complex III", "Complex IV"], answer: 1, why: "Complex II transfers electrons from FADH2 without pumping protons across the inner membrane." },
              { q: "What property allows Shor's algorithm to outpace classical factorization?", options: ["Quantum Fourier Transform on periodic states", "Classical binary search", "Brute-force trial division", "Monte Carlo annealing"], answer: 0, why: "Quantum Fourier Transform efficiently isolates modular periodicity in polynomial time." },
              { q: "In macroeconomics, what does an inverted yield curve historically signal?", options: ["Rapid economic boom", "Upcoming recessionary contraction", "Immediate hyperinflation", "Zero interest rates"], answer: 1, why: "Longer-term yields dropping below short-term rates reflect investor anticipation of growth slowdown and eventual rate cuts." }
            ]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"stats"') || prompt.includes('infographic')) {
        return res.json({
          data: {
            title: "Executive Source Infographic",
            tagline: "Grounded Synthesis of Key Curriculum Dimensions",
            stats: [
              { value: "3x", label: "Efficiency Gain" },
              { value: "98.4%", label: "Accuracy Index" },
              { value: "100%", label: "Source Grounded" }
            ],
            sections: [
              { icon: "⚡", heading: "Dynamic Catalysis", text: "Systems operate at peak efficiency when intermediate thresholds are sustained." },
              { icon: "🔬", heading: "Empirical Rigor", text: "Independent cross-trials confirm reproducibility under standard laboratory conditions." },
              { icon: "🌐", heading: "Systemic Integration", text: "Localized modules interface continuously through coordinated feedback loops." }
            ],
            steps: ["Initiation & substrate binding", "Catalytic conversion", "Equilibrium stabilization", "Feedback signal modulation"],
            terms: ["Proton-Motive Force", "Superposition", "Equilibrium", "Rate Limiting", "Allostery", "Decoherence"]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"columns"') || prompt.includes('data table')) {
        return res.json({
          data: {
            title: "Comparative Curriculum Matrix",
            columns: ["Domain / Concept", "Primary Mechanism", "Key Metric / Formula", "Exam Priority"],
            rows: [
              ["Cellular Respiration", "Chemiosmotic ATP synthesis", "Δp = Δψ - 59ΔpH", "High Yield"],
              ["Quantum Computing", "Superposition & entanglement", "|ψ⟩ = α|0⟩ + β|1⟩", "High Yield"],
              ["Macroeconomic Policy", "Monetary transmission channels", "M × V = P × Y", "Core Concept"],
              ["Enzyme Kinetics", "Transition state stabilization", "Michaelis-Menten (Km)", "Essential"]
            ]
          },
          usedRealModel: false
        });
      } else if (prompt.includes('"summary"') || prompt.includes('Notebook guide')) {
        return res.json({
          data: {
            summary: "The active curriculum synthesizes core scientific and economic mechanisms, focusing on how systemic conservation laws, catalytic pathways, and probabilistic states govern physical and financial systems [S1]. Understanding these interrelationships enables precise predictive problem-solving [S1].",
            questions: [
              "What is the primary rate-limiting mechanism discussed in the text?",
              "How do the active sources define systemic equilibrium?",
              "What are the three most common exam problem patterns for this topic?"
            ]
          },
          usedRealModel: false
        });
      }
    }

    // Markdown text fallback
    return res.json({
      text: `### 📚 Grounded Source Analysis\n\nBased on your active study documents, here is the synthesis:\n\n- **Core Conceptual Foundation [S1]**: The text establishes that system dynamics operate within strictly governed boundaries. Parameter shifts dictate whether equilibrium is maintained.\n\n- **Mechanistic Progression [S1]**: Each stage transfers state variables sequentially to downstream components, avoiding energetic bottlenecks.\n\n- **Key Takeaway [S1]**: Focus your study sessions on tracing these transitions rather than memorizing isolated terms.`,
      usedRealModel: false
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/run:', err);
    res.status(500).json({ error: err.message || 'Error processing request' });
  }
});

// POST /api/gemini/chat - Retrieval-Augmented Generation (RAG)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], sources = [], customKey } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. RAG Retrieval Phase: Top-K matching chunks
    const ragResult = retrieveRelevantChunks(message, sources, 4);
    const ragAugmentedContext = buildRAGPromptContext(ragResult.retrievedChunks);

    const ai = getGenAIClient(customKey);

    if (ai) {
      try {
        const systemInstruction = `You are "LensBook", an elite Retrieval-Augmented Generation (RAG) educational co-pilot modeled directly after NotebookLM.
You have been provided with Top-K retrieved passages from the user's active documents:

${ragAugmentedContext}

STRICT RAG RULES:
1. Ground your explanations, definitions, and synthesis directly on the retrieved chunk passages above.
2. Cite retrieved chunks using numbered citation pills [1], [2], corresponding directly to [RETRIEVED CHUNK 1], [RETRIEVED CHUNK 2], etc.
3. If asked about a concept, explain the exact mechanisms and cite key formulas or principles from the chunks.
4. If a question is not covered in the retrieved passages, transparently say that it is not present in the indexed sources.
5. Maintain a clear, concise, highly articulate academic tone with clean markdown.`;

        // Format history
        const formattedHistory = history.slice(-6).map((h: { sender: string; text: string }) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }));

        const chat = ai.chats.create({
          model: 'gemini-3.8-flash',
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        // Add history if present
        for (const item of formattedHistory) {
          if (item.role === 'user') {
            await chat.sendMessage({ message: item.parts[0].text });
          }
        }

        const result = await chat.sendMessage({ message });
        const replyText = result.text || 'I analyzed the retrieved passages, but could not produce a response.';

        return res.json({
          reply: replyText,
          sourcesCited: ragResult.retrievedChunks.map((c, i) => ({
            index: i + 1,
            id: c.sourceId,
            title: c.sourceTitle,
            scorePercentage: c.scorePercentage,
            chunkId: c.id
          })),
          retrievedChunks: ragResult.retrievedChunks,
          ragMetrics: {
            totalChunksInCorpus: ragResult.totalChunksInCorpus,
            chunksRetrieved: ragResult.retrievedChunks.length,
            topScore: Math.round(ragResult.topScore * 100),
            latencyMs: ragResult.latencyMs
          },
          usedRealModel: true
        });
      } catch (geminiError: any) {
        console.warn('Gemini live call error, falling back to simulated grounded study response:', geminiError?.message);
      }
    }

    // High fidelity fallback simulation grounded in active sources
    const query = (message as string).toLowerCase();
    let reply = '';
    const activeNames = sources.map((s: { title: string }, idx: number) => `[${idx + 1}] *${s.title}*`).join(', ');

    if (query.includes('summarize') || query.includes('summary') || query.includes('overview')) {
      reply = `### 📚 Grounded Source Synthesis\n\nBased on your active study sources (${activeNames}), here is the executive breakdown:\n\n` +
        `1. **Core Mechanistic Foundations [1]**\n` +
        `The active materials establish a fundamental interplay between localized energy transformations and systematic conservation laws. Whether analyzing cellular ATP synthesis via proton-motive gradient or quantum superposition states on the Bloch sphere, the underlying theme is energetic equilibrium.\n\n` +
        `2. **Key Operational Dynamics [2]**\n` +
        `- **Efficiency Optimization**: Dynamic feedback loops modulate throughput based on external substrate or algorithmic demands.\n` +
        `- **State Transition Thresholds**: Systems operate within strictly bounded critical regions where minute parameter shifts induce systemic phase changes.\n\n` +
        `3. **High-Yield Exam Takeaway [1][2]**\n` +
        `Mastery requires not just memorizing isolated definitions, but tracing the transfer of state across stages. Pay special attention to bottleneck phases in your review.`;
    } else if (query.includes('key terms') || query.includes('terminology') || query.includes('vocabulary')) {
      reply = `### 🔑 High-Yield Key Terminology\n\nExtracted directly from active sources (${activeNames}):\n\n` +
        `- **Chemiosmotic Coupling [1]**: The generation of ATP using energy stored in an electrochemical gradient across the inner mitochondrial membrane.\n` +
        `- **Bloch Sphere Superposition [2]**: Geometrical representation of the pure state space of a two-level quantum mechanical system (qubit).\n` +
        `- **Quantitative Tightening (QT) [3]**: Contractionary monetary policy reducing central bank balance sheets to stabilize inflation expectations.\n` +
        `- **Proton-Motive Force ($\Delta p$) [1]**: The electrochemical potential energy derived from pH and electrical voltage gradients across bio-membranes.\n` +
        `- **Quantum Decoherence [2]**: The irreversible loss of quantum coherence where phase information dissipates into the ambient environment.`;
    } else if (query.includes('practice questions') || query.includes('5 practice') || query.includes('quiz') || query.includes('test')) {
      reply = `### 📝 5 Active Recall Practice Questions\n\nTest your retention on the active materials:\n\n` +
        `1. **Question 1 (Mechanisms) [1]**\nWhy does complex II (succinate dehydrogenase) yield fewer ATP molecules than complex I during the electron transport chain?\n*Answer Key: FADH2 donates electrons downstream at complex II, bypassing the initial four-proton pump of complex I.*\n\n` +
        `2. **Question 2 (Quantum States) [2]**\nWhat mathematical transformation describes a Hadamard gate operation on a $|0\\rangle$ ground state qubit?\n*Answer Key: It creates an equal linear superposition $(|0\\rangle + |1\\rangle)/\\sqrt{2}$.*\n\n` +
        `3. **Question 3 (Monetary Equilibrium) [3]**\nIn an inverted yield curve scenario, what does market pricing imply regarding medium-term growth prospects?\n*Answer Key: Markets anticipate near-term contraction and subsequent central bank easing to counter recessionary pressures.*\n\n` +
        `4. **Question 4 (Metabolic Regulation) [1]**\nHow does high cytosolic ATP/AMP ratio act as an allosteric inhibitor on phosphofructokinase-1 (PFK-1)?\n*Answer Key: Abundant ATP binds allosteric sites, lowering enzyme affinity for fructose-6-phosphate to prevent metabolic waste.*\n\n` +
        `5. **Question 5 (Algorithmic Supremacy) [2]**\nWhat distinct principle enables Shor's algorithm to achieve polynomial time factorizations over classical exponential baselines?\n*Answer Key: Quantum Fourier Transform (QFT) isolating periodic eigenstates within modular exponentiation.*`;
    } else {
      reply = `### 💡 Grounded Study Insight\n\nRegarding your question: *"${message}"*\n\n` +
        `Cross-referencing your active sources (${activeNames}):\n\n` +
        `• **Direct Textual Alignment**: In the uploaded curriculum, this topic represents a pivotal conceptual junction. Key parameters directly dictate system performance and theoretical boundaries [1].\n\n` +
        `• **Practical Application**: When resolving exam scenarios or synthesizing research, remember to isolate the primary driving variables first before calculating secondary interactions [2].\n\n` +
        `• **Next Step Suggestion**: You can jump into the **Studio Feature Engine** on the right to listen to Dr. Evelyn and Leo break this down in the **Audio Overview**, or inspect the **Mind Map** for hierarchical branch details!`;
    }

    return res.json({
      reply,
      sourcesCited: ragResult.retrievedChunks.map((c, i) => ({
        index: i + 1,
        id: c.sourceId,
        title: c.sourceTitle,
        scorePercentage: c.scorePercentage,
        chunkId: c.id
      })),
      retrievedChunks: ragResult.retrievedChunks,
      ragMetrics: {
        totalChunksInCorpus: ragResult.totalChunksInCorpus,
        chunksRetrieved: ragResult.retrievedChunks.length,
        topScore: Math.round(ragResult.topScore * 100),
        latencyMs: ragResult.latencyMs
      },
      usedRealModel: false
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error in chat' });
  }
});

// POST /api/gemini/generate-studio
// Generates structured data for each of the 6 studio tabs
app.post('/api/gemini/generate-studio', async (req, res) => {
  try {
    const { feature, sources = [], focusPrompt = '', customKey } = req.body;

    if (!feature) {
      return res.status(400).json({ error: 'Feature name is required' });
    }

    const ai = getGenAIClient(customKey);
    const sourcesContext = buildSourcesContext(sources);

    if (ai) {
      try {
        if (feature === 'audio_overview') {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate a dual-host audio overview dialogue modeled after NotebookLM's Deep Dive.
Host A: "Dr. Evelyn Vance" (Analytical, authoritative, synthesizes fundamental mechanisms)
Host B: "Leo Miller" (Curious, inquisitive, bridges concepts with vivid analogies and asks probing questions)

Context Sources:
${sourcesContext}
${focusPrompt ? `Focus specifically on: ${focusPrompt}` : ''}

Return a valid JSON object matching this schema:
{
  "title": "Title of the Deep Dive Episode",
  "topic": "Primary Subject",
  "durationSeconds": 185,
  "summary": "Brief 2-sentence synopsis",
  "segments": [
    {
      "speaker": "Host A: Dr. Evelyn Vance" or "Host B: Leo Miller",
      "text": "Spoken dialogue string",
      "timestamp": "0:00",
      "emotion": "Curious" | "Analytical" | "Astonished" | "Insightful",
      "keyTakeaway": "Short highlight"
    }
  ]
}`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.8,
            }
          });

          const json = JSON.parse(response.text || '{}');
          if (json.segments && json.segments.length > 0) {
            return res.json({ data: json, usedRealModel: true });
          }
        } else if (feature === 'mind_map') {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate an expandable hierarchical mind map breaking down the provided study sources into categories and granular notes.

Context Sources:
${sourcesContext}
${focusPrompt ? `Focus specifically on: ${focusPrompt}` : ''}

Return a valid JSON object matching this schema:
{
  "root": {
    "id": "root-1",
    "name": "Central Core Theme",
    "description": "High-level description",
    "children": [
      {
        "id": "cat-1",
        "name": "Domain Category Name",
        "badge": "Essential" | "Intermediate" | "Advanced",
        "summary": "Short explanation",
        "children": [
          {
            "id": "sub-1",
            "name": "Subtopic Concept",
            "badge": "Core Theory",
            "notes": "Granular study note with formulas, mechanisms, or critical nuances.",
            "formula": "Optional mathematical formula or equation",
            "examTip": "High-yield test advice"
          }
        ]
      }
    ]
  }
}`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            }
          });

          const json = JSON.parse(response.text || '{}');
          if (json.root) {
            return res.json({ data: json, usedRealModel: true });
          }
        } else if (feature === 'slide_deck') {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate an educational slide deck structure complete with core bullets, visual callout cards, and structural voice narration strings.

Context Sources:
${sourcesContext}
${focusPrompt ? `Focus specifically on: ${focusPrompt}` : ''}

Return a valid JSON object matching this schema:
{
  "deckTitle": "Comprehensive Lecture Deck",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "subtitle": "Subtitle or Category",
      "bullets": ["Key bullet point 1", "Key bullet point 2", "Key bullet point 3"],
      "keyVisual": {
        "type": "metric" | "comparison" | "framework",
        "title": "Visual Callout Title",
        "value": "Key Stat or Metric",
        "caption": "Short descriptive label"
      },
      "voiceNarration": "Complete speaker presenter script explaining this slide naturally in voice."
    }
  ]
}`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            }
          });

          const json = JSON.parse(response.text || '{}');
          if (json.slides) {
            return res.json({ data: json, usedRealModel: true });
          }
        } else if (feature === 'quiz') {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate a challenging, high-yield practice quiz with 6 questions grounded in the active sources.

Context Sources:
${sourcesContext}
${focusPrompt ? `Focus specifically on: ${focusPrompt}` : ''}

Return a valid JSON object matching this schema:
{
  "quizTitle": "Mastery Assessment Quiz",
  "estimatedMinutes": 8,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "difficulty": "Easy" | "Medium" | "Hard",
      "explanation": "Detailed explanation of why the correct option is right and others are wrong.",
      "sourceRef": "Source title reference"
    }
  ]
}`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            }
          });

          const json = JSON.parse(response.text || '{}');
          if (json.questions) {
            return res.json({ data: json, usedRealModel: true });
          }
        } else if (feature === 'timeline') {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate a chronological timeline and key infographics dataset from the sources.

Context Sources:
${sourcesContext}
${focusPrompt ? `Focus specifically on: ${focusPrompt}` : ''}

Return a valid JSON object matching this schema:
{
  "timelineTitle": "Chronological & Progression Milestones",
  "events": [
    {
      "id": "ev-1",
      "epoch": "Stage 1 / Phase A / 1994",
      "title": "Milestone Title",
      "description": "Thorough chronological summary of the breakthrough or operational step.",
      "category": "Discovery" | "Mechanism" | "Synthesis" | "Policy",
      "impact": "High" | "Critical" | "Standard"
    }
  ],
  "infographics": [
    {
      "metric": "Key Quantitative Metric",
      "value": "30-32 ATP / 99.9% / 2.0%",
      "label": "Metric Name",
      "trend": "+14.2% yield" or "Benchmark",
      "description": "Contextual meaning of this stat"
    }
  ]
}`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            }
          });

          const json = JSON.parse(response.text || '{}');
          if (json.events) {
            return res.json({ data: json, usedRealModel: true });
          }
        } else if (feature === 'tables_faq') {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate a comparative data table and matching question-and-answer accordions from the sources.

Context Sources:
${sourcesContext}
${focusPrompt ? `Focus specifically on: ${focusPrompt}` : ''}

Return a valid JSON object matching this schema:
{
  "tableTitle": "Comparative Technical Matrix",
  "columns": ["Domain / Stage", "Primary Mechanism", "Key Substrates / Input", "Yield / Output", "Regulatory Bottleneck"],
  "rows": [
    {
      "col0": "Glycolysis",
      "col1": "Substrate-level phosphorylation",
      "col2": "1 Glucose, 2 NAD+",
      "col3": "2 Pyruvate, 2 ATP, 2 NADH",
      "col4": "Phosphofructokinase-1 (PFK-1)"
    }
  ],
  "faqs": [
    {
      "id": "faq-1",
      "category": "Bioenergetics" | "Quantum" | "Economics",
      "question": "Frequently asked conceptual question?",
      "answer": "Thorough scannable answer citing mechanisms.",
      "sourceRef": "Source title reference"
    }
  ]
}`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            }
          });

          const json = JSON.parse(response.text || '{}');
          if (json.columns && json.faqs) {
            return res.json({ data: json, usedRealModel: true });
          }
        }
      } catch (geminiError: any) {
        console.warn(`Gemini live call for feature ${feature} failed, falling back to simulated data:`, geminiError?.message);
      }
    }

    // Default high quality structured fallback templates
    const fallbackData = getFallbackDataForFeature(feature);
    return res.json({ data: fallbackData, usedRealModel: false });
  } catch (error: any) {
    console.error('Generate studio error:', error);
    res.status(500).json({ error: error.message || 'Internal server error in studio generation' });
  }
});

// Rich built-in datasets ensuring instant out-of-the-box readiness
function getFallbackDataForFeature(feature: string) {
  switch (feature) {
    case 'audio_overview':
      return {
        title: "Deep Dive: Cellular Bioenergetics, Quantum States & Macro Equilibrium",
        topic: "Interdisciplinary Synthesis",
        durationSeconds: 215,
        summary: "Dr. Evelyn Vance and Leo Miller deconstruct how microscopic energy gradients in mitochondria mirror state representations in quantum systems and macroscopic policy liquidity.",
        segments: [
          {
            speaker: "Host A: Dr. Evelyn Vance",
            text: "Welcome back to the StudyApex Deep Dive. Today we're tackling three foundational topics that, on the surface, seem worlds apart: cellular bioenergetics, quantum computing superposition, and monetary policy mechanisms.",
            timestamp: "0:00",
            emotion: "Analytical",
            keyTakeaway: "Introduction to interdisciplinary systemic equilibrium."
          },
          {
            speaker: "Host B: Leo Miller",
            text: "Right! And what blew my mind when reading these source documents is how both a cell synthesizing ATP and a central bank executing quantitative tightening are essentially managing tight potential gradients to prevent total breakdown.",
            timestamp: "0:22",
            emotion: "Curious",
            keyTakeaway: "Analogy between cellular gradient and economic liquidity."
          },
          {
            speaker: "Host A: Dr. Evelyn Vance",
            text: "Exactly, Leo. In cellular respiration, Peter Mitchell's chemiosmotic hypothesis proved that energy isn't transferred via some mystical chemical intermediate. It's stored as an electrochemical proton gradient—literally pumping H+ ions into the intermembrane space to turn the rotor of ATP synthase like a hydroelectric dam turbine.",
            timestamp: "0:48",
            emotion: "Insightful",
            keyTakeaway: "Chemiosmotic proton-motive force as a molecular turbine."
          },
          {
            speaker: "Host B: Leo Miller",
            text: "And that turbine generates about 30 to 32 ATP per glucose! But wait—when we cross over to quantum mechanics in Source 2, we see a whole different game. A classical bit is either 0 or 1, like an off/on switch, but a qubit sits anywhere on the Bloch sphere.",
            timestamp: "1:18",
            emotion: "Astonished",
            keyTakeaway: "Qubit superposition vs classical binary states."
          },
          {
            speaker: "Host A: Dr. Evelyn Vance",
            text: "Precisely. The superposition $|\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ allows algorithms like Shor's to explore exponentially large solution spaces in polynomial time. However, the Achilles heel is decoherence—environmental thermal noise destroying that delicate phase before computation completes.",
            timestamp: "1:44",
            emotion: "Analytical",
            keyTakeaway: "Superposition power constrained by environmental decoherence."
          },
          {
            speaker: "Host B: Leo Miller",
            text: "Which sounds uncomfortably close to central bankers in Source 3 trying to curb inflation without triggering a recessionary liquidity trap! If rates spike too fast, market confidence decoheres completely.",
            timestamp: "2:12",
            emotion: "Curious",
            keyTakeaway: "Macroeconomic interest rate sensitivity."
          },
          {
            speaker: "Host A: Dr. Evelyn Vance",
            text: "A sharp comparison. The yield curve inversion serves as the market's diagnostic sensor, warning that short-term funding pressure has exceeded equilibrium capacity.",
            timestamp: "2:38",
            emotion: "Insightful",
            keyTakeaway: "Yield curve as macroeconomic diagnostic sensor."
          }
        ]
      };

    case 'mind_map':
      return {
        root: {
          id: "root-core",
          name: "StudyApex Core Curriculum Matrix",
          description: "Synthesized conceptual hierarchy across active educational domains",
          children: [
            {
              id: "cat-bio",
              name: "1. Bioenergetics & Cellular Respiration",
              badge: "Essential",
              summary: "Pathways transforming glucose carbon bonds into usable ATP currency",
              children: [
                {
                  id: "sub-glyc",
                  name: "Glycolysis & Pyruvate Decarboxylation",
                  badge: "Cytoplasm",
                  notes: "10-step enzymatic pathway yielding 2 net ATP, 2 NADH, and 2 Pyruvate. Rate-limiting step: PFK-1.",
                  formula: "Glucose + 2 ADP + 2 Pi + 2 NAD+ -> 2 Pyruvate + 2 ATP + 2 NADH + 2 H+",
                  examTip: "PFK-1 is allosterically inhibited by high ATP and activated by AMP and F-2,6-BP."
                },
                {
                  id: "sub-krebs",
                  name: "Citric Acid (Krebs) Cycle",
                  badge: "Matrix",
                  notes: "Occurs inside mitochondrial matrix. 2 turns per glucose generate 6 NADH, 2 FADH2, and 2 GTP/ATP.",
                  formula: "Acetyl-CoA + Oxaloacetate -> Citrate (via Citrate Synthase)",
                  examTip: "Succinate dehydrogenase is the ONLY enzyme embedded directly in the inner mitochondrial membrane."
                },
                {
                  id: "sub-oxphos",
                  name: "Oxidative Phosphorylation & Chemiosmosis",
                  badge: "Inner Membrane",
                  notes: "Complexes I, III, and IV pump protons into intermembrane space; Complex V (ATP Synthase) harnesses proton flux.",
                  formula: "Proton-Motive Force: Δp = ΔΨ - (2.3 RT/F)ΔpH",
                  examTip: "Uncouplers like 2,4-DNP collapse Δp without inhibiting electron transport, dissipating energy as heat."
                }
              ]
            },
            {
              id: "cat-quantum",
              name: "2. Quantum Computing Foundations",
              badge: "Advanced",
              summary: "Principles of quantum superposition, entanglement, and computational gates",
              children: [
                {
                  id: "sub-qubit",
                  name: "Qubit & Bloch Sphere Geometry",
                  badge: "Hilbert Space",
                  notes: "State vector |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ with normalization |α|² + |β|² = 1.",
                  formula: "|ψ⟩ = α|0⟩ + β|1⟩",
                  examTip: "Measurement projects the superposition irrevocably into |0⟩ or |1⟩ with probabilities |α|² and |β|²."
                },
                {
                  id: "sub-gates",
                  name: "Quantum Logic Gates & Entanglement",
                  badge: "Unitary Transforms",
                  notes: "Hadamard creates equal superposition; CNOT creates Bell entangled states (|00⟩ + |11⟩)/√2.",
                  formula: "H = (1/√2) [[1, 1], [1, -1]]",
                  examTip: "All quantum gates must be reversible and unitary (U†U = I) to preserve norm."
                },
                {
                  id: "sub-shor",
                  name: "Shor's & Grover's Algorithms",
                  badge: "Complexity",
                  notes: "Shor offers exponential speedup for integer factorization via QFT; Grover offers quadratic speedup O(√N) for search.",
                  formula: "QFT: |j⟩ -> (1/√N) Σ exp(2πi jk/N) |k⟩",
                  examTip: "Threatens 2048-bit RSA encryption; mandates transition to post-quantum cryptography (PQC)."
                }
              ]
            },
            {
              id: "cat-macro",
              name: "3. Macroeconomics & Monetary Policy",
              badge: "Intermediate",
              summary: "Central bank transmission channels, interest rate corridors, and yield dynamics",
              children: [
                {
                  id: "sub-taylor",
                  name: "Taylor Rule & Inflation Targeting",
                  badge: "Corridor Rate",
                  notes: "Prescriptive policy model setting nominal interest rate based on inflation gaps and GDP output gap.",
                  formula: "i = r* + π + 0.5(π - π*) + 0.5(y - y*)",
                  examTip: "The Taylor principle requires raising nominal rate by MORE than 1:1 against inflation to raise REAL rates."
                },
                {
                  id: "sub-balance",
                  name: "Quantitative Easing vs Tightening (QT)",
                  badge: "Balance Sheet",
                  notes: "Direct asset purchase/redemption altering bank reserve liquidity and long-term borrowing term premiums.",
                  formula: "M2 = Monetary Base × Money Multiplier",
                  examTip: "QT drains liquidity without immediate rate hikes, flattening or inverting short-term funding spreads."
                }
              ]
            }
          ]
        }
      };

    case 'slide_deck':
      return {
        deckTitle: "StudyApex Master Curriculum Lecture Deck",
        slides: [
          {
            slideNumber: 1,
            title: "Cellular Bioenergetics: The Mitochondrial Dynamo",
            subtitle: "Module 1 • High-Yield Cellular Mechanisms",
            bullets: [
              "Chemiosmotic coupling translates chemical bond energy into an electrochemical proton gradient (Δp).",
              "Electron transport chain: Complexes I, III, and IV pump ~10 H+ per NADH across the inner membrane.",
              "Complex V (ATP Synthase) functions as a molecular rotary motor producing ~1 ATP per 3-4 H+ influx."
            ],
            keyVisual: {
              type: "metric",
              title: "Net Energy Harvest",
              value: "30-32 ATP",
              caption: "Calculated per complete glucose oxidation cycle"
            },
            voiceNarration: "Welcome everyone. In this opening slide, we examine the extraordinary molecular turbine inside our cells. Notice how the electron transport chain doesn't make ATP directly—it pumps protons out, creating a concentrated battery charge across the inner membrane that drives the catalytic head of ATP synthase."
          },
          {
            slideNumber: 2,
            title: "Quantum Superposition & The Bloch Sphere",
            subtitle: "Module 2 • Quantum Information Architecture",
            bullets: [
              "Unlike classical bits bounded to binary 0 or 1, a qubit occupies continuous probability amplitudes.",
              "The state vector |ψ⟩ = α|0⟩ + β|1⟩ is constrained by unitary conservation |α|² + |β|² = 1.",
              "Unitary logic gates (Hadamard, Pauli-X, CNOT) execute rotations on the sphere surface without measurement."
            ],
            keyVisual: {
              type: "comparison",
              title: "Information State Space",
              value: "2^N Hilbert Dim",
              caption: "Exponential parallelism across N entangled qubits"
            },
            voiceNarration: "Turning now to quantum foundations. Here we see the Bloch sphere representation. While a conventional computer must check states sequentially, an array of entangled qubits explores a two-to-the-N dimensional state space simultaneously until an observation collapses the wave function."
          },
          {
            slideNumber: 3,
            title: "Monetary Policy Transmission & Yield Inversion",
            subtitle: "Module 3 • Macroeconomic Balance Sheet Dynamics",
            bullets: [
              "The Federal Reserve dual mandate: Maximum employment and long-run price stability (2.0% target).",
              "Taylor Rule dynamics: Adjusting the Federal Funds Rate above neutral to cool overheated output gaps.",
              "Yield Curve Inversion (2Y vs 10Y Treasury): Historic leading indicator signaling imminent recessionary risk."
            ],
            keyVisual: {
              type: "framework",
              title: "Inflation Target Corridor",
              value: "2.0% PCE",
              caption: "Anchor for long-term consumer inflation expectations"
            },
            voiceNarration: "Finally, let's step back to macroeconomics. When demand drives inflation away from the two percent anchor, central banks hike policy rates. If short-term rates eclipse ten-year yields, that inversion signals that debt markets anticipate contraction ahead."
          },
          {
            slideNumber: 4,
            title: "Synthesis: Resilient Systems Under Stress",
            subtitle: "Module 4 • Cross-Domain Conceptual Review",
            bullets: [
              "Biological threshold: Glycolysis shifts to lactic fermentation when oxygen oxygen acceptors are depleted.",
              "Quantum threshold: Decoherence time T2 sets the upper bound on viable gate depth before error accumulation.",
              "Economic threshold: The Zero Lower Bound (ZLB) forces monetary authorities into unconventional quantitative easing."
            ],
            keyVisual: {
              type: "metric",
              title: "System Fault Limit",
              value: "Threshold Dynamics",
              caption: "Non-linear failure states when buffers are exhausted"
            },
            voiceNarration: "To conclude, consider the overarching lesson from all three domains: systems maintain equilibrium through feedback buffers, but once those buffers cross critical thresholds, non-linear phase transitions take place."
          }
        ]
      };

    case 'quiz':
      return {
        quizTitle: "StudyApex Active Recall Mastery Assessment",
        estimatedMinutes: 10,
        questions: [
          {
            id: "q-1",
            question: "In mitochondrial oxidative phosphorylation, what is the exact physical driving force that induces rotation in the c-ring of ATP synthase?",
            options: [
              "Direct electrostatic repulsion of ADP by magnesium ions",
              "Protonation and deprotonation of specific aspartate/glutamate residues within the c-subunit",
              "Thermal fluctuation of water molecules inside the intermembrane space",
              "Active ATP hydrolysis occurring in the mitochondrial matrix"
            ],
            correctIndex: 1,
            difficulty: "Hard",
            explanation: "Protons enter through the half-channels of the stationary a-subunit, protonating a conserved carboxylate residue (aspartate or glutamate) on the c-ring. This neutralizes its charge, allowing it to rotate through the hydrophobic lipid bilayer until exiting into the matrix.",
            sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
          },
          {
            id: "q-2",
            question: "Why does the oxidation of one molecule of FADH2 generate fewer ATP molecules (~1.5) than one molecule of NADH (~2.5)?",
            options: [
              "FADH2 cannot enter the mitochondrial matrix and remains trapped in the cytosol",
              "FADH2 enters electron transport at Complex II, bypassing the proton pumping of Complex I",
              "FADH2 produces cytotoxic superoxide radicals that destroy ATP synthase",
              "FADH2 electrons are carried directly to oxygen without cytochrome c mediation"
            ],
            correctIndex: 1,
            difficulty: "Medium",
            explanation: "Electrons from FADH2 are transferred to ubiquinone via Complex II (succinate dehydrogenase). Because Complex II does not pump protons across the inner membrane, four fewer protons are translocated per electron pair compared to NADH (which enters at Complex I).",
            sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
          },
          {
            id: "q-3",
            question: "A single-qubit quantum state is prepared in $|0\\rangle$. What is the resulting state vector after applying a standard Hadamard gate?",
            options: [
              "|1⟩",
              "(|0⟩ + |1⟩) / √2",
              "i|0⟩ - |1⟩",
              "(|0⟩ - |1⟩) / 2"
            ],
            correctIndex: 1,
            difficulty: "Easy",
            explanation: "The Hadamard transform maps computational basis states into equal superpositions: H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ - |1⟩)/√2. This places the qubit along the +X axis of the Bloch sphere.",
            sourceRef: "Source 2: Quantum Computing Foundations"
          },
          {
            id: "q-4",
            question: "In quantum information theory, what does the 'No-Cloning Theorem' fundamentally state?",
            options: [
              "Quantum computers can never simulate classical deterministic circuits",
              "It is physically impossible to create an identical copy of an arbitrary unknown quantum state",
              "Entangled pairs must immediately decouple if separated by more than 1 kilometer",
              "Error correction circuits cannot detect phase-flip bit errors"
            ],
            correctIndex: 1,
            difficulty: "Medium",
            explanation: "The linearity of quantum mechanics and unitary operations prohibits any physical transformation that copies an arbitrary unknown quantum state |ψ⟩ onto another blank state |0⟩ without altering the original.",
            sourceRef: "Source 2: Quantum Computing Foundations"
          },
          {
            id: "q-5",
            question: "According to the monetary policy Taylor Rule, if inflation rises by 1 percentage point above target, how should the central bank adjust nominal interest rates to maintain stabilizing real conditions?",
            options: [
              "Keep nominal rates completely constant to prevent banking sector volatility",
              "Raise nominal interest rates by MORE than 1 percentage point (e.g. 1.5 pp) so real rates rise",
              "Lower nominal rates by 1 percentage point to encourage investment",
              "Limit the rate change strictly to the rate of population growth"
            ],
            correctIndex: 1,
            difficulty: "Hard",
            explanation: "This is the core 'Taylor Principle': if inflation increases by 1%, the central bank must raise nominal rates by more than 1% (typically 1.5%). This ensures the real interest rate (r = i - π) actually rises, discouraging excessive borrowing and cooling aggregate demand.",
            sourceRef: "Source 3: Macroeconomics & Monetary Policy"
          },
          {
            id: "q-6",
            question: "When the Treasury yield curve inverts (e.g., 2-Year yields exceed 10-Year yields), what primary market expectation is reflected?",
            options: [
              "Investors anticipate runaway economic expansion over the coming decade",
              "Investors anticipate near-term monetary tightening followed by eventual economic slowdown and rate cuts",
              "The Federal Reserve has permanently eliminated government bond auctions",
              "Commercial banks have ceased offering checking deposits"
            ],
            correctIndex: 1,
            difficulty: "Medium",
            explanation: "An inverted yield curve reflects investor expectations that current high short-term interest rates will slow down economic activity, compelling the central bank to lower rates in the future. Historically, this has been a reliable predictor of economic downturns.",
            sourceRef: "Source 3: Macroeconomics & Monetary Policy"
          }
        ]
      };

    case 'timeline':
      return {
        timelineTitle: "Chronological Progression & Scientific Milestones",
        events: [
          {
            id: "t-1",
            epoch: "1961 - Chemiosmotic Revolution",
            title: "Peter Mitchell Proposes Proton-Motive Coupling",
            description: "Mitchell overturned conventional biochemistry by proposing that ATP synthesis is energized by an electrochemical proton gradient across membranes rather than high-energy chemical intermediates, earning the 1978 Nobel Prize.",
            category: "Discovery",
            impact: "Critical"
          },
          {
            id: "t-2",
            epoch: "1982 - Quantum Computing Vision",
            title: "Feynman's Quantum Simulation Postulate",
            description: "Richard Feynman demonstrated that classical computers cannot efficiently simulate quantum mechanical systems without exponential overhead, proposing computers constructed of quantum elements.",
            category: "Discovery",
            impact: "High"
          },
          {
            id: "t-3",
            epoch: "1993 - Systematic Monetary Rules",
            title: "John B. Taylor Publishes the Taylor Rule",
            description: "Introduced the rule-based policy guideline linking central bank target rates to inflation gaps and real output gaps, moving central banking away from discretionary ad-hoc decisions.",
            category: "Policy",
            impact: "High"
          },
          {
            id: "t-4",
            epoch: "1994 - Algorithmic Cryptanalysis",
            title: "Peter Shor Formulates Quantum Factoring",
            description: "Shor demonstrated polynomial-time integer factorization on a quantum machine, establishing that quantum computing poses an existential disruption to RSA public-key cryptography.",
            category: "Mechanism",
            impact: "Critical"
          },
          {
            id: "t-5",
            epoch: "1997 - Rotary Catalysis Confirmation",
            title: "John Walker & Paul Boyer Solve ATP Synthase",
            description: "Crystallographic X-ray structure verified that ATP synthase rotates physically at speeds upwards of 100 revolutions per second, confirming mechanical rotation in living organisms.",
            category: "Mechanism",
            impact: "Critical"
          },
          {
            id: "t-6",
            epoch: "2024–2026 - Modern Frontier Synthesis",
            title: "Fault-Tolerant Logical Qubits & Balance Sheet Normalization",
            description: "Hardware transitions from noisy intermediate-scale quantum (NISQ) systems toward neutral-atom and superconducting surface code error correction, while central banks execute quantitative tightening (QT).",
            category: "Synthesis",
            impact: "High"
          }
        ],
        infographics: [
          {
            metric: "ATP Harvest per Glucose",
            value: "30-32 ATP",
            label: "Net Bio-Yield",
            trend: "+38% theoretical max",
            description: "Efficiency of aerobic respiration versus just 2 ATP produced via anaerobic glycolysis alone."
          },
          {
            metric: "Bloch Sphere State Space",
            value: "2^50+ States",
            label: "Quantum Hilbert Dim",
            trend: "Exponential scale",
            description: "A 50-qubit quantum state demands more classical RAM to simulate than exists on ordinary supercomputers."
          },
          {
            metric: "Taylor Inflation Target",
            value: "2.0% Core PCE",
            label: "Target Stability Anchor",
            trend: "Target benchmark",
            description: "The targeted annual price increase standard utilized by the Federal Open Market Committee."
          },
          {
            metric: "Decoherence Window",
            value: "~100-300 μs",
            label: "Superconducting T2",
            trend: "Coherence limit",
            description: "Active time available to execute quantum gate operations before environmental noise causes phase collapse."
          }
        ]
      };

    case 'tables_faq':
      return {
        tableTitle: "Comparative Technical Matrix: Metabolic, Quantum & Economic Systems",
        columns: [
          "Discipline / Stage",
          "Primary Mechanism",
          "Fundamental Unit",
          "Key Limiting Bottleneck",
          "Equilibrium Metric"
        ],
        rows: [
          {
            col0: "Glycolysis (Bioenergetics)",
            col1: "Substrate-level phosphorylation",
            col2: "Glucose (6-Carbon)",
            col3: "Phosphofructokinase-1 (PFK-1)",
            col4: "2 net ATP / 2 NADH"
          },
          {
            col0: "Citric Acid Cycle (Bio)",
            col1: "Oxidative decarboxylation",
            col2: "Acetyl-CoA",
            col3: "Isocitrate Dehydrogenase",
            col4: "3 NADH, 1 FADH2, 1 GTP"
          },
          {
            col0: "Electron Transport (Bio)",
            col1: "Chemiosmotic proton pumping",
            col2: "Electrons / H+ protons",
            col3: "Oxygen (terminal acceptor)",
            col4: "Proton-Motive Force (Δp)"
          },
          {
            col0: "Quantum Computing",
            col1: "Unitary superposition & phase",
            col2: "Qubit (|0⟩, |1⟩)",
            col3: "Decoherence (T1/T2 relaxation)",
            col4: "Fidelity > 99.9%"
          },
          {
            col0: "Monetary Policy (Macro)",
            col1: "Interest rate corridor & QT",
            col2: "Monetary Base / Reserves",
            col3: "Zero Lower Bound / Stagflation",
            col4: "2.0% Inflation / Neutral r*"
          }
        ],
        faqs: [
          {
            id: "faq-1",
            category: "Bioenergetics",
            question: "Why does uncoupling oxidative phosphorylation cause hyperthermia (rapid overheating)?",
            answer: "Compounds like 2,4-dinitrophenol (DNP) transport protons across the inner mitochondrial membrane into the matrix, bypassing ATP synthase. Because electron transport continues at maximum speed without resistance, 100% of the proton gradient energy is dissipated directly as thermal heat instead of being captured into chemical bonds of ATP.",
            sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
          },
          {
            id: "faq-2",
            category: "Bioenergetics",
            question: "What is the difference between substrate-level phosphorylation and oxidative phosphorylation?",
            answer: "Substrate-level phosphorylation directly transfers a high-energy phosphate group from a phosphorylated metabolic intermediate to ADP (such as 1,3-bisphosphoglycerate to 3-phosphoglycerate). Oxidative phosphorylation uses redox energy from electron transport to pump protons across a membrane, driving ATP synthesis indirectly via ATP synthase rotary catalysis.",
            sourceRef: "Source 1: Cellular Respiration & Bioenergetics"
          },
          {
            id: "faq-3",
            category: "Quantum Computing",
            question: "Why can't we simply read out all superposition states at the end of a quantum algorithm?",
            answer: "According to the Born rule in quantum mechanics, measuring a qubit forces its state vector to collapse probabilistically into one of the classical basis eigenstates (|0⟩ or |1⟩). Quantum algorithms like Shor's rely on constructive and destructive phase interference so the desired answer has near-100% measurement probability upon collapse.",
            sourceRef: "Source 2: Quantum Computing Foundations"
          },
          {
            id: "faq-4",
            category: "Quantum Computing",
            question: "What is quantum entanglement and how does it differ from classical correlation?",
            answer: "Entanglement is a non-separable quantum state of two or more qubits (e.g. (|00⟩ + |11⟩)/√2). Even when separated by light-years, the outcome of measuring one qubit instantaneously determines the state of the other, violating Bell's inequalities and exhibiting correlations that cannot be explained by classical hidden variables.",
            sourceRef: "Source 2: Quantum Computing Foundations"
          },
          {
            id: "faq-5",
            category: "Macroeconomics",
            question: "Why do central banks fear deflation even more than moderate inflation?",
            answer: "Deflation causes real debt burdens to escalate, as wages and corporate revenues fall while debt principal remains fixed. Furthermore, consumers postpone big-ticket purchases anticipating lower prices tomorrow, triggering a contractionary spiral where consumption drops, businesses lay off workers, and nominal interest rates strike the Zero Lower Bound.",
            sourceRef: "Source 3: Macroeconomics & Monetary Policy"
          },
          {
            id: "faq-6",
            category: "Macroeconomics",
            question: "How does Quantitative Tightening (QT) work in practice?",
            answer: "In QT, the central bank allows Treasuries and mortgage-backed securities on its balance sheet to mature without reinvesting the proceeds, or sells them outright. This drains bank reserves from the financial system and increases the supply of bonds in private markets, pushing long-term bond yields up and tightening financial conditions.",
            sourceRef: "Source 3: Macroeconomics & Monetary Policy"
          }
        ]
      };

    default:
      return {};
  }
}

// Vite integration / Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve dist folder
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyApex server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
