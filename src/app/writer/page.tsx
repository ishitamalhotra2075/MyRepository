"use client";

import React, { useState } from "react";
import { PenTool, Sparkles, Wand2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { JenniEditor } from "@/components/writer/JenniEditor";
import { PaperpalAuditor } from "@/components/writer/PaperpalAuditor";
import { PaperpalAudit } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

const INITIAL_MANUSCRIPT = `In this paper, we propose a scalable approach for parameter-efficient adaptation of large language models. A lot of previous studies relied on full fine-tuning, which introduces a huge amount of GPU memory overhead and creates severe storage bottlenecks. 

Our empirical evaluations show that freezing foundational transformer weights and training low-rank decomposition matrices drastically cuts memory consumption. This proves that high performance can be achieved without modifying all parameters. In order to evaluate generalization, we tested on diverse NLP benchmarks.`;

export default function WriterPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState(INITIAL_MANUSCRIPT);
  const [audit, setAudit] = useState<PaperpalAudit | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAuditText = async (text: string) => {
    setIsAuditing(true);
    try {
      const auditResult = await api.auditText(text);
      setAudit(auditResult);
      showToast({
        type: "success",
        title: "Paperpal Audit Complete",
        message: `Academic score: ${auditResult.academicScore}/100. ${auditResult.enhancements.length} suggestions found.`
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyEnhancement = (original: string, replacement: string) => {
    const updated = content.replace(original, replacement);
    setContent(updated);

    // Update local audit
    if (audit) {
      setAudit({
        ...audit,
        academicScore: Math.min(98, audit.academicScore + 6),
        enhancements: audit.enhancements.filter(e => e.originalSpan !== original)
      });
    }

    showToast({
      type: "success",
      title: "Enhancement Applied",
      message: `Replaced "${original}" with academic phrasing "${replacement}".`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Jenni AI & Paperpal Academic Writing Copilot
          </h1>
          <Badge variant="purple" size="sm">
            AI Co-Writer
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500">
          Draft manuscripts with smart ghost-text autocompletion (Tab to accept), academic paraphrasing, and Paperpal peer-reviewed language auditing.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Column: Jenni AI Manuscript Editor */}
        <div className="lg:col-span-8 h-full">
          <JenniEditor
            content={content}
            onChange={setContent}
            onAuditText={handleAuditText}
          />
        </div>

        {/* Right Column: Paperpal Language & Tone Auditor */}
        <div className="lg:col-span-4 h-full overflow-y-auto">
          <PaperpalAuditor
            audit={audit}
            isLoading={isAuditing}
            onApplyEnhancement={handleApplyEnhancement}
          />
        </div>
      </div>
    </div>
  );
}
