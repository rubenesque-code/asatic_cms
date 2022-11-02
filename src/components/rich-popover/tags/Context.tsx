import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntityToTag,
  removeRelatedEntityFromTag,
} from "^redux/state/tags";

export type ComponentContextValue = [
  {
    parentTagsIds: string[];
    parentType: "article" | "blog" | "collection" | "recorded-event";
    id: string;
  },
  {
    addTagToParent: (tagId: string) => void;
    removeTagFromParent: (tagId: string) => void;
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

  const handleAddTag = (tagId: string) => {
    parentActions.addTagToParent(tagId);
    dispatch(
      addRelatedEntityToTag({
        id: tagId,
        relatedEntity: { entityId: parentData.id, type: parentData.parentType },
      })
    );
  };

  const handleRemoveTag = (tagId: string) => {
    parentActions.removeTagFromParent(tagId);
    dispatch(
      removeRelatedEntityFromTag({
        id: tagId,
        relatedEntityId: parentData.id,
      })
    );
  };
  return (
    <ComponentContext.Provider
      value={[
        parentData,
        { addTagToParent: handleAddTag, removeTagFromParent: handleRemoveTag },
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
