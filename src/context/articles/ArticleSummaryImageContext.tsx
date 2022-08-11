import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { Article } from "^types/article";

type ContextValue = [article: Article];
const Context = createContext<ContextValue>([{}] as ContextValue);

const ArticleProvider = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  const value = [article] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useArticleContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error("useArticleContext must be used within its provider!");
  }
  return context;
};

export { ArticleProvider, useArticleContext };
