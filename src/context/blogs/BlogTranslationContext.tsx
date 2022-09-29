import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addBodySection,
  moveSection,
  removeBodySection,
  removeTranslation,
  updateTitle,
  updateLandingAutoSummary,
  updateCollectionSummary,
  updateLandingCustomSummary,
} from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { BlogTranslation } from "^types/blog";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogTranslationSlice() {}

const actionsInitial = {
  addBodySection,
  moveSection,
  removeBodySection,
  removeTranslation,
  updateTitle,
  updateCollectionSummary,
  updateLandingAutoSummary,
  updateLandingCustomSummary,
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
    updateCollectionSummary: (args) =>
      dispatch(updateCollectionSummary({ ...sharedArgs, ...args })),
    updateLandingAutoSummary: (args) =>
      dispatch(updateLandingAutoSummary({ ...sharedArgs, ...args })),
    updateTitle: (args) => dispatch(updateTitle({ ...sharedArgs, ...args })),
    updateLandingCustomSummary: (args) =>
      dispatch(updateLandingCustomSummary({ ...sharedArgs, ...args })),
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
