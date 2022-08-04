import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyImageAspectRatio,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyImageCaption,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleImageSection } from "^types/article";
import { OmitFromMethods } from "^types/utilities";

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

type ContextValue = [section: ArticleImageSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleImageSectionProvider = ({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: ArticleImageSection;
}) => {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: articleId,
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

const useArticleImageSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleImageSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { ArticleImageSectionProvider, useArticleImageSectionContext };
