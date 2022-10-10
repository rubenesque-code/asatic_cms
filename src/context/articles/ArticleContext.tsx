import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addAuthor,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeCollection,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  toggleUseSummaryImage,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSaveDate,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
} from "^redux/state/articles";
import { selectArticleLikeStatus } from "^redux/state/complex-selectors/article-like";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { ROUTES } from "^constants/routes";

import { Article } from "^types/article";
import { PrimaryEntityStatus } from "^types/primary-entity";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticleSlice() {}

const actionsInitial = {
  addAuthor,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeCollection,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  toggleUseSummaryImage,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSaveDate,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};

export type ContextValue = [
  article: Article & {
    languagesIds: string[];
    status: PrimaryEntityStatus;
  },
  actions: Actions
];
const ArticleContext = createContext<ContextValue>([{}, {}] as ContextValue);

ArticleSlice.Provider = function ArticleProvider({
  article,
  children,
}: {
  article: Article;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = article;
  const languagesIds = mapLanguageIds(translations);

  const status = useSelector((state) =>
    selectArticleLikeStatus(state, article)
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addAuthor: ({ authorId }) => dispatch(addAuthor({ id, authorId })),
    addCollection: (args) => dispatch(addCollection({ id, ...args })),
    addSubject: ({ subjectId }) => dispatch(addSubject({ id, subjectId })),
    addTag: ({ tagId }) => dispatch(addTag({ id, tagId })),
    addTranslation: ({ languageId }) =>
      dispatch(addTranslation({ id, languageId })),
    removeAuthor: ({ authorId }) => dispatch(removeAuthor({ authorId, id })),
    removeCollection: (args) => dispatch(removeCollection({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    removeSubject: ({ subjectId }) =>
      dispatch(removeSubject({ id, subjectId })),
    removeTag: ({ tagId }) => dispatch(removeTag({ id, tagId })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    toggleUseSummaryImage: () => dispatch(toggleUseSummaryImage({ id })),
    updateLandingCustomImageAspectRatio: (args) =>
      dispatch(updateLandingCustomImageAspectRatio({ id, ...args })),
    updateLandingCustomImageVertPosition: (args) =>
      dispatch(updateLandingCustomImageVertPosition({ id, ...args })),
    updateSaveDate: (args) => dispatch(updateSaveDate({ id, ...args })),
    updateSummaryImageSrc: (args) =>
      dispatch(updateSummaryImageSrc({ id, ...args })),
    updateSummaryImageVertPosition: (args) =>
      dispatch(updateSummaryImageVertPosition({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.ARTICLES.route}/${id}`),
  };

  return (
    <ArticleContext.Provider
      value={[{ ...article, languagesIds, status }, actions]}
    >
      {typeof children === "function"
        ? children([{ ...article, languagesIds, status }, actions])
        : children}
    </ArticleContext.Provider>
  );
};

ArticleSlice.useContext = function useArticleContext() {
  const context = useContext(ArticleContext);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useArticleContext must be used within its provider!");
  }
  return context;
};
