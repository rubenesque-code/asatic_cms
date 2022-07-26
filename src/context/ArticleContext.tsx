import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateSummaryImageAspectRatio as updateSummaryImageAspectRatioAction,
  updateSummaryImageVertPosition as updateSummaryImageVertPositionAction,
  updateSummaryImageSrc as updateSummaryImageSrcAction,
  toggleUseSummaryImage as toggleUseSummaryImageAction,
  removeOne as deletArticleAction,
  togglePublishStatus as togglePublishStatusAction,
  deleteTranslation as deleteTranslationAction,
  addTranslation as addTranslationAction,
  removeTag as removeTagAction,
  addTag as addTagAction,
  addAuthor as addAuthorAction,
  removeAuthor as removeAuthorAction,
  removeSubject as removeSubjectAction,
  addSubject as addSubjectAction,
} from "^redux/state/articles";

import { deleteArticle as deleteArticleFromDb } from "^lib/firebase/firestore/write/writeDocs";

import { checkObjectHasField } from "^helpers/general";
import {
  ActionNoArg,
  ActionPayloadNoId,
  ActionWithArg,
} from "^types/utilities";

import { Article } from "^types/article";

type UpdateSummaryImageAspectRatioArgs = ActionPayloadNoId<
  typeof updateSummaryImageAspectRatioAction
>;
type UpdateSummaryImageVertPositionArgs = ActionPayloadNoId<
  typeof updateSummaryImageVertPositionAction
>;
type UpdateSummaryImageSrcArgs = ActionPayloadNoId<
  typeof updateSummaryImageSrcAction
>;
type DeleteTranslationArgs = ActionPayloadNoId<typeof deleteTranslationAction>;
type AddTranslationArgs = ActionPayloadNoId<typeof addTranslationAction>;
type RemoveTagArgs = ActionPayloadNoId<typeof removeTagAction>;
type AddTagArgs = ActionPayloadNoId<typeof addTagAction>;
type RemoveSubjectArgs = ActionPayloadNoId<typeof removeSubjectAction>;
type AddSubjectArgs = ActionPayloadNoId<typeof addSubjectAction>;
type AddAuthorArgs = ActionPayloadNoId<typeof addAuthorAction>;
type RemoveAuthorArgs = ActionPayloadNoId<typeof removeAuthorAction>;

type Actions = {
  updateSummaryImageAspectRatio: ActionWithArg<UpdateSummaryImageAspectRatioArgs>;
  updateSummaryImageVertPosition: ActionWithArg<UpdateSummaryImageVertPositionArgs>;
  updateSummaryImageSrc: ActionWithArg<UpdateSummaryImageSrcArgs>;
  toggleUseSummaryImage: ActionNoArg;
  deleteArticleFromStoreAndDb: ActionNoArg;
  togglePublishStatus: ActionNoArg;
  deleteTranslation: ActionWithArg<DeleteTranslationArgs>;
  addTranslation: ActionWithArg<AddTranslationArgs>;
  removeTag: ActionWithArg<RemoveTagArgs>;
  addTag: ActionWithArg<AddTagArgs>;
  addAuthor: ActionWithArg<AddAuthorArgs>;
  removeAuthor: ActionWithArg<RemoveAuthorArgs>;
  addSubject: ActionWithArg<AddSubjectArgs>;
  removeSubject: ActionWithArg<RemoveSubjectArgs>;
};

type ArticleContextValue = [article: Article, actions: Actions];
const ArticleContext = createContext<ArticleContextValue>([
  {},
  {},
] as ArticleContextValue);

const ArticleProvider = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  const { id } = article;

  const dispatch = useDispatch();

  const updateSummaryImageAspectRatio = (
    args: UpdateSummaryImageAspectRatioArgs
  ) => dispatch(updateSummaryImageAspectRatioAction({ id, ...args }));

  const updateSummaryImageVertPosition = (
    args: UpdateSummaryImageVertPositionArgs
  ) => dispatch(updateSummaryImageVertPositionAction({ id, ...args }));

  const updateSummaryImageSrc = (args: UpdateSummaryImageSrcArgs) =>
    dispatch(updateSummaryImageSrcAction({ id, ...args }));

  const toggleUseSummaryImage = () =>
    dispatch(toggleUseSummaryImageAction({ id }));

  const deleteArticleFromStoreAndDb = async () => {
    dispatch(deletArticleAction({ id }));
    await deleteArticleFromDb(id);
  };

  const togglePublishStatus = () => dispatch(togglePublishStatusAction({ id }));

  const deleteTranslation = (args: DeleteTranslationArgs) =>
    dispatch(deleteTranslationAction({ id, ...args }));

  const addTranslation = (args: AddTranslationArgs) =>
    dispatch(addTranslationAction({ id, ...args }));

  const removeTag = (args: RemoveTagArgs) =>
    dispatch(removeTagAction({ id, ...args }));

  const addTag = (args: AddTagArgs) => dispatch(addTagAction({ id, ...args }));

  const removeSubject = (args: RemoveSubjectArgs) =>
    dispatch(removeSubjectAction({ id, ...args }));

  const addSubject = (args: AddSubjectArgs) =>
    dispatch(addSubjectAction({ id, ...args }));

  const addAuthor = (args: AddAuthorArgs) =>
    dispatch(addAuthorAction({ id, ...args }));

  const removeAuthor = (args: RemoveAuthorArgs) =>
    dispatch(removeAuthorAction({ id, ...args }));

  const value = [
    article,
    {
      updateSummaryImageAspectRatio,
      updateSummaryImageVertPosition,
      updateSummaryImageSrc,
      toggleUseSummaryImage,
      deleteArticleFromStoreAndDb,
      togglePublishStatus,
      deleteTranslation,
      addTranslation,
      removeTag,
      addTag,
      addAuthor,
      removeAuthor,
      addSubject,
      removeSubject,
    },
  ] as ArticleContextValue;

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
};

const useArticleContext = () => {
  const context = useContext(ArticleContext);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error("useArticleContext must be used within its provider!");
  }
  return context;
};

export { ArticleProvider, useArticleContext };
