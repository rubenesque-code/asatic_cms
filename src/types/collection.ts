import { JSONContent } from "@tiptap/core";
import { PublishStatus, Translation } from "./editable_content";

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
  lastSave: Date | null;
  publishInfo: {
    status: PublishStatus;
    date?: Date;
  };
};
