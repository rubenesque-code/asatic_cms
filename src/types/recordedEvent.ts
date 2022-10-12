import { JSONContent } from "@tiptap/react";

import { PrimaryEntity } from "^types/primary-entity";
import { DisplayEntityType } from "./display-entity";
import { TranslationGeneric } from "./translation";
import { Expand } from "./utilities";

export type RecordedEvent = {
  id: string;
  translations: RecordedEventTranslation[];
  youtubeId?: string;
  recordedEventTypeId?: string;
} & PrimaryEntity &
  DisplayEntityType<"recorded-event">;

export type RecordedEventTranslation = Expand<TranslationGeneric> & {
  title?: string;
  body?: JSONContent;
};

export type RecordedEventType = {
  id: string;
  translations: RecordedEventTypeTranslation[];
};

export type RecordedEventTypeTranslation = TranslationGeneric & {
  name: string;
};
