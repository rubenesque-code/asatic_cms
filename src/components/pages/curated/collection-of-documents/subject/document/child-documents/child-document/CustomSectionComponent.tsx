import { ReactElement } from "react";
import tw from "twin.macro";

import { Article } from "^types/article";
import { Blog } from "^types/blog";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleSummary from "./Article";
import ArticleProvidersWithOwnLanguages from "^components/_containers/articles/ProvidersWithOwnLanguages";

const CustomSectionComponent = ({
  entity,
  showImage,
  span,
}: {
  entity: Article | Blog;
  showImage?: boolean;
  span: 1 | 2;
}) => {
  return entity.type === "article" ? (
    <ArticleProvidersWithOwnLanguages article={entity}>
      <ArticleSummary showImage={showImage} span={span} />
    </ArticleProvidersWithOwnLanguages>
  ) : (
    <div>Blog</div>
  );
  /*     <$EntityContainer_>
      {(containerIsHovered) => (
        <>
          {entity.type === "article" ? (
            <ArticleProvidersWithOwnLanguages article={entity}>
              <ArticleSummary showImage={showImage} span={span} />
            </ArticleProvidersWithOwnLanguages>
          ) : (
            <div>Blog</div>
          )}
        </>
      )}
    </$EntityContainer_> */
};

export default CustomSectionComponent;

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
