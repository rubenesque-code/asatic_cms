import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateSummaryImageAspectRatio as updateSummaryImageAspectRatioAction,
  updateSummaryImageVertPosition as updateSummaryImageVertPositionAction,
  updateSummaryImageSrc as updateSummaryImageSrcAction,
  toggleUseSummaryImage as toggleUseSummaryImageAction,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { Article } from "^types/article";

type UpdateSummaryImageAspectRatioArgs = Omit<
  Parameters<typeof updateSummaryImageAspectRatioAction>[0],
  "id"
>;
type UpdateSummaryImageVertPositionArgs = Omit<
  Parameters<typeof updateSummaryImageVertPositionAction>[0],
  "id"
>;
type UpdateSummaryImageSrcArgs = Omit<
  Parameters<typeof updateSummaryImageSrcAction>[0],
  "id"
>;

type Actions = {
  updateSummaryImageAspectRatio: (
    args: UpdateSummaryImageAspectRatioArgs
  ) => void;
  updateSummaryImageVertPosition: (
    args: UpdateSummaryImageVertPositionArgs
  ) => void;
  updateSummaryImageSrc: (args: UpdateSummaryImageSrcArgs) => void;
  toggleUseSummaryImage: () => void;
};

type ArticleContextValue = [article: Article, actions: Actions];
const ArticleContext = createContext<ArticleContextValue>([
  {},
  {},
] as ArticleContextValue);

const ArticleProvider = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  const { id } = article;

  const dispatch = useDispatch();

  const updateSummaryImageAspectRatio = (
    args: UpdateSummaryImageAspectRatioArgs
  ) => dispatch(updateSummaryImageAspectRatioAction({ id, ...args }));

  const updateSummaryImageVertPosition = (
    args: UpdateSummaryImageVertPositionArgs
  ) => dispatch(updateSummaryImageVertPositionAction({ id, ...args }));

  const updateSummaryImageSrc = (args: UpdateSummaryImageSrcArgs) =>
    dispatch(updateSummaryImageSrcAction({ id, ...args }));

  const toggleUseSummaryImage = () =>
    dispatch(toggleUseSummaryImageAction({ id }));

  const value = [
    article,
    {
      updateSummaryImageAspectRatio,
      updateSummaryImageVertPosition,
      updateSummaryImageSrc,
      toggleUseSummaryImage,
    },
  ] as ArticleContextValue;

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
};

const useArticleContext = () => {
  const context = useContext(ArticleContext);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error("useArticleContext must be used within its provider!");
  }
  return context;
};

export { ArticleProvider, useArticleContext };
