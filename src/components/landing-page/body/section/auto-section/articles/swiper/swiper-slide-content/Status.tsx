import ArticleSlice from "^context/articles/ArticleContext";

import { Status_ } from "../../../_containers/Entity";

const ArticleStatus = () => {
  const [{ publishDate, status }] = ArticleSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

export default ArticleStatus;
