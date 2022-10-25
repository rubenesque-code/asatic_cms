import ArticleSlice from "^context/articles/ArticleContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $statusContainer } from "../_styles";

const Status = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return (
    <Status_
      publishDate={publishDate}
      status={status}
      styles={$statusContainer}
    />
  );
};

export default Status;
