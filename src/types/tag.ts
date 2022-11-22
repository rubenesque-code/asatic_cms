import {
  EntityFields,
  EntityGlobalFields,
  EntityNameSubSet,
  RelatedDisplayEntityFields,
} from "./entity";
import { EntityAsChildStatus } from "./entity-status";

export type Tag = EntityGlobalFields<"tag"> &
  EntityFields<"text"> &
  RelatedDisplayEntityFields<TagRelatedEntity>;

export type TagRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

export type ChildTagMissingRequirement = "missing name field";

export type TagAsChildStatus = EntityAsChildStatus<ChildTagMissingRequirement>;
