/*  type RelatedEntityField =
  | "articlesIds"
  | "authorsIds"
  | "blogsIds"
  | "collectionsIds"
  | "recordedEventsIds"
  | "subjectsIds"
  | "tagsIds"; */

export const relatedEntityFieldMap = {
  article: "articlesIds",
  author: "authorsIds",
  blog: "blogsIds",
  collection: "collectionsIds",
  recordedEvent: "recordedEventsIds",
  subject: "subjectsIds",
  tag: "tagsIds",
} as const;

type RelatedEntityType = keyof typeof relatedEntityFieldMap;

export type RelatedEntityTypes<TEntityType extends RelatedEntityType> = Extract<
  RelatedEntityType,
  TEntityType
>;
