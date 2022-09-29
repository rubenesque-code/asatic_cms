import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticleById as selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import ContainersUI from "./ContainersUI";
import Header from "./Header";
import ArticleBodyEmpty from "./ArticleBodyEmpty";
import ArticleBody from "./ArticleBody";

import ArticleHeader from "./ArticleHeader";
import ArticleProvidersWithTranslationLanguages from "../ArticleProvidersWithTranslationLanguages";

import ArticleUI from "^components/article-like/entity-page/article/UI";

const ArticlePageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <ArticleProviders>
        <>
          <Header />
          <ContainersUI.Canvas>{<Article />}</ContainersUI.Canvas>
        </>
      </ArticleProviders>
    </ContainersUI.ScreenHeight>
  );
};

export default ArticlePageContent;

const ArticleProviders = ({ children }: { children: ReactElement }) => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectArticleById(state, articleId))!;

  return (
    <ArticleProvidersWithTranslationLanguages article={article}>
      {children}
    </ArticleProvidersWithTranslationLanguages>
  );
};

const Article = () => {
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <ArticleUI>
      <>
        <ArticleHeader />
        {body.length ? <ArticleBody /> : <ArticleBodyEmpty />}
      </>
    </ArticleUI>
  );
};
