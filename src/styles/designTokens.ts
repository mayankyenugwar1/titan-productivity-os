export const DESIGN_TOKENS = {
  // Typography Tokens
  typography: {
    labelSmall: "text-xs font-bold uppercase tracking-[0.18em]",
    labelMedium: "text-xs font-bold uppercase tracking-[0.16em]",
    bodySmall: "text-xs font-sans leading-relaxed text-zinc-300",
    bodyMedium: "text-sm font-sans leading-relaxed text-zinc-300",
    headingSmall: "font-sans text-lg font-bold text-zinc-100",
    headingMedium: "font-sans text-xl font-bold text-white sm:text-2xl",
    headingLarge: "font-sans text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  },

  // Spacing Tokens
  spacing: {
    cardPaddingSmall: "p-4 sm:p-5",
    cardPaddingMedium: "p-6 sm:p-7",
    cardPaddingLarge: "p-7 sm:p-8 lg:p-9",
    sectionGap: "space-y-8 sm:space-y-10",
    gridGap: "gap-4 sm:gap-6",
  },

  // Card Styling Tokens
  cards: {
    base: "rounded-3xl border border-zinc-800/80 bg-[#070709] shadow-2xl shadow-black font-mono transition-all duration-300 hover:border-[#d4af37]/40",
    glass: "rounded-3xl border border-zinc-800/80 bg-[#0c0c0f]/90 backdrop-blur-2xl shadow-2xl shadow-black font-mono",
    goldHighlight: "rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#09090b] via-[#0d0d10] to-[#08080a] shadow-2xl shadow-black font-mono",
  },

  // Button Styling Tokens
  buttons: {
    focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
    hoverScale: "transition-all duration-300 ease-out active:scale-[0.98]",
  },
};
