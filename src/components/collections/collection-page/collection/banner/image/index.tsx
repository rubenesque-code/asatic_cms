import CollectionSlice from "^context/collections/CollectionContext";
import Empty from "./Empty";

import Populated from "./Populated";

const BannerImage = () => {
  const [
    {
      image: { id },
    },
  ] = CollectionSlice.useContext();

  return id ? <Populated /> : <Empty />;
};

export default BannerImage;
