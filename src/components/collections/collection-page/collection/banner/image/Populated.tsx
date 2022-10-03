/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import CollectionSlice from "^context/collections/CollectionContext";

import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import MenuButtons from "^components/display-content/image/MenuButtons";
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
      image: { id: imgId, vertPosition },
    },
  ] = CollectionSlice.useContext();

  return (
    <MyImage imgId={imgId!} objectFit="cover" vertPosition={vertPosition} />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      image: { vertPosition },
    },
    { updateImageSrc, updateImageVertPosition },
  ] = CollectionSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <MenuButtons
        updateImageSrc={(imageId) => updateImageSrc({ imageId })}
        updateVertPosition={(imgVertPosition) =>
          updateImageVertPosition({ imgVertPosition })
        }
        vertPosition={vertPosition}
      />
    </ContentMenu>
  );
};
