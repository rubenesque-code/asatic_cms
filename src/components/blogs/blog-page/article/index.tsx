import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { Container } from "^components/article-like/entity-page/article/styles/article";
import Header from "./Header";
import Body from "./Body";
import BodyEmpty from "./BodyEmpty";

const Blog = () => {
  const [{ body }] = BlogTranslationSlice.useContext();

  return (
    <Container>
      <>
        <Header />
        {body.length ? <Body /> : <BodyEmpty />}
      </>
    </Container>
  );
};

export default Blog;
