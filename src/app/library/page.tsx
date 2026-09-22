"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Upload,
  Filter,
  Check,
  FileText,
  Sparkles,
  LayoutGrid,
  List,
  Columns
} from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { PaperCard } from "@/components/library/PaperCard";
import { PdfViewer } from "@/components/library/PdfViewer";
import { PaperUploadModal } from "@/components/library/PaperUploadModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Paper } from "@/lib/types";

export default function LibraryPage() {
  const {
    papers,
    selectedPaperIds,
    activePaper,
    setActivePaper,
    selectAllPapers,
    clearSelectedPapers,
    togglePaperSelection,
  } = useLibrary();

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "split">("grid");

  // Collect all unique keywords across papers
  const allKeywords = Array.from(
    new Set(papers.flatMap(p => p.keywords || []))
  );

  const filteredPapers = papers.filter(p => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = !selectedTag || p.keywords.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Research Library & PDF Reader
            </h1>
            <Badge variant="primary" size="sm">
              {papers.length} Manuscripts
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Manage your scientific corpus, view extracted sections, and choose papers for AnswerThis multi-document synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsUploadOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Import PDF
          </Button>

          <div className="hidden sm:flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === "grid"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === "split"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title="Split Reader View"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Tags Filtering Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search papers by title, abstract, or author..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Bulk selection controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="text-zinc-500 hidden sm:inline">
            {selectedPaperIds.length} of {papers.length} selected
          </span>
          <button
            onClick={selectAllPapers}
            className="px-2.5 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearSelectedPapers}
            className="px-2.5 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Deselect
          </button>
        </div>
      </div>

      {/* Keyword Chips */}
      {allKeywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              selectedTag === null
                ? "bg-indigo-600 text-white font-medium"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50"
            }`}
          >
            All Keywords
          </button>
          {allKeywords.slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white font-medium"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Main View Area: Grid View vs Split Reader View */}
      {viewMode === "split" && activePaper ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
          {/* Left mini list */}
          <div className="lg:col-span-4 overflow-y-auto space-y-3 pr-1">
            {filteredPapers.map(paper => (
              <div
                key={paper.id}
                onClick={() => setActivePaper(paper)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activePaper.id === paper.id
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/60 shadow-md"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-zinc-400">{paper.year}</span>
                  {selectedPaperIds.includes(paper.id) && (
                    <Badge variant="primary" size="sm">Selected</Badge>
                  )}
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                  {paper.title}
                </h4>
                <p className="text-[11px] text-zinc-500 truncate mt-1">
                  {paper.authors[0]} et al.
                </p>
              </div>
            ))}
          </div>

          {/* Right reader */}
          <div className="lg:col-span-8 h-full">
            <PdfViewer paper={activePaper} onClose={() => setViewMode("grid")} />
          </div>
        </div>
      ) : (
        <div>
          {filteredPapers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300">
                No research papers match your search
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try searching with different terms or import a scientific PDF document into your library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onRead={p => {
                    setActivePaper(p);
                    setViewMode("split");
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <PaperUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
