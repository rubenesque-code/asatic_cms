import { createContext, ReactElement, useContext } from "react";
import { Article } from "^types/article";

type ArticleContextValue = {
  article: Article;
};
const ArticleContext = createContext<ArticleContextValue>(
  {} as ArticleContextValue
);

const ArticleProvider = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  return (
    <ArticleContext.Provider value={{ article }}>
      {children}
    </ArticleContext.Provider>
  );
};

const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticleContext must be used within its provider!");
  }
  return context;
};

export { ArticleProvider, useArticleContext };
