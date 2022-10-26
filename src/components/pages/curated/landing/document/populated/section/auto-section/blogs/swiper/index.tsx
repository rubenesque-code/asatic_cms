import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectBlogs } from "^redux/state/blogs";

import { Swiper_ } from "../../_containers/Swiper_";
import Slide from "./slide";

const Swiper = () => {
  const blogs = useSelector(selectBlogs);
  const ordered = orderDisplayContent(blogs);
  const blogsids = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="blue"
      slides={blogsids.map((articleId) => (
        <Slide blogId={articleId} key={articleId} />
      ))}
    />
  );
};

export default Swiper;
