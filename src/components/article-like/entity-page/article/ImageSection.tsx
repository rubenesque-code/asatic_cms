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
import TextArea from "^components/editors/TextArea";

import ArticleUI from "./UI";

export const Image = ({
  aspectRatio,
  imageId,
  updateAspectRatio,
  vertPosition,
}: {
  aspectRatio: number;
  imageId: string;
  updateAspectRatio: (aspectRatio: number) => void;
  vertPosition: number;
}) => {
  return (
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => updateAspectRatio(aspectRatio)}
    >
      <MyImage imgId={imageId} objectFit="cover" vertPosition={vertPosition} />
    </ResizeImage>
  );
};

export const Caption = ({
  caption,
  updateCaption,
}: {
  caption: string | undefined;
  updateCaption: (caption: string) => void;
}) => {
  return (
    <ArticleUI.ImageCaption>
      <TextArea
        injectedValue={caption}
        onBlur={updateCaption}
        placeholder="optional caption"
      />
    </ArticleUI.ImageCaption>
  );
};

export const MenuButtons = ({
  vertPosition,
  updateImageSrc,
  updateVertPosition,
}: {
  vertPosition: number;
  updateVertPosition: (vertPosition: number) => void;
  updateImageSrc: (imageId: string) => void;
}) => {
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
