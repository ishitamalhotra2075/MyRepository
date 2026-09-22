"use client";

import React, { useState, useEffect } from "react";
import { GitCompare, Download, Check, Sparkles, Layers, ArrowRight, Share2 } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { useToast } from "@/context/ToastContext";
import { ComparisonMatrix } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";

export default function ComparePage() {
  const { papers, selectedPaperIds, togglePaperSelection, getSelectedPapers } = useLibrary();
  const { showToast } = useToast();

  const [matrix, setMatrix] = useState<ComparisonMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedPapers = getSelectedPapers();

  useEffect(() => {
    if (selectedPapers.length > 0) {
      handleGenerateMatrix();
    }
  }, [selectedPaperIds]);

  const handleGenerateMatrix = async () => {
    if (selectedPapers.length === 0) return;
    setIsLoading(true);
    try {
      const data = await api.comparePapers(selectedPapers);
      setMatrix(data);
    } catch {
      // Handled in api
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!matrix) return;
    let md = `# Methodology Comparison Matrix\n\n`;
    md += `*Synthesized across ${selectedPapers.length} research papers*\n\n`;

    // Table
    md += `| Dimension | ${selectedPapers.map(p => p.title).join(" | ")} |\n`;
    md += `| --- | ${selectedPapers.map(() => "---").join(" | ")} |\n`;

    matrix.dimensions.forEach(dim => {
      md += `| **${dim.name}** | ${selectedPapers.map(p => dim.values[p.id] || "N/A").join(" | ")} |\n`;
    });

    md += `\n## Consensus\n`;
    matrix.consensus.forEach(c => (md += `- ${c}\n`));

    md += `\n## Divergence\n`;
    (matrix.divergences || []).forEach(d => (md += `- ${d}\n`));

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "methodology-comparison.md";
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      title: "Comparison Exported",
      message: "Matrix saved as Markdown document."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Methodology Comparison Matrix
            </h1>
            <Badge variant="primary" size="sm">
              Differential Synthesis
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Compare algorithmic architectures, evaluation benchmarks, metrics, and limitations side-by-side across papers in your workspace.
          </p>
        </div>

        {matrix && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportMarkdown}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Matrix (.md)
          </Button>
        )}
      </div>

      {/* Paper Selection Checklist */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Select Papers to Compare ({selectedPaperIds.length} Selected)
          </span>
          <span className="text-xs text-zinc-500">
            Tip: Select 2 or more papers for detailed side-by-side analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {papers.map(p => {
            const isSelected = selectedPaperIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => togglePaperSelection(p.id)}
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/60 shadow-sm text-zinc-900 dark:text-zinc-100"
                    : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                }`}
              >
                <div
                  className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-snug line-clamp-1">{p.title}</p>
                  <p className="text-[11px] text-zinc-400 font-mono">{p.year} • {p.authors[0]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Matrix Table */}
      {selectedPapers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <GitCompare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300">
            Select at least one paper to compare
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Choose manuscripts above to generate side-by-side architectural evaluations and limitation breakdowns.
          </p>
        </div>
      ) : isLoading ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-3 animate-pulse">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Synthesizing Differential Methodological Matrix...
          </p>
        </div>
      ) : matrix ? (
        <div className="space-y-6">
          {/* Responsive Scrollable Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              {/* Header */}
              <thead className="bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="p-4 w-48 shrink-0">Evaluation Dimension</th>
                  {selectedPapers.map(paper => (
                    <th key={paper.id} className="p-4 min-w-[240px] font-bold">
                      <div className="flex flex-col">
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[10px] mb-0.5">
                          {paper.year}
                        </span>
                        <span className="normal-case text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                          {paper.title}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows */}
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-sans">
                {matrix.dimensions.map(dim => (
                  <tr key={dim.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 align-top font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50/40 dark:bg-zinc-900/40">
                      <div>{dim.name}</div>
                      <div className="text-[11px] font-normal text-zinc-400 mt-1">{dim.description}</div>
                    </td>
                    {selectedPapers.map(paper => (
                      <td key={paper.id} className="p-4 align-top text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono">
                        {dim.values[paper.id] || "Standard evaluation baseline"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Consensus & Divergence Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Synthesized Consensus Across Papers
              </h3>
              <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-300/90 pl-5 list-disc leading-relaxed">
                {matrix.consensus.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-amber-500" />
                Divergent Methodological Approaches
              </h3>
              <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-300/90 pl-5 list-disc leading-relaxed">
                {matrix.divergences.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
