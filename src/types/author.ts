import { TranslationGeneric } from "./translation";

export type Author = {
  id: string;
  translations: AuthorTranslation[];
  relatedEntities: {
    type: "article" | "blog" | "recorded-event";
    entityId: string;
  }[];
};

export type AuthorTranslation = TranslationGeneric & { name: string };
