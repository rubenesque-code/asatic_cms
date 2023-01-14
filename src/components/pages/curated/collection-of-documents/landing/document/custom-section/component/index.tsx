import ArticleSummary from "./ArticleSummary";
import BlogSummary from "./BlogSummary";

import ArticleProvidersWithSiteLanguage from "^components/_containers/articles/ProvidersWithSiteLanguage";
import BlogProvidersWithSiteLanguage from "^components/_containers/blogs/ProvidersWithSiteLanguage";
import { useSelector } from "^redux/hooks";
import { selectArticleById } from "^redux/state/articles";
import { selectBlogById } from "^redux/state/blogs";

const CustomSectionComponent = ({
  entity,
}: {
  entity: { type: "article" | "blog"; id: string };
}) => {
  return entity.type === "article" ? (
    <Article id={entity.id} />
  ) : (
    <Blog id={entity.id} />
  );
};

export default CustomSectionComponent;

const Article = ({ id }: { id: string }) => {
  const article = useSelector((state) => selectArticleById(state, id))!;

  return (
    <ArticleProvidersWithSiteLanguage article={article}>
      <ArticleSummary />
    </ArticleProvidersWithSiteLanguage>
  );
};

const Blog = ({ id }: { id: string }) => {
  const blog = useSelector((state) => selectBlogById(state, id))!;

  return (
    <BlogProvidersWithSiteLanguage blog={blog}>
      <BlogSummary />
    </BlogProvidersWithSiteLanguage>
  );
};
