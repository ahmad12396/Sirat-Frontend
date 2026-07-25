export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  THEME: "theme",
  LANGUAGE: "language",
  RECENT_SEARCHES: "recent_searches",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
