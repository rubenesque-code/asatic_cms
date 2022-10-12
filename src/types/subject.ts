import { TranslationGeneric } from "./translation";

export type SubjectTranslation = TranslationGeneric & {
  text: string;
};

export type Subject = {
  id: string;
  translations: SubjectTranslation[];
};
