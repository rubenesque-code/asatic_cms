/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import tw, { TwStyle } from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import ContentMenu from "^components/menus/Content";
import {
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "../ImageMenu_";
import { $Container_, $Empty_ } from "../../_presentation/$SummaryImage_";
import MyImage from "^components/images/MyImage";
import ResizeImage from "^components/resize/Image";

type SummaryTypeProp = { summaryType: "summary" | "landing" };

export const SummaryImage = ({
  containerStyles,
  summaryType,
  isResizable,
}: {
  containerStyles: TwStyle;
  isResizable?: boolean;
} & SummaryTypeProp) => {
  return (
    <$Container_
      menu={(containerIsHovered) => (
        <ImageMenu isShowing={containerIsHovered} summaryType={summaryType} />
      )}
      styles={containerStyles}
    >
      {isResizable ? <ResizableImage /> : <Image summaryType={summaryType} />}
    </$Container_>
  );
};

const ResizableImage = () => {
  const [{ landingCustomSection }, { updateLandingCustomImageAspectRatio }] =
    RecordedEventSlice.useContext();

  return (
    <ResizeImage
      aspectRatio={landingCustomSection.imgAspectRatio}
      onAspectRatioChange={(aspectRatio) =>
        updateLandingCustomImageAspectRatio({ aspectRatio })
      }
    >
      <Image summaryType="landing" />
    </ResizeImage>
  );
};

const Image = ({ summaryType }: { summaryType: "summary" | "landing" }) => {
  const [{ summaryImage, youtubeId, landingCustomSection }] =
    RecordedEventSlice.useContext();

  const vertPosition =
    summaryType === "landing"
      ? landingCustomSection.imgVertPosition
      : summaryImage.vertPosition;

  return summaryImage.imageId ? (
    <MyImage
      imageId={summaryImage.imageId}
      objectFit="cover"
      vertPosition={vertPosition}
    />
  ) : youtubeId ? (
    <img
      css={[tw`absolute w-full h-full object-cover `]}
      src={getThumbnailFromYoutubeId(youtubeId)}
      style={{ objectPosition: `50% ${vertPosition || 50}%` }}
      alt=""
    />
  ) : (
    <$Empty_ />
  );
};

const ImageMenu = ({
  isShowing,
  summaryType,
}: {
  isShowing: boolean;
  summaryType: "summary" | "landing";
}) => {
  const [
    { summaryImage, youtubeId, landingCustomSection },
    {
      updateLandingCustomImageVertPosition,
      updateSummaryImageVertPosition,
      updateSummaryImageSrc,
    },
  ] = RecordedEventSlice.useContext();

  const vertPosition =
    summaryType === "landing"
      ? landingCustomSection.imgVertPosition
      : summaryImage.vertPosition;

  const handleUpdateVertPosition = (vertPosition: number) => {
    if (summaryType === "landing") {
      updateLandingCustomImageVertPosition({ vertPosition });
    } else {
      updateSummaryImageVertPosition({ vertPosition });
    }
  };

  return (
    <ContentMenu show={isShowing} styles={tw`absolute bottom-0 left-0`}>
      {summaryImage.imageId || youtubeId ? (
        <>
          <UpdateImageVertPositionButtons_
            vertPosition={vertPosition || 50}
            updateVertPosition={handleUpdateVertPosition}
          />
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <UpdateImageSrcButton_
        updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
      />
    </ContentMenu>
  );
};
