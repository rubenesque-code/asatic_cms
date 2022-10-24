import { generateImgVertPositionProps } from "^helpers/image";

import {
  FocusImageHigherIcon,
  FocusImageLowerIcon,
  ImageIcon,
} from "^components/Icons";
import ContentMenu from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";

export const UpdateImageSrcButton = ({
  updateImageSrc,
}: {
  updateImageSrc: (imageId: string) => void;
}) => {
  return (
    <WithAddDocImage onAddImage={(imageId) => updateImageSrc(imageId)}>
      <ContentMenu.Button tooltipProps={{ text: "change image" }}>
        <ImageIcon />
      </ContentMenu.Button>
    </WithAddDocImage>
  );
};

export const UpdateImageVertPositionButtons = ({
  updateVertPosition,
  vertPosition,
}: {
  vertPosition: number;
  updateVertPosition: (vertPosition: number) => void;
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
        <FocusImageLowerIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={focusHigher}
        isDisabled={!canFocusHigher}
        tooltipProps={{ text: "focus higher" }}
      >
        <FocusImageHigherIcon />
      </ContentMenu.Button>
    </>
  );
};
