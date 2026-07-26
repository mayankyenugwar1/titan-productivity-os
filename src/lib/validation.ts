import { sanitizeCategory } from "@/constants/categories";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMissionInput(input: {
  title?: string;
  category?: string;
  priority?: string;
  xp?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!input.title || !input.title.trim()) {
    errors.push("Mission title is required and cannot be empty.");
  }

  if (input.title && input.title.trim().length > 120) {
    errors.push("Mission title cannot exceed 120 characters.");
  }

  if (input.category) {
    const sanitized = sanitizeCategory(input.category);
    if (!sanitized) {
      errors.push("Invalid category specified.");
    }
  }

  if (input.priority && !["High", "Medium", "Low"].includes(input.priority)) {
    errors.push("Priority clearance must be High, Medium, or Low.");
  }

  if (typeof input.xp === "number" && (input.xp < 0 || input.xp > 5000)) {
    errors.push("XP yield must be between 0 and 5000.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateProjectInput(input: {
  name?: string;
  category?: string;
  priority?: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!input.name || !input.name.trim()) {
    errors.push("Project initiative name is required.");
  }

  if (input.name && input.name.trim().length > 100) {
    errors.push("Project name cannot exceed 100 characters.");
  }

  if (input.priority && !["High", "Medium", "Low"].includes(input.priority)) {
    errors.push("Project priority must be High, Medium, or Low.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateKnowledgeNote(input: {
  title?: string;
  content?: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!input.title || !input.title.trim()) {
    errors.push("Knowledge document title is required.");
  }

  if (!input.content || !input.content.trim()) {
    errors.push("Knowledge document content cannot be empty.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
