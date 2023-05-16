import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import Empty from "./Empty";
import Populated from "./populated";

const Body = () => {
  const [{ body }] = BlogTranslationSlice.useContext();

  return body.length ? <Populated /> : <Empty />;
};

export default Body;
