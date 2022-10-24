import BlogSlice from "^context/blogs/BlogContext";

import Status from "../Status";
import Summary from "./Summary";
import { Container } from "../styles";

const Blog = () => {
  const [{ status, publishDate }] = BlogSlice.useContext();

  return (
    <Container>
      <Status publishDate={publishDate} status={status} />
      <Summary />
    </Container>
  );
};

export default Blog;
