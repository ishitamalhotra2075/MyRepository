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

export interface PaperSection {
  id: string;
  title: string;
  pageNumber: number;
  content: string;
}

export interface PaperReference {
  id: string;
  rawText: string;
  title?: string;
  authors?: string[];
  year?: number;
  doi?: string;
  status: 'verified' | 'suspicious' | 'hallucinated' | 'unverified';
  confidenceScore: number;
  verificationSource?: string;
  discrepancies?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citedPaperIds?: string[];
  citations?: {
    paperId: string;
    paperTitle: string;
    pageNumber: number;
    quote: string;
    relevance: string;
  }[];
  synthesisTheme?: string;
}

export interface ScholarPaperResult {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  doi?: string;
  abstract: string;
  citationCount: number;
  url: string;
  pdfUrl?: string;
  arxivId?: string;
  bibtex: string;
}

export interface ComparisonMatrix {
  paperIds: string[];
  dimensions: {
    name: string;
    description: string;
    values: Record<string, string>;
  }[];
  summary: string;
  consensus: string[];
  divergences: string[];
}

export interface LiteratureReview {
  id: string;
  topic: string;
  createdAt: string;
  executiveSummary: string;
  themes: {
    name: string;
    description: string;
    papers: { paperId: string; title: string; contribution: string }[];
  }[];
  methodologicalLandscape: string;
  criticalGaps: string[];
  futureDirections: string[];
  bibliography: {
    paperId: string;
    formattedCitation: string;
    bibtex: string;
  }[];
}

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

export interface PaperpalAudit {
  originalText: string;
  academicScore: number; // 0 - 100
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

export interface GraphNode {
  id: string;
  label: string;
  type: 'paper' | 'topic' | 'methodology' | 'author';
  group?: number;
  year?: number;
  citations?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'cites' | 'shares_method' | 'shares_topic' | 'co_author';
  weight: number;
}

export interface ResearchGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
