// - map meaningful names (e.g. EntityName or ImageFieldsNameMap (in entity-image.ts)) that are used to reference actual key-values
// - just create interfaces with key-values that are referenced in multiple types. E.g. EntityFieldsMap
// - maybe want another method to enforce key names across all types; key names unconnected to any value. Haven't done this yet; maybe not worth it.

import { TupleToUnion, FilterTuple } from "./utilities";

export type EntityNameTuple = [
  "article",
  "author",
  "blog",
  "collection",
  "recordedEvent",
  "recordedEventType",
  "subject",
  "tag"
];

export type EntityNameTupleSubset<TEntityName extends EntityNameTuple[number]> =
  FilterTuple<EntityNameTuple, TEntityName>;

export type EntityName = TupleToUnion<EntityNameTuple>;

export type EntityNameSubSet<TEntity extends EntityName> = TEntity;

export type DisplayEntityName = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

export type DisplayEntityNameSubset<TName extends DisplayEntityName> =
  EntityNameSubSet<TName>;

export type SubEntityName = EntityNameSubSet<"author" | "tag">;

type RelatedEntityFieldsHelper<TFields extends { [k in EntityName]: string }> =
  TFields;

export type RelatedEntityNameToFieldMap = RelatedEntityFieldsHelper<{
  article: "articlesIds";
  author: "authorsIds";
  blog: "blogsIds";
  collection: "collectionsIds";
  recordedEvent: "recordedEventsIds";
  recordedEventType: "recordedEventTypeId";
  subject: "subjectsIds";
  tag: "tagsIds";
}>;

export type RelatedEntityFieldsSubset<TEntityName extends EntityName> = {
  [k in TEntityName]: RelatedEntityNameToFieldMap[k];
};

export type EntityNameToKey<TEntityName extends EntityName> =
  RelatedEntityNameToFieldMap[TEntityName];

export type SubEntityKey =
  RelatedEntityNameToFieldMap[keyof RelatedEntityNameToFieldMap];

type RelatedDisplayEntityFieldsMap =
  RelatedEntityFieldsSubset<DisplayEntityName>;

type RelatedSubEntityFieldsMap = RelatedEntityFieldsSubset<SubEntityName>;

export type RelatedEntityFields<
  TRelatedEntityType extends keyof RelatedEntityNameToFieldMap
> = {
  [k in RelatedEntityNameToFieldMap[TRelatedEntityType]]: k extends "recordedEventTypeId"
    ? string | null | undefined
    : string[];
};

export type RelatedDisplayEntityFields<
  TRelatedEntityType extends keyof RelatedDisplayEntityFieldsMap
> = {
  [k in RelatedDisplayEntityFieldsMap[TRelatedEntityType]]: string[];
};

export type RelatedSubEntityFields<
  TRelatedEntityType extends keyof RelatedSubEntityFieldsMap
> = {
  [k in RelatedSubEntityFieldsMap[TRelatedEntityType]]: string[];
};

type EntityFieldsMap = {
  id: string;
  text?: string;
  name?: string;
};

export type EntityFields<TField extends keyof EntityFieldsMap> = Pick<
  EntityFieldsMap,
  TField
>;

export type EntityGlobalFields<TEntityName extends EntityName> =
  EntityFields<"id"> & { type: TEntityName };

export type PublishFields = {
  publishStatus: "published" | "draft";
  publishDate?: Date;
};

export type SaveFields = {
  lastSave: Date | null;
};

type ComponentMap = {
  id: string;
  index: number;
  width: number;
};

export type ComponentFields<TField extends keyof ComponentMap> = Pick<
  ComponentMap,
  TField
>;

type MediaMap = {
  caption?: string;
  youtubeId?: string;
};

export type MediaFields<TField extends keyof MediaMap> = Pick<MediaMap, TField>;
