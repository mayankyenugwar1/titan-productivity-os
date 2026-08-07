/**
 * Safe Date Utilities for TITAN OS
 * Protects all date formatting & parsing against RangeError: Invalid time value.
 */

/**
 * Safely parses any value (string, number, Date, null, undefined) into a valid Date object.
 * Returns null if the value is invalid, empty, or cannot be parsed.
 */
export function safeDate(value: unknown, sourceInfo?: string): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      if (sourceInfo) console.error("Invalid Date object received:", value, "Source:", sourceInfo);
      return null;
    }
    return value;
  }
  try {
    const date = new Date(value as string | number);
    if (isNaN(date.getTime())) {
      if (sourceInfo) console.error("Invalid timestamp string/number:", value, "Source:", sourceInfo);
      return null;
    }
    return date;
  } catch (err) {
    if (sourceInfo) console.error("Date parsing exception for value:", value, "Source:", sourceInfo, err);
    return null;
  }
}

/**
 * Type guard to check if a value is a valid Date instance.
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Safely formats a date using Intl.DateTimeFormat.
 * Returns fallback ("—") if the date is invalid.
 */
export function safeFormat(
  value: unknown,
  options?: Intl.DateTimeFormatOptions,
  fallback = "—"
): string {
  const date = safeDate(value);
  if (!date) return fallback;
  try {
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch {
    return fallback;
  }
}

/**
 * Safely formats time (e.g. 02:30 PM).
 */
export function safeTime(
  value: unknown,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
  fallback = "—"
): string {
  const date = safeDate(value);
  if (!date) return fallback;
  try {
    return date.toLocaleTimeString("en-US", options);
  } catch {
    return fallback;
  }
}

/**
 * Safely formats date string (e.g. Oct 24, 2026).
 */
export function safeDateString(
  value: unknown,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
  fallback = "—"
): string {
  const date = safeDate(value);
  if (!date) return fallback;
  try {
    return date.toLocaleDateString("en-US", options);
  } catch {
    return fallback;
  }
}

/**
 * Safely produces ISO string (e.g. 2026-08-04T12:00:00.000Z).
 */
export function safeISOString(value: unknown, fallback?: string): string {
  const date = safeDate(value);
  if (!date) {
    if (fallback !== undefined) return fallback;
    const now = new Date();
    return isValidDate(now) ? now.toISOString() : "1970-01-01T00:00:00.000Z";
  }
  try {
    return date.toISOString();
  } catch {
    return fallback ?? "1970-01-01T00:00:00.000Z";
  }
}

/**
 * Safely produces YYYY-MM-DD date key.
 * Returns fallback or empty string if date is invalid, avoiding false matches with today's date.
 */
export function safeDateKey(value: unknown, fallback?: string): string {
  const date = safeDate(value);
  if (!date) {
    return fallback ?? "";
  }
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return fallback ?? "";
  }
}

/**
 * Safely formats relative time (e.g. "2h ago", "Yesterday", "Just now").
 */
export function safeRelativeTime(value: unknown, fallback = "Just now"): string {
  const date = safeDate(value);
  if (!date) return fallback;
  try {
    const now = Date.now();
    const diffMs = now - date.getTime();
    if (diffMs < 0) return "Just now";
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return "Just now";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return safeDateString(date, { month: "short", day: "numeric" }, fallback);
  } catch {
    return fallback;
  }
}
