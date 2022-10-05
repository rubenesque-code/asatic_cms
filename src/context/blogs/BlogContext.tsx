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
} from "^redux/state/blogs";
// todo: status should be same for all primary content? apart from translation of article-like vs recorded-event
import { selectArticleStatus } from "^redux/state/complex-selectors/blogs";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { ROUTES } from "^constants/routes";

import { Blog } from "^types/blog";
import { PrimaryEntityStatus } from "^types/primary-entity";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogSlice() {}

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
  blog: Blog & {
    languagesIds: string[];
    status: PrimaryEntityStatus;
  },
  actions: Actions
];
const BlogContext = createContext<ContextValue>([{}, {}] as ContextValue);

BlogSlice.Provider = function BlogProvider({
  blog,
  children,
}: {
  blog: Blog;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = blog;
  const languagesIds = mapLanguageIds(translations);

  const status = useSelector((state) => selectArticleStatus(state, blog));

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
    routeToEditPage: () => router.push(`/${ROUTES.BLOGS}/${id}`),
  };

  return (
    <BlogContext.Provider value={[{ ...blog, languagesIds, status }, actions]}>
      {typeof children === "function"
        ? children([{ ...blog, languagesIds, status }, actions])
        : children}
    </BlogContext.Provider>
  );
};

BlogSlice.useContext = function useBlogContext() {
  const context = useContext(BlogContext);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useBlogContext must be used within its provider!");
  }
  return context;
};
