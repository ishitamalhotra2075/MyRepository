"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Sparkles,
  BookOpen,
  RotateCcw,
  Plus,
  X,
  ChevronRight,
  ExternalLink,
  Quote,
  Layers,
  ArrowRight
} from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { useToast } from "@/context/ToastContext";
import { ChatMessage as ChatMessageType, Paper } from "@/lib/types";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { PaperSelector } from "@/components/chat/PaperSelector";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";

const INITIAL_SUGGESTIONS = [
  "What are the common computational limitations identified across these papers?",
  "Compare the evaluation benchmarks and datasets utilized in their methodologies",
  "Summarize the key mathematical formulations and attention/adapter mechanics",
  "What consensus or controversies exist regarding parameter scaling vs retrieval?",
];

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { papers, selectedPaperIds, getSelectedPapers } = useLibrary();
  const { showToast } = useToast();

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      timestamp: new Date().toISOString(),
      content: `Welcome to **ResearchGPT AnswerThis Grounded Synthesis**! I analyze your selected research papers simultaneously, answering your queries with verifiable page-level citations and verbatim quotes from the manuscripts.\n\nSelect papers from the top dropdown to refine the grounding corpus, or ask a question below.`,
      synthesisTheme: "AnswerThis Multi-Paper Grounding"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [citationModalPaper, setCitationModalPaper] = useState<{ paper: Paper; page: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Execute initial query if passed via search param
  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const selectedPapers = getSelectedPapers();

    if (selectedPapers.length === 0) {
      showToast({
        type: "warning",
        title: "No Papers Selected",
        message: "Please select at least one paper to ground the AnswerThis chat.",
      });
      return;
    }

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      timestamp: new Date().toISOString(),
      content: textToSend.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(textToSend.trim(), selectedPapers, messages);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      showToast({
        type: "error",
        title: "Synthesis Failed",
        message: "Unable to process query. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: "Conversation cleared. Select papers and ask a new scientific query.",
        synthesisTheme: "Ready for Synthesis"
      }
    ]);
  };

  const handleViewCitation = (paperId: string, pageNumber: number) => {
    const found = papers.find(p => p.id === paperId);
    if (found) {
      setCitationModalPaper({ paper: found, page: pageNumber });
    }
  };

  const selectedPapers = getSelectedPapers();

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fade-in space-y-4">
      {/* Top Bar: Paper Selector & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <PaperSelector />

          {/* Selected Paper Chips */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-lg py-1">
            {selectedPapers.map(p => (
              <span
                key={p.id}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800/60 truncate max-w-[180px]"
                title={p.title}
              >
                {p.title}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onViewCitation={handleViewCitation}
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                AnswerThis Synthesizing Across {selectedPapers.length} Manuscripts...
              </p>
              <p className="text-[11px] text-zinc-400">
                Aligning empirical benchmarks, extracting page numbers, and verifying quotes...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts if chat is brief */}
      {messages.length <= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 shrink-0">
          {INITIAL_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-left p-2.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 text-xs text-zinc-600 dark:text-zinc-300 transition-all flex items-center justify-between group"
            >
              <span className="truncate pr-2">{prompt}</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Field */}
      <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={`Ask AnswerThis about ${selectedPapers.length} selected papers (e.g., 'Compare their key architectural assumptions')...`}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
          />
          <Button
            size="sm"
            variant="primary"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            isLoading={isLoading}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Synthesize
          </Button>
        </form>
      </div>

      {/* Grounded Citation Modal */}
      {citationModalPaper && (
        <Modal
          isOpen={true}
          onClose={() => setCitationModalPaper(null)}
          title={`Grounded Page ${citationModalPaper.page} Citation`}
          description={citationModalPaper.paper.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
              &quot;{citationModalPaper.paper.abstract}&quot;
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">
                Authors: {citationModalPaper.paper.authors.join(", ")}
              </p>
              <p className="text-zinc-500">
                Venue: {citationModalPaper.paper.venue} ({citationModalPaper.paper.year})
              </p>
              <p className="text-zinc-400 font-mono">
                DOI: {citationModalPaper.paper.doi}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setCitationModalPaper(null)}>
                Close
              </Button>
              {citationModalPaper.paper.url && (
                <a
                  href={citationModalPaper.paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                >
                  <span>Open Source PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading chat workspace...</div>}>
      <ChatContent />
    </React.Suspense>
  );
}
