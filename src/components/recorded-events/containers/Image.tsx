/* eslint-disable @next/next/no-img-element */
import tw, { TwStyle } from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import { PlayIcon } from "^components/Icons";
import ContainerUtility from "^components/ContainerUtilities";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";

const Image = () => {
  const [{ youtubeId }] = RecordedEventSlice.useContext();

  return !youtubeId ? <NoVideo /> : <Populated />;
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

const Populated = () => {
  const [{ summaryImage }] = RecordedEventSlice.useContext();

  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
          {summaryImage.imageId ? <SummaryImage /> : <YoutubeThumbnail />}
          <PlayIcon styles={tw`text-6xl left-sm bottom-sm`} />
          <Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
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

const SummaryImage = () => {
  const [
    {
      summaryImage: { imageId, vertPosition },
    },
  ] = RecordedEventSlice.useContext();

  return (
    <MyImage imgId={imageId!} objectFit="cover" vertPosition={vertPosition} />
  );
};

const Menu = ({
  isShowing,
  styles = tw`absolute left-0 bottom-0`,
}: {
  isShowing: boolean;
  styles?: TwStyle;
}) => {
  const [
    {
      summaryImage: { vertPosition },
    },
    { updateSummaryImageSrc, updateSummaryImageVertPosition },
  ] = RecordedEventSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={styles}>
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
