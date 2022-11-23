import { ReactElement } from "react";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { Article } from "^types/article";

import { EntityLanguageProvider } from "^context/EntityLanguages";

const ArticleProvidersWithOwnLanguages = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  return (
    <ArticleSlice.Provider article={article}>
      {([{ id: articleId, languagesIds, translations }]) => (
        <EntityLanguageProvider entity={{ languagesIds }}>
          {({ activeLanguageId }) => (
            <ArticleTranslationSlice.Provider
              articleId={articleId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </ArticleTranslationSlice.Provider>
          )}
        </EntityLanguageProvider>
      )}
    </ArticleSlice.Provider>
  );
};

export default ArticleProvidersWithOwnLanguages;
