import { Article } from "^types/article";
import { Blog } from "^types/blog";

import ArticleSummary from "./ArticleSummary";
import BlogSummary from "./Blog";
import ArticleProvidersWithOwnLanguages from "^components/_containers/articles/ProvidersWithOwnLanguages";
import BlogProvidersWithOwnLanguages from "^components/_containers/blogs/ProvidersWithOwnLanguages";

const CustomSectionComponent = ({ entity }: { entity: Article | Blog }) => {
  return entity.type === "article" ? (
    <ArticleProvidersWithOwnLanguages article={entity}>
      <ArticleSummary />
    </ArticleProvidersWithOwnLanguages>
  ) : (
    <BlogProvidersWithOwnLanguages blog={entity}>
      <BlogSummary />
    </BlogProvidersWithOwnLanguages>
  );
};

export default CustomSectionComponent;
