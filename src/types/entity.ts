export type EntityName =
  | "article"
  | "author"
  | "blog"
  | "collection"
  | "recordedEvent"
  | "subject"
  | "tag";

type EntitySubSet<TEntity extends EntityName> = TEntity;

export type DisplayEntityName = EntitySubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

export type SubEntityName = EntitySubSet<"author" | "tag">;

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
