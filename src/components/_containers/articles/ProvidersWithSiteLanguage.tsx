import { ReactElement } from "react";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Article } from "^types/article";

import SiteLanguage from "^components/SiteLanguage";

const ArticleProvidersWithSiteLanguages = ({
  article,
  children,
}: {
  article: Article;
  children: ReactElement;
}) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <ArticleSlice.Provider article={article}>
      <ArticleTranslationSlice.Provider
        articleId={article.id}
        translation={selectTranslationForActiveLanguage(
          article.translations,
          siteLanguageId
        )}
      >
        {children}
      </ArticleTranslationSlice.Provider>
    </ArticleSlice.Provider>
  );
};

export default ArticleProvidersWithSiteLanguages;
