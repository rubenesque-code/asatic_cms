// - map meaningful names (e.g. EntityName or ImageFieldsNameMap (in entity-image.ts)) that are used to reference actual key-values
// - just create interfaces with key-values that are referenced in multiple types. E.g. EntityFieldsMap
// - maybe want another method to enforce key names across all types; key names unconnected to any value. Haven't done this yet; maybe not worth it.

export type EntityName =
  | "article"
  | "author"
  | "blog"
  | "collection"
  | "recordedEvent"
  | "subject"
  | "tag";

export type EntityNameSubSet<TEntity extends EntityName> = TEntity;

export type DisplayEntityName = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

export type DisplayEntityNameSubset<TName extends DisplayEntityName> =
  EntityNameSubSet<TName>;

export type SubEntityName = EntityNameSubSet<"author" | "tag">;

type RelatedEntityFieldsHelper<TFields extends { [k in EntityName]: string }> =
  TFields;

type RelatedEntityNameToFieldMap = RelatedEntityFieldsHelper<{
  article: "articlesIds";
  author: "authorsIds";
  blog: "blogsIds";
  collection: "collectionsIds";
  recordedEvent: "recordedEventsIds";
  subject: "subjectsIds";
  tag: "tagsIds";
}>;

type RelatedEntityFieldsSubset<TEntityName extends EntityName> = {
  [k in TEntityName]: RelatedEntityNameToFieldMap[k];
};

type RelatedDisplayEntityFieldsMap =
  RelatedEntityFieldsSubset<DisplayEntityName>;

type RelatedSubEntityFieldsMap = RelatedEntityFieldsSubset<SubEntityName>;

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
  text: string;
  name: string;
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