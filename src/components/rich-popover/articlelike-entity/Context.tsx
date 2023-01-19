import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { addRelatedEntity as addRelatedEntityToArticle } from "^redux/state/articles";
import { addRelatedEntity as addRelatedEntityToBlog } from "^redux/state/blogs";
import { addRelatedEntity as addRelatedEntityToRecordedEvent } from "^redux/state/recordedEvents";

import { checkObjectHasField } from "^helpers/general";

import { EntityNameSubSet } from "^types/entity";

type RelatedEntityName = EntityNameSubSet<"collection"> | "landing";
type ArticleLikeEntityName = EntityNameSubSet<"article" | "blog">;

type ArticleLikeEntity = {
  id: string;
  name: ArticleLikeEntityName;
};

export type ParentEntityProp = {
  parentEntity: {
    data: {
      id?: string;
      name: RelatedEntityName;
      existingEntitiesIds: {
        articles: string[];
        blogs: string[];
      };
      limitToLanguageId?: string;
    };
    actions: {
      addEntity: (entity: ArticleLikeEntity) => void;
    };
  };
};

type ComponentContextValue = {
  parentName: RelatedEntityName;
  excludedEntityIds: {
    articles: string[];
    blogs: string[];
  };
  handleAddPrimaryEntity: (primaryEntity: ArticleLikeEntity) => void;
  limitToLanguageId?: string;
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

  const handleAddEntity = (primaryEntity: {
    id: string;
    name: ArticleLikeEntityName;
  }) => {
    parentEntity.actions.addEntity(primaryEntity);

    if (parentEntity.data.name === "landing" || !parentEntity.data.id) {
      return;
    }

    const addParentToPrimaryEntityProps = {
      id: primaryEntity.id,
      relatedEntity: {
        id: parentEntity.data.id,
        name: parentEntity.data.name,
      },
    };

    if (primaryEntity.name === "article") {
      dispatch(addRelatedEntityToArticle(addParentToPrimaryEntityProps));
    } else if (primaryEntity.name === "blog") {
      dispatch(addRelatedEntityToBlog(addParentToPrimaryEntityProps));
    } else {
      dispatch(addRelatedEntityToRecordedEvent(addParentToPrimaryEntityProps));
    }

    closePopover();
  };

  return (
    <ComponentContext.Provider
      value={{
        excludedEntityIds: parentEntity.data.existingEntitiesIds,
        handleAddPrimaryEntity: handleAddEntity,
        parentName: parentEntity.data.name,
        limitToLanguageId: parentEntity.data.limitToLanguageId,
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
