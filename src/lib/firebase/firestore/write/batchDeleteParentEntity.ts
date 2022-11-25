import { arrayRemove, writeBatch, WriteBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import {
  EntityName,
  EntityNameSubSet,
  RelatedEntityFields,
} from "^types/entity";
import { SubjectRelatedEntity } from "^types/subject";
import { getDocRef } from "../getRefs";
import {
  entityNameToCollectionKeyMap,
  entityNameToSubEntityKeyMap,
} from "../_helpers/entityTypeMaps";

// todo: what to do for subject-collection relationship
// todo: would make more sense to just have seperate e.g. article, blog and recordedEvent fields in author rather than a single relatedEntities field

type ParentEntityArg = {
  name: EntityName;
  id: string;
};

type SubEntityArg = {
  name: EntityName;
  ids: string[];
};

const batchUpdateSubEntitiesOnParentDelete = ({
  batch,
  parentEntity,
  subEntity,
}: {
  batch: WriteBatch;
  subEntity: SubEntityArg;
  parentEntity: ParentEntityArg;
}) => {
  subEntity.ids.forEach((subEntityId) => {
    const subEntityDocRef = getDocRef(
      entityNameToCollectionKeyMap[subEntity.name],
      subEntityId
    );

    const updatedSubEntityField = {
      [entityNameToSubEntityKeyMap[parentEntity.name]]: arrayRemove(
        parentEntity.id
      ),
    };

    batch.update(subEntityDocRef, updatedSubEntityField);
  });
};

export async function deleteParentEntity({
  parentEntity,
  subEntities,
}: {
  parentEntity: ParentEntityArg;
  subEntities: SubEntityArg[];
}) {
  const batch = writeBatch(firestore);

  const parentDocRef = getDocRef(
    entityNameToCollectionKeyMap[parentEntity.name],
    parentEntity.id
  );
  batch.delete(parentDocRef);

  subEntities.forEach((subEntity) => {
    batchUpdateSubEntitiesOnParentDelete({
      batch,
      parentEntity: { id: parentEntity.id, name: parentEntity.name },
      subEntity,
    });
  });

  await batch.commit();
}

export const deleteAuthor = ({
  id,
  subEntities,
}: {
  id: string;
  subEntities: {
    articlesIds: string[];
    blogsIds: string[];
    recordedEventsIds: string[];
  };
}) =>
  deleteParentEntity({
    parentEntity: { id, name: "author" },
    subEntities: [
      { name: "article", ids: subEntities.articlesIds },
      { name: "blog", ids: subEntities.blogsIds },
      { name: "recordedEvent", ids: subEntities.recordedEventsIds },
    ],
  });

export async function deletePrimaryEntity({
  entity,
  subEntities,
}: {
  entity: {
    id: string;
    name: EntityNameSubSet<"article" | "blog" | "recordedEvent">;
  };
  subEntities: {
    authorsIds: string[];
    collectionsIds: string[];
    subjectsIds: string[];
    tagsIds: string[];
  };
}) {
  await deleteParentEntity({
    parentEntity: entity,
    subEntities: [
      { name: "author", ids: subEntities.authorsIds },
      {
        name: "collection",
        ids: subEntities.collectionsIds,
      },
      {
        name: "subject",
        ids: subEntities.subjectsIds,
      },
      {
        name: "tag",
        ids: subEntities.tagsIds,
      },
    ],
  });
}

export const deleteCollection = async ({
  id,
  subEntities,
}: {
  id: string;
  subEntities: {
    articlesIds: string[];
    blogsId: string[];
    recordedEventsId: string[];
    subjectsIds: string[];
    tagsIds: string[];
  };
}) =>
  await deleteParentEntity({
    parentEntity: {
      id,
      name: "collection",
    },
    subEntities: [
      { name: "article", ids: subEntities.articlesIds },
      { name: "blog", ids: subEntities.blogsId },
      { name: "recordedEvent", ids: subEntities.recordedEventsId },
      { name: "subject", ids: subEntities.subjectsIds },
      { name: "tag", ids: subEntities.tagsIds },
    ],
  });

export type DeleteSubjectProps = {
  entity: {
    id: string;
  };
} & RelatedEntityFields<SubjectRelatedEntity>;

export const deleteSubject = async ({
  id,
  subEntities,
}: {
  id: string;
  subEntities: {
    articlesIds: string[];
    blogsId: string[];
    recordedEventsId: string[];
    collectionsIds: string[];
    tagsIds: string[];
  };
}) =>
  await deleteParentEntity({
    parentEntity: {
      id,
      name: "subject",
    },
    subEntities: [
      { name: "article", ids: subEntities.articlesIds },
      { name: "blog", ids: subEntities.blogsId },
      { name: "recordedEvent", ids: subEntities.recordedEventsId },
      { name: "collection", ids: subEntities.collectionsIds },
      { name: "tag", ids: subEntities.tagsIds },
    ],
  });
