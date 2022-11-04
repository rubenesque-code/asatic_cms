import { DisplayEntityStatus } from "./display-entity";
import {
  EntityGlobalFields,
  PublishFields,
  RelatedDisplayEntityFields,
  RelatedSubEntityFields,
  SaveFields,
} from "./entity";
import { SummaryFields, Translations } from "./entity-translation";
import { ImageFields, SummaryImageFields } from "./entity-image";

export type Collection = EntityGlobalFields<"collection"> & {
  bannerImage: ImageFields<"id" | "y-position">;
} & RelatedDisplayEntityFields<
    "article" | "blog" | "recordedEvent" | "subject"
  > &
  RelatedSubEntityFields<"author" | "tag"> &
  PublishFields &
  SaveFields &
  Translations<CollectionTranslationFields> &
  SummaryImageFields<"isNotToggleable">;

type CollectionTranslationFields = {
  title?: string;
  description?: string;
} & SummaryFields<"general">;

export type CollectionTranslation = Collection["translations"][number];

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
