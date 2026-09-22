"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface HallucinationGaugeProps {
  score: number; // 0 to 100%
  status: "verified" | "suspicious" | "hallucinated";
}

export function HallucinationGauge({ score, status }: HallucinationGaugeProps) {
  const isVerified = status === "verified";
  const isSuspicious = status === "suspicious";
  const isHallucinated = status === "hallucinated";

  const color = isVerified ? "#10b981" : isSuspicious ? "#f59e0b" : "#f43f5e";
  const bgColor = isVerified ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : isSuspicious ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${bgColor}`}>
      <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-zinc-200 dark:text-zinc-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${score}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke={color}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-black font-mono leading-none">{score}%</span>
          <span className="text-[8px] uppercase tracking-tighter opacity-70">Risk</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 font-bold text-sm">
          {isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
          {isSuspicious && <AlertTriangle className="w-4 h-4 text-amber-500" />}
          {isHallucinated && <ShieldAlert className="w-4 h-4 text-rose-500" />}
          <span>
            {isVerified && "Verified Authentic Citation"}
            {isSuspicious && "Suspicious Reference Discrepancy"}
            {isHallucinated && "Fake / Hallucinated Citation Detected"}
          </span>
        </div>
        <p className="text-xs opacity-80 mt-0.5 leading-snug">
          {isVerified && "Cross-checked against CrossRef & arXiv scientific registries. Genuine publication."}
          {isSuspicious && "Paper partially matches registry, but dates or venue differ from official records."}
          {isHallucinated && "High risk of AI fabrication. No corresponding record exists in CrossRef or PubMed."}
        </p>
      </div>
    </div>
  );
}
