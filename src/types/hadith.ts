import type { Nullable } from "@/types/common";

export type HadithGrade = "sahih" | "hasan" | "daif" | "mawdu";

export type HadithCollection = {
  id: string;
  name: string;
  englishName: string;
  hadithCount: number;
};

export type Hadith = {
  id: string;
  collectionId: string;
  bookNumber: number;
  hadithNumber: number;
  narrator: Nullable<string>;
  text: string;
  translation: Nullable<string>;
  grade: Nullable<HadithGrade>;
};
