import { Paper } from "./types";

export const SAMPLE_PAPERS: Paper[] = [
  {
    id: "paper-transformer-2017",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
    year: 2017,
    venue: "Advances in Neural Information Processing Systems (NeurIPS)",
    doi: "10.48550/arXiv.1706.03762",
    url: "https://arxiv.org/abs/1706.03762",
    pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf",
    citationCount: 118450,
    uploadedAt: "2026-09-10T10:00:00Z",
    fileSize: "2.1 MB",
    pagesCount: 15,
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
    keywords: ["Transformers", "Self-Attention", "Machine Translation", "Sequence Transduction", "Deep Learning"],
    keyFindings: [
      "Replacing recurrent and convolutional layers entirely with Multi-Head Self-Attention yields higher translation quality.",
      "Achieved 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over existing best results by over 2 BLEU.",
      "Trained in 3.5 days on 8 P100 GPUs, a small fraction of the training costs of competing architectures.",
      "Introduced Scaled Dot-Product Attention and Positional Encodings to capture sequence order without recurrence."
    ],
    methodology: {
      approach: "Pure self-attention encoder-decoder architecture with 6 stacked layers each, utilizing scaled dot-product multi-head attention and position-wise feed-forward networks.",
      dataset: "WMT 2014 English-to-German (4.5M sentence pairs) and WMT 2014 English-to-French (36M sentence pairs).",
      metrics: "BLEU score, training compute FLOPs, and inference perplexity.",
      limitations: "Quadratic O(N^2) memory complexity with respect to sequence length, absence of explicit inductive bias for spatial/temporal hierarchies."
    },
    sections: [
      {
        id: "sec-1",
        title: "1. Introduction",
        pageNumber: 1,
        content: "Recurrent neural networks, particularly LSTM and gated recurrent neural networks, have been firmly established as state of the art approaches in sequence modeling. Inherent sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths."
      },
      {
        id: "sec-2",
        title: "2. Background",
        pageNumber: 2,
        content: "The goal of reducing sequential computation also forms the foundation of Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building blocks. In the Transformer this is reduced to a constant number of operations."
      },
      {
        id: "sec-3",
        title: "3. Model Architecture",
        pageNumber: 3,
        content: "Most competitive neural sequence transduction models have an encoder-decoder structure. The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder. Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V."
      },
      {
        id: "sec-4",
        title: "4. Why Self-Attention",
        pageNumber: 6,
        content: "Three desiderata motivated self-attention: total computational complexity per layer, amount of computation that can be parallelized, and path length between long-range dependencies in the network."
      }
    ],
    references: [
      {
        id: "ref-1",
        rawText: "Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. Neural machine translation by jointly learning to align and translate. ICLR 2015.",
        title: "Neural machine translation by jointly learning to align and translate",
        authors: ["D. Bahdanau", "K. Cho", "Y. Bengio"],
        year: 2015,
        doi: "10.48550/arXiv.1409.0473",
        status: "verified",
        confidenceScore: 0.99,
        verificationSource: "CrossRef / arXiv"
      },
      {
        id: "ref-2",
        rawText: "Sepp Hochreiter and Jürgen Schmidhuber. Long short-term memory. Neural computation, 9(8):1735–1780, 1997.",
        title: "Long short-term memory",
        authors: ["S. Hochreiter", "J. Schmidhuber"],
        year: 1997,
        doi: "10.1162/neco.1997.9.8.1735",
        status: "verified",
        confidenceScore: 1.0,
        verificationSource: "CrossRef"
      }
    ]
  },
  {
    id: "paper-rag-2020",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni", "Vladimir Karpukhin", "Naman Goyal", "Heinrich Küttler", "Mike Lewis", "Wen-tau Yih", "Tim Rocktäschel", "Sebastian Riedel", "Douwe Kiela"],
    year: 2020,
    venue: "Advances in Neural Information Processing Systems (NeurIPS)",
    doi: "10.48550/arXiv.2005.11401",
    url: "https://arxiv.org/abs/2005.11401",
    pdfUrl: "https://arxiv.org/pdf/2005.11401.pdf",
    citationCount: 4120,
    uploadedAt: "2026-09-12T14:30:00Z",
    fileSize: "1.8 MB",
    pagesCount: 19,
    abstract: "Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to precisely access and manipulate knowledge is still limited, and on knowledge-intensive tasks, their performance falls behind task-specific architectures. We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) — models which combine pre-trained parametric and non-parametric memory for language generation.",
    keywords: ["RAG", "Retrieval-Augmented Generation", "Dense Passage Retrieval", "Factual Knowledge", "Hallucination Reduction"],
    keyFindings: [
      "Combining parametric memory (BART generator) with non-parametric retrieval (Dense Passage Retrieval over Wikipedia) significantly reduces factual hallucinations.",
      "Achieved state-of-the-art results on open-domain question answering benchmarks (Natural Questions, WebQuestions, CuratedTREC).",
      "RAG generates more specific, diverse, and factual language than parametric-only seq2seq baselines.",
      "Non-parametric index can be updated dynamically without retraining the base language model parameters."
    ],
    methodology: {
      approach: "Hybrid model marrying a dense vector neural retriever (DPR) with a sequence-to-sequence generative model (BART), optimized end-to-end via marginalization over retrieved documents.",
      dataset: "Wikipedia dump of 21M 100-word passages, evaluated on Natural Questions, WebQuestions, CuratedTREC, and MS-MARCO.",
      metrics: "Exact Match (EM), F1 score, BLEU, and human evaluation of factual consistency.",
      limitations: "Retrieval latency during generation, potential propagation of incorrect retrieved context into final answers."
    },
    sections: [
      {
        id: "rag-sec-1",
        title: "1. Introduction",
        pageNumber: 1,
        content: "Pre-trained neural language models learn an impressive amount of world knowledge from their training data. However, they have severe limitations: they cannot easily expand or revise their memory, can't reliably produce citations for their claims, and may produce hallucinations."
      },
      {
        id: "rag-sec-2",
        title: "2. Methods: RAG-Sequence and RAG-Token",
        pageNumber: 3,
        content: "We propose two formulations: RAG-Sequence uses the same retrieved document to generate the complete sequence, while RAG-Token can use different retrieved passages per generated token. Given input x, we use retriever p_eta(z|x) and generator p_theta(y_i|x, z, y_{1:i-1})."
      }
    ],
    references: [
      {
        id: "rag-ref-1",
        rawText: "Vladimir Karpukhin, Barlas Oğuz, et al. Dense Passage Retrieval for Open-Domain Question Answering. EMNLP 2020.",
        title: "Dense Passage Retrieval for Open-Domain Question Answering",
        authors: ["V. Karpukhin", "B. Oğuz"],
        year: 2020,
        doi: "10.48550/arXiv.2004.04906",
        status: "verified",
        confidenceScore: 0.99,
        verificationSource: "CrossRef / arXiv"
      }
    ]
  },
  {
    id: "paper-lora-2021",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Zeyuan Allen-Zhu", "Yuanzhi Li", "Shean Wang", "Lu Wang", "Weizhu Chen"],
    year: 2021,
    venue: "International Conference on Learning Representations (ICLR)",
    doi: "10.48550/arXiv.2106.09685",
    url: "https://arxiv.org/abs/2106.09685",
    pdfUrl: "https://arxiv.org/pdf/2106.09685.pdf",
    citationCount: 6890,
    uploadedAt: "2026-09-14T09:15:00Z",
    fileSize: "1.4 MB",
    pagesCount: 14,
    abstract: "An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to specific tasks. As we pre-train larger models, full fine-tuning becomes impractical. We propose Low-Rank Adaptation (LoRA), which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks.",
    keywords: ["LoRA", "PEFT", "Parameter-Efficient Fine-Tuning", "Transformer Optimization", "Low-Rank Decomposition"],
    keyFindings: [
      "Reduces the number of trainable parameters by up to 10,000 times and GPU memory requirement by 3 times compared to full fine-tuning.",
      "Performs on-par or better than full fine-tuning on RoBERTa, DeBERTa, GPT-2, and GPT-3 175B.",
      "Introduces zero inference latency as adapter matrices can be merged with frozen weights during deployment.",
      "Allows rapid switching between specialized task weights without swapping multi-gigabyte foundation model checkpoints."
    ],
    methodology: {
      approach: "Represents weight updates Delta W as low-rank decomposition B * A, where W in R^{d x k}, B in R^{d x r}, A in R^{r x k} with rank r << min(d, k).",
      dataset: "GLUE benchmark, E2E NLG Challenge, and DART generation datasets.",
      metrics: "BLEU, NIST, METEOR, ROUGE-L, CIDEr, and GPU training VRAM footprint.",
      limitations: "Batching multiple tasks with different LoRA weights concurrently requires custom kernel scheduling."
    },
    sections: [
      {
        id: "lora-sec-1",
        title: "1. Introduction",
        pageNumber: 1,
        content: "Many applications in natural language processing rely on adapting one large pre-trained language model to multiple downstream tasks. LoRA allows training only a tiny subset of parameters, freezing base weights W0."
      }
    ],
    references: [
      {
        id: "lora-ref-1",
        rawText: "Neil Houlsby et al. Parameter-efficient transfer learning for NLP. ICML 2019.",
        title: "Parameter-efficient transfer learning for NLP",
        authors: ["N. Houlsby"],
        year: 2019,
        doi: "10.48550/arXiv.1902.00751",
        status: "verified",
        confidenceScore: 0.98,
        verificationSource: "CrossRef / arXiv"
      }
    ]
  },
  {
    id: "paper-hallucination-2023",
    title: "Siren's Song in the AI Ocean: A Survey on Hallucination in Large Language Models",
    authors: ["Yue Zhang", "Yafu Li", "Leyang Cui", "Deng Cai", "Lemao Liu", "Ting Liu", "Shuming Shi"],
    year: 2023,
    venue: "ACM Computing Surveys",
    doi: "10.1145/3639899",
    url: "https://arxiv.org/abs/2309.01219",
    pdfUrl: "https://arxiv.org/pdf/2309.01219.pdf",
    citationCount: 1540,
    uploadedAt: "2026-09-15T11:20:00Z",
    fileSize: "3.2 MB",
    pagesCount: 26,
    abstract: "The emergence of large language models (LLMs) has marked a significant milestone in Natural Language Processing, demonstrating remarkable capabilities in text understanding and generation. However, LLMs are prone to hallucination—generating plausible-sounding but factually unverified or false content, especially in scientific citations, medical guidance, and legal references. This survey provides an in-depth taxonomy of hallucination causes, detection methodologies, and mitigation strategies.",
    keywords: ["Hallucination", "Fake Citations", "Factuality", "Faithfulness", "Evaluation Metrics", "Verification Systems"],
    keyFindings: [
      "Up to 38% of LLM-generated scientific citations are fabricated (non-existent DOIs, synthesized author combinations).",
      "Hallucinations stem from pre-training data noise, imperfect parametric recall, and exposure bias during autoregressive decoding.",
      "Verification using external knowledge graphs, CrossRef APIs, and multi-agent debate reduces citation fabrication by over 92%.",
      "Faithfulness and factuality must be decoupled during academic review generation."
    ],
    methodology: {
      approach: "Systematic literature survey of 280+ papers categorizing hallucination into input-conflicting, context-conflicting, and fact-conflicting manifestations.",
      dataset: "Aggregated benchmark across TruthfulQA, HaluEval, FaithDial, and PubMedQA.",
      metrics: "Citation Precision, DOI validity rate, ROUGE-L, Knowledge Triple Matching accuracy.",
      limitations: "Evaluation remains computationally intensive and dependent on ground-truth knowledge base completeness."
    },
    sections: [
      {
        id: "hal-sec-1",
        title: "1. Introduction",
        pageNumber: 1,
        content: "Despite human-like fluency, hallucination remains the Achilles heel of modern language models, critically impairing reliability in scientific research, medicine, and jurisprudence."
      }
    ],
    references: [
      {
        id: "hal-ref-1",
        rawText: "Stephanie Lin, Jacob Hilton, and Owain Evans. TruthfulQA: Measuring how models mimic human falsehoods. ACL 2022.",
        title: "TruthfulQA: Measuring how models mimic human falsehoods",
        authors: ["S. Lin", "J. Hilton", "O. Evans"],
        year: 2022,
        doi: "10.48550/arXiv.2109.07958",
        status: "verified",
        confidenceScore: 0.99,
        verificationSource: "CrossRef / arXiv"
      }
    ]
  }
];
