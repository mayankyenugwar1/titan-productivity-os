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

function getStorageKey(userId?: string): string {
  const safeId = userId && typeof userId === "string" && userId.trim() ? userId.trim() : "local_user";
  return `titan_knowledge_v1_${safeId}`;
}

function getStoredNotes(userId?: string): KnowledgeItem[] {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return getInitialKnowledgeItems();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialKnowledgeItems();
  } catch {
    return getInitialKnowledgeItems();
  }
}

function setStoredNotes(userId: string | undefined, items: KnowledgeItem[]): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn("localStorage knowledge set error:", err);
  }
}

interface KnowledgeStoreState {
  items: KnowledgeItem[];
  activeItemId: string | null;
  typeFilter: string;
  searchQuery: string;
  editorMode: "visual" | "markdown";
  loading: boolean;
  currentUserId: string;

  setActiveItemId: (id: string | null) => void;
  setTypeFilter: (type: string) => void;
  setSearchQuery: (query: string) => void;
  setEditorMode: (mode: "visual" | "markdown") => void;

  loadNotes: (userId?: string) => void;
  createNote: (
    titleOrUserId: string,
    contentOrTitle: string,
    typeOrContent?: KnowledgeType | string,
    categoryOrType?: string | KnowledgeType,
    tagsOrCategory?: string[] | string,
    tagsInput?: string[]
  ) => void;
  updateNote: (idOrUserId: string, updatesOrId: Partial<KnowledgeItem> | string, updatesInput?: Partial<KnowledgeItem>) => void;
  deleteNote: (idOrUserId: string, idInput?: string) => void;
  togglePin: (idOrUserId: string, idInput?: string) => void;
  toggleFavorite: (idOrUserId: string, idInput?: string) => void;
}

export const useKnowledgeStore = create<KnowledgeStoreState>((set, get) => ({
  items: getInitialKnowledgeItems(),
  activeItemId: "note-1",
  typeFilter: "ALL",
  searchQuery: "",
  editorMode: "visual",
  loading: false,
  currentUserId: "local_user",

  setActiveItemId: (id) => set({ activeItemId: id }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setEditorMode: (editorMode) => set({ editorMode }),

  loadNotes: (userId = "local_user") => {
    set({ loading: true, currentUserId: userId });
    const items = getStoredNotes(userId);
    const activeItemId = items.length > 0 ? items[0].id : null;
    set({ items, activeItemId, loading: false });
  },

  createNote: (titleOrUserId, contentOrTitle, typeOrContent, categoryOrType, tagsOrCategory, tagsInput) => {
    let uid = get().currentUserId;
    let title: string;
    let content: string;
    let type: KnowledgeType;
    let category: string;
    let tags: string[];

    if (tagsInput !== undefined) {
      uid = titleOrUserId;
      title = contentOrTitle;
      content = typeOrContent as string;
      type = categoryOrType as KnowledgeType;
      category = tagsOrCategory as string;
      tags = tagsInput;
    } else if (typeof tagsOrCategory === "string" || Array.isArray(tagsOrCategory)) {
      title = titleOrUserId;
      content = contentOrTitle;
      type = typeOrContent as KnowledgeType;
      category = categoryOrType as string;
      tags = Array.isArray(tagsOrCategory) ? tagsOrCategory : [];
    } else {
      title = titleOrUserId;
      content = contentOrTitle;
      type = (typeOrContent as KnowledgeType) || "Document";
      category = (categoryOrType as string) || "General";
      tags = [];
    }

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

    set((state) => {
      const nextItems = [newItem, ...state.items];
      setStoredNotes(uid, nextItems);
      return {
        items: nextItems,
        activeItemId: newItem.id,
      };
    });
  },

  updateNote: (idOrUserId, updatesOrId, updatesInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    let updates: Partial<KnowledgeItem>;

    if (updatesInput !== undefined) {
      uid = idOrUserId;
      targetId = updatesOrId as string;
      updates = updatesInput;
    } else {
      targetId = idOrUserId;
      updates = updatesOrId as Partial<KnowledgeItem>;
    }

    const now = safeISOString(new Date());
    set((state) => {
      const nextItems = state.items.map((item) => {
        if (item.id !== targetId) return item;
        const newContent = updates.content !== undefined ? updates.content : item.content;
        const wordCount = calculateWordCount(newContent);
        return {
          ...item,
          ...updates,
          wordCount,
          readingTimeMins: calculateReadingTime(wordCount),
          updatedAt: now,
        };
      });
      setStoredNotes(uid, nextItems);
      return { items: nextItems };
    });
  },

  deleteNote: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    set((state) => {
      const nextItems = state.items.filter((item) => item.id !== targetId);
      const nextActiveId = state.activeItemId === targetId ? (nextItems[0]?.id || null) : state.activeItemId;
      setStoredNotes(uid, nextItems);
      return { items: nextItems, activeItemId: nextActiveId };
    });
  },

  togglePin: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    set((state) => {
      const nextItems = state.items.map((item) => (item.id === targetId ? { ...item, pinned: !item.pinned } : item));
      setStoredNotes(uid, nextItems);
      return { items: nextItems };
    });
  },

  toggleFavorite: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    set((state) => {
      const nextItems = state.items.map((item) => (item.id === targetId ? { ...item, favorite: !item.favorite } : item));
      setStoredNotes(uid, nextItems);
      return { items: nextItems };
    });
  },
}));
