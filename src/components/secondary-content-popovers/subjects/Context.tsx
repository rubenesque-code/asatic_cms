import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

export type ContextValue = {
  docActiveLanguageId: string;
  docLanguagesIds: string[];
  docSubjectsIds: string[];
  docType: string;
  addSubjectToDoc: (subjectId: string) => void;
  removeSubjectFromDoc: (subjectId: string) => void;
};

const ComponentContext = createContext<ContextValue>({} as ContextValue);

export const ComponentProvider = ({
  children,
  ...contextValue
}: {
  children: ReactElement;
} & ContextValue) => {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children}
    </ComponentContext.Provider>
  );
};

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useWithSubjectsContext must be used within its provider!");
  }
  return context;
};
