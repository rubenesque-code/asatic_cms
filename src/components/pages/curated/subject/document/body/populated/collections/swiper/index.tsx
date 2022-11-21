import { orderDisplayContent } from "^helpers/displayContent";
import { Collection as CollectionType } from "^types/collection";

import { Swiper_ } from "^components/_containers/Swiper_";
import Collection from "./collection";

const Swiper = ({ collections }: { collections: CollectionType[] }) => {
  const ordered = orderDisplayContent(collections);

  return (
    <Swiper_
      colorTheme="white"
      slides={ordered.map((collection) => (
        <Collection collection={collection} key={collection.id} />
      ))}
    />
  );
};

export default Swiper;
