import { JSONContent } from "@tiptap/react";
import { Translation, Document } from "^types/editable_content";

export type RecordedEventTranslation = Translation & {
  body: JSONContent;
  title?: string;
};

export type RecordedEvent = {
  id: string;
  authorIds: string[];
  collectionIds: string[];
  subjectIds: string[];
  summaryImage: {
    imageId?: string;
  };
} & Document<RecordedEventTranslation>;

export type RecordedEventError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";
