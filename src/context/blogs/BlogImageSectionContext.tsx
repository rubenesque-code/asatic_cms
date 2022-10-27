import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyImageAspectRatio,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyImageCaption,
} from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";

import { ArticleLikeImageSection } from "^types/article-like-entity";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogImageSectionSlice() {}

const actionsInitial = {
  updateBodyImageAspectRatio,
  updateBodyImageCaption,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: ArticleLikeImageSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

BlogImageSectionSlice.Provider = function BlogImageSectionProvider({
  children,
  translationId,
  blogId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  blogId: string;
  section: ArticleLikeImageSection;
}) {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: blogId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const actions: Actions = {
    updateBodyImageAspectRatio: (args) =>
      dispatch(updateBodyImageAspectRatio({ ...sharedArgs, ...args })),
    updateBodyImageCaption: (args) =>
      dispatch(updateBodyImageCaption({ ...sharedArgs, ...args })),
    updateBodyImageSrc: (args) =>
      dispatch(updateBodyImageSrc({ ...sharedArgs, ...args })),
    updateBodyImageVertPosition: (args) =>
      dispatch(updateBodyImageVertPosition({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

BlogImageSectionSlice.useContext = function useBlogImageSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogImageSectionContext must be used within its provider!"
    );
  }
  return context;
};
