import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import Empty from "./Empty";
import Populated from "./populated";

const Body = () => {
  const [{ body }] = ArticleTranslationSlice.useContext();

  return body.length ? <Populated /> : <Empty />;
};

export default Body;
