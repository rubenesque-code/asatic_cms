import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslation } from "^types/article";

type ArticleTranslationContextValue = [translation: ArticleTranslation];
const ArticleTranslationContext = createContext<ArticleTranslationContextValue>(
  [{}] as ArticleTranslationContextValue
);

const ArticleTranslationProvider = ({
  children,
  translation,
}: {
  children: ReactElement;
  translation: ArticleTranslation;
}) => {
  const value = [translation] as ArticleTranslationContextValue;

  return (
    <ArticleTranslationContext.Provider value={value}>
      {children}
    </ArticleTranslationContext.Provider>
  );
};

const useArticleTranslationContext = () => {
  const context = useContext(ArticleTranslationContext);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { ArticleTranslationProvider, useArticleTranslationContext };
