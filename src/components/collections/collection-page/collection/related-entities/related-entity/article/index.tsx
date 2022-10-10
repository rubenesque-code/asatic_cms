import ArticleSlice from "^context/articles/ArticleContext";

import Status from "../Status";
import ArticleSummary from "./Summary";
import { Container } from "../styles";

const Article = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return (
    <Container>
      <Status publishDate={publishDate} status={status} />
      <ArticleSummary />
    </Container>
  );
};

export default Article;
