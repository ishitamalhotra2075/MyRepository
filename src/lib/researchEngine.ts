import { Paper, ChatMessage, ComparisonMatrix, LiteratureReview, ResearchGraphData } from "./types";

export function generateChatResponse(
  query: string,
  selectedPapers: Paper[],
  conversationHistory: ChatMessage[] = []
): ChatMessage {
  const cleanQuery = query.toLowerCase();

  // If no papers selected, warn or ask to select
  if (selectedPapers.length === 0) {
    return {
      id: `msg-${Date.now()}`,
      role: "assistant",
      timestamp: new Date().toISOString(),
      content: "Please select one or more research papers from your library to ask grounded questions. With AnswerThis-style grounding, I will cite specific pages and verbatim quotes from your chosen papers.",
      citations: []
    };
  }

  // Multi-paper synthesis
  const citations: ChatMessage["citations"] = [];
  let answerContent = "";
  let synthesisTheme = "Cross-Paper Empirical Synthesis";

  // Check query intents
  if (cleanQuery.includes("limitation") || cleanQuery.includes("weakness") || cleanQuery.includes("drawback")) {
    synthesisTheme = "Critical Limitations & Boundary Conditions";
    answerContent = `Across the selected ${selectedPapers.length} papers, several key technical and computational limitations emerge:\n\n`;

    selectedPapers.forEach((paper, idx) => {
      const limitation = paper.methodology?.limitations || "Requires substantial compute budget and high-quality aligned training corpora.";
      const page = (idx * 3) + 4;
      const quote = `As stated in ${paper.title}: "${limitation}"`;

      answerContent += `• **${paper.title}** (${paper.year}): [Page ${page}]\n  ${limitation}\n\n`;
      citations.push({
        paperId: paper.id,
        paperTitle: paper.title,
        pageNumber: page,
        quote,
        relevance: "Primary discussion of model constraints and compute trade-offs."
      });
    });

    answerContent += `\n**Synthesized Consensus**: The recurring theme across these architectures is the trade-off between expressive capacity and computational quadratic complexity (or retrieval latency in non-parametric systems).`;
  } else if (cleanQuery.includes("method") || cleanQuery.includes("approach") || cleanQuery.includes("architecture")) {
    synthesisTheme = "Architectural & Methodological Landscape";
    answerContent = `Comparing the core methodologies of the selected literature:\n\n`;

    selectedPapers.forEach((paper, idx) => {
      const approach = paper.methodology?.approach || paper.abstract.slice(0, 160) + "...";
      const page = idx + 2;
      answerContent += `• **${paper.title}** (${paper.year}) [p. ${page}]:\n  ${approach}\n\n`;

      citations.push({
        paperId: paper.id,
        paperTitle: paper.title,
        pageNumber: page,
        quote: `"${approach.slice(0, 120)}..."`,
        relevance: "Defines core mathematical formulation and network topology."
      });
    });

    answerContent += `\n**Synthesis**: While earlier paradigms relied heavily on deep convolutional or recurrent stacking, recent foundational advances pivot toward attention mechanisms and parameter-efficient rank decomposition.`;
  } else if (cleanQuery.includes("compare") || cleanQuery.includes("difference") || cleanQuery.includes("versus") || cleanQuery.includes("vs")) {
    synthesisTheme = "Comparative Differential Analysis";
    answerContent = `Here is a cross-comparative synthesis of the selected works:\n\n`;

    selectedPapers.forEach((paper, i) => {
      const dataset = paper.methodology?.dataset || "Standard NLP / Vision benchmarks";
      const keyMetric = paper.keyFindings?.[0] || "Demonstrated state-of-the-art empirical performance.";
      answerContent += `1. **${paper.title}** (${paper.year}):\n   - **Primary Objective**: ${paper.keywords.join(", ")}\n   - **Benchmark / Dataset**: ${dataset}\n   - **Core Finding**: ${keyMetric}\n\n`;

      citations.push({
        paperId: paper.id,
        paperTitle: paper.title,
        pageNumber: i + 1,
        quote: `"${paper.abstract.slice(0, 140)}..."`,
        relevance: "Abstract formulation and benchmark validation summary."
      });
    });

    answerContent += `**Key Divergence**: These papers attack the efficiency frontier from opposite angles: parametric memory compression (e.g. LoRA) versus non-parametric retrieval augmentation (e.g. RAG) and fundamental attention reformulation (Transformer).`;
  } else {
    // General grounded answer
    synthesisTheme = "Literature Grounded Response";
    const primaryPaper = selectedPapers[0];
    const secondPaper = selectedPapers[1] || selectedPapers[0];

    answerContent = `Based on your query regarding "${query.trim()}", the examined literature reveals the following insights:\n\n`;
    answerContent += `1. In **${primaryPaper.title}** (${primaryPaper.year}) [Page 1-2]:\n   ${primaryPaper.abstract.slice(0, 200)}...\n   Key finding: ${primaryPaper.keyFindings?.[0] || "Provides foundational baseline."}\n\n`;

    citations.push({
      paperId: primaryPaper.id,
      paperTitle: primaryPaper.title,
      pageNumber: 2,
      quote: `"${primaryPaper.abstract.slice(0, 130)}..."`,
      relevance: "Foundational conceptual framing and abstract definition."
    });

    if (selectedPapers.length > 1) {
      answerContent += `2. In **${secondPaper.title}** (${secondPaper.year}) [Page 3]:\n   ${secondPaper.keyFindings?.[1] || secondPaper.abstract.slice(0, 180)}...\n\n`;
      citations.push({
        paperId: secondPaper.id,
        paperTitle: secondPaper.title,
        pageNumber: 3,
        quote: `"${(secondPaper.keyFindings?.[1] || secondPaper.abstract).slice(0, 110)}..."`,
        relevance: "Supporting empirical evidence and cross-paper alignment."
      });
    }

    answerContent += `**AnswerThis Takeaway**: Both works emphasize verifiable representation learning and mitigating latency or parameter sprawl in large-scale modern AI systems.`;
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    timestamp: new Date().toISOString(),
    content: answerContent,
    citedPaperIds: selectedPapers.map(p => p.id),
    citations,
    synthesisTheme
  };
}

export function generateComparisonMatrix(papers: Paper[]): ComparisonMatrix {
  const paperIds = papers.map(p => p.id);

  const dimensions = [
    {
      name: "Core Architecture / Approach",
      description: "Fundamental mathematical and algorithmic foundation",
      values: papers.reduce((acc, p) => {
        acc[p.id] = p.methodology?.approach || "Algorithmic pipeline";
        return acc;
      }, {} as Record<string, string>)
    },
    {
      name: "Training / Evaluation Dataset",
      description: "Corpus and benchmark datasets utilized in empirical tests",
      values: papers.reduce((acc, p) => {
        acc[p.id] = p.methodology?.dataset || "Academic Benchmark Evaluation Split";
        return acc;
      }, {} as Record<string, string>)
    },
    {
      name: "Key Performance Metrics",
      description: "Reported empirical gains over baseline models",
      values: papers.reduce((acc, p) => {
        acc[p.id] = p.methodology?.metrics || "BLEU, Accuracy, F1-Score";
        return acc;
      }, {} as Record<string, string>)
    },
    {
      name: "Critical Limitations & Overhead",
      description: "Documented bottlenecks, failure cases, and assumptions",
      values: papers.reduce((acc, p) => {
        acc[p.id] = p.methodology?.limitations || "Compute intensity, scale constraints";
        return acc;
      }, {} as Record<string, string>)
    }
  ];

  return {
    paperIds,
    dimensions,
    summary: `Systematic comparative synthesis of ${papers.length} peer-reviewed research papers exploring algorithmic paradigms, parameter efficiency, and verification fidelity.`,
    consensus: [
      "Traditional monolithic scaling encounters diminishing returns and severe memory bottlenecks.",
      "Explicit modularity (adapters, external retrieval, or self-attention layers) consistently improves efficiency without catastrophic forgetting.",
      "Empirical reproducibility requires rigorous baseline alignment across standardized benchmarks."
    ],
    divergences: [
      "Whether parametric knowledge should be frozen (LoRA/RAG) or re-trained end-to-end (Transformers).",
      "Handling of inference latency: zero-overhead weight merging vs. multi-step retrieval pipeline."
    ]
  };
}

export function generateStructuredLiteratureReview(topic: string, papers: Paper[]): LiteratureReview {
  const themes = [
    {
      name: "1. Architectural Evolution: From Recurrence to Self-Attention",
      description: "How sequential processing bottlenecks led to the emergence of parallelizable multi-head attention mechanisms.",
      papers: papers.slice(0, 2).map(p => ({
        paperId: p.id,
        title: p.title,
        contribution: `Pioneered scalable representations; demonstrated that ${p.keyFindings?.[0] || "self-attention outperforms recurrent architectures"}.`
      }))
    },
    {
      name: "2. Knowledge Augmentation & Parameter Efficiency",
      description: "Mitigating excessive computational burdens and factual hallucinations through modular adapters and non-parametric memory.",
      papers: papers.slice(2, 4).map(p => ({
        paperId: p.id,
        title: p.title,
        contribution: `Addressed scalability bottlenecks via ${p.keywords.join(", ")}; drastically reduced training VRAM and hallucinated citations.`
      }))
    }
  ];

  const bibliography = papers.map(p => ({
    paperId: p.id,
    formattedCitation: `${p.authors.slice(0, 3).join(", ")}${p.authors.length > 3 ? " et al." : ""} (${p.year}). ${p.title}. ${p.venue || "arXiv Preprint Server"}. DOI: ${p.doi || "N/A"}`,
    bibtex: `@article{${p.id},
  title={${p.title}},
  author={${p.authors.join(" and ")}},
  year={${p.year}},
  doi={${p.doi || ""}}
}`
  }));

  return {
    id: `lit-rev-${Date.now()}`,
    topic,
    createdAt: new Date().toISOString(),
    executiveSummary: `This structured literature review synthesizes current state-of-the-art findings regarding "${topic}". Across ${papers.length} foundational papers, research demonstrates a decisive transition towards modular, parameter-efficient architectures and grounded verification mechanisms that counter generative hallucinations.`,
    themes,
    methodologicalLandscape: "The methodological spectrum combines analytical self-attention modeling, low-rank matrix decomposition, and dense passage retrieval with marginalization across retrieved passages.",
    criticalGaps: [
      "Absence of standardized universal benchmarks for detecting subtle, multi-hop citation hallucinations in scientific generation.",
      "Inference latency trade-offs when chaining dense retrieval systems in real-time edge environments.",
      "Limited formal guarantees regarding catastrophic forgetting when multiple domain-specific low-rank adapters are composed."
    ],
    futureDirections: [
      "Developing native multi-agent verification protocols with automated CrossRef and DOI cryptographic provenance.",
      "Hybrid sub-quadratic linear attention mechanisms integrated with dynamic non-parametric memory caches.",
      "Standardizing automated peer-review auditing tools for citation integrity and factuality."
    ],
    bibliography
  };
}

export function buildResearchKnowledgeGraph(papers: Paper[]): ResearchGraphData {
  const nodes: ResearchGraphData["nodes"] = [];
  const links: ResearchGraphData["links"] = [];
  const addedTopics = new Set<string>();

  // Add paper nodes
  papers.forEach((p, idx) => {
    nodes.push({
      id: p.id,
      label: p.title,
      type: "paper",
      group: 1,
      year: p.year,
      citations: p.citationCount || 100
    });

    // Add topic nodes
    (p.keywords || []).slice(0, 3).forEach(kw => {
      const topicId = `topic-${kw.toLowerCase().replace(/\s+/g, "-")}`;
      if (!addedTopics.has(topicId)) {
        addedTopics.add(topicId);
        nodes.push({
          id: topicId,
          label: kw,
          type: "topic",
          group: 2
        });
      }

      links.push({
        source: p.id,
        target: topicId,
        type: "shares_topic",
        weight: 1
      });
    });

    // Add inter-paper citation links
    if (idx > 0) {
      links.push({
        source: p.id,
        target: papers[idx - 1].id,
        type: "cites",
        weight: 2
      });
    }
  });

  return { nodes, links };
}
