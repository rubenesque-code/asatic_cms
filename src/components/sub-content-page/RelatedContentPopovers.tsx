import { Article as ArticleIcon } from "phosphor-react";
import { ContentMenuButton } from "^components/menus/Content";
import WithRelatedContent from "^components/WithRelatedContent";
import useFilterArticlesByUse from "^hooks/data/useFilterArticlesByUse";

const RelatedContentPopovers = ({ contentType }: { contentType: string }) => {
  return (
    <>
      <ArticlesPopover contentType={contentType} />
    </>
  );
};

export default RelatedContentPopovers;

const ArticlesPopover = ({
  contentType,
  contentId,
  contentField,
}: {
  contentType: string;
  contentId: string;
  contentField: string;
}) => {
  const contentArticles = useFilterArticlesByUse(contentField, contentId);

  return (
    <WithRelatedContent
      contentType={contentType}
      relatedContent={}
      relatedContentType=""
    >
      <ContentMenuButton tooltipProps={{ text: "articles" }}>
        <ArticleIcon />
      </ContentMenuButton>
    </WithRelatedContent>
  );
};
