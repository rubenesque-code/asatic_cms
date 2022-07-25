import { JSONContent } from "@tiptap/react";
import { Translation, Document } from "^types/editable_content";

export type RecordedEventTranslation = Translation & {
  body: JSONContent;
  title?: string;
};

export type RecordedEvent = {
  id: string;
  authorIds: string[];
  subjectIds: string[];
  summaryImage: {
    imageId?: string;
  };
} & Document<RecordedEventTranslation>;
