import { ReactElement } from "react";

import { useDeleteArticleMutation } from "^redux/services/articles";

import { useSelector } from "^redux/hooks";
import { selectArticleById as selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ArticleProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import {
  $PageContainer,
  $EntityTypeWatermark,
} from "^components/display-entity/entity-page/_styles";
import Header from "./Header";
import Article from "./article";
import StickyCanvas_ from "^components/display-entity/entity-page/_containers/StickyCanvas_";

const ArticlePageContent = () => {
  return (
    <$PageContainer>
      <ArticleProviders>
        <MutationProviders>
          <>
            <Header />
            <StickyCanvas_>
              <>
                <Article />
                <$EntityTypeWatermark>Article</$EntityTypeWatermark>
              </>
            </StickyCanvas_>
          </>
        </MutationProviders>
      </ArticleProviders>
    </$PageContainer>
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

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const deleteMutation = useDeleteArticleMutation();

  return (
    <DeleteMutationProvider mutation={deleteMutation}>
      <>{children}</>
    </DeleteMutationProvider>
  );
};
