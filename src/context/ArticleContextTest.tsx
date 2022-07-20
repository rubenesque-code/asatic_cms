import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateSummaryImageAspectRatio,
  updateSummaryImageVertPosition,
  updateSummaryImageSrc,
  toggleUseSummaryImage,
} from "^redux/state/articles";

import { deleteArticle as deleteArticleFromDb } from "^lib/firebase/firestore/write/writeDocs";

import { checkObjectHasField } from "^helpers/general";
import { ActionPayloadNoIdNorTranslationId } from "^types/utilities";

import { Article } from "^types/article";

type Action<T> = (arg: T) => void;

const actionsInitial = {
  updateSummaryImageAspectRatio,
  updateSummaryImageVertPosition,
  updateSummaryImageSrc,
  // toggleUseSummaryImage,
};

type Actions<T> = {
  [K in keyof T]: Action<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ActionPayloadNoIdNorTranslationId<
      T[K] extends (...args: any) => any ? any : any
    >
  >;
  // [K in keyof T]: Action<ActionPayloadNoId<T[K] extends (...args: any) => infer A ? A : never >>
};

type ContextActions = Actions<typeof actionsInitial>;

type x = ContextActions["updateSummaryImageAspectRatio"];
const a: x = {};

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

  const actions = Object.keys(actionsInitial).map((key) => {
    const keyAsserted = key as keyof typeof actionsInitial;
    const action = actionsInitial[keyAsserted];
  });

  const value = [article, {}] as ArticleContextValue;

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
