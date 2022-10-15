import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

export type ComponentContextValue = [
  {
    activeLanguageId: string;
    parentLanguagesIds: string[];
    parentSubjectsIds: string[];
    parentType: string;
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
  return (
    <ComponentContext.Provider value={[parentData, parentActions]}>
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
