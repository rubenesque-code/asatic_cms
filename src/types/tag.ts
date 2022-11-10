import {
  EntityFields,
  EntityGlobalFields,
  EntityNameSubSet,
  RelatedDisplayEntityFields,
} from "./entity";

export type Tag = EntityGlobalFields<"tag"> &
  EntityFields<"text"> &
  RelatedDisplayEntityFields<TagRelatedEntity>;

export type TagRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;
