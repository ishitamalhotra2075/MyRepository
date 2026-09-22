"use client";

import React, { useState, useEffect } from "react";
import { Network, Sparkles, BookOpen, Layers, Info, Filter } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { ResearchGraph } from "@/components/graph/ResearchGraph";
import { ResearchGraphData } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function GraphPage() {
  const { papers } = useLibrary();
  const [graphData, setGraphData] = useState<ResearchGraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGraph() {
      setIsLoading(true);
      try {
        const data = await api.getGraph(papers);
        setGraphData(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadGraph();
  }, [papers]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Interactive Research Knowledge Graph
          </h1>
          <Badge variant="primary" size="sm">
            Topological Connections
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500">
          Visualize inter-paper citations, shared methodology links, and thematic concept clusters. Click any node to inspect details and connections.
        </p>
      </div>

      {/* Network Stats Card */}
      {graphData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {graphData.nodes.filter(n => n.type === "paper").length}
              </p>
              <p className="text-[11px] text-zinc-500">Paper Nodes</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {graphData.nodes.filter(n => n.type === "topic").length}
              </p>
              <p className="text-[11px] text-zinc-500">Thematic Clusters</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {graphData.links.length}
              </p>
              <p className="text-[11px] text-zinc-500">Network Edges</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                100%
              </p>
              <p className="text-[11px] text-zinc-500">Connected Graph</p>
            </div>
          </div>
        </div>
      )}

      {/* Main SVG Graph */}
      {isLoading || !graphData ? (
        <div className="h-[600px] flex items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 animate-pulse">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mr-2" />
          <span>Generating Research Knowledge Graph...</span>
        </div>
      ) : (
        <ResearchGraph graphData={graphData} />
      )}
    </div>
  );
}
