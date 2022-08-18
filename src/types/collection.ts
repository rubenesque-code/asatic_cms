import { JSONContent } from "@tiptap/core";
import { Translation } from "./editable_content";

export type CollectionTranslation = Translation & {
  label: string;
  description?: JSONContent;
};

export type Collection = {
  id: string;
  imageId?: string;
  landing: {
    autoSection: {
      imgVertPosition: number;
    };
  };
  subjectsById: string[];
  translations: CollectionTranslation[];
};
