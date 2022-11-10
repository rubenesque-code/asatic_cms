import BlogSlice from "^context/blogs/BlogContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $statusContainer } from "../_styles";

const Status = () => {
  const [{ status, publishDate }] = BlogSlice.useContext();

  return (
    <Status_
      publishDate={publishDate}
      status={status}
      styles={$statusContainer}
    />
  );
};

export default Status;
