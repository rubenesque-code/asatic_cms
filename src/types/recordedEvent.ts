import { JSONContent } from "@tiptap/react";
import { Translation, Document } from "^types/editable_content";
import { MyOmit } from "./utilities";
import { Video } from "./video";

export type RecordedEventTranslation = Translation & {
  body: JSONContent | null;
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
  video?: {
    id: string;
    video: MyOmit<Video, "caption">;
  };
} & Document<RecordedEventTranslation>;

export type RecordedEventError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";
