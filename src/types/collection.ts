import { DisplayEntityStatus } from "./entity-status";
import {
  EntityGlobalFields,
  EntityNameSubSet,
  PublishFields,
  RelatedDisplayEntityFields,
  RelatedSubEntityFields,
  SaveFields,
} from "./entity";
import {
  RichText,
  SummaryFields,
  TranslationField,
  Translations,
} from "./entity-translation";
import { ImageFields, SummaryImageField } from "./entity-image";

export type Collection = EntityGlobalFields<"collection"> & {
  bannerImage: ImageFields<"id" | "y-position">;
} & RelatedDisplayEntityFields<
    "article" | "blog" | "recordedEvent" | "subject"
  > &
  RelatedSubEntityFields<"author" | "tag"> &
  PublishFields &
  SaveFields &
  Translations<CollectionTranslationFields> &
  SummaryImageField<"isNotToggleable">;

type CollectionTranslationFields = TranslationField<"title"> & {
  description: RichText;
} & SummaryFields<"general">;

export type CollectionTranslation = Collection["translations"][number];

export type CollectionRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "recordedEvent" | "subject" | "tag"
>;

export type CollectionStatus = DisplayEntityStatus<CollectionRelatedEntity>;
