export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  BOOKMARKS: "/dashboard/bookmarks",
  NOTES: "/dashboard/notes",
  COLLECTIONS: "/dashboard/collections",

  QURAN: "/quran",
  TAFSIR: "/tafsir",
  HADITH: "/hadith",
  SEERAH: "/seerah",
  FIQH: "/fiqh",
  PRAYER_TIMES: "/prayer",
  QIBLA: "/qibla",
  CALENDAR: "/calendar",
  AZKAR: "/azkar",
  DUAS: "/duas",
  SEARCH: "/search",

  ADMIN: "/admin",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
