import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  toggleUseSummaryImage,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSaveDate,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  addRelatedEntity,
  removeRelatedEntity,
} from "^redux/state/blogs";
import { selectArticleLikeStatus } from "^redux/state/complex-selectors/article-like";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { ROUTES } from "^constants/routes";

import { Blog } from "^types/blog";
import { OmitFromMethods } from "^types/utilities";
import { ArticleLikeStatus } from "^types/article-like-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  toggleUseSummaryImage,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSaveDate,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  addRelatedEntity,
  removeRelatedEntity,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};

export type ContextValue = [
  blog: Blog & {
    languagesIds: string[];
    status: ArticleLikeStatus;
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

  const status = useSelector((state) => selectArticleLikeStatus(state, blog));

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addRelatedEntity: (args) => dispatch(addRelatedEntity({ id, ...args })),
    removeRelatedEntity: (args) =>
      dispatch(removeRelatedEntity({ id, ...args })),
    addTranslation: ({ languageId }) =>
      dispatch(addTranslation({ id, languageId })),
    removeOne: () => dispatch(removeOne({ id })),
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
    routeToEditPage: () => router.push(`${ROUTES.BLOGS.route}/${id}`),
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
