import { ReactElement } from "react";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { Article } from "^types/article";

import DocLanguages from "^components/DocLanguages";

const ArticleProviders = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  return (
    <ArticleSlice.Provider article={article}>
      {([{ id: articleId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
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
        </DocLanguages.Provider>
      )}
    </ArticleSlice.Provider>
  );
};

export default ArticleProviders;
