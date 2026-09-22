"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className = "",
  hover = false,
  glass = true,
  glow = false,
  ...props
}: CardProps) {
  const base = "rounded-2xl transition-all duration-300 relative border";
  const glassStyle = glass
    ? "bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl border-zinc-200/80 dark:border-zinc-800/80 shadow-sm"
    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm";
  const hoverStyle = hover
    ? "hover:-translate-y-1 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700/90 cursor-pointer"
    : "";
  const glowStyle = glow ? "shadow-[0_0_25px_rgba(99,102,241,0.15)] dark:shadow-[0_0_35px_rgba(99,102,241,0.25)] border-indigo-500/30" : "";

  return (
    <div className={`${base} ${glassStyle} ${hoverStyle} ${glowStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
