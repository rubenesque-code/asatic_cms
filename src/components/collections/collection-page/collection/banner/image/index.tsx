import CollectionSlice from "^context/collections/CollectionContext";
import Empty from "./Empty";

import Populated from "./Populated";

const BannerImage = () => {
  const [
    {
      bannerImage: { imageId },
    },
  ] = CollectionSlice.useContext();

  return imageId ? <Populated /> : <Empty />;
};

export default BannerImage;
