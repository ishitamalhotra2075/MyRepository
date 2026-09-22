"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ScholarPaperResult } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

interface BibtexModalProps {
  paper: ScholarPaperResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BibtexModal({ paper, isOpen, onClose }: BibtexModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!paper) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(paper.bibtex);
    setCopied(true);
    showToast({
      type: "success",
      title: "BibTeX Copied",
      message: `Citation for "${paper.title}" copied to clipboard.`
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BibTeX Citation Entry"
      description={`Formatted bibliography citation for "${paper.title}".`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border border-zinc-800">
          {paper.bibtex}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied!" : "Copy BibTeX"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
