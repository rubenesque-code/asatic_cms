import { ReactElement } from "react";
import {
  ArrowBendLeftDown as ArrowBendLeftDownIcon,
  ArrowBendRightUp as ArrowBendRightUpIcon,
  Image as ImageIcon,
} from "phosphor-react";
import { TwStyle } from "twin.macro";

import WithAddDocImage from "^components/WithAddDocImage";
import {
  ContentMenuButton,
  ContentMenuContainer,
  ContentMenuVerticalBar,
} from "./Content";

const ImageMenuUI = ({
  canFocusHigher,
  canFocusLower,
  focusHigher,
  focusLower,
  updateImageSrc,
  show,
  containerStyles,
  additionalButtons,
}: {
  updateImageSrc: (imgId: string) => void;
  focusLower: () => void;
  focusHigher: () => void;
  canFocusLower: boolean;
  canFocusHigher: boolean;
  show: boolean;
  containerStyles?: TwStyle;
  additionalButtons?: ReactElement;
}) => (
  <ContentMenuContainer styles={containerStyles} show={show}>
    <>
      <ContentMenuButton
        onClick={focusLower}
        isDisabled={!canFocusLower}
        tooltipProps={{ text: "focus lower" }}
      >
        <ArrowBendLeftDownIcon />
      </ContentMenuButton>
      <ContentMenuButton
        onClick={focusHigher}
        isDisabled={!canFocusHigher}
        tooltipProps={{ text: "focus higher" }}
      >
        <ArrowBendRightUpIcon />
      </ContentMenuButton>
      <ContentMenuVerticalBar />
      <WithAddDocImage onAddImage={(id) => updateImageSrc(id)}>
        <ContentMenuButton tooltipProps={{ text: "change image" }}>
          <ImageIcon />
        </ContentMenuButton>
      </WithAddDocImage>
      {additionalButtons ? additionalButtons : null}
    </>
  </ContentMenuContainer>
);

export default ImageMenuUI;
