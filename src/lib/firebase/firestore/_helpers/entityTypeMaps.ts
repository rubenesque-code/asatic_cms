import { EntityName, RelatedEntityNameToFieldMap } from "^types/entity";
import { CollectionKey } from "../collectionKeys";

type EntityNameMapHelper<TFields extends { [k in EntityName]: CollectionKey }> =
  TFields;

type EntityNameToCollectionKeyMap = EntityNameMapHelper<{
  article: CollectionKey.ARTICLES;
  author: CollectionKey.AUTHORS;
  blog: CollectionKey.BLOGS;
  collection: CollectionKey.COLLECTIONS;
  recordedEvent: CollectionKey.RECORDEDEVENTS;
  recordedEventType: CollectionKey.RECORDEDEVENTTYPES;
  subject: CollectionKey.SUBJECTS;
  tag: CollectionKey.TAGS;
}>;

export type EntityNameToCollectionKey<TEntityName extends EntityName> =
  EntityNameToCollectionKeyMap[TEntityName];

export type EntityNameToSubEntityKey<TEntityName extends EntityName> =
  RelatedEntityNameToFieldMap[TEntityName];

export const entityNameToCollectionKeyMap: EntityNameToCollectionKeyMap = {
  article: CollectionKey.ARTICLES,
  author: CollectionKey.AUTHORS,
  blog: CollectionKey.BLOGS,
  collection: CollectionKey.COLLECTIONS,
  recordedEvent: CollectionKey.RECORDEDEVENTS,
  recordedEventType: CollectionKey.RECORDEDEVENTTYPES,
  subject: CollectionKey.SUBJECTS,
  tag: CollectionKey.TAGS,
};

export const entityNameToSubEntityKeyMap: RelatedEntityNameToFieldMap = {
  article: "articlesIds",
  author: "authorsIds",
  blog: "blogsIds",
  collection: "collectionsIds",
  recordedEvent: "recordedEventsIds",
  subject: "subjectsIds",
  tag: "tagsIds",
  recordedEventType: "recordedEventTypeId",
};
