import ArticleSlice from "^context/articles/ArticleContext";

import Status from "../related-entity/Status";
import ArticleArticle from "./Summary";

const Article = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return (
    <>
      <Status publishDate={publishDate} status={status} />
      <ArticleArticle />
    </>
  );
};

export default Article;
