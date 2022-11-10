import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntity as addRelatedEntityToTag,
  removeRelatedEntity as removeRelatedEntityFromTag,
} from "^redux/state/tags";
import { TagRelatedEntity } from "^types/tag";

export type ComponentContextValue = [
  relateEntityData: {
    id: string;
    name: TagRelatedEntity;
    tagsIds: string[];
  },
  relatedEntityActions: {
    addTagToRelatedEntity: (tagId: string) => void;
    removeTagFromRelatedEntity: (tagId: string) => void;
  }
];

const ComponentContext = createContext<ComponentContextValue>([
  {},
  {},
] as ComponentContextValue);

export function ComponentProvider({
  children,
  relatedEntityActions,
  relatedEntityData,
}: {
  children: ReactElement;
  relatedEntityData: ComponentContextValue[0];
  relatedEntityActions: ComponentContextValue[1];
}) {
  const dispatch = useDispatch();

  const relatedEntity = {
    id: relatedEntityData.id,
    name: relatedEntityData.name,
  };

  const handleAddTag = (tagId: string) => {
    relatedEntityActions.addTagToRelatedEntity(tagId);
    dispatch(
      addRelatedEntityToTag({
        id: tagId,
        relatedEntity,
      })
    );
  };

  const handleRemoveTag = (tagId: string) => {
    relatedEntityActions.removeTagFromRelatedEntity(tagId);
    dispatch(
      removeRelatedEntityFromTag({
        id: tagId,
        relatedEntity,
      })
    );
  };
  return (
    <ComponentContext.Provider
      value={[
        relatedEntityData,
        {
          addTagToRelatedEntity: handleAddTag,
          removeTagFromRelatedEntity: handleRemoveTag,
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
      "useTagsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
