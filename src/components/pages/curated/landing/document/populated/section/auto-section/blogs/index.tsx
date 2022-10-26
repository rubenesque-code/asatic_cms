import { useSelector } from "^redux/hooks";
import { selectTotalBlogs } from "^redux/state/blogs";

import Empty from "./Empty";
import Populated from "./Populated";

const Blogs = () => {
  const numBlogs = useSelector(selectTotalBlogs);

  return numBlogs ? <Populated /> : <Empty />;
};

export default Blogs;
