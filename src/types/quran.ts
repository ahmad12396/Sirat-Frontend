import type { Nullable } from "@/types/common";

export type RevelationType = "meccan" | "medinan";

export type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
  translation: Nullable<string>;
  transliteration: Nullable<string>;
  juz: number;
  page: number;
};

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishTranslation: string;
  revelationType: RevelationType;
  ayahCount: number;
};

export type SurahWithAyahs = Surah & {
  ayahs: Ayah[];
};
