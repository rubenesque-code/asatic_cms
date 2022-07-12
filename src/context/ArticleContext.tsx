import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { Article } from "^types/article";

type ArticleContextValue = [article: Article];
const ArticleContext = createContext<ArticleContextValue>([
  {},
] as ArticleContextValue);

const ArticleProvider = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  const value = [article] as ArticleContextValue;

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
