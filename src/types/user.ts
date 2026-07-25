import type { LanguageCode } from "@/constants/languages";
import type { Role } from "@/constants/roles";
import type { Theme } from "@/constants/theme";
import type { BaseEntity, Nullable } from "@/types/common";

export type UserPreferences = {
  language: LanguageCode;
  theme: Theme;
};

export type User = BaseEntity & {
  name: string;
  email: string;
  avatarUrl: Nullable<string>;
  role: Role;
  preferences: UserPreferences;
};
