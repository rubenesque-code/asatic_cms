import { arrayRemove, writeBatch, WriteBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import { Collection as CollectionKey } from "../collectionKeys";
import { getDocRef } from "../getRefs";

// only concerned with updating related sub-entities
// only need to update related entities field of e.g. author

// todo: update types so that collectionKeys values are same as e.g. parentEntity type (recorded-event is only variation but should enforce)

type ParentEntityType =
  | "article"
  | "blog"
  | "collection"
  | "recorded-event"
  | "subject";
type ParentEntity = {
  type: ParentEntityType;
  collectionKey: Extract<
    CollectionKey,
    | CollectionKey.ARTICLES
    | CollectionKey.BLOGS
    | CollectionKey.COLLECTIONS
    | CollectionKey.RECORDEDEVENTS
    | CollectionKey.SUBJECTS
  >;
  id: string;
};
type SubEntityCollectionKey = Extract<
  CollectionKey,
  | CollectionKey.AUTHORS
  | CollectionKey.COLLECTIONS
  | CollectionKey.SUBJECTS
  | CollectionKey.TAGS
  | CollectionKey.ARTICLES
  | CollectionKey.BLOGS
  | CollectionKey.RECORDEDEVENTS
>;

const batchUpdateSubEntities = (
  batch: WriteBatch,
  subEntityCollectionKey: SubEntityCollectionKey,
  subEntityIds: string[],
  parentEntity: { type: ParentEntityType; entityId: string }
) => {
  for (let i = 0; i < subEntityIds.length; i++) {
    const subEntityId = subEntityIds[i];
    const subEntityDocRef = getDocRef(subEntityCollectionKey, subEntityId);
    batch.update(subEntityDocRef, {
      relatedEntities: arrayRemove(parentEntity),
    });
  }
};

export const deleteParentEntity = async ({
  parentEntity,
  subEntities,
}: {
  parentEntity: ParentEntity;
  subEntities: { collectionKey: SubEntityCollectionKey; ids: string[] }[];
}) => {
  const batch = writeBatch(firestore);

  const parentDocRef = getDocRef(parentEntity.collectionKey, parentEntity.id);
  batch.delete(parentDocRef);

  for (let i = 0; i < subEntities.length; i++) {
    console.log(subEntities[i]);

    batchUpdateSubEntities(
      batch,
      subEntities[i].collectionKey,
      subEntities[i].ids,
      {
        type: parentEntity.type,
        entityId: parentEntity.id,
      }
    );
  }

  await batch.commit();
};

export type DeleteArticleProps = {
  entityId: string;
  authorsIds: string[];
  collectionsIds: string[];
  subjectsIds: string[];
  tagsIds: string[];
};

export const deleteArticle = async ({
  entityId,
  authorsIds,
  collectionsIds,
  subjectsIds,
  tagsIds,
}: DeleteArticleProps) =>
  await deleteParentEntity({
    parentEntity: {
      id: entityId,
      collectionKey: CollectionKey.ARTICLES,
      type: "article",
    },
    subEntities: [
      { collectionKey: CollectionKey.AUTHORS, ids: authorsIds },
      { collectionKey: CollectionKey.COLLECTIONS, ids: collectionsIds },
      { collectionKey: CollectionKey.SUBJECTS, ids: subjectsIds },
      { collectionKey: CollectionKey.TAGS, ids: tagsIds },
    ],
  });
