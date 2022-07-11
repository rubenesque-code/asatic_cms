import { createContext, ReactElement, useContext } from "react";
import { ArticleTranslation } from "^types/article";

type ArticleTranslationContextValue = {
  translation: ArticleTranslation;
};
const ArticleTranslationContext = createContext<ArticleTranslationContextValue>(
  {} as ArticleTranslationContextValue
);

const ArticleTranslationProvider = ({
  children,
  translation,
}: {
  children: ReactElement;
  translation: ArticleTranslation;
}) => {
  return (
    <ArticleTranslationContext.Provider
      value={{
        translation,
      }}
    >
      {children}
    </ArticleTranslationContext.Provider>
  );
};

const useArticleTranslationContext = () => {
  const context = useContext(ArticleTranslationContext);
  if (context === undefined) {
    throw new Error(
      "useArticleTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { ArticleTranslationProvider, useArticleTranslationContext };
