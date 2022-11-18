import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { addRelatedEntity as addRelatedEntityToArticle } from "^redux/state/articles";
import { addRelatedEntity as addRelatedEntityToBlog } from "^redux/state/blogs";
import { addRelatedEntity as addRelatedEntityToCollection } from "^redux/state/collections";
import { addRelatedEntity as addRelatedEntityToRecordedEvent } from "^redux/state/recordedEvents";

import { checkObjectHasField } from "^helpers/general";

import { EntityNameSubSet, RelatedEntityFields } from "^types/entity";

type RelatedEntityName = EntityNameSubSet<"subject">;
type DisplayEntityName = EntityNameSubSet<
  "article" | "blog" | "recordedEvent" | "collection"
>;

type DisplayEntity = {
  id: string;
  name: DisplayEntityName;
};

type RelatedDisplayEntityFields = RelatedEntityFields<DisplayEntityName>;

export type ParentEntityProp = {
  parentEntity: {
    data: {
      id: string;
      name: RelatedEntityName;
      existingEntities: RelatedDisplayEntityFields;
    };
    actions: {
      addDisplayEntity: (displayEntity: DisplayEntity) => void;
    };
  };
};

type ComponentContextValue = {
  parentName: RelatedEntityName;
  excludedEntity: RelatedDisplayEntityFields;
  handleAddDisplayEntity: (displayEntity: DisplayEntity) => void;
};

const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

export function ComponentProvider({
  children,
  parentEntity,
  closePopover,
}: {
  children: ReactElement;
  closePopover: () => void;
} & ParentEntityProp) {
  const dispatch = useDispatch();

  const handleAddDisplayEntity = (displayEntity: DisplayEntity) => {
    parentEntity.actions.addDisplayEntity(displayEntity);

    const addParentToPrimaryEntityArgs = {
      id: displayEntity.id,
      relatedEntity: {
        id: parentEntity.data.id,
        name: parentEntity.data.name,
      },
    };

    if (displayEntity.name === "article") {
      dispatch(addRelatedEntityToArticle(addParentToPrimaryEntityArgs));
    } else if (displayEntity.name === "blog") {
      dispatch(addRelatedEntityToBlog(addParentToPrimaryEntityArgs));
    } else if (displayEntity.name === "collection") {
      dispatch(addRelatedEntityToCollection(addParentToPrimaryEntityArgs));
    } else {
      dispatch(addRelatedEntityToRecordedEvent(addParentToPrimaryEntityArgs));
    }

    closePopover();
  };

  return (
    <ComponentContext.Provider
      value={{
        excludedEntity: parentEntity.data.existingEntities,
        handleAddDisplayEntity: handleAddDisplayEntity,
        parentName: parentEntity.data.name,
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
      "usePrimaryEntityPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
