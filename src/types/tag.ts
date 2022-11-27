import {
  EntityFields,
  EntityGlobalFields,
  EntityNameTupleSubset,
  RelatedDisplayEntityFields,
} from "./entity";
import { EntityAsChildStatus } from "./entity-status";
import { TupleToUnion } from "./utilities";

export type Tag = EntityGlobalFields<"tag"> &
  EntityFields<"text"> &
  RelatedDisplayEntityFields<TagRelatedEntity>;

export type TagRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

export type TagRelatedEntity = TupleToUnion<TagRelatedEntityTuple>;

export type ChildTagMissingRequirement = "missing name field";

export type TagAsChildStatus = EntityAsChildStatus<ChildTagMissingRequirement>;
