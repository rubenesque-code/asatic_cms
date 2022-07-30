import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addAuthor,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeSubject,
  removeTag,
  togglePublishStatus,
  toggleUseSummaryImage,
  updateSummaryImageAspectRatio,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";
import { OmitFromMethods } from "^types/utilities";

import { Article } from "^types/article";

const actionsInitial = {
  addAuthor,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeSubject,
  removeTag,
  togglePublishStatus,
  toggleUseSummaryImage,
  updateSummaryImageAspectRatio,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

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

  const actions: Actions = {
    addAuthor: ({ authorId }) => dispatch(addAuthor({ id, authorId })),
    addSubject: ({ subjectId }) => dispatch(addSubject({ id, subjectId })),
    addTag: ({ tagId }) => dispatch(addTag({ id, tagId })),
    addTranslation: ({ languageId }) =>
      dispatch(addTranslation({ id, languageId })),
    removeAuthor: ({ authorId }) => dispatch(removeAuthor({ authorId, id })),
    removeSubject: ({ subjectId }) =>
      dispatch(removeSubject({ id, subjectId })),
    removeTag: ({ tagId }) => dispatch(removeTag({ id, tagId })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    toggleUseSummaryImage: () => dispatch(toggleUseSummaryImage({ id })),
    updateSummaryImageAspectRatio: ({ aspectRatio }) =>
      dispatch(updateSummaryImageAspectRatio({ aspectRatio, id })),
    updateSummaryImageSrc: ({ imgId }) =>
      dispatch(updateSummaryImageSrc({ id, imgId })),
    updateSummaryImageVertPosition: ({ vertPosition }) =>
      dispatch(updateSummaryImageVertPosition({ id, vertPosition })),
  };

  const value = [article, actions] as ArticleContextValue;

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
