import {
  ArrowBendLeftDown,
  ArrowBendRightUp,
  Image as ImageIcon,
} from "phosphor-react";

import { generateImgVertPositionProps } from "^helpers/image";

import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ResizeImage from "^components/resize/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import MediaSection from "./MediaSection";
import { ReactElement } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ImageSection() {}

ImageSection.Image = function Image_({
  aspectRatio,
  imageId,
  updateAspectRatio,
  vertPosition,
}: {
  aspectRatio: number;
  imageId: string;
  updateAspectRatio: (aspectRatio: number) => void;
  vertPosition: number;
}) {
  return (
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => updateAspectRatio(aspectRatio)}
    >
      <MyImage imgId={imageId} objectFit="cover" vertPosition={vertPosition} />
    </ResizeImage>
  );
};

ImageSection.MenuButtons = function MenuButtons_({
  vertPosition,
  updateImageSrc,
  updateVertPosition,
}: {
  vertPosition: number;
  updateVertPosition: (vertPosition: number) => void;
  updateImageSrc: (imageId: string) => void;
}) {
  const { canFocusHigher, canFocusLower, focusHigher, focusLower } =
    generateImgVertPositionProps(vertPosition, (vertPosition) =>
      updateVertPosition(vertPosition)
    );

  return (
    <>
      <ContentMenu.Button
        onClick={focusLower}
        isDisabled={!canFocusLower}
        tooltipProps={{ text: "focus lower" }}
      >
        <ArrowBendLeftDown />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={focusHigher}
        isDisabled={!canFocusHigher}
        tooltipProps={{ text: "focus higher" }}
      >
        <ArrowBendRightUp />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      <WithAddDocImage onAddImage={(imageId) => updateImageSrc(imageId)}>
        <ContentMenu.Button tooltipProps={{ text: "change image" }}>
          <ImageIcon />
        </ContentMenu.Button>
      </WithAddDocImage>
      <ContentMenu.VerticalBar />
    </>
  );
};

ImageSection.Empty = function Empty({
  children,
  updateImageSrc,
}: {
  children: (isHovered: boolean) => ReactElement;
  updateImageSrc: (imageId: string) => void;
}) {
  return (
    <MediaSection.Empty title="Image section">
      {(isHovered) => (
        <>
          <WithAddDocImage onAddImage={updateImageSrc}>
            <MediaSection.Empty.AddContentButton text="Add image">
              <ImageIcon />
            </MediaSection.Empty.AddContentButton>
          </WithAddDocImage>
          {children(isHovered)}
        </>
      )}
    </MediaSection.Empty>
  );
};
