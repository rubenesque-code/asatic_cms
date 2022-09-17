import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import PanelUI from "../../PanelUI";
import DocCollectionsInputSelectCombo from "./InputSelectCombo";
import DocCollectionsList from "./List";

export default function DocCollectionsPanel(props: PanelContextValue) {
  return (
    <PanelUI>
      <DocCollectionsPanel.Provider {...props}>
        <DocCollectionsPanel.Content />
      </DocCollectionsPanel.Provider>
    </PanelUI>
  );
}

type PanelContextValue = {
  docActiveLanguageId: string;
  docLanguagesIds: string[];
  docCollectionsIds: string[];
  docType: string;
  addCollectionToDoc: (collectionId: string) => void;
  removeCollectionFromDoc: (collectionId: string) => void;
};

const ComponentContext = createContext<PanelContextValue>(
  {} as PanelContextValue
);

DocCollectionsPanel.Provider = function PanelProvider({
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

DocCollectionsPanel.useContext = function useDocCollectionsPanelContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useDocCollectionsPanelContext must be used within its provider!"
    );
  }
  return context;
};

DocCollectionsPanel.Content = function Content() {
  const { docCollectionsIds, docType } = DocCollectionsPanel.useContext();
  const areDocCollections = Boolean(docCollectionsIds.length);

  return (
    <>
      <PanelUI.DescriptionSkeleton
        areSubDocs={areDocCollections}
        description="
        Collections allow content to be grouped under a topic (as opposed to a
        subject, which is broader). A collection can optionally be part of a
        subject(s).
       "
        docType={docType}
        subDocType="collection"
        title="Collections"
      />
      {areDocCollections ? <DocCollectionsList /> : null}
      <DocCollectionsInputSelectCombo />
    </>
  );
};
