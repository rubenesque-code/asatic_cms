import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addBodySection,
  moveSection,
  removeBodySection,
  removeTranslation,
  updateTitle,
  updateSummary,
  addFootnote,
  deleteFootnote,
  updateFootnoteNumber,
  updateFootnoteText,
} from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { ArticleLikeTranslation as BlogTranslation } from "^types/article-like-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogTranslationSlice() {}

const actionsInitial = {
  addBodySection,
  moveSection,
  removeBodySection,
  removeTranslation,
  updateTitle,
  updateSummary,
  addFootnote,
  deleteFootnote,
  updateFootnoteNumber,
  updateFootnoteText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: BlogTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

BlogTranslationSlice.Provider = function BlogTranslationProvider({
  children,
  translation,
  blogId,
}: {
  children: ReactElement;
  translation: BlogTranslation;
  blogId: string;
}) {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: blogId,
    translationId,
  };

  const actions: Actions = {
    addBodySection: (args) =>
      dispatch(addBodySection({ ...sharedArgs, ...args })),
    removeBodySection: (args) =>
      dispatch(removeBodySection({ ...sharedArgs, ...args })),
    removeTranslation: () => dispatch(removeTranslation({ ...sharedArgs })),
    moveSection: (args) => dispatch(moveSection({ ...sharedArgs, ...args })),
    updateTitle: (args) => dispatch(updateTitle({ ...sharedArgs, ...args })),
    updateSummary: (args) =>
      dispatch(updateSummary({ ...sharedArgs, ...args })),
    addFootnote: (args) => dispatch(addFootnote({ ...sharedArgs, ...args })),
    deleteFootnote: (args) =>
      dispatch(deleteFootnote({ ...sharedArgs, ...args })),
    updateFootnoteNumber: (args) =>
      dispatch(updateFootnoteNumber({ ...sharedArgs, ...args })),
    updateFootnoteText: (args) =>
      dispatch(updateFootnoteText({ ...sharedArgs, ...args })),
  };

  const value = [translation, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

BlogTranslationSlice.useContext = function useBlogTranslationContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogTranslationContext must be used within its provider!"
    );
  }
  return context;
};
