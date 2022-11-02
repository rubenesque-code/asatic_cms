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
  relatedEntities: {
    type: "article" | "blog" | "recorded-event";
    entityId: string;
  }[];
} & DisplayEntity &
  DisplayEntityType<"collection"> &
  Pick<SecondaryContentFields, "subjectsIds" | "tagsIds">;

export type CollectionTranslation = Expand<TranslationGeneric> & {
  title: string;
  description?: string;
  landingAutoSummary?: string;
};

export type CollectionStatus = DisplayEntityStatus<CollectionError>;

export type CollectionError =
  | "missing language"
  | "missing subject"
  | "missing subject translation"
  | "missing tag"
  | "missing article"
  | "missing article fields"
  | "missing blog"
  | "missing blog fields"
  | "missing recorded event"
  | "missing recorded event fields";
