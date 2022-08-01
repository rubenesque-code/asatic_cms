import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateSummary as updateSummaryAction,
  updateTitle as updateTitleAction,
  addBodySection as addBodySectionAction,
  reorderBody as reorderBodyAction,
  deleteBodySection as deleteBodySectionAction,
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
type AddBodySectionArgs = ActionPayloadNoIdNorTranslationId<
  typeof addBodySectionAction
>;
type ReorderSectionBodyArgs = ActionPayloadNoIdNorTranslationId<
  typeof reorderBodyAction
>;
type DeleteBodySectionArgs = ActionPayloadNoIdNorTranslationId<
  typeof deleteBodySectionAction
>;

type Actions = {
  updateSummary: ActionWithArg<UpdateSummaryArgs>;
  updateTitle: ActionWithArg<UpdateTitleArgs>;
  addBodySection: ActionWithArg<AddBodySectionArgs>;
  reorderBody: ActionWithArg<ReorderSectionBodyArgs>;
  deleteBodySection: ActionWithArg<DeleteBodySectionArgs>;
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

  const sharedArgs = {
    id: articleId,
    translationId,
  };

  const updateSummary = (args: UpdateSummaryArgs) =>
    dispatch(updateSummaryAction({ ...sharedArgs, ...args }));

  const updateTitle = (args: UpdateTitleArgs) =>
    dispatch(updateTitleAction({ ...sharedArgs, ...args }));

  const addBodySection = (args: AddBodySectionArgs) =>
    dispatch(addBodySectionAction({ ...sharedArgs, ...args }));

  const reorderBody = (args: ReorderSectionBodyArgs) =>
    dispatch(reorderBodyAction({ ...sharedArgs, ...args }));

  const deleteBodySection = (args: DeleteBodySectionArgs) =>
    dispatch(deleteBodySectionAction({ ...sharedArgs, ...args }));

  const value = [
    translation,
    {
      updateSummary,
      updateTitle,
      addBodySection,
      reorderBody,
      deleteBodySection,
    },
  ] as ContextValue;

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
