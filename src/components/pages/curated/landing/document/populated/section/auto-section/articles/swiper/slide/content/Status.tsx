import ArticleSlice from "^context/articles/ArticleContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $status } from "../../../_styles/entity";

const Status = () => {
  const [{ publishDate, status }] = ArticleSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

export default Status;
