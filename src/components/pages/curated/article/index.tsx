import { useDeleteArticleMutation } from "^redux/services/articles";

import { useSelector } from "^redux/hooks";
import { selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import ArticleProvidersWithOwnLanguages from "^components/_containers/articles/ProvidersWithOwnLanguages";
import { $PageContainer, $EntityTypeWatermark } from "../_styles";
import StickyCanvas_ from "../_containers/StickyCanvas_";
import Header from "./Header";
// import Article from "./article";

const ArticlePage = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectArticleById(state, articleId))!;

  const deleteMutation = useDeleteArticleMutation();

  return (
    <$PageContainer>
      <ArticleProvidersWithOwnLanguages article={article}>
        <DeleteMutationProvider mutation={deleteMutation}>
          <>
            <Header />
            <StickyCanvas_>
              <>
                {/* <Article /> */}
                <$EntityTypeWatermark>Article</$EntityTypeWatermark>
              </>
            </StickyCanvas_>
          </>
        </DeleteMutationProvider>
      </ArticleProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default ArticlePage;
