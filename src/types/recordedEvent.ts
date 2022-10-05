import { JSONContent } from "@tiptap/react";

import { PrimaryEntity } from "^types/primary-entity";
import { DisplayEntityType, TranslationGeneric } from "./display-entity";
import { Expand } from "./utilities";

export type RecordedEvent = {
  id: string;
  translations: RecordedEventTranslation[];
  youtubeId?: string;
} & PrimaryEntity &
  DisplayEntityType<"recorded-event">;

export type RecordedEventTranslation = Expand<TranslationGeneric> & {
  title?: string;
  body?: JSONContent;
};
