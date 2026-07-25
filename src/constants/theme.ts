export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

// Dark is the product default — see ADR-0008 (docs/decisions).
export const DEFAULT_THEME: Theme = THEMES.DARK;

export const THEME_STORAGE_KEY = "theme";
