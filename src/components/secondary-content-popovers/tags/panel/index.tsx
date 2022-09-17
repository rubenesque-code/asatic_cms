import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import PanelUI from "../../PanelUI";
import DocTagsList from "./List";
import DocTagsInputSelectCombo from "./InputSelectCombo";

export default function DocTagsPanel(props: PanelContextValue) {
  return (
    <PanelUI>
      <DocTagsPanel.Provider {...props}>
        <DocTagsPanel.Content />
      </DocTagsPanel.Provider>
    </PanelUI>
  );
}

type PanelContextValue = {
  docTagsIds: string[];
  docType: string;
  addTagToDoc: (tagId: string) => void;
  removeTagFromDoc: (tagId: string) => void;
};

const ComponentContext = createContext<PanelContextValue>(
  {} as PanelContextValue
);

DocTagsPanel.Provider = function PanelProvider({
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

DocTagsPanel.useContext = function useDocTagsPanelContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useDocTagsPanelContext must be used within its provider!");
  }
  return context;
};

DocTagsPanel.Content = function Content() {
  const { docTagsIds, docType } = DocTagsPanel.useContext();
  const areDocTags = Boolean(docTagsIds.length);

  return (
    <>
      <PanelUI.DescriptionSkeleton
        areSubDocs={areDocTags}
        description="
        Tags allow all documents, such as articles and videos, to be narrowly
        categorised on the website, mainly for search purposes. They can be
        broad, e.g. politics, or narrow, e.g. oil. Documents can have
        many tags.
        "
        docType={docType}
        subDocType="tag"
        title="Tags"
      />
      {areDocTags ? <DocTagsList /> : null}
      <DocTagsInputSelectCombo />
    </>
  );
};
