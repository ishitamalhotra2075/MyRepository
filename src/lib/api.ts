import { Paper, ChatMessage, ComparisonMatrix, LiteratureReview, CitationVerificationResult, PaperpalAudit, ResearchGraphData, ScholarPaperResult } from "./types";
import { SAMPLE_PAPERS } from "./samplePapers";
import { verifyCitationText } from "./citationValidator";
import { generateChatResponse, generateComparisonMatrix, generateStructuredLiteratureReview, buildResearchKnowledgeGraph } from "./researchEngine";
import { auditAcademicText, generateAutocompleteSuggestion, paraphraseAcademic } from "./paperpalAuditor";
import { searchOnlineScholarPapers } from "./scholarSearch";

const API_BASE = ""; // Relative Next.js App Router paths

export const api = {
  // Papers
  async getPapers(): Promise<Paper[]> {
    try {
      const res = await fetch(`${API_BASE}/api/papers`);
      if (res.ok) {
        const data = await res.json();
        return data.papers || SAMPLE_PAPERS;
      }
    } catch (e) {
      console.warn("Using local fallback papers:", e);
    }
    return SAMPLE_PAPERS;
  },

  async createPaper(paperData: Partial<Paper>): Promise<Paper> {
    try {
      const res = await fetch(`${API_BASE}/api/papers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paperData),
      });
      if (res.ok) {
        const data = await res.json();
        return data.paper;
      }
    } catch (e) {
      console.warn("Paper creation fallback:", e);
    }

    // Client fallback
    const fallbackPaper: Paper = {
      id: `paper-${Date.now()}`,
      title: paperData.title || "Untitled Paper",
      authors: paperData.authors || ["Current Author"],
      year: paperData.year || new Date().getFullYear(),
      abstract: paperData.abstract || "No abstract provided.",
      keywords: paperData.keywords || ["Research"],
      venue: paperData.venue || "Uploaded Document",
      uploadedAt: new Date().toISOString(),
      doi: paperData.doi || `10.48550/user.${Date.now()}`,
      pagesCount: 12,
      fileSize: "1.2 MB"
    };
    return fallbackPaper;
  },

  // Multi-Paper Grounded Chat (AnswerThis style)
  async sendChatMessage(query: string, selectedPapers: Paper[], history: ChatMessage[] = []): Promise<ChatMessage> {
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          paperIds: selectedPapers.map(p => p.id),
          papers: selectedPapers
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.message;
      }
    } catch (e) {
      console.warn("Using local chat generator fallback:", e);
    }
    return generateChatResponse(query, selectedPapers, history);
  },

  // Fake Citation & Hallucination Detector
  async verifyCitation(citationText: string): Promise<CitationVerificationResult> {
    try {
      const res = await fetch(`${API_BASE}/api/citations/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citationText }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.result;
      }
    } catch (e) {
      console.warn("Using client citation validator:", e);
    }
    return verifyCitationText(citationText);
  },

  // Online Scholar Search (Google Scholar / arXiv style)
  async searchScholar(query: string): Promise<ScholarPaperResult[]> {
    try {
      const res = await fetch(`${API_BASE}/api/scholar?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        return data.results;
      }
    } catch (e) {
      console.warn("Using client scholar search:", e);
    }
    return searchOnlineScholarPapers(query);
  },

  // Methodology Comparison
  async comparePapers(papers: Paper[]): Promise<ComparisonMatrix> {
    try {
      const res = await fetch(`${API_BASE}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperIds: papers.map(p => p.id),
          papers
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.matrix;
      }
    } catch (e) {
      console.warn("Using local comparison generator:", e);
    }
    return generateComparisonMatrix(papers);
  },

  // Structured Literature Review
  async generateLiteratureReview(topic: string, papers: Paper[]): Promise<LiteratureReview> {
    try {
      const res = await fetch(`${API_BASE}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          paperIds: papers.map(p => p.id),
          papers
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.review;
      }
    } catch (e) {
      console.warn("Using local review generator:", e);
    }
    return generateStructuredLiteratureReview(topic, papers);
  },

  // Paperpal Academic Tone & Grammar Audit
  async auditText(text: string): Promise<PaperpalAudit> {
    try {
      const res = await fetch(`${API_BASE}/api/writing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "audit", text }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.audit;
      }
    } catch (e) {
      console.warn("Using local audit engine:", e);
    }
    return auditAcademicText(text);
  },

  // Jenni AI Autocomplete Suggestion
  async getAutocomplete(context: string): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/api/writing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "autocomplete", context }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.suggestion;
      }
    } catch (e) {
      console.warn("Using local autocomplete engine:", e);
    }
    return generateAutocompleteSuggestion(context);
  },

  // Jenni AI Paraphrase
  async paraphrase(text: string, mode: 'academic' | 'expand' | 'condense' | 'simplify'): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/api/writing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "paraphrase", text, mode }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.paraphrased;
      }
    } catch (e) {
      console.warn("Using local paraphrase engine:", e);
    }
    return paraphraseAcademic(text, mode);
  },

  // Research Knowledge Graph
  async getGraph(papers: Paper[]): Promise<ResearchGraphData> {
    try {
      const res = await fetch(`${API_BASE}/api/graph`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.graph;
      }
    } catch (e) {
      console.warn("Using local graph builder:", e);
    }
    return buildResearchKnowledgeGraph(papers);
  }
};
