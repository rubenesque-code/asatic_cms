import { JSONContent } from "@tiptap/react";
import {
  PrimaryContent,
  PrimaryContentStatus,
  Translation,
} from "^types/primary-content";
// import { Translation, Document } from "^types/editable_content";
import { MyOmit } from "./utilities";
import { Video } from "./video";

export type RecordedEventTranslation = Translation & {
  body: JSONContent | null;
};

export type RecordedEvent = PrimaryContent<
  RecordedEventTranslation,
  "recorded-event"
> & {
  landing: {
    imageId?: string;
    autoSection: {
      imgVertPosition: number;
    };
    customSection: {
      imgAspectRatio: number;
      imgVertPosition: number;
    };
  };
  video?: {
    id: string;
    video: MyOmit<Video, "caption">;
  };
};

export type RecordedEventError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";

export type RecordedEventStatus = PrimaryContentStatus<RecordedEventError[]>;
