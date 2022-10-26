import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import { PlayIcon } from "^components/Icons";

import {
  $Container_,
  $Empty_,
} from "^components/pages/curated/_presentation/$SummaryImage_";
import {
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "^components/pages/curated/_containers/ImageMenu_";

export const SummaryImage_ = ({
  containerStyles,
}: {
  containerStyles: TwStyle;
}) => {
  const [{ summaryImage, youtubeId }] = RecordedEventSlice.useContext();

  const imageId =
    summaryImage.imageId ||
    (youtubeId ? getThumbnailFromYoutubeId(youtubeId) : null);

  return (
    <$Container_
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
      styles={containerStyles}
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
      css={[tw`absolute w-full h-full object-cover `]}
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
    <ContentMenu show={isShowing} styles={tw`absolute left-0 bottom-0`}>
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
