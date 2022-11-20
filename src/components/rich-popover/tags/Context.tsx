import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntity as addRelatedEntityToTag,
  removeRelatedEntity as removeRelatedEntityFromTag,
} from "^redux/state/tags";

import { TagRelatedEntity } from "^types/tag";
import { MyExtract } from "^types/utilities";

type ParentEntity = {
  id: string;
  name: MyExtract<
    TagRelatedEntity,
    "article" | "blog" | "recordedEvent" | "collection" | "subject"
  >;
  tagsIds: string[];
  addTag: (tagId: string) => void;
  removeTag: (tagId: string) => void;
};

export type ParentEntityProp = {
  parentEntity: ParentEntity;
};

type ComponentContextValue = {
  parentEntityData: Pick<ParentEntity, "name" | "tagsIds">;
  addTagRelations: (tagId: string) => void;
  removeTagRelations: (tagId: string) => void;
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

  const addTagRelations = (tagId: string) => {
    parentEntity.addTag(tagId);
    dispatch(
      addRelatedEntityToTag({
        id: tagId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  const removeTagRelations = (tagId: string) => {
    parentEntity.removeTag(tagId);
    dispatch(
      removeRelatedEntityFromTag({
        id: tagId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  return (
    <ComponentContext.Provider
      value={{
        addTagRelations,
        removeTagRelations,
        parentEntityData: {
          name: parentEntity.name,
          tagsIds: parentEntity.tagsIds,
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
      "useTagsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
