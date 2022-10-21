/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import CollectionSlice from "^context/collections/CollectionContext";

import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import MenuButtons from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";

const Populated = () => {
  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
          <Image />
          <Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default Populated;

const Image = () => {
  const [
    {
      bannerImage: { imageId, vertPosition },
    },
  ] = CollectionSlice.useContext();

  return (
    <MyImage imageId={imageId!} objectFit="cover" vertPosition={vertPosition} />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      bannerImage: { vertPosition },
    },
    { updateBannerImageSrc, updateBannerImageVertPosition },
  ] = CollectionSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <MenuButtons
        updateImageSrc={(imageId) => updateBannerImageSrc({ imageId })}
        updateVertPosition={(vertPosition) =>
          updateBannerImageVertPosition({ vertPosition })
        }
        vertPosition={vertPosition}
      />
    </ContentMenu>
  );
};
