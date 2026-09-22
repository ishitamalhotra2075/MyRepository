# ResearchGPT Developer Manual 💻🔬
### Comprehensive Technical Architecture, Data Flows, and Codebase Guide

This document is an in-depth technical manual written for engineers, technical architects, and contributors who want to understand every facet of the **ResearchGPT** application.

---

## 1. High-Level System Architecture

ResearchGPT adopts a **dual-runtime hybrid architecture** combining:
1. **Next.js 15 App Router (Frontend + Edge/Serverless Route Handlers)**: Powers the responsive user interface, server-rendered components, client state hydration, and native Vercel deployment.
2. **Express.js (Node.js REST API Server + Express Validator)**: Houses the standalone microservice endpoints, Multer file upload pipelines, and `express-validator` middleware for containerized or on-premise execution.
3. **Shared Business Logic Layer (`src/lib/`)**: Pure TypeScript modules containing citation validation algorithms, heuristic hallucination scoring, arXiv search parsers, and Paperpal academic tone analysis. Both the Express server and Next.js App Router share or replicate these routines.

```
                  ┌──────────────────────────────────────────────┐
                  │              User Web Browser                │
                  │   Desktop / Tablet / Mobile Phone (PWA)      │
                  └──────────────────────┬───────────────────────┘
                                         │ HTTP/JSON & Multipart
                                         ▼
            ┌────────────────────────────────────────────────────────┐
            │                 Next.js 15 App Router                  │
            │                  (Port 3000 / Vercel)                  │
            │                                                        │
            │  • React 19 UI Components (Glassmorphism, Tailwind)    │
            │  • Client Contexts (LibraryContext, Theme, Toast)      │
            │  • PWA Service Worker (sw.js) & Web App Manifest       │
            │  • Route Handlers (/api/chat, /api/citations/verify)   │
            └──────────────┬───────────────────────────┬─────────────┘
                           │                           │
          Direct Function  │                           │ Proxy / Standalone
          Call (Serverless)│                           │ (Port 5000)
                           ▼                           ▼
            ┌─────────────────────────────┐ ┌─────────────────────────────┐
            │  Core Scientific Engine     │ │   Express.js REST Server    │
            │  (src/lib/)                 │ │   (server/index.js)         │
            │  • Citation Validator       │ │   • express-validator       │
            │  • Hallucination Scorer     │ │   • Multer PDF Uploads      │
            │  • Paperpal Tone Auditor    │ │   • Cross-Origin CORS       │
            │  • Jenni AI Autocomplete    │ │   • /api/v1 REST Endpoints  │
            └──────────────┬──────────────┘ └──────────────┬──────────────┘
                           │                               │
                           ▼                               ▼
            ┌─────────────────────────────────────────────────────────────┐
            │              External Scientific Services                   │
            │  • CrossRef Global DOI Registry (api.crossref.org)          │
            │  • arXiv Public Export API (export.arxiv.org)               │
            │  • Digital Object Identifier (DOI.org)                      │
            └─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & File Map

```
D:\Project
├── public/
│   ├── manifest.json              # PWA Web App Manifest configuration
│   ├── sw.js                      # PWA Service Worker (offline caching)
│   └── icons/
│       ├── icon-192.svg           # PWA mobile icon (192x192)
│       └── icon-512.svg           # PWA desktop icon (512x512)
├── server/
│   ├── index.js                   # Express.js REST API entry point
│   └── middleware/
│       └── validation.js          # express-validator rules and handler
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with metadata and providers
│   │   ├── globals.css            # Tailwind directives and CSS variables
│   │   ├── page.tsx               # Overview Hub / Ecosystem Dashboard
│   │   ├── library/page.tsx       # PDF Reader and Manuscript Library
│   │   ├── chat/page.tsx          # AnswerThis-style Multi-Paper Grounded Chat
│   │   ├── scholar/page.tsx       # Google Scholar & arXiv Online Search
│   │   ├── compare/page.tsx       # Methodology Comparison Matrix
│   │   ├── detector/page.tsx      # Fake Citation & Hallucination Guard
│   │   ├── writer/page.tsx        # Jenni AI Co-Writer & Paperpal Auditor
│   │   ├── review/page.tsx        # Structured Literature Review Generator
│   │   ├── graph/page.tsx         # Interactive Research Knowledge Graph
│   │   └── api/                   # Next.js 15 App Router Route Handlers
│   │       ├── papers/route.ts
│   │       ├── chat/route.ts
│   │       ├── citations/verify/route.ts
│   │       ├── compare/route.ts
│   │       ├── scholar/route.ts
│   │       ├── review/route.ts
│   │       ├── writing/route.ts
│   │       └── graph/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Top navigation, theme toggle, actions
│   │   │   ├── Sidebar.tsx        # Responsive navigation drawer
│   │   │   ├── BottomNav.tsx      # Mobile-first touch bottom navigation
│   │   │   ├── AppShell.tsx       # State shell for modals & layout
│   │   │   └── PwaPrompt.tsx      # PWA one-click install prompt
│   │   ├── ui/                    # Reusable design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── library/
│   │   │   ├── PaperCard.tsx      # Paper representation card with actions
│   │   │   ├── PdfViewer.tsx      # Dual-view PDF & section reader
│   │   │   └── PaperUploadModal.tsx # Drag-and-drop PDF ingestion
│   │   ├── chat/
│   │   │   ├── ChatMessage.tsx    # AnswerThis message with quote cards
│   │   │   └── PaperSelector.tsx  # Multi-document grounding dropdown
│   │   ├── scholar/
│   │   │   ├── ScholarSearchResult.tsx # Online search card with import
│   │   │   └── BibtexModal.tsx    # BibTeX modal with clipboard copy
│   │   ├── detector/
│   │   │   ├── CitationAuditCard.tsx # Citation report breakdown
│   │   │   └── HallucinationGauge.tsx # Circular 0-100% SVG risk meter
│   │   ├── writer/
│   │   │   ├── JenniEditor.tsx    # Ghost-text editor with Tab accept
│   │   │   └── PaperpalAuditor.tsx# Rigor score & tone suggestions
│   │   └── graph/
│   │       └── ResearchGraph.tsx  # Interactive SVG force connection graph
│   ├── context/
│   │   ├── LibraryContext.tsx     # Papers store, multi-selection, localStorage
│   │   ├── ThemeContext.tsx       # Dark/light class toggler
│   │   └── ToastContext.tsx       # Animated toast notifications queue
│   └── lib/
│       ├── types.ts               # Core TypeScript definitions
│       ├── samplePapers.ts        # Seminal research manuscripts (Vaswani, Lewis, Hu)
│       ├── citationValidator.ts   # CrossRef & hallucination detection logic
│       ├── paperpalAuditor.ts     # Academic language & tone enhancement rules
│       ├── scholarSearch.ts       # arXiv public API parser
│       ├── researchEngine.ts      # Multi-paper chat, matrix, review synthesis
│       └── api.ts                 # Unified client API wrapper
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── .env.example
├── .env.local
├── README.md
└── DEVELOPER.md
```

---

## 3. Data Models & TypeScript Interfaces (`src/lib/types.ts`)

### `Paper`
Represents an ingested scientific publication:
```typescript
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  abstract: string;
  keywords: string[];
  citationCount?: number;
  uploadedAt: string;
  fileSize?: string;
  pagesCount?: number;
  sections?: PaperSection[];
  keyFindings?: string[];
  methodology?: {
    approach: string;
    dataset: string;
    metrics: string;
    limitations: string;
  };
  references?: PaperReference[];
}
```

### `CitationVerificationResult`
Returned by the Fake Citation Guard:
```typescript
export interface CitationVerificationResult {
  citationText: string;
  doi?: string;
  status: 'verified' | 'suspicious' | 'hallucinated';
  hallucinationRisk: number; // 0 to 100%
  extractedDetails: {
    title?: string;
    authors?: string[];
    year?: number;
    journal?: string;
  };
  matchedRecord?: {
    title: string;
    authors: string[];
    year: number;
    journal: string;
    doi: string;
    url: string;
    citations: number;
  };
  discrepancies: string[];
  verdictExplanation: string;
  suggestedCorrection?: string;
}
```

### `PaperpalAudit`
Returned by the Academic Language and Tone Auditor:
```typescript
export interface PaperpalAudit {
  originalText: string;
  academicScore: number; // 0 to 100
  tone: 'objective' | 'informal' | 'speculative' | 'dense';
  readabilityGrade: string;
  enhancements: {
    id: string;
    type: 'vocabulary' | 'tone' | 'grammar' | 'conciseness' | 'hedging';
    originalSpan: string;
    suggestedSpan: string;
    explanation: string;
  }[];
  summaryFeedback: string;
}
```

---

## 4. Fake Citation & Hallucination Detector Pipeline

One of the marquee features of ResearchGPT is the **Fake Citation Guard**. It combats the critical problem of LLMs fabricating citations (hallucinated DOIs, imaginary papers, or synthetic author pairings).

### Algorithmic Sequence:
1. **Regex Extraction**:
   Uses the official DOI standard regular expression:
   ```typescript
   export const DOI_REGEX = /10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/i;
   ```
2. **Entity Tokenization**:
   Extracts candidate publication year (`/\b(19\d\d|20[0-2]\d)\b/`), title enclosed in quotes or delimiters, and author names.
3. **Canonical Cache Lookup**:
   Checks against `VERIFIED_WORKS_DB` (indexed seminal works like *Attention Is All You Need*, *ResNet*, *RAG*, *LoRA*, *BERT*).
4. **Live CrossRef Registry Verification**:
   If a DOI is extracted, issues an HTTP request to `https://api.crossref.org/works/{doi}` with a dedicated user-agent header. If 200 OK is returned, reconciles the author list and publication year.
5. **Hallucination Risk Heuristics**:
   - Improbable future year (e.g., > 2026): **+45 risk**
   - Synthetic buzzword detection (`/quantum blockchain synergy|hyper-neural consciousness/`): **+40 risk**
   - Non-standard DOI format or unregistered prefix: **+35 risk**
   - No registry match found across CrossRef, PubMed, or arXiv: **Risk normalized to 85–98% (Hallucinated)**
6. **Suggested Correction Engine**:
   If discrepancies or hallucinations are found, the engine synthesizes an authentic APA citation from the nearest registered work.

---

## 5. Express Validator Middleware (`server/middleware/validation.js`)

In the standalone Express server, all incoming requests pass through `express-validator` chains before reaching route controllers:

```javascript
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed for request parameters",
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};
```

### Key Validation Rules:
- **`validateChat`**:
  - `body('query')`: Must be non-empty string, length 2 to 2000 chars.
  - `body('paperIds')`: Optional array of string IDs.
- **`validateCitationVerify`**:
  - `body('citationText')`: Must be non-empty string, length 5 to 3000 chars.
- **`validateCompare`**:
  - `body('paperIds')`: Array with at least 1 paper ID.
- **`validateReview`**:
  - `body('topic')`: String with length between 3 and 500 characters.
- **`validateWritingAudit`**:
  - `body('text')`: String between 5 and 10,000 characters.

---

## 6. Multi-Paper Grounded Chat (AnswerThis Mechanics)

The AnswerThis chat engine in `src/lib/researchEngine.ts` ensures that every response is verifiable:

1. **Context Window Merging**:
   Takes the user's active `selectedPaperIds` from `LibraryContext` and extracts abstracts, methodology entries, and sections.
2. **Intent Parsing**:
   Detects whether the user is asking about:
   - *Limitations / Weaknesses*: Gathers `paper.methodology.limitations` across all selected papers.
   - *Methodology / Architecture*: Evaluates `paper.methodology.approach`.
   - *Comparative Differences*: Formulates a structured contrast.
3. **Grounded Citation Tags**:
   Generates citation objects linked to each statement:
   ```typescript
   citations.push({
     paperId: paper.id,
     paperTitle: paper.title,
     pageNumber: computedPage,
     quote: verbatimExcerpt,
     relevance: "Defines core mathematical formulation and network topology."
   });
   ```
4. **Interactive UI Interactivity**:
   Clicking any citation tag in the chat UI opens the **Grounded Citation Modal**, which displays the verbatim excerpt, author metadata, and a direct link to the original PDF.

---

## 7. Jenni AI & Paperpal Academic Writing Engine

### Jenni AI Features:
- **Debounced Ghost-Text Autocompletion**:
  While the user types in `JenniEditor`, a `setTimeout` debounces for 600ms. If the text length exceeds 15 characters, it calls `api.getAutocomplete(content)`.
- **Keyboard Interception**:
  Listening to `onKeyDown`, if the user presses `Tab` while `ghostText` is visible, the suggested text is immediately appended to `content` and the suggestion is cleared.
- **Scholarly Paraphrasing Modes**:
  - `academic`: Elevates colloquial verbs to peer-reviewed diction (*"shows"* ➔ *"demonstrates"*, *"good"* ➔ *"optimal"*).
  - `expand`: Elucidates theoretical foundations and implications.
  - `condense`: Trims verbiage and eliminates passive fillers.
  - `simplify`: Converts dense jargon into lucid expository prose.

### Paperpal Auditor Features:
- **Rule-Based Phrasal Pattern Matching**:
  Scans text against curated academic style rules (hedging checks, objective diction, avoiding colloquial quantifiers like *"a lot of"* or *"huge amount"*).
- **Academic Score Formula**:
  `academicScore = Math.max(50, Math.min(98, 95 - (enhancements.length * 7)))`.
- **Direct Editor Injection**:
  Clicking "Apply" on any suggestion replaces the original substring in the editor with the suggested scholarly alternative and recalculates the score in real-time.

---

## 8. State Management Architecture

ResearchGPT utilizes React 19 Contexts for fast, zero-boilerplate client state:

| Context | State Managed | Storage Persistence |
|---|---|---|
| `LibraryContext` | `papers[]`, `selectedPaperIds[]`, `activePaper`, `searchQuery`, `selectedTag` | Persists custom uploaded papers to `localStorage['researchgpt-custom-papers']` |
| `ThemeContext` | `theme: 'dark' \| 'light'` | Persists to `localStorage['researchgpt-theme']` and toggles `.dark` class on `document.documentElement` |
| `ToastContext` | `toasts: Toast[]` | In-memory animated queue with auto-removal timeouts |

---

## 9. Progressive Web App (PWA) Implementation

ResearchGPT fulfills all PWA installation requirements:
1. **`public/manifest.json`**:
   - `start_url: "/"`
   - `display: "standalone"`
   - `background_color: "#09090b"`
   - `theme_color: "#4f46e5"`
   - Maskable SVG icons in 192x192 and 512x512 formats.
2. **`public/sw.js`**:
   - Pre-caches core static assets on install.
   - Network-first fetch handler that caches successful 200 GET requests and falls back to cached assets when offline.
3. **`src/components/layout/PwaPrompt.tsx`**:
   - Captures the browser's `beforeinstallprompt` event.
   - Renders a floating installation card allowing mobile or desktop users to trigger the native installation prompt with one tap.

---

## 10. Extending ResearchGPT (Production Enhancements)

### Integrating External Vector Databases
To scale beyond in-memory cosine similarity to millions of document chunks:
1. In `server/services/vectorStore.js`, initialize a client for **Pinecone**, **Qdrant**, or **pgvector**.
2. Chunk uploaded PDFs into 500-token passages using LangChain or LlamaIndex.
3. Generate embeddings using `text-embedding-3-small` or `text-embedding-004`.
4. Replace the keyword search in `src/lib/researchEngine.ts` with a similarity query against the vector index.

### Connecting External LLMs (Gemini / OpenAI)
1. Provide `GEMINI_API_KEY` or `OPENAI_API_KEY` in `.env.local`.
2. In `src/app/api/chat/route.ts`, route the query through `@google/genai` or `openai`:
   ```typescript
   import { GoogleGenAI } from "@google/genai";
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
   const response = await ai.models.generateContent({
     model: "gemini-2.5-flash",
     contents: promptWithGroundedContext
   });
   ```

---

## 11. Verification & Test Checklist

- [x] TypeScript build passes with zero errors (`npm run build`).
- [x] All 20 Next.js static and dynamic App Router routes render cleanly.
- [x] Express.js server starts on port 5000 and passes all validation middleware tests.
- [x] Fake Citation Guard catches synthetic DOIs and verifies authentic CrossRef publications.
- [x] Grounded chat cites specific pages and quotes.
- [x] Jenni AI editor accepts autocompletions on Tab press.
- [x] PWA manifest and service worker register cleanly.
- [x] Fully responsive across mobile phones, tablets, and desktop displays.
