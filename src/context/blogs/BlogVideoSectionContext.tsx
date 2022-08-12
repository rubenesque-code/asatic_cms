import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyVideoCaption,
  updateBodyVideoSrc,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleLikeContentVideoSection } from "^types/article-like-primary-content";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  updateBodyVideoCaption,
  updateBodyVideoSrc,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: ArticleLikeContentVideoSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const BlogVideoSectionProvider = ({
  children,
  translationId,
  blogId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  blogId: string;
  section: ArticleLikeContentVideoSection;
}) => {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: blogId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const actions: Actions = {
    updateBodyVideoCaption: (args) =>
      dispatch(updateBodyVideoCaption({ ...sharedArgs, ...args })),
    updateBodyVideoSrc: (args) =>
      dispatch(updateBodyVideoSrc({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useBlogVideoSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogVideoSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { BlogVideoSectionProvider, useBlogVideoSectionContext };
