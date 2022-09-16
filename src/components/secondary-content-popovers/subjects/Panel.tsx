import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import PanelUI from "../PanelUI";
import DocSubjectsInputSelectCombo from "./InputSelectCombo";
import DocSubjectsList from "./List";

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

const PanelProvider = ({
  children,
  ...contextValue
}: {
  children: (contextValue: PanelContextValue) => ReactElement;
} & PanelContextValue) => {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children(contextValue)}
    </ComponentContext.Provider>
  );
};

export const useDocSubjectsContext = () => {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

const Panel = (contextValue: PanelContextValue) => {
  return (
    <PanelProvider {...contextValue}>
      {({ docSubjectsIds, docType }) => (
        <PanelUI>
          <>
            <PanelUI.DescriptionSkeleton
              areSubDocs={Boolean(docSubjectsIds.length)}
              description="Subjects are broad - such as biology, art or politics. They are displayed on the website menu."
              docType={docType}
              subDocType="subject"
              title="Subjects"
            />
            <DocSubjectsList />
            <DocSubjectsInputSelectCombo />
          </>
        </PanelUI>
      )}
    </PanelProvider>
  );
};

export default Panel;
