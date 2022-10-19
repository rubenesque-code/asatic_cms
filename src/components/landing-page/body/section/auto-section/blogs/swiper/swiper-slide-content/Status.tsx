import BlogSlice from "^context/blogs/BlogContext";

import { Status_ } from "../../../_containers/Entity_";

const Status = () => {
  const [{ publishDate, status }] = BlogSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

export default Status;
