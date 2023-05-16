import { RelatedEntityNameToFieldMap } from "^types/entity";

export const relatedEntityFieldMap: RelatedEntityNameToFieldMap = {
  article: "articlesIds",
  author: "authorsIds",
  blog: "blogsIds",
  collection: "collectionsIds",
  recordedEvent: "recordedEventsIds",
  subject: "subjectsIds",
  tag: "tagsIds",
  recordedEventType: "recordedEventTypeId",
};

// type RelatedEntityType = keyof typeof relatedEntityFieldMap;

/* export type RelatedEntityTypes<TEntityType extends RelatedEntityType> = Extract<
  RelatedEntityType,
  TEntityType
>;
 */
