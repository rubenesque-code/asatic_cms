/* eslint-disable @next/next/no-img-element */
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import ContainerUtility from "^components/ContainerUtilities";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import { PlayIcon } from "^components/Icons";
import { ImageContainer } from "../styles";

const Image = () => {
  const [
    {
      youtubeId,
      summaryImage: { imageId },
    },
  ] = RecordedEventSlice.useContext();

  return (
    <ImageContainer>
      {youtubeId ? (
        <ContainerUtility.isHovered>
          {(isHovered) => (
            <>
              {imageId ? <ExplicitImage /> : <YoutubeThumbnail />}
              <PlayIcon styles={tw`text-6xl left-sm bottom-sm`} />
              <Menu isShowing={isHovered} />
            </>
          )}
        </ContainerUtility.isHovered>
      ) : (
        <NoVideo />
      )}
    </ImageContainer>
  );
};

export default Image;

const NoVideo = () => {
  return (
    <div css={[tw`w-full h-full grid place-items-center`]}>
      <div>
        <p css={[tw`uppercase text-sm`]}>- No video -</p>
      </div>
    </div>
  );
};

const YoutubeThumbnail = () => {
  const [
    {
      youtubeId,
      summaryImage: { vertPosition },
    },
  ] = RecordedEventSlice.useContext();

  const thumbnailImgSrc = getThumbnailFromYoutubeId(youtubeId!);

  return (
    <img
      src={thumbnailImgSrc}
      css={[tw`object-cover w-full h-full`]}
      style={{ objectPosition: `50% ${vertPosition || 50}%` }}
      alt=""
    />
  );
};

const ExplicitImage = () => {
  const [
    {
      summaryImage: { imageId, vertPosition },
    },
  ] = RecordedEventSlice.useContext();

  return (
    <MyImage imageId={imageId!} objectFit="cover" vertPosition={vertPosition} />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      summaryImage: { vertPosition },
    },
    { updateSummaryImageSrc, updateSummaryImageVertPosition },
  ] = RecordedEventSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <ImageMenuButtons
        updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
        updateVertPosition={(vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition })
        }
        vertPosition={vertPosition || 50}
      />
    </ContentMenu>
  );
};
