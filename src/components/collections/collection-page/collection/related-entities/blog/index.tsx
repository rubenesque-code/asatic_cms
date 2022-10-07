import BlogSlice from "^context/blogs/BlogContext";

import BlogArticle from "./Summary";
import Status from "../related-entity/Status";

const Blog = () => {
  const [{ status, publishDate }] = BlogSlice.useContext();

  return (
    <>
      <Status publishDate={publishDate} status={status} />
      <BlogArticle />
    </>
  );
};

export default Blog;
