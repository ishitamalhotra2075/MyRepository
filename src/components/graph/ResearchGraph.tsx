"use client";

import React, { useState, useEffect } from "react";
import { Network, ZoomIn, ZoomOut, Maximize2, Sparkles, BookOpen, Layers, X } from "lucide-react";
import { ResearchGraphData, GraphNode, GraphLink } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface ResearchGraphProps {
  graphData: ResearchGraphData;
  onSelectPaperNode?: (paperId: string) => void;
}

export function ResearchGraph({ graphData, onSelectPaperNode }: ResearchGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Map nodes with radial / force positions
  const [positionedNodes, setPositionedNodes] = useState<(GraphNode & { cx: number; cy: number })[]>([]);

  useEffect(() => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    const paperNodes = graphData.nodes.filter(n => n.type === "paper");
    const topicNodes = graphData.nodes.filter(n => n.type === "topic");

    const mapped = graphData.nodes.map((node, index) => {
      if (node.type === "paper") {
        const pIndex = paperNodes.indexOf(node);
        const angle = (pIndex / Math.max(paperNodes.length, 1)) * 2 * Math.PI;
        const radius = 140;
        return {
          ...node,
          cx: centerX + radius * Math.cos(angle),
          cy: centerY + radius * Math.sin(angle),
        };
      } else {
        const tIndex = topicNodes.indexOf(node);
        const angle = (tIndex / Math.max(topicNodes.length, 1)) * 2 * Math.PI + 0.3;
        const radius = 240;
        return {
          ...node,
          cx: centerX + radius * Math.cos(angle),
          cy: centerY + radius * Math.sin(angle),
        };
      }
    });

    setPositionedNodes(mapped);
  }, [graphData]);

  const getNodeCoords = (nodeId: string) => {
    const found = positionedNodes.find(n => n.id === nodeId);
    return found ? { x: found.cx, y: found.cy } : { x: 400, y: 250 };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).tagName === "rect") {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="flex flex-col h-[650px] bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl relative select-none">
      {/* Top Graph Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md p-2 rounded-xl border border-zinc-800 text-xs">
          <div className="flex items-center gap-1.5 px-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" />
            <span className="text-zinc-300">Papers ({graphData.nodes.filter(n => n.type === "paper").length})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 border-l border-zinc-800">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-zinc-300">Thematic Topics ({graphData.nodes.filter(n => n.type === "topic").length})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 border-l border-zinc-800">
            <span className="w-4 h-0.5 bg-indigo-400" />
            <span className="text-zinc-400">Citation Links</span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-400 px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.15))}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        viewBox="0 0 800 500"
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="800" height="500" fill="transparent" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} transform-origin="400 250">
          {/* Links / Edges */}
          {graphData.links.map((link, i) => {
            const sourceCoords = getNodeCoords(link.source);
            const targetCoords = getNodeCoords(link.target);
            const isHighlighted = hoveredNode === link.source || hoveredNode === link.target;

            return (
              <line
                key={i}
                x1={sourceCoords.x}
                y1={sourceCoords.y}
                x2={targetCoords.x}
                y2={targetCoords.y}
                stroke={isHighlighted ? "#818cf8" : "url(#edgeGrad)"}
                strokeWidth={isHighlighted ? 2.5 : 1.2}
                strokeDasharray={link.type === "shares_topic" ? "4 4" : undefined}
                className="transition-all duration-200"
              />
            );
          })}

          {/* Nodes */}
          {positionedNodes.map(node => {
            const isPaper = node.type === "paper";
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.cx}, ${node.cy})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => {
                  setSelectedNode(node);
                  if (isPaper && onSelectPaperNode) onSelectPaperNode(node.id);
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Outer Circle */}
                <circle
                  r={isPaper ? (isSelected ? 26 : 22) : 16}
                  fill={isPaper ? "#4f46e5" : "#10b981"}
                  fillOpacity={isHovered || isSelected ? 1 : 0.85}
                  stroke={isSelected ? "#ffffff" : isHovered ? "#a5b4fc" : "#312e81"}
                  strokeWidth={isSelected ? 3 : 1.5}
                  filter={isSelected || isHovered ? "url(#glowFilter)" : undefined}
                />

                {/* Node Icon / Letter */}
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fill="#ffffff"
                  fontSize={isPaper ? "11px" : "9px"}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {isPaper ? "📄" : "#"}
                </text>

                {/* Node Label Text */}
                <text
                  y={isPaper ? 34 : 26}
                  textAnchor="middle"
                  fill={isSelected || isHovered ? "#ffffff" : "#a1a1aa"}
                  fontSize="10px"
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="pointer-events-none"
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + "..." : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 max-w-sm w-full p-4 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl text-zinc-200 animate-slide-up space-y-2 z-20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={selectedNode.type === "paper" ? "primary" : "success"} size="sm">
                {selectedNode.type.toUpperCase()}
              </Badge>
              {selectedNode.year && <span className="text-xs text-zinc-400 font-mono">{selectedNode.year}</span>}
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-bold text-sm leading-snug text-white">
            {selectedNode.label}
          </h4>

          {selectedNode.citations && (
            <p className="text-xs text-zinc-400">
              Cited <span className="text-indigo-400 font-bold font-mono">{selectedNode.citations.toLocaleString()}</span> times across scholarly literature.
            </p>
          )}

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Connected via scientific citation networks and conceptual keyword alignments.
          </p>
        </div>
      )}
    </div>
  );
}
