import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import PanelUI from "../PanelUI";

export type PanelContextValue = {
  docActiveLanguageId: string;
  docLanguagesIds: string[];
  docSubjectsIds: string[];
  docType: string;
  addSubjectToDoc: (subjectId: string) => void;
  removeSubjectFromDoc: (subjectId: string) => void;
};

const ComponentContext = createContext<PanelContextValue>(
  {} as PanelContextValue
);

export const PanelProvider = ({
  children,
  ...contextValue
}: {
  children: ReactElement;
} & PanelContextValue) => {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children}
    </ComponentContext.Provider>
  );
};

const useComponentContext = () => {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

const Panel = () => {
  const { docSubjectsIds, docType } = useComponentContext();

  const areDocSubjects = Boolean(docSubjectsIds.length);

  return (
    <PanelUI>
      <PanelUI.DescriptionSkeleton
        areSubDocs={areDocSubjects}
        description="Subjects are broad - such as biology, art or politics. They are displayed on the website menu."
        docType={docType}
        subDocType="subject"
        title="Subjects"
      />
    </PanelUI>
  );
};

export default Panel;
