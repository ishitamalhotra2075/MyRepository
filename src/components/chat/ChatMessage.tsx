"use client";

import React, { useState } from "react";
import { Sparkles, User, Copy, Check, BookOpen, Quote, ChevronRight } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { useToast } from "@/context/ToastContext";

interface ChatMessageProps {
  message: ChatMessageType;
  onViewCitation?: (paperId: string, pageNumber: number) => void;
}

export function ChatMessage({ message, onViewCitation }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    showToast({
      type: "success",
      title: "Response Copied",
      message: "Chat synthesis copied to clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-all ${
        isAssistant
          ? "bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm"
          : "bg-zinc-100/70 dark:bg-zinc-800/40 border border-transparent"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isAssistant
            ? "bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20"
            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
        }`}
      >
        {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {isAssistant ? "ResearchGPT" : "You"}
            </span>
            {message.synthesisTheme && (
              <Badge variant="primary" size="sm">
                {message.synthesisTheme}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              title="Copy message"
              aria-label="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content with formatting */}
        <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
          {message.content}
        </div>

        {/* AnswerThis Style Citations Bar */}
        {message.citations && message.citations.length > 0 && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grounded Citations ({message.citations.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.citations.map((cite, idx) => (
                <div
                  key={idx}
                  onClick={() => onViewCitation && onViewCitation(cite.paperId, cite.pageNumber)}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-indigo-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {cite.paperTitle}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shrink-0">
                      Page {cite.pageNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic line-clamp-2 leading-relaxed">
                    {cite.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
