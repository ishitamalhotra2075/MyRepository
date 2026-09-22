"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, ArrowRight, AlertOctagon, CheckCircle2 } from "lucide-react";
import { CitationVerificationResult } from "@/lib/types";
import { HallucinationGauge } from "./HallucinationGauge";
import { Button } from "../ui/Button";
import { useToast } from "@/context/ToastContext";

interface CitationAuditCardProps {
  result: CitationVerificationResult;
}

export function CitationAuditCard({ result }: CitationAuditCardProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCorrection = () => {
    if (!result.suggestedCorrection) return;
    navigator.clipboard.writeText(result.suggestedCorrection);
    setCopied(true);
    showToast({
      type: "success",
      title: "Correction Copied",
      message: "Verified citation copied to clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
      {/* Raw Citation Text */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Analyzed Citation Input
        </span>
        <blockquote className="text-xs sm:text-sm font-mono p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 break-words">
          &quot;{result.citationText}&quot;
        </blockquote>
      </div>

      {/* Visual Risk Gauge */}
      <HallucinationGauge score={result.hallucinationRisk} status={result.status} />

      {/* Discrepancies if any */}
      {result.discrepancies && result.discrepancies.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1.5">
          <p className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            Detected Inconsistencies
          </p>
          <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300/90 pl-5 list-disc">
            {result.discrepancies.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Matched Official Record */}
      {result.matchedRecord && (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Official CrossRef Registry Match
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {result.matchedRecord.citations.toLocaleString()} citations
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {result.matchedRecord.title}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {result.matchedRecord.authors.join(", ")} • {result.matchedRecord.year} • {result.matchedRecord.journal}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-400 font-mono">
              DOI: {result.matchedRecord.doi}
            </span>
            <a
              href={result.matchedRecord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Verify at DOI.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Suggested Authentic Correction */}
      {result.suggestedCorrection && (
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              Suggested Authentic Replacement
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCorrection}
              leftIcon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
            {result.suggestedCorrection}
          </p>
        </div>
      )}
    </div>
  );
}
