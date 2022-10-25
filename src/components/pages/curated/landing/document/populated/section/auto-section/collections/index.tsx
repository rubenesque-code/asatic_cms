import { useSelector } from "^redux/hooks";
import { selectTotalCollections } from "^redux/state/collections";

import { $Empty, $Populated } from "../_presentation/Section";
import Swiper from "./swiper";

const Collections = () => {
  /*   const numCollections = useSelector(selectTotalCollections);

  return numCollections ? (
    <$Populated
      colorTheme="white"
      moreFromText=""
      swiper={<Swiper />}
      title="Collections"
    />
  ) : (
    <$Empty docType="collections" />
  ); */
  return <div>Collections</div>;
};

export default Collections;
