import { PaperpalAudit } from "./types";

const REPLACEMENTS: { pattern: RegExp; replacement: string; explanation: string; type: 'vocabulary' | 'tone' | 'hedging' | 'conciseness' }[] = [
  {
    pattern: /\ba lot of\b/gi,
    replacement: "a substantial volume of",
    explanation: "Informal quantifier. Use precise academic phrasing.",
    type: "vocabulary"
  },
  {
    pattern: /\blook into\b/gi,
    replacement: "investigate / examine",
    explanation: "Phrasal verb. Prefer formal academic verbs.",
    type: "vocabulary"
  },
  {
    pattern: /\bgood results\b/gi,
    replacement: "statistically significant outcomes",
    explanation: "Vague evaluation. Provide concrete metric-oriented language.",
    type: "vocabulary"
  },
  {
    pattern: /\bshows\b/gi,
    replacement: "demonstrates",
    explanation: "Enhances academic rigor.",
    type: "tone"
  },
  {
    pattern: /\bthis proves that\b/gi,
    replacement: "these findings suggest that",
    explanation: "Empirical papers typically hedge findings rather than claiming definitive proof.",
    type: "hedging"
  },
  {
    pattern: /\bobviously\b/gi,
    replacement: "as evidenced by the data",
    explanation: "Subjective assertion. Maintain objective scientific stance.",
    type: "tone"
  },
  {
    pattern: /\bin order to\b/gi,
    replacement: "to",
    explanation: "Redundant verbiage. Simplify for concise academic prose.",
    type: "conciseness"
  },
  {
    pattern: /\bhuge amount\b/gi,
    replacement: "considerable magnitude",
    explanation: "Hyperbolic colloquialism. Replace with measured academic quantifier.",
    type: "vocabulary"
  },
  {
    pattern: /\bkind of\b|\bsort of\b/gi,
    replacement: "partially / approximately",
    explanation: "Vague conversational filler.",
    type: "tone"
  },
  {
    pattern: /\bfigured out\b/gi,
    replacement: "determined / deduced",
    explanation: "Conversational idiom unsuitable for peer-reviewed manuscripts.",
    type: "vocabulary"
  }
];

export function auditAcademicText(text: string): PaperpalAudit {
  if (!text || text.trim().length === 0) {
    return {
      originalText: "",
      academicScore: 0,
      tone: "objective",
      readabilityGrade: "N/A",
      enhancements: [],
      summaryFeedback: "Enter academic text to begin the Paperpal language and tone analysis."
    };
  }

  const enhancements: PaperpalAudit["enhancements"] = [];
  let scoreDeductions = 0;

  for (const item of REPLACEMENTS) {
    let match;
    const regex = new RegExp(item.pattern.source, "gi");
    while ((match = regex.exec(text)) !== null) {
      enhancements.push({
        id: `enh-${Math.random().toString(36).substring(2, 9)}`,
        type: item.type,
        originalSpan: match[0],
        suggestedSpan: item.replacement,
        explanation: item.explanation
      });
      scoreDeductions += 7;
    }
  }

  // Calculate readability score
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const avgWordsPerSentence = wordCount / sentenceCount;

  let readability = "Postgraduate (Scholarly)";
  if (avgWordsPerSentence < 12) {
    readability = "Undergraduate / General";
  } else if (avgWordsPerSentence > 28) {
    readability = "High Complexity (Dense)";
  }

  const baseScore = Math.max(50, Math.min(98, 95 - scoreDeductions));

  // Determine tone
  let tone: PaperpalAudit["tone"] = "objective";
  if (/obviously|clearly|unquestionably|unbelievable/i.test(text)) {
    tone = "speculative";
  } else if (/a lot of|kind of|sort of|figured out/i.test(text)) {
    tone = "informal";
  } else if (avgWordsPerSentence > 30) {
    tone = "dense";
  }

  const feedbackParts: string[] = [];
  if (enhancements.length === 0) {
    feedbackParts.push("Excellent academic prose! The phrasing adheres to formal peer-reviewed standards with strong hedging and objective diction.");
  } else {
    feedbackParts.push(`Identified ${enhancements.length} potential language improvement${enhancements.length > 1 ? 's' : ''} to enhance scholarly vocabulary and tone rigor.`);
  }

  return {
    originalText: text,
    academicScore: baseScore,
    tone,
    readabilityGrade: readability,
    enhancements,
    summaryFeedback: feedbackParts.join(" ")
  };
}

export function generateAutocompleteSuggestion(contextText: string, currentTopic?: string): string {
  const trimmed = contextText.trim();
  const lastWords = trimmed.split(/\s+/).slice(-5).join(" ").toLowerCase();

  if (lastWords.includes("we propose") || lastWords.includes("we introduce")) {
    return " a novel dual-stream architecture that mitigates representation collapse while preserving fine-grained features.";
  }
  if (lastWords.includes("in this paper")) {
    return " we present a systematic empirical investigation of multi-modal attention networks under out-of-distribution shifts.";
  }
  if (lastWords.includes("the experimental results demonstrate") || lastWords.includes("results show")) {
    return " that our proposed framework outperforms competitive state-of-the-art baselines across all benchmark datasets by an average margin of 4.2%.";
  }
  if (lastWords.includes("in contrast to prior work")) {
    return " our methodology eliminates the need for expensive supervision by leveraging self-supervised representation alignment.";
  }
  if (lastWords.includes("however, existing approaches")) {
    return " suffer from computational bottlenecks and exhibit vulnerability to hallucinated non-parametric memory retrieval.";
  }
  if (lastWords.includes("specifically, we")) {
    return " formulate an objective loss function that optimizes both factual consistency and generative diversity.";
  }

  return " demonstrate robust convergence behavior and achieve superior generalization fidelity across diverse evaluation splits.";
}

export function paraphraseAcademic(text: string, mode: 'academic' | 'expand' | 'condense' | 'simplify'): string {
  if (!text.trim()) return "";

  switch (mode) {
    case 'academic':
      return text
        .replace(/a lot of/gi, "a substantial volume of")
        .replace(/show/gi, "demonstrate")
        .replace(/good/gi, "optimal")
        .replace(/big/gi, "pronounced")
        .replace(/we think/gi, "the empirical findings indicate that")
        .replace(/problem/gi, "fundamental limitation");
    case 'expand':
      return `${text} Furthermore, this mechanism provides a theoretical foundation for understanding cross-domain transferability, thereby opening promising avenues for robust scalable deployment.`;
    case 'condense':
      return text
        .split(". ")
        .slice(0, 1)
        .join(". ")
        .replace(/in order to/gi, "to")
        .replace(/it is important to note that/gi, "notably,");
    case 'simplify':
      return text
        .replace(/dichotomous juxtaposition/gi, "contrast")
        .replace(/epistemological paradigm/gi, "approach")
        .replace(/manifests an unprecedented propensity/gi, "often tends to");
    default:
      return text;
  }
}
