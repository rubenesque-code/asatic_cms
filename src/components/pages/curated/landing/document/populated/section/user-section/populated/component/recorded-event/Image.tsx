import { ReactElement } from "react";
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import MenuButtons from "^components/display-entity/image/MenuButtons";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ResizeImage from "^components/resize/Image";
import { PlayIcon } from "^components/Icons";
import { $ImageContainer_, $ImageEmpty_ } from "../_presentation/$Image_";

const Image = () => {
  const [{ summaryImage, youtubeId }] = RecordedEventSlice.useContext();

  const imageId =
    summaryImage.imageId ||
    (youtubeId ? getThumbnailFromYoutubeId(youtubeId) : null);

  return (
    <$ImageContainer_>
      {(isHovered) => (
        <>
          {imageId ? (
            <Populated>
              {summaryImage.imageId ? <StorageImage /> : <ThumbnailImage />}
            </Populated>
          ) : (
            <$ImageEmpty_ entityType="video document" />
          )}
          <Menu isShowing={isHovered} />
        </>
      )}
    </$ImageContainer_>
  );
};

export default Image;

const Populated = ({ children: image }: { children: ReactElement }) => {
  const [{ landingCustomSection }, { updateLandingCustomImageAspectRatio }] =
    RecordedEventSlice.useContext();

  return (
    <div css={[tw`relative`]}>
      <ResizeImage
        aspectRatio={landingCustomSection.imgAspectRatio}
        onAspectRatioChange={(aspectRatio) =>
          updateLandingCustomImageAspectRatio({ aspectRatio })
        }
      >
        {image}
      </ResizeImage>
      <PlayIcon styles={tw`text-6xl left-sm bottom-sm`} />
    </div>
  );
};

const StorageImage = () => {
  const [{ summaryImage, landingCustomSection }] =
    RecordedEventSlice.useContext();

  return (
    <MyImage
      imageId={summaryImage.imageId!}
      objectFit="cover"
      vertPosition={landingCustomSection.imgVertPosition || 50}
    />
  );
};

const ThumbnailImage = () => {
  const [{ landingCustomSection, youtubeId }] = RecordedEventSlice.useContext();

  const imgSrc = getThumbnailFromYoutubeId(youtubeId!);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      css={[tw`object-cover w-full h-full`]}
      src={imgSrc}
      style={{ objectPosition: `50% ${landingCustomSection.imgVertPosition}%` }}
      alt=""
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { landingCustomSection, summaryImage, youtubeId },
    { updateSummaryImageSrc, updateLandingCustomImageVertPosition },
  ] = RecordedEventSlice.useContext();

  const imageId =
    summaryImage.imageId ||
    (youtubeId ? getThumbnailFromYoutubeId(youtubeId) : null);

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <MenuButtons
        isImage={Boolean(imageId)}
        updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
        updateVertPosition={(vertPosition) =>
          updateLandingCustomImageVertPosition({ vertPosition })
        }
        vertPosition={landingCustomSection.imgVertPosition}
      />
    </ContentMenu>
  );
};
