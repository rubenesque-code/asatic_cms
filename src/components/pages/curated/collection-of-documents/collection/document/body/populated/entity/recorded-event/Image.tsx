import { ReactElement } from "react";
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import { PlayIcon } from "^components/Icons";

import {
  $Container_,
  $Empty_,
} from "^components/pages/curated/document/_presentation/$SummaryImage_";
import { $imageContainer } from "../_styles";
import {
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "^curated-pages/_containers/ImageMenu_";

const Image = () => {
  const [{ summaryImage, youtubeId }] = RecordedEventSlice.useContext();

  const imageId =
    summaryImage.imageId ||
    (youtubeId ? getThumbnailFromYoutubeId(youtubeId) : null);

  return (
    <$Container_
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
      styles={$imageContainer}
    >
      {imageId ? (
        <Populated>
          {summaryImage.imageId ? <StorageImage /> : <ThumbnailImage />}
        </Populated>
      ) : (
        <$Empty_ />
      )}
    </$Container_>
  );
};

export default Image;

const Populated = ({ children: image }: { children: ReactElement }) => {
  return (
    <div css={[tw`relative h-full`]}>
      {image}
      <PlayIcon styles={tw`text-6xl left-sm bottom-sm`} />
    </div>
  );
};

const StorageImage = () => {
  const [{ summaryImage }] = RecordedEventSlice.useContext();

  return (
    <MyImage
      imageId={summaryImage.imageId!}
      objectFit="cover"
      vertPosition={summaryImage.vertPosition || 50}
    />
  );
};

const ThumbnailImage = () => {
  const [{ summaryImage, youtubeId }] = RecordedEventSlice.useContext();

  const imgSrc = getThumbnailFromYoutubeId(youtubeId!);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      css={[tw`object-cover w-full h-full`]}
      src={imgSrc}
      style={{ objectPosition: `50% ${summaryImage.vertPosition || 50}%` }}
      alt=""
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { summaryImage },
    { updateSummaryImageSrc, updateSummaryImageVertPosition },
  ] = RecordedEventSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <UpdateImageVertPositionButtons_
        updateVertPosition={(vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition })
        }
        vertPosition={summaryImage.vertPosition || 50}
      />
      <ContentMenu.VerticalBar />
      <UpdateImageSrcButton_
        updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
      />
    </ContentMenu>
  );
};
