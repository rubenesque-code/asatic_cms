import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateBodyTextContent } from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleLikeContentTextSection } from "^types/article-like-primary-content";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  updateBodyTextContent,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: ArticleLikeContentTextSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleTextSectionProvider = ({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: ArticleLikeContentTextSection;
}) => {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: articleId,
    translationId,
    sectionId,
  };

  const actions: Actions = {
    updateBodyTextContent: (args) =>
      dispatch(updateBodyTextContent({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleTextSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTextSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { ArticleTextSectionProvider, useArticleTextSectionContext };
