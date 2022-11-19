import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntity as addRelatedEntityToCollection,
  removeRelatedEntity as removeRelatedEntityFromCollection,
} from "^redux/state/collections";
import { CollectionRelatedEntity } from "^types/collection";
import { MyExtract } from "^types/utilities";

type ParentEntity = {
  activeLanguageId: string;
  id: string;
  name: MyExtract<
    CollectionRelatedEntity,
    "article" | "blog" | "recordedEvent" | "subject"
  >;
  translationLanguagesIds: string[];
  collectionsIds: string[];
  addCollection: (collectionId: string) => void;
  removeCollection: (collectionId: string) => void;
};

export type ParentEntityProp = {
  parentEntity: ParentEntity;
};

type ComponentContextValue = {
  parentEntityData: Pick<
    ParentEntity,
    "activeLanguageId" | "name" | "collectionsIds" | "translationLanguagesIds"
  >;
  addCollectionRelations: (collectionId: string) => void;
  removeCollectionRelations: (collectionId: string) => void;
};

const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

export function ComponentProvider({
  children,
  parentEntity,
}: {
  children: ReactElement;
} & ParentEntityProp) {
  const dispatch = useDispatch();

  const parentEntityAsRelatedEntity = {
    id: parentEntity.id,
    name: parentEntity.name,
  };

  const addCollectionRelations = (collectionId: string) => {
    parentEntity.addCollection(collectionId);
    dispatch(
      addRelatedEntityToCollection({
        id: collectionId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  const removeCollectionRelations = (collectionId: string) => {
    parentEntity.removeCollection(collectionId);
    dispatch(
      removeRelatedEntityFromCollection({
        id: collectionId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  return (
    <ComponentContext.Provider
      value={{
        addCollectionRelations,
        removeCollectionRelations,
        parentEntityData: {
          activeLanguageId: parentEntity.activeLanguageId,
          name: parentEntity.name,
          collectionsIds: parentEntity.collectionsIds,
          translationLanguagesIds: parentEntity.translationLanguagesIds,
        },
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useCollectionsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
