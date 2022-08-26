import { JSONContent } from "@tiptap/react";
import { ContentStatus } from "^types/primary-content";
import {
  LandingImageFields,
  Publishable,
  SecondaryContentFields,
  TrackSave,
  TranslationGeneric,
} from "./display-content";
// import { Translation, Document } from "^types/editable_content";
import { Expand, MyOmit } from "./utilities";

export type RecordedEventError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";

export type RecordedEventStatus = ContentStatus<RecordedEventError>;

export type RecordedEvent = {
  id: string;
  landingImage: Expand<MyOmit<LandingImageFields, "useImage">>;
  translations: RecordedEventTranslation[];
  type: "recorded-event";
  youtubeId?: string;
} & Expand<SecondaryContentFields> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type RecordedEventTranslation = Expand<TranslationGeneric> & {
  title?: string;
  body?: JSONContent;
};
