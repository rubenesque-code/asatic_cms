import { Translation } from "./editable_content";

export type CollectionTranslation = Translation & {
  text: string;
};

export type Collection = {
  id: string;
  subjectsById: string[];
  translations: CollectionTranslation[];
};
