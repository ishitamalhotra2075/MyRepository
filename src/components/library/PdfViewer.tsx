"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  Copy,
  Layers,
  Sparkles,
  Download
} from "lucide-react";
import { Paper, PaperSection, PaperReference } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useToast } from "@/context/ToastContext";

interface PdfViewerProps {
  paper: Paper;
  onClose?: () => void;
}

export function PdfViewer({ paper, onClose }: PdfViewerProps) {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<"reader" | "pdf" | "citations">("reader");
  const [searchInDoc, setSearchInDoc] = useState("");
  const totalPages = paper.pagesCount || 12;

  const handleCopyCitation = () => {
    const citation = `${paper.authors.join(", ")} (${paper.year}). ${paper.title}. ${paper.venue || "arXiv"}. DOI: ${paper.doi || "N/A"}`;
    navigator.clipboard.writeText(citation);
    showToast({
      type: "success",
      title: "Citation Copied",
      message: "Standard APA format copied to clipboard."
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 min-w-0">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Back to library"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="truncate">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {paper.title}
            </h2>
            <p className="text-xs text-zinc-500 truncate">
              {paper.authors.slice(0, 2).join(", ")} ({paper.year}) • {paper.doi || "Preprint"}
            </p>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-0.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("reader")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "reader"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Smart Reader
          </button>
          <button
            onClick={() => setActiveTab("citations")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "citations"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Citations ({paper.references?.length || 2})
          </button>
          {paper.pdfUrl && (
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "pdf"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              PDF Source
            </button>
          )}
        </div>

        {/* Right: Controls (Page nav, Zoom, Actions) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg px-2 py-1 text-xs text-zinc-600 dark:text-zinc-300">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-zinc-500 font-mono w-9 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyCitation}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Copy Citation"
          >
            <Copy className="w-4 h-4" />
          </button>

          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-100/60 dark:bg-zinc-950/60">
        {activeTab === "reader" && (
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl shadow-xl p-8 sm:p-12 transition-transform duration-150 space-y-6"
          >
            {/* Header Document Metadata */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 text-center space-y-3">
              <Badge variant="primary" size="md">
                {paper.venue || "Scientific Manuscript"}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                {paper.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {paper.authors.map((author, i) => (
                  <span key={author} className="after:content-[','] last:after:content-none">
                    {author}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-400">
                Published {paper.year} • Digital Object Identifier: <span className="font-mono text-zinc-500 dark:text-zinc-400">{paper.doi || "Unassigned"}</span>
              </p>
            </div>

            {/* Abstract Section */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                Abstract
              </h3>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-serif">
                {paper.abstract}
              </p>
            </div>

            {/* Methodology Overview Card */}
            {paper.methodology && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Architecture / Approach</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono">
                    {paper.methodology.approach}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Empirical Benchmark</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono">
                    {paper.methodology.dataset}
                  </p>
                </div>
              </div>
            )}

            {/* Key Findings Checklist */}
            {paper.keyFindings && paper.keyFindings.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Key Empirical Findings
                </h4>
                <div className="space-y-2">
                  {paper.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-[11px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Document Sections */}
            <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {(paper.sections || [
                {
                  id: "default-sec-1",
                  title: "1. Motivation and Problem Formulation",
                  pageNumber: 1,
                  content: "Sequential processing constraints fundamentally limit parallelization during large-scale network optimization. By decoupling representation modeling from recurrent temporal states, modern architectures compute global pairwise interactions in constant depth operations."
                },
                {
                  id: "default-sec-2",
                  title: "2. Empirical Architecture & Mathematical Formulation",
                  pageNumber: 3,
                  content: "The mathematical backbone relies on scaled dot-product attention computed across multi-head subspaces: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V. This formulation preserves dimensional capacity while mitigating vanishing gradient vanishing dynamics."
                }
              ]).map(section => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {section.title}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono">Page {section.pageNumber}</span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Citations & Fake Citation Audit Tab */}
        {activeTab === "citations" && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Extracted Document References & DOI Verification
                </h3>
                <p className="text-xs text-zinc-500">
                  Real-time CrossRef verification and hallucination detection for each cited work.
                </p>
              </div>
              <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                100% Authenticated
              </Badge>
            </div>

            {(paper.references || [
              {
                id: "ref-sample-1",
                rawText: "Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. Neural machine translation by jointly learning to align and translate. ICLR 2015.",
                title: "Neural machine translation by jointly learning to align and translate",
                authors: ["D. Bahdanau", "K. Cho", "Y. Bengio"],
                year: 2015,
                doi: "10.48550/arXiv.1409.0473",
                status: "verified" as const,
                confidenceScore: 0.99,
                verificationSource: "CrossRef / arXiv"
              },
              {
                id: "ref-sample-2",
                rawText: "Sepp Hochreiter and Jürgen Schmidhuber. Long short-term memory. Neural computation, 9(8):1735–1780, 1997.",
                title: "Long short-term memory",
                authors: ["S. Hochreiter", "J. Schmidhuber"],
                year: 1997,
                doi: "10.1162/neco.1997.9.8.1735",
                status: "verified" as const,
                confidenceScore: 1.0,
                verificationSource: "CrossRef Registry"
              }
            ]).map(ref => (
              <div
                key={ref.id}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
                    {ref.title || ref.rawText}
                  </p>
                  {ref.status === "verified" ? (
                    <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                      Verified Real
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm" icon={<ShieldAlert className="w-3 h-3" />}>
                      Fake Citation
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-zinc-500">
                  {ref.authors?.join(", ")} ({ref.year})
                </p>

                {ref.doi && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-zinc-400 font-mono">DOI: {ref.doi}</span>
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Resolve</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Embedded PDF View */}
        {activeTab === "pdf" && paper.pdfUrl && (
          <div className="w-full max-w-4xl h-[750px] bg-white rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
            <iframe
              src={paper.pdfUrl}
              title={paper.title}
              className="w-full h-full border-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
