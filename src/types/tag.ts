import { RelatedDisplayEntityFields } from "./entity";

export type Tag = { id: string; text: string } & RelatedDisplayEntityFields<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

export type Tags = Tag[];
