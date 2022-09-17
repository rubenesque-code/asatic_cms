import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import PanelUI from "../../PanelUI";
import DocSubjectsInputSelectCombo from "./InputSelectCombo";
import DocSubjectsList from "./List";

export default function DocSubjectsPanel(props: PanelContextValue) {
  return (
    <PanelUI>
      <DocSubjectsPanel.Provider {...props}>
        <DocSubjectsPanel.Content />
      </DocSubjectsPanel.Provider>
    </PanelUI>
  );
}

type PanelContextValue = {
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

DocSubjectsPanel.Provider = function PanelProvider({
  children,
  ...contextValue
}: {
  children: ReactElement;
} & PanelContextValue) {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children}
    </ComponentContext.Provider>
  );
};

DocSubjectsPanel.useContext = function useDocSubjectsPanelContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useDocSubjectsPanelContext must be used within its provider!"
    );
  }
  return context;
};

DocSubjectsPanel.Content = function Content() {
  const { docSubjectsIds, docType } = DocSubjectsPanel.useContext();
  const areDocSubjects = Boolean(docSubjectsIds.length);

  return (
    <>
      <PanelUI.DescriptionSkeleton
        areSubDocs={areDocSubjects}
        description="Subjects are broad - such as biology, art or politics. They are displayed on the website menu."
        docType={docType}
        subDocType="subject"
        title="Subjects"
      />
      {areDocSubjects ? <DocSubjectsList /> : null}
      <DocSubjectsInputSelectCombo />
    </>
  );
};
