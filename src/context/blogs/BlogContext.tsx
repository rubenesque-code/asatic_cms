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
  updateLandingCustomSectionImageAspectRatio,
  updateLandingCustomSectionImageVertPosition,
  updateLandingImageSrc,
  toggleUseLandingImage,
} from "^redux/state/blogs";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";
import { OmitFromMethods } from "^types/utilities";

import { Blog } from "^types/blog";
import { useRouter } from "next/router";
import { ROUTES } from "^constants/routes";
import { DisplayContentStatus } from "^types/display-content";
import { selectBlogStatus } from "^redux/state/complex-selectors/blogs";

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
  updateLandingCustomSectionImageAspectRatio,
  updateLandingCustomSectionImageVertPosition,
  updateLandingImageSrc,
  toggleUseLandingImage,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};
type ContextValue = [
  blog: Blog & { languagesIds: string[]; status: DisplayContentStatus },
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

BlogSlice.Provider = function BlogProvider({
  blog,
  children,
}: {
  blog: Blog;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = blog;
  const languagesIds = mapLanguageIds(translations);

  const status = useSelector((state) => selectBlogStatus(state, blog));

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
    updateLandingCustomSectionImageAspectRatio: (args) =>
      dispatch(updateLandingCustomSectionImageAspectRatio({ id, ...args })),
    updateLandingCustomSectionImageVertPosition: (args) =>
      dispatch(updateLandingCustomSectionImageVertPosition({ id, ...args })),
    updateLandingImageSrc: (args) =>
      dispatch(updateLandingImageSrc({ id, ...args })),
    toggleUseLandingImage: () => dispatch(toggleUseLandingImage({ id })),
    routeToEditPage: () => router.push(`/${ROUTES.BLOGS}/${id}`),
  };

  return (
    <Context.Provider value={[{ ...blog, languagesIds, status }, actions]}>
      {typeof children === "function"
        ? children([{ ...blog, languagesIds, status }, actions])
        : children}
    </Context.Provider>
  );
};

BlogSlice.useContext = function useBlogContext() {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useBlogContext must be used within its provider!");
  }
  return context;
};
