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

export type EntityFieldsMap = {
  id: string;
  text: string;
};

export type EntityFields<TField extends keyof EntityFieldsMap> = Pick<
  EntityFieldsMap,
  TField
>;

export type EntityGlobal<TEntityName extends EntityName> =
  EntityFields<"id"> & { type: TEntityName };

export type PublishFields = {
  publishStatus: "published" | "draft";
  publishDate?: Date;
};

export type SaveFields = {
  lastSave: Date | null;
};
