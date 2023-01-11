import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addBodySection,
  moveSection,
  removeBodySection,
  removeTranslation,
  updateTitle,
  updateSummary,
} from "^redux/state/articles";

import { checkObjectHasField, sortComponents } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { ArticleLikeTranslation as ArticleTranslation } from "^types/article-like-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticleTranslationSlice() {}

const actionsInitial = {
  addBodySection,
  moveSection,
  removeBodySection,
  removeTranslation,
  updateTitle,
  updateSummary,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: ArticleTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

ArticleTranslationSlice.Provider = function ArticleTranslationProvider({
  children,
  translation,
  articleId,
}: {
  children: ReactElement;
  translation: ArticleTranslation;
  articleId: string;
}) {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: articleId,
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
  };

  const bodyOrdered = sortComponents(translation.body);

  return (
    <Context.Provider value={[{ ...translation, body: bodyOrdered }, actions]}>
      {children}
    </Context.Provider>
  );
};

ArticleTranslationSlice.useContext = function useArticleTranslationContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationContext must be used within its provider!"
    );
  }
  return context;
};
