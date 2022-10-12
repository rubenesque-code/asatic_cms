import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectBlogs } from "^redux/state/blogs";

import Swiper_ from "../../_containers/Swiper";
import SwiperSlideContent from "./swiper-slide-content";

const Swiper = () => {
  const blogs = useSelector(selectBlogs);
  const ordered = orderDisplayContent(blogs);
  const blogsIds = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="blue"
      slides={blogsIds.map((articleId) => (
        <SwiperSlideContent blogId={articleId} key={articleId} />
      ))}
    />
  );
};

export default Swiper;
