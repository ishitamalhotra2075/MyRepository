"use client";

import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, Sparkles, Check, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { CitationVerificationResult } from "@/lib/types";
import { CitationAuditCard } from "@/components/detector/CitationAuditCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";

const SAMPLE_CITATIONS = [
  {
    label: "🟢 Authentic CrossRef DOI",
    type: "verified",
    text: "Vaswani, A., Shazeer, N., Parmar, N., et al. (2017). Attention Is All You Need. Advances in Neural Information Processing Systems. DOI: 10.48550/arXiv.1706.03762"
  },
  {
    label: "🔴 Fabricated AI Hallucination",
    type: "hallucinated",
    text: "Smith, J. & Turing, A. (2029). Quantum-Accelerated Deep Learning via Blockchain Synergy and Hyper-Neural Consciousness. International Journal of Advanced LLM Systems. DOI: 10.9999/synthetic.ai.hallucination.4491"
  },
  {
    label: "🟡 Suspicious / Incomplete Reference",
    type: "suspicious",
    text: "He, K. et al. (2021). Deep Residual Learning for Image Recognition. CVPR. (Wrong year cited vs 2016 publication)."
  }
];

export default function DetectorPage() {
  const [citationInput, setCitationInput] = useState("");
  const [result, setResult] = useState<CitationVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (textToVerify?: string) => {
    const text = textToVerify || citationInput;
    if (!text.trim() || isVerifying) return;

    setIsVerifying(true);
    try {
      const data = await api.verifyCitation(text.trim());
      setResult(data);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectPreset = (text: string) => {
    setCitationInput(text);
    handleVerify(text);
  };

  const handleClear = () => {
    setCitationInput("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Fake Citation & Hallucination Guard
          </h1>
          <Badge variant="warning" size="sm">
            CrossRef & DOI Verifier
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500">
          Catch AI-generated fake citations, non-existent DOIs, and metadata inconsistencies in scientific papers and literature reviews.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Paste Academic Citation or Reference String
          </label>
          <textarea
            rows={3}
            value={citationInput}
            onChange={e => setCitationInput(e.target.value)}
            placeholder="e.g. 'Vaswani, A. et al. (2017). Attention Is All You Need. NeurIPS. DOI: 10.48550/arXiv.1706.03762'..."
            className="w-full p-3.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
          />
        </div>

        {/* Quick Test Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-zinc-400">Quick Test Presets:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CITATIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.text)}
                className="text-xs px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors border border-zinc-200 dark:border-zinc-700"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <Button
            size="md"
            variant="primary"
            disabled={!citationInput.trim() || isVerifying}
            isLoading={isVerifying}
            onClick={() => handleVerify()}
            leftIcon={<ShieldAlert className="w-4 h-4" />}
          >
            Authenticate Citation
          </Button>
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Audit Verdict & Discrepancy Breakdown
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Timestamp: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <CitationAuditCard result={result} />
        </div>
      )}
    </div>
  );
}
