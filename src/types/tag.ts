import {
  EntityFields,
  EntityGlobal,
  RelatedDisplayEntityFields,
} from "./entity";

export type Tag = EntityGlobal<"tag"> &
  EntityFields<"text"> &
  RelatedDisplayEntityFields<
    "article" | "blog" | "collection" | "recordedEvent" | "subject"
  >;

export type Tags = Tag[];
