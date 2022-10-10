import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import { Image as ImageIcon, Trash } from "phosphor-react";

import MediaSection from "^components/display-entity/entity-page/article/MediaSection";
import WithAddDocImage from "^components/WithAddDocImage";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";

type UpdateImageSrc = {
  updateImageSrc: (imageId: string) => void;
};
type ToggleUseImage = {
  toggleUseImage: () => void;
};

export const Empty = ({
  updateImageSrc,
  toggleUseImage,
}: UpdateImageSrc & ToggleUseImage) => {
  return (
    <MediaSection.Empty title="Image">
      {(isHovered) => (
        <>
          <WithAddDocImage onAddImage={updateImageSrc}>
            <MediaSection.Empty.AddContentButton text="Add image">
              <ImageIcon />
            </MediaSection.Empty.AddContentButton>
          </WithAddDocImage>
          <Menu isShowing={isHovered} toggleUseImage={toggleUseImage} />
        </>
      )}
    </MediaSection.Empty>
  );
};

const Menu = ({
  children,
  isShowing,
  toggleUseImage,
}: {
  children?: ReactElement;
  isShowing: boolean;
} & ToggleUseImage) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute left-0 top-0`}>
      {children ? children : null}
      <ContentMenu.Button
        onClick={toggleUseImage}
        tooltipProps={{ text: "remove image" }}
      >
        <Trash />
      </ContentMenu.Button>
    </ContentMenu>
  );
};

type ImageButtonProps = ComponentProps<typeof ImageMenuButtons>;

export const Populated = ({
  imageId,
  vertPosition,
  toggleUseImage,
  updateImageSrc,
  updateVertPosition,
}: {
  imageId: string;
  vertPosition: number;
} & ImageButtonProps &
  ToggleUseImage) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative h-full`}>
      {(isHovered) => (
        <>
          <MyImage
            imgId={imageId}
            objectFit="cover"
            vertPosition={vertPosition}
          />
          <Menu isShowing={isHovered} toggleUseImage={toggleUseImage}>
            <>
              <ImageMenuButtons
                updateImageSrc={updateImageSrc}
                updateVertPosition={updateVertPosition}
                vertPosition={vertPosition}
              />
              <ContentMenu.VerticalBar />
            </>
          </Menu>
        </>
      )}
    </ContainerUtility.isHovered>
  );
};
