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
  updatePublishDate,
} from "^redux/state/blogs";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";
import { OmitFromMethods } from "^types/utilities";

import { Blog } from "^types/blog";
import { useRouter } from "next/router";
import { ROUTES } from "^constants/routes";

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
  updatePublishDate,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};
type ContextValue = [
  blog: Blog & { languagesById: string[] },
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const BlogProvider = ({
  blog,
  children,
}: {
  blog: Blog;
  children: ReactElement;
}) => {
  const { id, translations } = blog;
  const languagesById = mapLanguageIds(translations);

  const dispatch = useDispatch();
  const router = useRouter();

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
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.BLOGS}/${id}`),
  };

  return (
    <Context.Provider value={[{ ...blog, languagesById }, actions]}>
      {children}
    </Context.Provider>
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
