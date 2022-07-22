import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyImageAspectRatio as updateBodyImageAspectRatioAction,
  updateBodyImageSrc as updateBodyImageSrcAction,
  updateBodyImageVertPosition as updateBodyImageVertPositionAction,
  updateBodyImageCaption as updateBodyImageCaptionAction,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslationBodyImageSection } from "^types/article";
import {
  // ActionPayloadNoIdNorTranslationId,
  ActionWithArg,
} from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitArgs<T extends (...args: any) => any> = Omit<
  Parameters<T>[0],
  "id" | "translationId" | "sectionId"
>;

type UpdateAspectRatioArgs = OmitArgs<typeof updateBodyImageAspectRatioAction>;
type UpdateSrcArgs = OmitArgs<typeof updateBodyImageSrcAction>;
type UpdateVertPositionArgs = OmitArgs<
  typeof updateBodyImageVertPositionAction
>;
type UpdateBodyImageCaptionArgs = OmitArgs<typeof updateBodyImageCaptionAction>;

type Actions = {
  updateAspectRatio: ActionWithArg<UpdateAspectRatioArgs>;
  updateSrc: ActionWithArg<UpdateSrcArgs>;
  updateVertPosition: ActionWithArg<UpdateVertPositionArgs>;
  updateCaption: ActionWithArg<UpdateBodyImageCaptionArgs>;
};

type ContextValue = [
  section: ArticleTranslationBodyImageSection,
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const ArticleTranslationBodyImageSectionProvider = ({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: ArticleTranslationBodyImageSection;
}) => {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: articleId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const updateAspectRatio = (args: UpdateAspectRatioArgs) =>
    dispatch(
      updateBodyImageAspectRatioAction({
        ...sharedArgs,
        ...args,
      })
    );

  const updateSrc = (args: UpdateSrcArgs) =>
    dispatch(
      updateBodyImageSrcAction({
        ...sharedArgs,
        ...args,
      })
    );

  const updateVertPosition = (args: UpdateVertPositionArgs) =>
    dispatch(
      updateBodyImageVertPositionAction({
        ...sharedArgs,
        ...args,
      })
    );

  const updateCaption = (args: UpdateBodyImageCaptionArgs) =>
    dispatch(
      updateBodyImageCaptionAction({
        ...sharedArgs,
        ...args,
      })
    );

  const value = [
    section,
    { updateAspectRatio, updateSrc, updateVertPosition, updateCaption },
  ] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleTranslationBodyImageSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationBodyImageSectionContext must be used within its provider!"
    );
  }
  return context;
};

export {
  ArticleTranslationBodyImageSectionProvider,
  useArticleTranslationBodyImageSectionContext,
};
