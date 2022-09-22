import { useSelector } from "^redux/hooks";
import { selectCollectionsIds } from "^redux/state/collections";
import AutoSection from "..";
import Swiper from "../Swiper";
import Collection from "./Collection";

const Collections = () => {
  return (
    <AutoSection.Container
      colorTheme="white"
      moreFromText=""
      swiper={<SwiperPopulated />}
      title="Collections"
    />
  );
};

export default Collections;

const SwiperPopulated = () => {
  const collectionsIds = useSelector(selectCollectionsIds) as string[];

  return (
    <Swiper
      colorTheme="white"
      elements={collectionsIds.map((collectionId) => (
        <Collection id={collectionId} key={collectionId} />
      ))}
    />
  );
};
