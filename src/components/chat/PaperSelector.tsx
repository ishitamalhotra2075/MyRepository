"use client";

import React, { useState } from "react";
import { BookOpen, Check, ChevronDown, Sparkles, Filter, X } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { Badge } from "../ui/Badge";

export function PaperSelector() {
  const { papers, selectedPaperIds, togglePaperSelection, selectAllPapers, clearSelectedPapers } = useLibrary();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 shadow-sm transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Synthesizing ({selectedPaperIds.length} Papers)</span>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {selectedPaperIds.length > 0 && (
          <button
            onClick={clearSelectedPapers}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5"
            title="Clear paper selection"
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30"
          />
          <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-40 space-y-2 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                Choose Papers to Chat With
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllPapers}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Select All
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <button
                  onClick={clearSelectedPapers}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Deselect
                </button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {papers.map(paper => {
                const isSelected = selectedPaperIds.includes(paper.id);
                return (
                  <div
                    key={paper.id}
                    onClick={() => togglePaperSelection(paper.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40 text-zinc-900 dark:text-zinc-100"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-snug line-clamp-1">
                        {paper.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {paper.authors[0]} et al. ({paper.year})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                {selectedPaperIds.length} of {papers.length} selected
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
