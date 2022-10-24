import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import CollectionSlice from "^context/collections/CollectionContext";
import {
  UpdateImageSrcButton,
  UpdateImageVertPositionButtons,
} from "../../../../_containers/ImageMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      bannerImage: { vertPosition, imageId },
    },
    { updateBannerImageVertPosition, updateBannerImageSrc },
  ] = CollectionSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <UpdateImageSrcButton
        updateImageSrc={(imageId) => updateBannerImageSrc({ imageId })}
      />
      {imageId ? (
        <>
          <ContentMenu.VerticalBar />
          <UpdateImageVertPositionButtons
            updateVertPosition={(vertPosition) =>
              updateBannerImageVertPosition({ vertPosition })
            }
            vertPosition={vertPosition}
          />
        </>
      ) : null}
    </ContentMenu>
  );
};

export default Menu;
