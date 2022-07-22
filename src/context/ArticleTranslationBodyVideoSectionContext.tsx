import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyVideoCaption as updateBodyVideoCaptionAction,
  updateBodyVideoSrc as updateBodyVideoSrcAction,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslationBodyVideoSection } from "^types/article";
import {
  // ActionPayloadNoIdNorTranslationId,
  ActionWithArg,
} from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitArgs<T extends (...args: any) => any> = Omit<
  Parameters<T>[0],
  "id" | "translationId" | "sectionId"
>;

type UpdateSrcArgs = OmitArgs<typeof updateBodyVideoSrcAction>;
type UpdateCaptionArgs = OmitArgs<typeof updateBodyVideoCaptionAction>;

type Actions = {
  updateSrc: ActionWithArg<UpdateSrcArgs>;
  updateCaption: ActionWithArg<UpdateCaptionArgs>;
};

type ContextValue = [
  section: ArticleTranslationBodyVideoSection,
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleTranslationBodyVideoSectionProvider = ({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: ArticleTranslationBodyVideoSection;
}) => {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: articleId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const updateSrc = (args: UpdateSrcArgs) =>
    dispatch(
      updateBodyVideoSrcAction({
        ...sharedArgs,
        ...args,
      })
    );

  const updateCaption = (args: UpdateCaptionArgs) =>
    dispatch(
      updateBodyVideoCaptionAction({
        ...sharedArgs,
        ...args,
      })
    );

  const value = [section, { updateSrc, updateCaption }] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleTranslationBodyVideoSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationBodyVideoSectionContext must be used within its provider!"
    );
  }
  return context;
};

export {
  ArticleTranslationBodyVideoSectionProvider,
  useArticleTranslationBodyVideoSectionContext,
};
