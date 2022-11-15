import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntity as addRelatedEntityToAuthor,
  removeRelatedEntity as removeRelatedEntityFromAuthor,
} from "^redux/state/authors";
import { AuthorRelatedEntity } from "^types/author";
import { MyExtract } from "^types/utilities";

type ParentEntity = {
  activeLanguageId: string;
  id: string;
  name: MyExtract<AuthorRelatedEntity, "article" | "blog" | "recordedEvent">;
  translationLanguagesIds: string[];
  authorsIds: string[];
  addAuthor: (authorId: string) => void;
  removeAuthor: (authorId: string) => void;
};

export type ParentEntityProp = {
  parentEntity: ParentEntity;
};

type ComponentContextValue = {
  parentEntityData: Pick<
    ParentEntity,
    "activeLanguageId" | "name" | "authorsIds" | "translationLanguagesIds"
  >;
  addAuthorRelations: (authorId: string) => void;
  removeAuthorRelations: (authorId: string) => void;
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

  const addAuthorRelations = (authorId: string) => {
    parentEntity.addAuthor(authorId);
    dispatch(
      addRelatedEntityToAuthor({
        id: authorId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  const removeAuthorRelations = (authorId: string) => {
    parentEntity.removeAuthor(authorId);
    dispatch(
      removeRelatedEntityFromAuthor({
        id: authorId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  return (
    <ComponentContext.Provider
      value={{
        addAuthorRelations,
        removeAuthorRelations,
        parentEntityData: {
          activeLanguageId: parentEntity.activeLanguageId,
          name: parentEntity.name,
          authorsIds: parentEntity.authorsIds,
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
      "useAuthorsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
