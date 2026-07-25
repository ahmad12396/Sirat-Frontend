export const LANGUAGES = {
  EN: "en",
  AR: "ar",
  UR: "ur",
} as const;

export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const DEFAULT_LANGUAGE: LanguageCode = LANGUAGES.EN;

export const RTL_LANGUAGES: LanguageCode[] = [LANGUAGES.AR, LANGUAGES.UR];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  [LANGUAGES.EN]: "English",
  [LANGUAGES.AR]: "العربية",
  [LANGUAGES.UR]: "اردو",
};

export function isRtlLanguage(language: LanguageCode): boolean {
  return RTL_LANGUAGES.includes(language);
}
