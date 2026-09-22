"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Quote,
  RefreshCw,
  Copy,
  Check,
  Download,
  BookOpen,
  CornerDownLeft,
  Wand2,
  FileDown
} from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

interface JenniEditorProps {
  content: string;
  onChange: (text: string) => void;
  onAuditText?: (text: string) => void;
}

export function JenniEditor({ content, onChange, onAuditText }: JenniEditorProps) {
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [ghostText, setGhostText] = useState("");
  const [isGeneratingGhost, setIsGeneratingGhost] = useState(false);
  const [paraphraseMode, setParaphraseMode] = useState<"academic" | "expand" | "condense" | "simplify">("academic");
  const [isParaphrasing, setIsParaphrasing] = useState(false);

  // Trigger ghost autocomplete suggestion when user stops typing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (content.trim().length > 15) {
        setIsGeneratingGhost(true);
        try {
          const suggestion = await api.getAutocomplete(content);
          setGhostText(suggestion);
        } catch {
          // Ignore
        } finally {
          setIsGeneratingGhost(false);
        }
      } else {
        setGhostText("");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [content]);

  // Handle Tab key to accept ghost text
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      onChange(content + ghostText);
      setGhostText("");
      showToast({
        type: "success",
        title: "Autocomplete Accepted",
        message: "Jenni AI sentence suggestion inserted."
      });
    }
  };

  const handleParaphrase = async () => {
    if (!content.trim()) return;
    setIsParaphrasing(true);
    try {
      const paraphrased = await api.paraphrase(content, paraphraseMode);
      onChange(paraphrased);
      showToast({
        type: "success",
        title: "Academic Paraphrasing Applied",
        message: `Rewritten using ${paraphraseMode} scholarly tone.`
      });
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleInsertCitation = (sampleCitation: string) => {
    onChange(content + ` (${sampleCitation})`);
    showToast({
      type: "info",
      title: "Citation Inserted",
      message: "Inline academic citation added at cursor."
    });
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manuscript-draft.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: "success",
      title: "Exported",
      message: "Manuscript downloaded as Markdown file."
    });
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Editor Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-xl p-1 border border-zinc-200 dark:border-zinc-700 text-xs font-medium">
            <span className="text-zinc-400 px-2">Rewrite Mode:</span>
            {(["academic", "expand", "condense", "simplify"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setParaphraseMode(mode)}
                className={`capitalize px-2.5 py-1 rounded-lg transition-all ${
                  paraphraseMode === mode
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="secondary"
            isLoading={isParaphrasing}
            onClick={handleParaphrase}
            leftIcon={<Wand2 className="w-3.5 h-3.5 text-indigo-500" />}
          >
            Rewrite Text
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleInsertCitation("Vaswani et al., 2017")}
            leftIcon={<Quote className="w-3.5 h-3.5 text-indigo-500" />}
          >
            + Cite
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExportMarkdown}
            leftIcon={<FileDown className="w-3.5 h-3.5" />}
          >
            Export .md
          </Button>

          {onAuditText && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onAuditText(content)}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Audit Paperpal
            </Button>
          )}
        </div>
      </div>

      {/* Editor Writing Body */}
      <div className="flex-1 relative p-6 sm:p-8 flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start writing your research paper introduction, methodology, or literature review... Jenni AI will suggest smart sentence continuations (Press Tab to accept)."
          className="w-full flex-1 bg-transparent border-none resize-none focus:outline-none text-zinc-900 dark:text-zinc-100 text-sm sm:text-base leading-relaxed font-serif placeholder:font-sans placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />

        {/* Ghost text recommendation banner */}
        {ghostText && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-950 dark:text-indigo-200 font-serif italic truncate">
                Suggested continuation: &quot;{ghostText}&quot;
              </p>
            </div>
            <button
              onClick={() => {
                onChange(content + ghostText);
                setGhostText("");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shrink-0"
            >
              <span>Accept (Tab)</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="px-6 py-2.5 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-4">
          <span>{words} words</span>
          <span>{chars} characters</span>
          <span>~{readTime} min read</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Jenni AI Autocomplete Ready</span>
        </div>
      </div>
    </div>
  );
}
