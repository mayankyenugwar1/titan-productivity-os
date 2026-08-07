import { create } from "zustand";
import {
  calculateReadingTime,
  calculateWordCount,
  getInitialKnowledgeItems,
  type KnowledgeItem,
  type KnowledgeType,
} from "@/services/knowledge/knowledgeService";
import { safeISOString } from "@/utils/safeDate";

export type { KnowledgeItem, KnowledgeType };

interface KnowledgeStoreState {
  items: KnowledgeItem[];
  activeItemId: string | null;
  typeFilter: string;
  searchQuery: string;
  editorMode: "visual" | "markdown";

  setActiveItemId: (id: string | null) => void;
  setTypeFilter: (type: string) => void;
  setSearchQuery: (query: string) => void;
  setEditorMode: (mode: "visual" | "markdown") => void;

  createNote: (title: string, content: string, type: KnowledgeType, category: string, tags?: string[]) => void;
  updateNote: (id: string, updates: Partial<KnowledgeItem>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useKnowledgeStore = create<KnowledgeStoreState>((set) => ({
  items: getInitialKnowledgeItems(),
  activeItemId: "note-1",
  typeFilter: "ALL",
  searchQuery: "",
  editorMode: "visual",

  setActiveItemId: (id) => set({ activeItemId: id }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setEditorMode: (editorMode) => set({ editorMode }),

  createNote: (title, content, type, category, tags = []) => {
    const now = safeISOString(new Date());
    const wordCount = calculateWordCount(content);
    const newItem: KnowledgeItem = {
      id: `note-${Date.now()}`,
      title: title.trim() || "Untitled Note",
      content,
      type,
      category,
      tags,
      pinned: false,
      favorite: false,
      wordCount,
      readingTimeMins: calculateReadingTime(wordCount),
      updatedAt: now,
      createdAt: now,
    };

    set((state) => ({
      items: [newItem, ...state.items],
      activeItemId: newItem.id,
    }));
  },

  updateNote: (id, updates) => {
    const now = safeISOString(new Date());
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const newContent = updates.content !== undefined ? updates.content : item.content;
        const wordCount = calculateWordCount(newContent);
        return {
          ...item,
          ...updates,
          wordCount,
          readingTimeMins: calculateReadingTime(wordCount),
          updatedAt: now,
        };
      }),
    }));
  },

  deleteNote: (id) => {
    set((state) => {
      const nextItems = state.items.filter((item) => item.id !== id);
      const nextActiveId = state.activeItemId === id ? (nextItems[0]?.id || null) : state.activeItemId;
      return { items: nextItems, activeItemId: nextActiveId };
    });
  },

  togglePin: (id) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)),
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)),
    }));
  },
}));
