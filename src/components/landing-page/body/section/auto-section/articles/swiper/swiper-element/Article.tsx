import { Container_ } from "../../../_containers/Entity";
import ArticleMenu from "./ArticleMenu";
import ArticleStatus from "./ArticleStatus";
import ArticleSummary from "./ArticleSummary";

const Article = () => {
  return (
    <Container_>
      {(isHovered) => (
        <>
          <ArticleStatus />
          <ArticleSummary />
          <ArticleMenu isShowing={isHovered} />
        </>
      )}
    </Container_>
  );
};

export default Article;
