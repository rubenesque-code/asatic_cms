import { JSONContent } from "@tiptap/core";
import { TranslationGeneric } from "./translation";

import {
  SecondaryContentFields,
  DisplayEntity,
  DisplayEntityType,
  DisplayEntityStatus,
} from "./display-entity";
import { Expand } from "./utilities";

export type Collection = {
  id: string;
  bannerImage: {
    imageId?: string;
    vertPosition: number;
  };
  translations: CollectionTranslation[];
} & DisplayEntity &
  DisplayEntityType<"collection"> &
  Pick<SecondaryContentFields, "subjectsIds" | "tagsIds">;

export type CollectionTranslation = Expand<TranslationGeneric> & {
  title: string;
  description?: JSONContent;
  landingAutoSummary?: JSONContent;
};

export type CollectionStatus = DisplayEntityStatus<CollectionError>;

export type CollectionError =
  | "missing language"
  | "missing subject"
  | "missing subject translation"
  | "missing tag"
  | "missing article fields"
  | "missing blog fields"
  | "missing recorded event fields";
