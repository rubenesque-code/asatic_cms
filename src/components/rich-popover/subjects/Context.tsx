import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addRelatedEntityToSubject,
  removeRelatedEntityFromSubject,
} from "^redux/state/subjects";

import { checkObjectHasField } from "^helpers/general";

export type ComponentContextValue = [
  {
    activeLanguageId: string;
    languagesIds: string[];
    subjectsIds: string[];
    type: "article" | "blog" | "collection" | "recorded-event";
    id: string;
  },
  {
    addSubjectToParent: (subjectId: string) => void;
    removeSubjectFromParent: (subjectId: string) => void;
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

  const handleAddSubject = (subjectId: string) => {
    parentActions.addSubjectToParent(subjectId);
    dispatch(
      addRelatedEntityToSubject({
        id: subjectId,
        relatedEntity: { entityId: parentData.id, type: parentData.type },
      })
    );
  };

  const handleRemoveSubject = (subjectId: string) => {
    parentActions.removeSubjectFromParent(subjectId);
    dispatch(
      removeRelatedEntityFromSubject({
        id: subjectId,
        relatedEntityId: parentData.id,
      })
    );
  };

  return (
    <ComponentContext.Provider
      value={[
        parentData,
        {
          addSubjectToParent: handleAddSubject,
          removeSubjectFromParent: handleRemoveSubject,
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
      "useSubjectsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
