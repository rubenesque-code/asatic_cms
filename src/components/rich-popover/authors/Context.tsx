import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntityToAuthor,
  removeRelatedEntityFromAuthor,
} from "^redux/state/authors";

export type ComponentContextValue = [
  {
    activeLanguageId: string;
    parentLanguagesIds: string[];
    parentAuthorsIds: string[];
    parentType: "article" | "blog" | "recorded-event";
    id: string;
  },
  {
    addAuthorToParent: (authorId: string) => void;
    removeAuthorFromParent: (authorId: string) => void;
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

  const handleAddAuthor = (collectionId: string) => {
    parentActions.addAuthorToParent(collectionId);
    dispatch(
      addRelatedEntityToAuthor({
        id: collectionId,
        relatedEntity: { entityId: parentData.id, type: parentData.parentType },
      })
    );
  };

  const handleRemoveAuthor = (collectionId: string) => {
    parentActions.removeAuthorFromParent(collectionId);
    dispatch(
      removeRelatedEntityFromAuthor({
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
          addAuthorToParent: handleAddAuthor,
          removeAuthorFromParent: handleRemoveAuthor,
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
      "useAuthorsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
