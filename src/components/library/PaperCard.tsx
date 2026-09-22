"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  MessageSquareQuote,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  GitCompare,
  Sparkles,
  Quote
} from "lucide-react";
import { Paper } from "@/lib/types";
import { useLibrary } from "@/context/LibraryContext";
import { useToast } from "@/context/ToastContext";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface PaperCardProps {
  paper: Paper;
  onRead?: (paper: Paper) => void;
}

export function PaperCard({ paper, onRead }: PaperCardProps) {
  const { selectedPaperIds, togglePaperSelection, removePaper, setActivePaper } = useLibrary();
  const { showToast } = useToast();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isSelected = selectedPaperIds.includes(paper.id);

  const handleCopyBibtex = () => {
    const bibtex = `@article{${paper.id},
  title={${paper.title}},
  author={${paper.authors.join(" and ")}},
  year={${paper.year}},
  doi={${paper.doi || ""}},
  venue={${paper.venue || ""}}
}`;
    navigator.clipboard.writeText(bibtex);
    showToast({
      type: "success",
      title: "BibTeX Copied",
      message: `Citation for "${paper.title}" copied to clipboard.`
    });
  };

  const handleOpenReader = () => {
    setActivePaper(paper);
    if (onRead) onRead(paper);
  };

  return (
    <Card
      hover
      className={`group p-5 flex flex-col justify-between transition-all duration-200 ${
        isSelected
          ? "border-indigo-500/60 dark:border-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md"
          : ""
      }`}
    >
      <div>
        {/* Top bar: Selection checkbox & citation count */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePaperSelection(paper.id)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400"
              }`}
              aria-label={isSelected ? "Deselect paper" : "Select paper for chat"}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              {paper.year}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {paper.citationCount !== undefined && paper.citationCount > 0 && (
              <Badge variant="outline" size="sm" icon={<Quote className="w-3 h-3 text-indigo-500" />}>
                {paper.citationCount.toLocaleString()}
              </Badge>
            )}
            {paper.pagesCount && (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {paper.pagesCount} pages
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleOpenReader}
          className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 leading-snug mb-1.5 transition-colors"
        >
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-2">
          {paper.authors.join(", ")}
        </p>

        {/* Abstract snippet */}
        <p className="text-xs text-zinc-600 dark:text-zinc-400/90 line-clamp-3 leading-relaxed mb-3">
          {paper.abstract}
        </p>

        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {paper.keywords.slice(0, 3).map(kw => (
              <span
                key={kw}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium"
              >
                {kw}
              </span>
            ))}
            {paper.keywords.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-zinc-400 font-medium">
                +{paper.keywords.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer action buttons */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleOpenReader}
            leftIcon={<BookOpen className="w-3.5 h-3.5 text-indigo-500" />}
          >
            Read PDF
          </Button>

          <Link href="/chat">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<MessageSquareQuote className="w-3.5 h-3.5" />}
              title="Chat with paper"
            >
              Chat
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyBibtex}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Copy BibTeX Citation"
            aria-label="Copy BibTeX"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Open Source URL"
              aria-label="Open source link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {showConfirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => removePaper(paper.id)}
                className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-1 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete paper"
              aria-label="Delete paper"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
