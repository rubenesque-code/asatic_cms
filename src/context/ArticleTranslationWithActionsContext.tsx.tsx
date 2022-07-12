import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateSummary as updateSummaryAction } from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslation } from "^types/article";

type Actions = {
  updateSummary: (props: UpdateSummaryProps) => void;
};
type ContextValue = [translation: ArticleTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

type UpdateSummaryProps = Omit<
  Parameters<typeof updateSummaryAction>[0],
  "id" | "translationId"
>;

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

  const updateSummary = (props: UpdateSummaryProps) =>
    dispatch(updateSummaryAction({ id: articleId, translationId, ...props }));

  const value = [translation, { updateSummary }] as ContextValue;

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
