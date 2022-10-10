import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticleById as selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ArticleProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";

import ContainersUI from "^components/article-like/entity-page/ContainersUI";
import Canvas from "^components/article-like/entity-page/Canvas";
import { ArticleTypeWatermark } from "^components/display-entity/entity-page/styles";

import Header from "./Header";
import Article from "./article";

const ArticlePageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <ArticleProviders>
        <>
          <Header />
          <Canvas>
            <>
              {<Article />}
              <ArticleTypeWatermark>Article</ArticleTypeWatermark>
            </>
          </Canvas>
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
