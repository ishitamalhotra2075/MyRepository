"use client";

import React from "react";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, BookOpen, AlertCircle } from "lucide-react";
import { PaperpalAudit } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface PaperpalAuditorProps {
  audit: PaperpalAudit | null;
  onApplyEnhancement?: (original: string, replacement: string) => void;
  isLoading?: boolean;
}

export function PaperpalAuditor({ audit, onApplyEnhancement, isLoading }: PaperpalAuditorProps) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Paperpal Academic Tone & Quality Audit
        </h3>
        <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
          Click &quot;Audit Paperpal&quot; to evaluate vocabulary rigor, hedging consistency, readability index, and academic score.
        </p>
      </div>
    );
  }

  const scoreColor = audit.academicScore >= 85
    ? "text-emerald-500 border-emerald-500/40 bg-emerald-500/10"
    : audit.academicScore >= 70
    ? "text-amber-500 border-amber-500/40 bg-amber-500/10"
    : "text-rose-500 border-rose-500/40 bg-rose-500/10";

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-5">
      {/* Top Header with Academic Score */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            Paperpal Quality Audit
          </h3>
          <p className="text-xs text-zinc-500">{audit.readabilityGrade}</p>
        </div>

        {/* Score pill */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${scoreColor}`}>
          <span className="text-base font-black font-mono leading-none">{audit.academicScore}</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter opacity-80">/ 100</span>
        </div>
      </div>

      {/* Summary Feedback */}
      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
        {audit.summaryFeedback}
      </p>

      {/* Enhancements List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span>Targeted Vocabulary Suggestions</span>
          <Badge variant="purple" size="sm">
            {audit.enhancements.length} available
          </Badge>
        </div>

        {audit.enhancements.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-center text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>No informal colloquialisms found. Writing meets high academic standards!</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {audit.enhancements.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="line-through text-rose-500 font-serif font-medium bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                      {item.originalSpan}
                    </span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-serif font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      {item.suggestedSpan}
                    </span>
                  </div>

                  {onApplyEnhancement && (
                    <button
                      onClick={() => onApplyEnhancement(item.originalSpan, item.suggestedSpan)}
                      className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-zinc-500 leading-snug">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
