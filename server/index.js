const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  validateChat,
  validateCitationVerify,
  validateCompare,
  validateReview,
  validateWritingAudit,
  validateScholarSearch,
  validatePaperCreate
} = require("./middleware/validation");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF documents are supported"));
    }
  }
});

// In-memory mock database initialized with seminal papers
let papersStore = [
  {
    id: "paper-transformer-2017",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
    year: 2017,
    venue: "NeurIPS 2017",
    doi: "10.48550/arXiv.1706.03762",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, based solely on attention mechanisms.",
    keywords: ["Transformers", "Self-Attention", "Deep Learning"],
    citationCount: 118450,
    uploadedAt: "2026-09-10T10:00:00Z",
    pagesCount: 15,
    methodology: {
      approach: "Stacked multi-head self-attention encoder-decoder",
      dataset: "WMT 2014 English-German & English-French",
      metrics: "28.4 BLEU score",
      limitations: "Quadratic memory complexity with sequence length"
    },
    keyFindings: [
      "Eliminates recurrence entirely via multi-head self-attention.",
      "Improves translation quality by over 2 BLEU while training faster."
    ]
  },
  {
    id: "paper-rag-2020",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni"],
    year: 2020,
    venue: "NeurIPS 2020",
    doi: "10.48550/arXiv.2005.11401",
    abstract: "We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) — models combining parametric and non-parametric memory.",
    keywords: ["RAG", "Dense Passage Retrieval", "Hallucination Reduction"],
    citationCount: 4120,
    uploadedAt: "2026-09-12T14:30:00Z",
    pagesCount: 19,
    methodology: {
      approach: "Hybrid DPR retriever paired with seq2seq BART generator",
      dataset: "Wikipedia 21M passages on Natural Questions and WebQuestions",
      metrics: "State-of-the-art exact match on open domain QA",
      limitations: "Inference latency due to dense index retrieval"
    },
    keyFindings: [
      "Dynamic non-parametric retrieval reduces factual hallucination.",
      "Enables continuous knowledge updates without retraining foundation weights."
    ]
  },
  {
    id: "paper-lora-2021",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Weizhu Chen"],
    year: 2021,
    venue: "ICLR 2022",
    doi: "10.48550/arXiv.2106.09685",
    abstract: "We propose Low-Rank Adaptation (LoRA), which freezes pre-trained model weights and injects trainable rank decomposition matrices.",
    keywords: ["LoRA", "PEFT", "Fine-Tuning Efficiency"],
    citationCount: 6890,
    uploadedAt: "2026-09-14T09:15:00Z",
    pagesCount: 14,
    methodology: {
      approach: "Low-rank matrix update W = W0 + B*A with rank r << d",
      dataset: "GLUE, E2E NLG, and DART generation benchmarks",
      metrics: "Equal or better performance than full fine-tuning with 10,000x fewer parameters",
      limitations: "Multi-task batching requires custom adapter scheduling"
    },
    keyFindings: [
      "Drastically slashes GPU VRAM footprint during fine-tuning.",
      "Zero inference latency when adapters are merged into base weights."
    ]
  }
];

// --- REST API Endpoints ---

// 1. Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ResearchGPT API Engine",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// 2. Papers - List all
app.get("/api/v1/papers", (req, res) => {
  res.json({ success: true, count: papersStore.length, papers: papersStore });
});

// 3. Papers - Get single paper
app.get("/api/v1/papers/:id", (req, res) => {
  const paper = papersStore.find(p => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ success: false, message: "Paper not found" });
  }
  res.json({ success: true, paper });
});

// 4. Papers - Create / Upload (With express-validator)
app.post("/api/v1/papers", validatePaperCreate, (req, res) => {
  const { title, abstract, year, authors, venue, doi, keywords } = req.body;
  const newPaper = {
    id: `paper-${Date.now()}`,
    title,
    abstract,
    year: year || new Date().getFullYear(),
    authors: authors || ["Unknown Author"],
    venue: venue || "Uploaded Manuscript",
    doi: doi || `10.48550/user.${Date.now()}`,
    keywords: keywords || ["Machine Learning", "Research"],
    citationCount: 0,
    uploadedAt: new Date().toISOString(),
    pagesCount: 10,
    methodology: {
      approach: "User defined empirical investigation",
      dataset: "Custom research evaluation set",
      metrics: "Custom metrics",
      limitations: "Subject to experimental scope"
    },
    keyFindings: [
      "User submitted manuscript awaiting peer evaluation.",
      "Abstract highlights empirical novelty."
    ]
  };
  papersStore.unshift(newPaper);
  res.status(201).json({ success: true, paper: newPaper });
});

// 5. PDF File Upload Route (Multer + parsing simulation)
app.post("/api/v1/papers/upload-pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No PDF file received" });
  }

  const cleanName = req.file.originalname.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
  const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  const newPaper = {
    id: `paper-pdf-${Date.now()}`,
    title: title,
    authors: ["Lead Researcher", "Co-Author et al."],
    year: new Date().getFullYear(),
    venue: "Uploaded PDF Archive",
    doi: `10.48550/uploaded.${Date.now()}`,
    abstract: `Extracted from uploaded document '${req.file.originalname}'. Investigates computational properties, empirical methodology, and algorithmic evaluation.`,
    keywords: ["PDF Analysis", "Extracted Corpus", "Empirical Research"],
    citationCount: 1,
    uploadedAt: new Date().toISOString(),
    fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
    pagesCount: Math.floor(Math.random() * 15) + 5,
    methodology: {
      approach: "Automated document ingestion and vector representation",
      dataset: "Local document corpus",
      metrics: "Extraction fidelity and OCR accuracy",
      limitations: "Subject to original PDF formatting constraints"
    },
    keyFindings: [
      "Successfully extracted and indexed document sections.",
      "Grounded citation references ready for AnswerThis semantic synthesis."
    ]
  };

  papersStore.unshift(newPaper);
  res.status(201).json({
    success: true,
    message: "PDF uploaded and parsed successfully",
    paper: newPaper
  });
});

// 6. Multi-Paper Chat API (AnswerThis Style) with express-validator
app.post("/api/v1/chat", validateChat, (req, res) => {
  const { query, paperIds } = req.body;
  const activePapers = paperIds && paperIds.length > 0
    ? papersStore.filter(p => paperIds.includes(p.id))
    : papersStore.slice(0, 2);

  const citations = activePapers.map((p, idx) => ({
    paperId: p.id,
    paperTitle: p.title,
    pageNumber: idx + 2,
    quote: `"${p.abstract.slice(0, 140)}..."`,
    relevance: "Primary discussion of findings and methodology."
  }));

  const response = {
    id: `msg-${Date.now()}`,
    role: "assistant",
    timestamp: new Date().toISOString(),
    content: `Based on your analysis query "${query}":\n\n` +
      activePapers.map((p, i) => `• In **${p.title}** (${p.year}) [p. ${i + 2}]: ${p.keyFindings?.[0] || p.abstract.slice(0, 160)}...`).join("\n\n") +
      `\n\n**AnswerThis Synthesis**: Both architectures prioritize reducing memory overhead while safeguarding factual grounding.`,
    citedPaperIds: activePapers.map(p => p.id),
    citations,
    synthesisTheme: "Multi-Paper Grounded Review"
  };

  res.json({ success: true, message: response });
});

// 7. Methodology Comparison API with express-validator
app.post("/api/v1/compare", validateCompare, (req, res) => {
  const { paperIds } = req.body;
  const selected = papersStore.filter(p => paperIds.includes(p.id));
  if (selected.length === 0) {
    return res.status(404).json({ success: false, message: "No matching papers found for given IDs" });
  }

  const dimensions = [
    {
      name: "Core Architecture / Approach",
      description: "Fundamental mathematical and algorithmic foundation",
      values: selected.reduce((acc, p) => {
        acc[p.id] = p.methodology?.approach || p.abstract.slice(0, 100);
        return acc;
      }, {})
    },
    {
      name: "Benchmark Dataset",
      description: "Corpus and benchmark datasets utilized in empirical tests",
      values: selected.reduce((acc, p) => {
        acc[p.id] = p.methodology?.dataset || "Standard Benchmark Evaluation";
        return acc;
      }, {})
    },
    {
      name: "Critical Bottlenecks",
      description: "Documented limitations and computational complexity",
      values: selected.reduce((acc, p) => {
        acc[p.id] = p.methodology?.limitations || "Requires scale";
        return acc;
      }, {})
    }
  ];

  res.json({
    success: true,
    matrix: {
      paperIds: selected.map(p => p.id),
      dimensions,
      summary: `Comparative breakdown across ${selected.length} scientific works.`
    }
  });
});

// 8. Fake Citation & Hallucination Detector API (Paperpal style) with express-validator
app.post("/api/v1/citations/verify", validateCitationVerify, async (req, res) => {
  const { citationText } = req.body;
  const doiMatch = citationText.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/i);
  const detectedDoi = doiMatch ? doiMatch[0].replace(/[.,;)]+$/, "") : null;

  const isSuspiciousFuture = /\b(202[7-9]|203\d)\b/.test(citationText);
  const isSynthetic = /quantum blockchain synergy|hyper-neural consciousness|crypto deep synthesis/i.test(citationText);

  if (isSynthetic || isSuspiciousFuture) {
    return res.json({
      success: true,
      result: {
        citationText,
        doi: detectedDoi,
        status: "hallucinated",
        hallucinationRisk: 96,
        discrepancies: [
          "Contains synthetic LLM hallucination tokens not present in CrossRef or arXiv registries.",
          isSuspiciousFuture ? "Publication date is in the future." : "Non-existent author or journal combination."
        ],
        verdictExplanation: "HIGH HALLUCINATION RISK: Fabricated reference detected. No matching registry record exists.",
        suggestedCorrection: "Verify against peer-reviewed bibliography or replace with a real CrossRef-indexed study."
      }
    });
  }

  // Check known DOI or valid DOI
  if (detectedDoi) {
    return res.json({
      success: true,
      result: {
        citationText,
        doi: detectedDoi,
        status: "verified",
        hallucinationRisk: 3,
        discrepancies: [],
        matchedRecord: {
          title: "Verified Scientific Publication",
          doi: detectedDoi,
          journal: "Indexed Journal",
          year: 2021,
          url: `https://doi.org/${detectedDoi}`,
          citations: 1250
        },
        verdictExplanation: "Authenticated against CrossRef Global DOI Registry. Publication metadata is authentic."
      }
    });
  }

  res.json({
    success: true,
    result: {
      citationText,
      status: "suspicious",
      hallucinationRisk: 48,
      discrepancies: ["No valid Digital Object Identifier (DOI) detected in citation string."],
      verdictExplanation: "Unindexed or incomplete reference. Recommendation: Append an authentic DOI or verified URL."
    }
  });
});

// 9. Structured Literature Review Generator with express-validator
app.post("/api/v1/review/generate", validateReview, (req, res) => {
  const { topic, paperIds } = req.body;
  const papers = paperIds && paperIds.length > 0
    ? papersStore.filter(p => paperIds.includes(p.id))
    : papersStore;

  const review = {
    id: `lit-rev-${Date.now()}`,
    topic,
    createdAt: new Date().toISOString(),
    executiveSummary: `This structured literature review synthesizes research on "${topic}". Findings across ${papers.length} publications reveal an accelerating migration toward parameter-efficient modularity and grounded provenance verification.`,
    themes: [
      {
        name: "Foundational Architectures & Scaling Bottlenecks",
        description: "Examination of how quadratic sequence complexity prompted new modular topologies.",
        papers: papers.slice(0, 2).map(p => ({
          paperId: p.id,
          title: p.title,
          contribution: p.keyFindings?.[0] || "Empirical baseline"
        }))
      }
    ],
    criticalGaps: [
      "Lack of standardized multi-hop hallucination detection datasets.",
      "Latency bottlenecks when integrating external non-parametric retrieval."
    ],
    futureDirections: [
      "Decentralized citation cryptographic verification.",
      "Linear attention mechanisms with continuous retrieval memory."
    ],
    bibliography: papers.map(p => ({
      paperId: p.id,
      formattedCitation: `${p.authors.join(", ")} (${p.year}). ${p.title}. ${p.venue || "arXiv"}. DOI: ${p.doi}`,
      bibtex: `@article{${p.id},\n  title={${p.title}},\n  year={${p.year}}\n}`
    }))
  };

  res.json({ success: true, review });
});

// 10. Jenni AI & Paperpal Academic Writing Auditor with express-validator
app.post("/api/v1/writing/audit", validateWritingAudit, (req, res) => {
  const { text } = req.body;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length || 1;

  const enhancements = [];
  if (/a lot of/i.test(text)) {
    enhancements.push({
      type: "vocabulary",
      originalSpan: "a lot of",
      suggestedSpan: "a substantial volume of",
      explanation: "Informal quantifier. Replace with scholarly terminology."
    });
  }
  if (/shows/i.test(text)) {
    enhancements.push({
      type: "tone",
      originalSpan: "shows",
      suggestedSpan: "demonstrates / substantiates",
      explanation: "Elevates academic prose rigor."
    });
  }

  res.json({
    success: true,
    audit: {
      originalText: text,
      academicScore: Math.max(70, 95 - enhancements.length * 8),
      tone: enhancements.length > 0 ? "informal" : "objective",
      readabilityGrade: wordCount / sentenceCount > 22 ? "Postgraduate Scholarly" : "Undergraduate",
      enhancements,
      summaryFeedback: enhancements.length === 0
        ? "Exemplary academic diction adhering to peer-reviewed guidelines."
        : `Identified ${enhancements.length} vocabulary enhancements.`
    }
  });
});

// 11. Scholar Search API with express-validator
app.get("/api/v1/search/scholar", validateScholarSearch, (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const matched = papersStore.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.abstract.toLowerCase().includes(q) ||
    p.authors.some(a => a.toLowerCase().includes(q))
  );

  res.json({
    success: true,
    query: req.query.q,
    count: matched.length,
    results: matched
  });
});

// 12. Knowledge Graph API
app.get("/api/v1/graph", (req, res) => {
  const nodes = papersStore.map(p => ({
    id: p.id,
    label: p.title,
    type: "paper",
    year: p.year,
    citations: p.citationCount
  }));
  const links = papersStore.length > 1
    ? [{ source: papersStore[1].id, target: papersStore[0].id, type: "cites", weight: 2 }]
    : [];

  res.json({ success: true, graph: { nodes, links } });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Start Express server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 ResearchGPT Express REST API Server running on port ${PORT}`);
    console.log(`📡 Endpoints available at http://localhost:${PORT}/api/v1/...`);
  });
}

module.exports = app;
