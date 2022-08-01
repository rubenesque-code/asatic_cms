import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateSummary,
  updateTitle,
  addBodySection,
  reorderBody,
  deleteBodySection,
  deleteTranslation,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslation } from "^types/article";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addBodySection,
  deleteBodySection,
  deleteTranslation,
  reorderBody,
  updateSummary,
  updateTitle,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: ArticleTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleTranslationProvider = ({
  children,
  translation,
  articleId,
}: {
  children: ReactElement;
  translation: ArticleTranslation;
  articleId: string;
}) => {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: articleId,
    translationId,
  };

  const actions: Actions = {
    addBodySection: (args) =>
      dispatch(addBodySection({ ...sharedArgs, ...args })),
    deleteBodySection: (args) =>
      dispatch(deleteBodySection({ ...sharedArgs, ...args })),
    deleteTranslation: () => dispatch(deleteTranslation({ ...sharedArgs })),
    reorderBody: (args) => dispatch(reorderBody({ ...sharedArgs, ...args })),
    updateSummary: (args) =>
      dispatch(updateSummary({ ...sharedArgs, ...args })),
    updateTitle: (args) => dispatch(updateTitle({ ...sharedArgs, ...args })),
  };

  const value = [translation, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleTranslationContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { ArticleTranslationProvider, useArticleTranslationContext };
