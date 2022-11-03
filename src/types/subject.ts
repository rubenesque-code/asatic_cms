import { TranslationGeneric } from "./translation";

export type SubjectTranslation = TranslationGeneric & {
  text: string;
};

export type Subject = {
  id: string;
  translations: SubjectTranslation[];
  articlesIds: string[];
  blogsIds: string[];
  collectionsIds: string[];
  recordedEventsIds: string[];
};
