import { Container_ } from "../../../_containers/Entity";
import ArticleMenu from "./Menu";
import ArticleStatus from "./Status";
import ArticleSummary from "./Summary";

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
