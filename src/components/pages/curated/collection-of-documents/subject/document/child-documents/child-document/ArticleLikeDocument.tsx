import { ReactElement } from "react";
import tw from "twin.macro";

import { Article } from "^types/article";
import { Blog } from "^types/blog";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleSummary from "^curated-pages/collection-of-documents/_components/ArticleSummary";
import ArticleProvidersWithOwnLanguages from "^components/_containers/articles/ProvidersWithOwnLanguages";

const ArticleLikeDocument = ({
  articleLikeEntity,
}: {
  articleLikeEntity: Article | Blog;
}) => {
  return (
    <$EntityContainer_>
      {(containerIsHovered) => (
        <>
          {articleLikeEntity.type === "article" ? (
            <ArticleProvidersWithOwnLanguages article={articleLikeEntity}>
              <ArticleSummary
                ignoreDeclaredSpan={false}
                removeComponent={() => null}
                span={2}
                updateComponentSpan={() => null}
              />
            </ArticleProvidersWithOwnLanguages>
          ) : (
            <div>Blog</div>
          )}
        </>
      )}
    </$EntityContainer_>
  );
};

export default ArticleLikeDocument;

const $EntityContainer_ = ({
  children,
}: {
  children: (containerIsHovered: boolean) => ReactElement;
}) => (
  <ContainerUtility.isHovered
    styles={tw`relative p-sm col-span-1 min-h-[100px] border`}
  >
    {(containerIsHovered) => children(containerIsHovered)}
  </ContainerUtility.isHovered>
);
