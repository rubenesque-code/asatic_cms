import { ReactElement } from "react";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { Article } from "^types/article";

import { EntityLanguageProvider } from "^context/EntityLanguages";

const ArticleProvidersWithParentLanguage = ({
  article,
  children,
  parentLanguageId,
}: {
  article: Article;
  children: ReactElement;
  parentLanguageId: string;
}) => {
  return (
    <ArticleSlice.Provider article={article}>
      {([{ id: articleId, languagesIds, translations }]) => (
        <EntityLanguageProvider
          entity={{ languagesIds }}
          parentLanguageId={parentLanguageId}
        >
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

export default ArticleProvidersWithParentLanguage;
