import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { Container } from "^components/article-like/entity-page/article/styles/article";
import Header from "./Header";
import Body from "./Body";
import BodyEmpty from "./BodyEmpty";

const Article = () => {
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <Container>
      <>
        <Header />
        {body.length ? <Body /> : <BodyEmpty />}
      </>
    </Container>
  );
};

export default Article;
