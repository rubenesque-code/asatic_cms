import { Collection } from "^types/collection";
import Swiper from "./swiper";

const Collections = ({ collections }: { collections: Collection[] }) => {
  return (
    <div>
      <div>Collections</div>
      <Swiper collections={collections} />
    </div>
  );
};

export default Collections;
