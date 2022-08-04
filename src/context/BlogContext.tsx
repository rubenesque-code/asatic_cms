import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addAuthor,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  deleteTranslation,
  removeAuthor,
  removeCollection,
  removeSubject,
  removeTag,
  togglePublishStatus,
  toggleUseSummaryImage,
  updateSummaryImageAspectRatio,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
} from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";
import { OmitFromMethods } from "^types/utilities";

import { Blog } from "^types/blog";

const actionsInitial = {
  addAuthor,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  deleteTranslation,
  removeAuthor,
  removeCollection,
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

type ContextValue = [blog: Blog, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const BlogProvider = ({
  blog,
  children,
}: {
  blog: Blog;
  children: ReactElement;
}) => {
  const { id } = blog;

  const dispatch = useDispatch();

  const actions: Actions = {
    addAuthor: ({ authorId }) => dispatch(addAuthor({ id, authorId })),
    addCollection: (args) => dispatch(addCollection({ id, ...args })),
    addSubject: ({ subjectId }) => dispatch(addSubject({ id, subjectId })),
    addTag: ({ tagId }) => dispatch(addTag({ id, tagId })),
    addTranslation: ({ languageId }) =>
      dispatch(addTranslation({ id, languageId })),
    deleteTranslation: (args) => dispatch(deleteTranslation({ id, ...args })),
    removeAuthor: ({ authorId }) => dispatch(removeAuthor({ authorId, id })),
    removeCollection: (args) => dispatch(removeCollection({ id, ...args })),
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

  return (
    <Context.Provider value={[blog, actions]}>{children}</Context.Provider>
  );
};

const useBlogContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useBlogContext must be used within its provider!");
  }
  return context;
};

export { BlogProvider, useBlogContext };
