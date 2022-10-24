import ArticleSlice from "^context/articles/ArticleContext";

import Status_ from "../_containers/Status_";
import { $Container } from "../_styles";
import Summary from "./Summary";

const Article = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return (
    <$Container>
      <Status_ publishDate={publishDate} status={status} />
      <Summary />
    </$Container>
  );
};

export default Article;
