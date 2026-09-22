"use client";

import React, { useState } from "react";
import { Quote, ExternalLink, Plus, Check, FileText, Sparkles, BookOpen } from "lucide-react";
import { ScholarPaperResult } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useLibrary } from "@/context/LibraryContext";
import { useToast } from "@/context/ToastContext";

interface ScholarSearchResultProps {
  paper: ScholarPaperResult;
  onViewBibtex: (paper: ScholarPaperResult) => void;
}

export function ScholarSearchResult({ paper, onViewBibtex }: ScholarSearchResultProps) {
  const { papers, addPaper } = useLibrary();
  const { showToast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const isAlreadyInLibrary = papers.some(p => p.id === paper.id || p.doi === paper.doi);

  const handleImport = async () => {
    if (isAlreadyInLibrary) return;
    setIsImporting(true);

    try {
      await new Promise(res => setTimeout(res, 400));
      addPaper({
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        venue: paper.venue,
        doi: paper.doi,
        url: paper.url,
        pdfUrl: paper.pdfUrl,
        abstract: paper.abstract,
        keywords: ["arXiv", "Machine Learning", "Scholar Import"],
        citationCount: paper.citationCount,
        uploadedAt: new Date().toISOString(),
        pagesCount: 10,
        fileSize: "1.5 MB",
        methodology: {
          approach: "Imported via scientific index search",
          dataset: "Document benchmarks",
          metrics: "Citation impact score",
          limitations: "See full published manuscript"
        },
        keyFindings: [
          `Published in ${paper.venue || "arXiv"} with ${paper.citationCount.toLocaleString()} citations.`,
          "Imported into ResearchGPT workspace for semantic analysis and grounded chat."
        ]
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {paper.year}
            </span>
            <span className="text-xs text-zinc-400 font-medium truncate">
              {paper.venue}
            </span>
          </div>

          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 leading-snug">
            <a href={paper.url} target="_blank" rel="noopener noreferrer">
              {paper.title}
            </a>
          </h3>
        </div>

        <Badge variant="outline" size="sm" icon={<Quote className="w-3 h-3 text-indigo-500" />}>
          {paper.citationCount.toLocaleString()} citations
        </Badge>
      </div>

      {/* Authors */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {paper.authors.join(", ")}
      </p>

      {/* Abstract */}
      <p className="text-xs text-zinc-600 dark:text-zinc-400/90 line-clamp-3 leading-relaxed">
        {paper.abstract}
      </p>

      {/* Actions */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isAlreadyInLibrary ? "secondary" : "primary"}
            disabled={isAlreadyInLibrary}
            isLoading={isImporting}
            onClick={handleImport}
            leftIcon={isAlreadyInLibrary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Plus className="w-3.5 h-3.5" />}
          >
            {isAlreadyInLibrary ? "In Library" : "Import to Library"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewBibtex(paper)}
            leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-500" />}
          >
            BibTeX
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {paper.doi && (
            <span className="text-zinc-400 font-mono hidden sm:inline">
              DOI: {paper.doi}
            </span>
          )}

          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
