import { TranslationGeneric } from "./translation";

export type Author = {
  id: string;
  translations: AuthorTranslation[];
  articlesIds: string[];
  blogsIds: string[];
  recordedEventsIds: string[];
};

export type AuthorTranslation = TranslationGeneric & { name: string };
