import { TranslationGeneric } from "./translation";

export type Author = {
  id: string;
  translations: AuthorTranslation[];
};

export type AuthorTranslation = TranslationGeneric & { name: string };
