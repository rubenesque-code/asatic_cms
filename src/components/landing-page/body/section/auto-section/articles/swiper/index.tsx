import { useSelector } from "^redux/hooks";
import { selectArticlesIds } from "^redux/state/articles";

// import useFindDocsUsedInCustomLandingSections from "^hooks/useFindDocsUsedInCustomLandingSections";

// import { arrayDivergence } from "^helpers/general";

import Swiper_ from "../../_containers/Swiper";
import SwiperElement from "./swiper-element";

const Swiper = () => {
  const articlesIds = useSelector(selectArticlesIds) as string[];

  /*   const usedArticlesIds = useFindDocsUsedInCustomLandingSections("article");
  const unusedArticlesIds = arrayDivergence(articlesIds, usedArticlesIds);

  const articlesOrderedIds = [...unusedArticlesIds, ...usedArticlesIds]; */

  return (
    <Swiper_
      colorTheme="cream"
      elements={articlesIds.map((articleId) => (
        <SwiperElement articleId={articleId} key={articleId} />
      ))}
    />
  );
};

export default Swiper;
