import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import { Image as ImageIcon } from "phosphor-react";

import MediaSection from "^components/display-entity/entity-page/article/MediaSection";
import WithAddDocImage from "^components/WithAddDocImage";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";
import { RemoveRelatedEntityIcon } from "^components/Icons";

type UpdateImageSrc = {
  updateImageSrc: (imageId: string) => void;
};

export const Empty = ({
  updateImageSrc,
  toggleUseImage,
}: UpdateImageSrc & { toggleUseImage: () => void }) => {
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
  toggleUseImage: () => void;
}) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute left-0 top-0`}>
      {children ? children : null}
      <ContentMenu.Button
        onClick={toggleUseImage}
        tooltipProps={{ text: "remove image" }}
      >
        <RemoveRelatedEntityIcon />
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
} & ImageButtonProps) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative h-full`}>
      {(isHovered) => (
        <>
          <MyImage
            imageId={imageId}
            objectFit="cover"
            vertPosition={vertPosition}
          />
          <Menu
            isShowing={isHovered}
            toggleUseImage={toggleUseImage!.toggleUseImage}
          >
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
