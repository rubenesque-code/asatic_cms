import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";

import Swiper_ from "../../_containers/Swiper_";
import Slide from "./slide";

const Swiper = () => {
  const articles = useSelector(selectArticles);
  const ordered = orderDisplayContent(articles);
  const articlesIds = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="cream"
      slides={articlesIds.map((articleId) => (
        <Slide articleId={articleId} key={articleId} />
      ))}
    />
  );
};

export default Swiper;
