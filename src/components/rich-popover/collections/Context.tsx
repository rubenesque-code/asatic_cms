import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntityToCollection,
  removeRelatedEntityFromCollection,
} from "^redux/state/collections";

export type ComponentContextValue = [
  {
    activeLanguageId: string;
    parentLanguagesIds: string[];
    parentCollectionsIds: string[];
    parentType: "article" | "blog" | "recorded-event";
    id: string;
  },
  {
    addCollectionToParent: (authorId: string) => void;
    removeCollectionFromParent: (authorId: string) => void;
  }
];

const ComponentContext = createContext<ComponentContextValue>([
  {},
  {},
] as ComponentContextValue);

export function ComponentProvider({
  children,
  parentActions,
  parentData,
}: {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
}) {
  const dispatch = useDispatch();

  const handleAddCollection = (collectionId: string) => {
    parentActions.addCollectionToParent(collectionId);
    dispatch(
      addRelatedEntityToCollection({
        id: collectionId,
        relatedEntity: { entityId: parentData.id, type: parentData.parentType },
      })
    );
  };

  const handleRemoveCollection = (collectionId: string) => {
    parentActions.removeCollectionFromParent(collectionId);
    dispatch(
      removeRelatedEntityFromCollection({
        id: collectionId,
        relatedEntityId: parentData.id,
      })
    );
  };

  return (
    <ComponentContext.Provider
      value={[
        parentData,
        {
          addCollectionToParent: handleAddCollection,
          removeCollectionFromParent: handleRemoveCollection,
        },
      ]}
    >
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useCollectionsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
