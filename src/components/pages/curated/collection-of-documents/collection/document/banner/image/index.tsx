import tw from "twin.macro";
import ContainerUtility from "^components/ContainerUtilities";
import CollectionSlice from "^context/collections/CollectionContext";

import Empty from "./Empty";
import Menu from "./Menu";
import Populated from "./Populated";

const Image = () => {
  const [
    {
      bannerImage: { imageId },
    },
  ] = CollectionSlice.useContext();

  return (
    <ContainerUtility.isHovered styles={tw`h-full`}>
      {(isHovered) => (
        <>
          {imageId ? <Populated /> : <Empty />}
          <Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default Image;
