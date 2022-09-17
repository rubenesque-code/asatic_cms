import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import PanelUI from "../../PanelUI";
import DocAuthorsList from "./List";
import DocAuthorsInputSelectCombo from "./InputSelectCombo";

export default function DocAuthorsPanel(props: PanelContextValue) {
  return (
    <PanelUI>
      <DocAuthorsPanel.Provider {...props}>
        <DocAuthorsPanel.Content />
      </DocAuthorsPanel.Provider>
    </PanelUI>
  );
}

type PanelContextValue = {
  docActiveLanguageId: string;
  docLanguagesIds: string[];
  docAuthorsIds: string[];
  docType: string;
  addAuthorToDoc: (authorId: string) => void;
  removeAuthorFromDoc: (authorId: string) => void;
};

const ComponentContext = createContext<PanelContextValue>(
  {} as PanelContextValue
);

DocAuthorsPanel.Provider = function PanelProvider({
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

DocAuthorsPanel.useContext = function useDocAuthorsPanelContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useDocAuthorsPanelContext must be used within its provider!"
    );
  }
  return context;
};

DocAuthorsPanel.Content = function Content() {
  const { docAuthorsIds, docType } = DocAuthorsPanel.useContext();
  const areDocAuthors = Boolean(docAuthorsIds.length);

  return (
    <>
      <PanelUI.DescriptionSkeleton
        areSubDocs={areDocAuthors}
        description={`Edit authors for this ${docType}`}
        docType={docType}
        subDocType="author"
        title="Authors"
      />
      {areDocAuthors ? <DocAuthorsList /> : null}
      <DocAuthorsInputSelectCombo />
    </>
  );
};
