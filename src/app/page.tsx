"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  MessageSquareQuote,
  Search,
  GitCompare,
  ShieldAlert,
  PenTool,
  FileText,
  Network,
  ArrowRight,
  Upload,
  CheckCircle2,
  TrendingUp,
  Flame,
  Quote,
  Zap
} from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PaperCard } from "@/components/library/PaperCard";

export default function DashboardPage() {
  const { papers, selectedPaperIds } = useLibrary();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/chat?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const handlePromptClick = (promptText: string) => {
    router.push(`/chat?q=${encodeURIComponent(promptText)}`);
  };

  const totalCitations = papers.reduce((sum, p) => sum + (p.citationCount || 0), 0);

  const modules = [
    {
      title: "Multi-Paper Grounded Chat",
      subtitle: "AnswerThis Style Synthesis",
      description: "Ask questions across multiple papers. Receive exact page citations, verbatim quotes, and synthesized consensus.",
      href: "/chat",
      icon: MessageSquareQuote,
      gradient: "from-indigo-600 to-blue-600",
      badge: `${selectedPaperIds.length} Selected`
    },
    {
      title: "Fake Citation Guard",
      subtitle: "Paperpal Citation Verifier",
      description: "Detect LLM hallucinations, check unregistered DOIs, and authenticate scientific references against CrossRef & arXiv.",
      href: "/detector",
      icon: ShieldAlert,
      gradient: "from-amber-600 to-rose-600",
      badge: "Real-time DOI"
    },
    {
      title: "Jenni AI & Paperpal Writer",
      subtitle: "Academic Writing Copilot",
      description: "Ghost-text autocompletion, vocabulary enhancement, academic tone audit, and inline citation insertion.",
      href: "/writer",
      icon: PenTool,
      gradient: "from-purple-600 to-pink-600",
      badge: "AI Autocomplete"
    },
    {
      title: "Scholar & arXiv Search",
      subtitle: "Online Academic Search",
      description: "Search millions of papers online with citation metrics, verified DOIs, abstracts, and one-click library import.",
      href: "/scholar",
      icon: Search,
      gradient: "from-cyan-600 to-indigo-600",
      badge: "Google Scholar"
    },
    {
      title: "Methodology Comparison Matrix",
      subtitle: "Differential Analysis",
      description: "Side-by-side breakdown comparing approaches, benchmark datasets, evaluation metrics, and critical limitations.",
      href: "/compare",
      icon: GitCompare,
      gradient: "from-emerald-600 to-teal-600",
      badge: "Matrix"
    },
    {
      title: "Structured Literature Review",
      subtitle: "Thematic Review Generator",
      description: "Synthesize executive summaries, thematic taxonomies, critical gaps, and formatted bibliographies into publication drafts.",
      href: "/review",
      icon: FileText,
      gradient: "from-orange-600 to-amber-600",
      badge: "Auto Review"
    },
    {
      title: "Interactive Knowledge Graph",
      subtitle: "Connection Map",
      description: "Explore interactive node-link relationships, shared methodologies, and cross-citation networks visually.",
      href: "/graph",
      icon: Network,
      gradient: "from-violet-600 to-purple-600",
      badge: "SVG Network"
    },
    {
      title: "Library & Smart PDF Reader",
      subtitle: "Extracted Sections & Viewer",
      description: "Full-text reader with section outlines, page jumping, zoom controls, and reference authentication sidebars.",
      href: "/library",
      icon: BookOpen,
      gradient: "from-blue-600 to-indigo-600",
      badge: `${papers.length} Papers`
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner with Glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-br from-indigo-950/20 via-purple-950/20 to-zinc-900/50 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}>
              Next-Gen Scientific Research Ecosystem
            </Badge>
            <span className="text-xs text-zinc-500 font-mono">
              AnswerThis • Paperpal • Jenni AI • CrossRef
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            Read, synthesize, and write research with{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              grounded AI integrity.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            Chat with multiple papers simultaneously, verify citations against official CrossRef DOIs to catch fake citations, compare methodologies side-by-side, and draft literature reviews with intelligent autocomplete.
          </p>

          {/* Quick Ask Input Bar */}
          <form onSubmit={handleQuickAsk} className="pt-2">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700/80 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <div className="pl-4 text-zinc-400">
                <Search className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={quickQuery}
                onChange={e => setQuickQuery(e.target.value)}
                placeholder="Ask AnswerThis across your loaded library (e.g., 'What are the main limitations in these papers?')..."
                className="w-full py-3.5 px-3 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
              />
              <div className="pr-2">
                <Button size="sm" variant="primary" type="submit" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Synthesize
                </Button>
              </div>
            </div>
          </form>

          {/* Quick suggested research queries */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-zinc-400">Suggested queries:</span>
            {[
              "Compare evaluation benchmarks",
              "What are the core limitations?",
              "Summarize key empirical findings",
              "Explain the mathematical formulation"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Workspace Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
              {papers.length}
            </p>
            <p className="text-xs text-zinc-500 font-medium">Papers in Library</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
              {totalCitations.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 font-medium">Citations Indexed</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              100%
            </p>
            <p className="text-xs text-zinc-500 font-medium">CrossRef Verified</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              Active
            </p>
            <p className="text-xs text-zinc-500 font-medium">Fake Citation Guard</p>
          </div>
        </div>
      </div>

      {/* Ecosystem Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              ResearchGPT Ecosystem
            </h2>
            <p className="text-xs text-zinc-500">
              Comprehensive toolkit incorporating the best capabilities of AnswerThis, Paperpal, and Jenni AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <Link key={mod.href} href={mod.href} className="group">
                <Card
                  hover
                  className="h-full p-5 flex flex-col justify-between group-hover:border-indigo-500/50 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${mod.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="default" size="sm">
                        {mod.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 mb-1">
                        {mod.subtitle}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Seminal Papers Currently in Workspace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Active Workspace Papers
            </h2>
            <p className="text-xs text-zinc-500">
              Selected papers are automatically grounded during multi-paper chat and comparative analysis.
            </p>
          </div>
          <Link href="/library">
            <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All ({papers.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.slice(0, 3).map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
}
