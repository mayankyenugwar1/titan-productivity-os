import { create } from "zustand";

interface DashboardStoreState {
  isCommandPaletteOpen: boolean;
  searchQuery: string;
  selectedDomainFilter: string;

  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedDomainFilter: (filter: string) => void;
}

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  isCommandPaletteOpen: false,
  searchQuery: "",
  selectedDomainFilter: "ALL",

  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedDomainFilter: (selectedDomainFilter) => set({ selectedDomainFilter }),
}));
