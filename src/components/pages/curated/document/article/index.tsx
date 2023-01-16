import { useSelector } from "^redux/hooks";
import { selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ArticleProvidersWithOwnLanguages from "^components/_containers/articles/ProvidersWithOwnLanguages";
import StickyCanvas_ from "^components/pages/curated/document/_containers/StickyCanvas_";
import Header from "./Header";
import Document from "./document";
import { $PageContainer, $EntityTypeWatermark } from "../_styles/$page";

const ArticlePage = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectArticleById(state, articleId))!;

  return (
    <$PageContainer>
      <ArticleProvidersWithOwnLanguages article={article}>
        <>
          <Header />
          <StickyCanvas_>
            <>
              <Document />
              <$EntityTypeWatermark>Article</$EntityTypeWatermark>
            </>
          </StickyCanvas_>
        </>
      </ArticleProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default ArticlePage;
