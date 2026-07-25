export const API_TIMEOUT_MS = 15_000;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    ME: "/users/me",
  },
  QURAN: {
    SURAHS: "/quran/surahs",
    SURAH: (id: number | string) => `/quran/surahs/${id}`,
  },
  TAFSIR: {
    BY_AYAH: (surahId: number | string, ayahId: number | string) =>
      `/tafsir/${surahId}/${ayahId}`,
  },
  HADITH: {
    COLLECTIONS: "/hadith/collections",
    COLLECTION: (id: number | string) => `/hadith/collections/${id}`,
  },
  PRAYER_TIMES: "/prayer-times",
  BOOKMARKS: "/bookmarks",
  NOTES: "/notes",
  COLLECTIONS: "/collections",
  SEARCH: "/search",
} as const;
