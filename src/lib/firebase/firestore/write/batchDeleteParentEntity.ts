import { arrayRemove, writeBatch, WriteBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import { EntityName } from "^types/entity";
import { getDocRef } from "../getRefs";
import {
  entityNameToCollectionKeyMap,
  entityNameToSubEntityKeyMap,
} from "../_helpers/entityTypeMaps";

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

export async function deleteParentEntity<TSubentityNames extends EntityName[]>({
  parentEntity,
  subEntities,
}: {
  parentEntity: ParentEntityArg;
  subEntities: {
    [Index in keyof TSubentityNames]: {
      name: TSubentityNames[Index];
      ids: string[];
    };
  };
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
      parentEntity,
      subEntity,
    });
  });

  await batch.commit();
}
