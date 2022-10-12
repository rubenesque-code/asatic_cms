import { useSelector } from "^redux/hooks";
import { selectCollections } from "^redux/state/collections";

import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";

import Swiper_ from "../../_containers/Swiper";
import SwiperSlideContent from "./swiper-slide-content";

const Swiper = () => {
  const collections = useSelector(selectCollections);
  const ordered = orderDisplayContent(collections);
  const collectionsIds = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="white"
      slides={collectionsIds.map((collectionId) => (
        <SwiperSlideContent collectionId={collectionId} key={collectionId} />
      ))}
    />
  );
};

export default Swiper;
