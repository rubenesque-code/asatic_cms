import { TranslationGeneric } from "./translation";

export type SubjectTranslation = TranslationGeneric & {
  text: string;
};

export type Subject = {
  id: string;
  translations: SubjectTranslation[];
  relatedEntities: {
    type: "article" | "blog" | "collection" | "recorded-event";
    entityId: string;
  }[];
};
