"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquareQuote,
  Search,
  GitCompare,
  ShieldAlert,
  PenTool,
  FileText,
  Network,
  Upload,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { Badge } from "../ui/Badge";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUploadModal?: () => void;
}

export function Sidebar({ isOpen, onClose, onOpenUploadModal }: SidebarProps) {
  const pathname = usePathname();
  const { papers, selectedPaperIds } = useLibrary();

  const navItems = [
    {
      href: "/",
      label: "Overview Hub",
      icon: LayoutDashboard,
      badge: undefined,
      description: "Research ecosystem dashboard"
    },
    {
      href: "/library",
      label: "Library & PDF Reader",
      icon: BookOpen,
      badge: `${papers.length}`,
      description: "Read, annotate, and view PDFs"
    },
    {
      href: "/chat",
      label: "Multi-Paper Chat",
      icon: MessageSquareQuote,
      badge: selectedPaperIds.length > 0 ? `${selectedPaperIds.length} active` : undefined,
      badgeVariant: "primary" as const,
      description: "AnswerThis grounded synthesis"
    },
    {
      href: "/scholar",
      label: "Scholar Search",
      icon: Search,
      badge: "arXiv",
      badgeVariant: "default" as const,
      description: "Online papers & BibTeX citations"
    },
    {
      href: "/compare",
      label: "Methodology Matrix",
      icon: GitCompare,
      badge: undefined,
      description: "Side-by-side comparative analysis"
    },
    {
      href: "/detector",
      label: "Fake Citation Guard",
      icon: ShieldAlert,
      badge: "AI Verifier",
      badgeVariant: "warning" as const,
      description: "Detect hallucinated citations"
    },
    {
      href: "/writer",
      label: "Jenni AI & Paperpal",
      icon: PenTool,
      badge: "Assistant",
      badgeVariant: "purple" as const,
      description: "Academic writing & tone auditor"
    },
    {
      href: "/review",
      label: "Literature Review",
      icon: FileText,
      badge: undefined,
      description: "Automated structured review"
    },
    {
      href: "/graph",
      label: "Knowledge Graph",
      icon: Network,
      badge: undefined,
      description: "Citation & concept connections"
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 lg:w-72 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Ecosystem Modules
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:bg-zinc-200/60 dark:group-hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="block truncate leading-tight">{item.label}</span>
                  </div>
                </div>

                {item.badge && (
                  <Badge variant={item.badgeVariant || "default"} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Upload & Pro Card */}
        <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
          {onOpenUploadModal && (
            <button
              onClick={() => {
                onClose();
                onOpenUploadModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import PDF Manuscript</span>
            </button>
          )}

          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AnswerThis & Paperpal</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
              Powered by real-time CrossRef verification and multi-document grounded synthesis.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
