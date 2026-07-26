export type HabitCategory =
  | "Operations"
  | "Fitness"
  | "Knowledge"
  | "Coding"
  | "Reading"
  | "Physical"
  | "Mindfulness"
  | "Finance"
  | "Personal Ops";

export const ALLOWED_CATEGORIES: HabitCategory[] = [
  "Operations",
  "Fitness",
  "Knowledge",
  "Coding",
  "Reading",
  "Physical",
  "Mindfulness",
  "Finance",
  "Personal Ops",
];

export const CATEGORY_MAP: Record<string, HabitCategory> = {
  Personal: "Personal Ops",
  "Personal Ops": "Personal Ops",
  Health: "Physical",
  Physical: "Physical",
  Study: "Knowledge",
  Knowledge: "Knowledge",
  Work: "Operations",
  Operations: "Operations",
  Fitness: "Fitness",
  Coding: "Coding",
  Reading: "Reading",
  Mindfulness: "Mindfulness",
  Finance: "Finance",
};

/**
 * Sanitizes any category string to ensure it strictly satisfies the
 * PostgreSQL "habits_category_check" database constraint.
 */
export function sanitizeCategory(rawCategory: string): HabitCategory {
  if (!rawCategory) return "Operations";
  const mapped = CATEGORY_MAP[rawCategory];
  if (mapped) return mapped;
  return ALLOWED_CATEGORIES.includes(rawCategory as HabitCategory)
    ? (rawCategory as HabitCategory)
    : "Operations";
}

/**
 * Returns user-friendly category display labels for UI dropdowns and badges.
 */
export const CATEGORY_OPTIONS = [
  { value: "Operations", label: "Operations" },
  { value: "Fitness", label: "Fitness" },
  { value: "Knowledge", label: "Knowledge" },
  { value: "Coding", label: "Coding" },
  { value: "Reading", label: "Reading" },
  { value: "Physical", label: "Physical (Health)" },
  { value: "Mindfulness", label: "Mindfulness" },
  { value: "Finance", label: "Finance" },
  { value: "Personal Ops", label: "Personal Ops" },
] as const;
