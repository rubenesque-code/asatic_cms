import { useSelector } from "^redux/hooks";
import { selectCollections } from "^redux/state/collections";

import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";

import { Swiper_ } from "../../_containers/Swiper_";
import Slide from "./slide";

const Swiper = () => {
  const collections = useSelector(selectCollections);
  const ordered = orderDisplayContent(collections);
  const collectionsIds = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="white"
      slides={collectionsIds.map((articleId) => (
        <Slide collectionId={articleId} key={articleId} />
      ))}
    />
  );
};

export default Swiper;
