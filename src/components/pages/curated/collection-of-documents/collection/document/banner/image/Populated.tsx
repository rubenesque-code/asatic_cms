import CollectionSlice from "^context/collections/CollectionContext";

import MyImage from "^components/images/MyImage";

const Populated = () => {
  const [
    {
      bannerImage: { imageId, vertPosition },
    },
  ] = CollectionSlice.useContext();

  return (
    <MyImage imageId={imageId!} objectFit="cover" vertPosition={vertPosition} />
  );
};

export default Populated;
