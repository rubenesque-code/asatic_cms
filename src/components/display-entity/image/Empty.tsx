import MediaSection from "../entity-page/article/MediaSection";
import { ImageIcon } from "^components/Icons";
import WithAddDocImage from "^components/WithAddDocImage";
import ContentMenu from "^components/menus/Content";
import { ToggleUseImageButton, ToggleUseImage } from "./MenuButtons";
import tw, { TwStyle } from "twin.macro";

const Empty = ({
  updateImageSrc,
  toggleUseImage,
  menuContainerStyles = tw`absolute right-0 top-0`,
}: {
  updateImageSrc: (imageId: string) => void;
  toggleUseImage?: ToggleUseImage;
  menuContainerStyles?: TwStyle;
}) => {
  return (
    <MediaSection.Empty title="Image">
      {(isHovered) => (
        <>
          <WithAddDocImage onAddImage={updateImageSrc}>
            <MediaSection.Empty.AddContentButton text="Add image">
              <ImageIcon />
            </MediaSection.Empty.AddContentButton>
          </WithAddDocImage>
          {toggleUseImage ? (
            <ContentMenu show={isHovered} styles={menuContainerStyles}>
              <ToggleUseImageButton {...toggleUseImage} />
            </ContentMenu>
          ) : null}
        </>
      )}
    </MediaSection.Empty>
  );
};

export default Empty;
