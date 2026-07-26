/**
 * WAYNE ENTERPRISES // PRIVATE OPERATING SYSTEM TOKENS
 * Standardized design system tokens for luxury matte black, graphite, and muted gold UI.
 */

export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const TITAN_TYPOGRAPHY = {
  badge: "text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e5c158]",
  sectionBadge: "text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e5c158]",
  h1: "text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl",
  h2: "text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl",
  h3: "text-lg font-semibold tracking-tight text-zinc-100",
  body: "text-sm leading-relaxed text-zinc-400",
  caption: "text-xs font-medium text-zinc-500",
} as const;

export const TITAN_CARD_STYLES = {
  default: "rounded-2xl border border-zinc-800/60 bg-[#0d0d10]/90 backdrop-blur-2xl shadow-2xl shadow-black/80",
  interactive: "rounded-2xl border border-zinc-800/60 bg-[#0d0d10]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 transition-all duration-500 hover:border-[#d4af37]/40 hover:bg-[#111116] hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]",
  hero: "relative overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#08080a] shadow-2xl shadow-black/90",
  stat: "rounded-2xl border border-zinc-800/60 bg-[#0d0d10]/80 p-5 backdrop-blur-xl transition-all duration-500 hover:border-[#d4af37]/30 hover:bg-[#121217]",
  callout: "rounded-2xl border border-[#d4af37]/25 bg-[#0e0e12]/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/60",
} as const;
