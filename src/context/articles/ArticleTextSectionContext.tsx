import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyText,
  addFootnote,
  deleteFootnote,
  updateFootnoteNumber,
  updateFootnoteText,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { TextSection } from "^types/article-like-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticleTextSectionSlice() {}

const actionsInitial = {
  updateBodyText,
  addFootnote,
  deleteFootnote,
  updateFootnoteNumber,
  updateFootnoteText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: TextSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

ArticleTextSectionSlice.Provider = function ArticleTextSectionProvider({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: TextSection;
}) {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: articleId,
    translationId,
    sectionId,
  };

  const actions: Actions = {
    updateBodyText: (args) =>
      dispatch(updateBodyText({ ...sharedArgs, ...args })),
    addFootnote: (args) => dispatch(addFootnote({ ...sharedArgs, ...args })),
    deleteFootnote: (args) =>
      dispatch(deleteFootnote({ ...sharedArgs, ...args })),
    updateFootnoteNumber: (args) =>
      dispatch(updateFootnoteNumber({ ...sharedArgs, ...args })),
    updateFootnoteText: (args) =>
      dispatch(updateFootnoteText({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

ArticleTextSectionSlice.useContext = function useArticleTextSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTextSectionContext must be used within its provider!"
    );
  }
  return context;
};
