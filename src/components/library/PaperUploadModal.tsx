"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useLibrary } from "@/context/LibraryContext";
import { useToast } from "@/context/ToastContext";
import { Paper } from "@/lib/types";

interface PaperUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaperUploadModal({ isOpen, onClose }: PaperUploadModalProps) {
  const { addPaper } = useLibrary();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"file" | "manual">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual form state
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [doi, setDoi] = useState("");
  const [venue, setVenue] = useState("");
  const [keywords, setKeywords] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        showToast({
          type: "warning",
          title: "Unsupported Format",
          message: "Please select a standard scientific PDF document.",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const processFileUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      // Simulate intelligent PDF ingestion, text parsing and metadata extraction
      await new Promise(resolve => setTimeout(resolve, 1200));

      const cleanTitle = selectedFile.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
      const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

      const newPaper: Paper = {
        id: `paper-upload-${Date.now()}`,
        title: formattedTitle,
        authors: ["Lead Investigator", "Co-Author et al."],
        year: new Date().getFullYear(),
        venue: "Uploaded PDF Repository",
        doi: `10.48550/user.${Date.now()}`,
        abstract: `Extracted from uploaded manuscript "${selectedFile.name}". This study investigates algorithmic and empirical dimensions, model benchmarks, and experimental bounds.`,
        keywords: ["PDF Analysis", "Deep Learning", "Methodology"],
        citationCount: 0,
        uploadedAt: new Date().toISOString(),
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        pagesCount: Math.floor(Math.random() * 14) + 6,
        methodology: {
          approach: "Automated OCR extraction, vector chunking and semantic embeddings",
          dataset: "Document corpus",
          metrics: "Precision and retrieval accuracy",
          limitations: "Subject to PDF visual parsing constraints"
        },
        keyFindings: [
          "Document indexed for multi-paper grounded chat synthesis.",
          "Verifiable references extracted and queued for hallucination check."
        ],
        sections: [
          {
            id: "sec-up-1",
            title: "1. Abstract & Motivation",
            pageNumber: 1,
            content: `Extracted content from ${selectedFile.name}. Key problem formulation and background review.`
          },
          {
            id: "sec-up-2",
            title: "2. Empirical Architecture",
            pageNumber: 3,
            content: "Detailed algorithmic pipeline, hyperparameter configuration, and hardware training setup."
          }
        ]
      };

      addPaper(newPaper);
      onClose();
      setSelectedFile(null);
    } catch (e) {
      showToast({
        type: "error",
        title: "Processing Failed",
        message: "Could not parse the PDF file. Please try manual entry."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Express-validator style validation rules
    if (!title.trim() || title.trim().length < 3) {
      errors.title = "Title is required (at least 3 characters)";
    }
    if (!abstract.trim() || abstract.trim().length < 15) {
      errors.abstract = "Abstract must be at least 15 characters long";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsProcessing(true);

    const authorList = authors
      ? authors.split(/,|and/).map(a => a.trim()).filter(Boolean)
      : ["Author"];

    const keywordList = keywords
      ? keywords.split(/,|;/).map(k => k.trim()).filter(Boolean)
      : ["Research", "Methodology"];

    const newPaper: Paper = {
      id: `paper-manual-${Date.now()}`,
      title: title.trim(),
      authors: authorList,
      year: parseInt(year, 10) || new Date().getFullYear(),
      venue: venue.trim() || "Independent Publication",
      doi: doi.trim() || `10.48550/paper.${Date.now()}`,
      abstract: abstract.trim(),
      keywords: keywordList,
      citationCount: 0,
      uploadedAt: new Date().toISOString(),
      pagesCount: 8,
      fileSize: "0.8 MB",
      methodology: {
        approach: "Standardized peer empirical analysis",
        dataset: "Custom benchmark",
        metrics: "BLEU, Accuracy, F1",
        limitations: "Generalization bounds"
      },
      keyFindings: [
        "Structured abstract successfully loaded into ResearchGPT workspace.",
        "Available for comparison matrix and structured literature reviews."
      ]
    };

    addPaper(newPaper);
    setIsProcessing(false);
    onClose();

    // Reset form
    setTitle("");
    setAuthors("");
    setAbstract("");
    setDoi("");
    setVenue("");
    setKeywords("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Research Paper to Library"
      description="Upload a scientific PDF manuscript or provide metadata to unlock AnswerThis grounded Q&A."
      maxWidth="xl"
    >
      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-5">
        <button
          onClick={() => setActiveTab("file")}
          className={`pb-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "file"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Upload PDF File
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`pb-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "manual"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Manual Metadata Entry
        </button>
      </div>

      {activeTab === "file" ? (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/40"
            }`}
          >
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{selectedFile.name}</p>
                <p className="text-xs text-zinc-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB PDF</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-rose-500 hover:underline mt-1"
                >
                  Change file
                </button>
              </div>
            ) : (
              <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                  Click to browse or drag & drop research PDF
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Supports arXiv, IEEE, ACM, Nature manuscripts up to 25 MB
                </p>
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!selectedFile}
              isLoading={isProcessing}
              onClick={processFileUpload}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Parse & Index PDF
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Paper Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Attention Is All You Need"
              className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.title && <p className="text-xs text-rose-500 mt-1">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Authors (comma separated)
              </label>
              <input
                type="text"
                value={authors}
                onChange={e => setAuthors(e.target.value)}
                placeholder="A. Vaswani, N. Shazeer..."
                className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Publication Year
              </label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Abstract *
            </label>
            <textarea
              rows={3}
              value={abstract}
              onChange={e => setAbstract(e.target.value)}
              placeholder="Paste or write the paper's scientific abstract..."
              className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.abstract && <p className="text-xs text-rose-500 mt-1">{formErrors.abstract}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                DOI Identifier
              </label>
              <input
                type="text"
                value={doi}
                onChange={e => setDoi(e.target.value)}
                placeholder="10.48550/arXiv.1706.03762"
                className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="Transformers, Attention, NLP"
                className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" isLoading={isProcessing}>
              Save Paper
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
