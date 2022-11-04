import {
  EntityFields,
  EntityGlobalFields,
  RelatedDisplayEntityFields,
} from "./entity";

export type Tag = EntityGlobalFields<"tag"> &
  EntityFields<"text"> &
  RelatedDisplayEntityFields<
    "article" | "blog" | "collection" | "recordedEvent" | "subject"
  >;

export type Tags = Tag[];
