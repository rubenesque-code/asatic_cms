import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateSummary as updateSummaryAction,
  updateTitle as updateTitleAction,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslation } from "^types/article";
import {
  ActionPayloadNoIdNorTranslationId,
  ActionWithArg,
} from "^types/utilities";

type UpdateSummaryArgs = ActionPayloadNoIdNorTranslationId<
  typeof updateSummaryAction
>;
type UpdateTitleArgs = ActionPayloadNoIdNorTranslationId<
  typeof updateTitleAction
>;

type Actions = {
  updateSummary: ActionWithArg<UpdateSummaryArgs>;
  updateTitle: ActionWithArg<UpdateTitleArgs>;
};

type ContextValue = [translation: ArticleTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleTranslationWithActionsProvider = ({
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

  const updateSummary = (args: UpdateSummaryArgs) =>
    dispatch(updateSummaryAction({ id: articleId, translationId, ...args }));

  const updateTitle = (args: UpdateTitleArgs) =>
    dispatch(updateTitleAction({ id: articleId, translationId, ...args }));

  const value = [translation, { updateSummary, updateTitle }] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleTranslationWithActionsContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationWithActionsContext must be used within its provider!"
    );
  }
  return context;
};

export {
  ArticleTranslationWithActionsProvider,
  useArticleTranslationWithActionsContext,
};
