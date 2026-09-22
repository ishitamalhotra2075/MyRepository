"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Filter, BookOpen, Quote, RefreshCw } from "lucide-react";
import { ScholarPaperResult } from "@/lib/types";
import { ScholarSearchResult } from "@/components/scholar/ScholarSearchResult";
import { BibtexModal } from "@/components/scholar/BibtexModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PaperCardSkeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";

export default function ScholarPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScholarPaperResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBibtexPaper, setSelectedBibtexPaper] = useState<ScholarPaperResult | null>(null);

  // Perform initial search for seminal literature
  useEffect(() => {
    handleSearch("attention transformers deep learning");
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const data = await api.searchScholar(searchQuery);
      setResults(data);
    } catch {
      // Handled in api
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = (filterTopic: string) => {
    setQuery(filterTopic);
    handleSearch(filterTopic);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Online Scholar & arXiv Search
          </h1>
          <Badge variant="primary" size="sm">
            Live Global Index
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500">
          Search millions of peer-reviewed scientific papers and preprints. Inspect citation counts, copy BibTeX, and import directly to your ResearchGPT workspace.
        </p>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (query.trim()) handleSearch(query);
        }}
        className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-2 focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <div className="pl-3 text-zinc-400">
          <Search className="w-5 h-5 text-indigo-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search topics, authors, or DOIs (e.g. 'Large language model reasoning', 'LoRA', 'ResNet')..."
          className="w-full py-2.5 px-3 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
        />
        <Button size="sm" variant="primary" type="submit" isLoading={isLoading}>
          Search
        </Button>
      </form>

      {/* Suggested Topic Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400">Trending Topics:</span>
        {[
          "Transformers & Attention",
          "Retrieval-Augmented Generation",
          "Parameter-Efficient Fine-Tuning",
          "Hallucination Detection",
          "Computer Vision ResNet",
          "Multimodal Foundation Models"
        ].map(topic => (
          <button
            key={topic}
            onClick={() => handleFilterClick(topic)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 text-zinc-600 dark:text-zinc-300 transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {isLoading ? "Searching Scientific Databases..." : `Showing ${results.length} Scientific Publications`}
        </p>
      </div>

      {/* Results List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PaperCardSkeleton />
          <PaperCardSkeleton />
          <PaperCardSkeleton />
          <PaperCardSkeleton />
        </div>
      ) : results.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300">
            No publications found
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query or exploring one of the trending research topics above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(paper => (
            <ScholarSearchResult
              key={paper.id}
              paper={paper}
              onViewBibtex={p => setSelectedBibtexPaper(p)}
            />
          ))}
        </div>
      )}

      {/* BibTeX Modal */}
      <BibtexModal
        paper={selectedBibtexPaper}
        isOpen={!!selectedBibtexPaper}
        onClose={() => setSelectedBibtexPaper(null)}
      />
    </div>
  );
}
