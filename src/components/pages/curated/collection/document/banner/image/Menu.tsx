import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import CollectionSlice from "^context/collections/CollectionContext";
import {
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "../../../../_containers/ImageMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      bannerImage: { imageId, vertPosition },
    },
    { updateBannerImageVertPosition, updateBannerImageSrc },
  ] = CollectionSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <UpdateImageSrcButton_
        updateImageSrc={(imageId) => updateBannerImageSrc({ imageId })}
      />
      {imageId ? (
        <>
          <ContentMenu.VerticalBar />
          <UpdateImageVertPositionButtons_
            updateVertPosition={(vertPosition) =>
              updateBannerImageVertPosition({ vertPosition })
            }
            vertPosition={vertPosition || 50}
          />
        </>
      ) : null}
    </ContentMenu>
  );
};

export default Menu;
