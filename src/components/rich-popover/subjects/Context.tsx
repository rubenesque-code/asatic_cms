import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntity as addRelatedEntityToSubject,
  removeRelatedEntity as removeRelatedEntityFromSubject,
} from "^redux/state/subjects";

import { checkObjectHasField } from "^helpers/general";
import { MyExtract } from "^types/utilities";
import { SubjectRelatedEntity } from "^types/subject";

type ParentEntity = {
  activeLanguageId: string;
  id: string;
  name: MyExtract<
    SubjectRelatedEntity,
    "article" | "blog" | "collection" | "recordedEvent"
  >;
  translationLanguagesIds: string[];
  subjectIds: string[];
  addSubject: (subjectId: string) => void;
  removeSubject: (subjectId: string) => void;
};

export type ParentEntityProp = {
  parentEntity: ParentEntity;
};

type ComponentContextValue = {
  parentEntityData: Pick<
    ParentEntity,
    "activeLanguageId" | "name" | "subjectIds" | "translationLanguagesIds"
  >;
  addSubjectRelations: (subjectId: string) => void;
  removeSubjectRelations: (subjectId: string) => void;
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

  const addSubjectRelations = (subjectId: string) => {
    parentEntity.addSubject(subjectId);
    dispatch(
      addRelatedEntityToSubject({
        id: subjectId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  const removeSubjectRelations = (subjectId: string) => {
    parentEntity.removeSubject(subjectId);
    dispatch(
      removeRelatedEntityFromSubject({
        id: subjectId,
        relatedEntity: parentEntityAsRelatedEntity,
      })
    );
  };

  return (
    <ComponentContext.Provider
      value={{
        addSubjectRelations,
        removeSubjectRelations,
        parentEntityData: {
          activeLanguageId: parentEntity.activeLanguageId,
          name: parentEntity.name,
          subjectIds: parentEntity.subjectIds,
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
      "useSubjectsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
