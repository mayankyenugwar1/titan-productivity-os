import { useMemo } from "react";
import { useKnowledgeStore } from "@/store/knowledgeStore";

export function useKnowledge() {
  const {
    items,
    activeItemId,
    typeFilter,
    searchQuery,
    editorMode,
    setActiveItemId,
    setTypeFilter,
    setSearchQuery,
    setEditorMode,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
  } = useKnowledgeStore();

  const activeItem = useMemo(() => {
    return items.find((item) => item.id === activeItemId) || items[0] || null;
  }, [items, activeItemId]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (
        searchQuery.trim() &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [items, typeFilter, searchQuery]);

  return {
    items: filteredItems,
    allItems: items,
    activeItem,
    activeItemId,
    typeFilter,
    searchQuery,
    editorMode,
    setActiveItemId,
    setTypeFilter,
    setSearchQuery,
    setEditorMode,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
  };
}
