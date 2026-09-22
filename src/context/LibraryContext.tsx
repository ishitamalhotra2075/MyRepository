"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Paper } from "@/lib/types";
import { SAMPLE_PAPERS } from "@/lib/samplePapers";
import { useToast } from "./ToastContext";

interface LibraryContextType {
  papers: Paper[];
  selectedPaperIds: string[];
  activePaper: Paper | null;
  searchQuery: string;
  selectedTag: string | null;
  addPaper: (paper: Paper) => void;
  removePaper: (id: string) => void;
  togglePaperSelection: (id: string) => void;
  selectAllPapers: () => void;
  clearSelectedPapers: () => void;
  setActivePaper: (paper: Paper | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  getSelectedPapers: () => Paper[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [papers, setPapers] = useState<Paper[]>(SAMPLE_PAPERS);
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([
    "paper-transformer-2017",
    "paper-rag-2020",
  ]);
  const [activePaper, setActivePaper] = useState<Paper | null>(SAMPLE_PAPERS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { showToast } = useToast();

  // Load persisted custom papers from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("researchgpt-custom-papers");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with seminal papers ensuring no duplicates
          const seminalIds = new Set(SAMPLE_PAPERS.map(p => p.id));
          const customs = parsed.filter((p: Paper) => !seminalIds.has(p.id));
          setPapers([...customs, ...SAMPLE_PAPERS]);
        }
      }
    } catch (e) {
      console.error("Error reading saved papers from storage", e);
    }
  }, []);

  const addPaper = (newPaper: Paper) => {
    setPapers(prev => {
      const updated = [newPaper, ...prev];
      try {
        const customs = updated.filter(p => !p.id.startsWith("paper-transformer-") && !p.id.startsWith("paper-rag-") && !p.id.startsWith("paper-lora-") && !p.id.startsWith("paper-hallucination-"));
        localStorage.setItem("researchgpt-custom-papers", JSON.stringify(customs));
      } catch (e) {
        console.error("Failed to save papers to localStorage", e);
      }
      return updated;
    });

    // Automatically select newly added paper
    setSelectedPaperIds(prev => [...new Set([newPaper.id, ...prev])]);
    showToast({
      type: "success",
      title: "Paper Added to Library",
      message: `"${newPaper.title}" is now ready for grounded chat and literature synthesis.`
    });
  };

  const removePaper = (id: string) => {
    setPapers(prev => {
      const updated = prev.filter(p => p.id !== id);
      try {
        const customs = updated.filter(p => !p.id.startsWith("paper-transformer-") && !p.id.startsWith("paper-rag-") && !p.id.startsWith("paper-lora-") && !p.id.startsWith("paper-hallucination-"));
        localStorage.setItem("researchgpt-custom-papers", JSON.stringify(customs));
      } catch (e) {
        console.error("Failed to sync removed paper", e);
      }
      return updated;
    });
    setSelectedPaperIds(prev => prev.filter(pId => pId !== id));
    if (activePaper?.id === id) {
      setActivePaper(null);
    }
    showToast({
      type: "info",
      title: "Paper Removed",
      message: "The paper was removed from your active workspace."
    });
  };

  const togglePaperSelection = (id: string) => {
    setSelectedPaperIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllPapers = () => {
    setSelectedPaperIds(papers.map(p => p.id));
  };

  const clearSelectedPapers = () => {
    setSelectedPaperIds([]);
  };

  const getSelectedPapers = () => {
    return papers.filter(p => selectedPaperIds.includes(p.id));
  };

  return (
    <LibraryContext.Provider
      value={{
        papers,
        selectedPaperIds,
        activePaper,
        searchQuery,
        selectedTag,
        addPaper,
        removePaper,
        togglePaperSelection,
        selectAllPapers,
        clearSelectedPapers,
        setActivePaper,
        setSearchQuery,
        setSelectedTag,
        getSelectedPapers,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
