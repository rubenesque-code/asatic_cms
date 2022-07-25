import { Translation } from "./editable_content";

export type SubjectTranslation = Translation & {
  text: string;
};

export type Subject = {
  id: string;
  translations: SubjectTranslation[];
};
