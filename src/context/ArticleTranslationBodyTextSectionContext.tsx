import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateBodyTextContent as updateBodyTextContentAction } from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslationBodyTextSection } from "^types/article";
import {
  // ActionPayloadNoIdNorTranslationId,
  ActionWithArg,
} from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitArgs<T extends (...args: any) => any> = Omit<
  Parameters<T>[0],
  "id" | "translationId" | "sectionId"
>;

type UpdateTextArgs = OmitArgs<typeof updateBodyTextContentAction>;

type Actions = {
  updateText: ActionWithArg<UpdateTextArgs>;
};

type ContextValue = [
  section: ArticleTranslationBodyTextSection,
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleTranslationBodyTextSectionProvider = ({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: ArticleTranslationBodyTextSection;
}) => {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const updateText = (args: UpdateTextArgs) =>
    dispatch(
      updateBodyTextContentAction({
        id: articleId,
        translationId,
        sectionId,
        ...args,
      })
    );

  const value = [section, { updateText }] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleTranslationBodyTextSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationBodyTextSectionContext must be used within its provider!"
    );
  }
  return context;
};

export {
  ArticleTranslationBodyTextSectionProvider,
  useArticleTranslationBodyTextSectionContext,
};
