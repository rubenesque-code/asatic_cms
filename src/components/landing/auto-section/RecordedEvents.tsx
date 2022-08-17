// container
// menu
// swiper
// swiper elements
// recorded event content

import { VideoCamera } from "phosphor-react";
import tw from "twin.macro";
import ArticleLikeContentStatusLabel from "^components/article-like-content/StatusLabel";
import DivHover from "^components/DivHover";
import ImageWrapper from "^components/images/Wrapper";
import ContentMenu from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";
import SiteLanguage from "^components/SiteLanguage";
import {
  RecordedEventProvider,
  useRecordedEventContext,
} from "^context/recorded-events/RecordedEventContext";
import { RecordedEventTranslationProvider } from "^context/recorded-events/RecordedEventTranslationContext";
import { selectTranslationForSiteLanguage } from "^helpers/article";
import { generateImgVertPosition } from "^helpers/image";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";
import useRecordedEventStatus from "^hooks/useRecordedEventStatus";
import { useSelector } from "^redux/hooks";
import { selectAll as selectRecordedEvents } from "^redux/state/recordedEvents";
import EditImagePopover from "../EditImagePopover";
import AutoSection from "./AutoSection";
import Swiper from "./Swiper";

export default function RecordedEvents() {
  return (
    <AutoSection.Container
      colorTheme="white"
      swiper={<RecordedEventsSwiper />}
      title="Videos"
      moreFromText="More videos"
    />
  );
}

const RecordedEventsSwiper = () => {
  const recordedEvents = useSelector(selectRecordedEvents);

  return (
    <Swiper
      colorTheme="white"
      elements={recordedEvents.map((recordedEvent) => (
        <RecordedEventProvider
          recordedEvent={recordedEvent}
          key={recordedEvent.id}
        >
          <RecordedEvent />
        </RecordedEventProvider>
      ))}
    />
  );
};

function RecordedEvent() {
  const [{ id: recordedEventId, translations }] = useRecordedEventContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForSiteLanguage(
    translations,
    siteLanguageId
  );

  return (
    <RecordedEventTranslationProvider
      translation={translation}
      recordedEventId={recordedEventId}
    >
      <DivHover styles={tw`h-full`}>
        {(isHovered) => (
          <>
            <Swiper.Element>
              <RecordedEventContent />
            </Swiper.Element>
            <RecordedEventMenu recordedEventIsHovered={isHovered} />
          </>
        )}
      </DivHover>
    </RecordedEventTranslationProvider>
  );
}

const RecordedEventMenu = ({
  recordedEventIsHovered,
}: {
  recordedEventIsHovered: boolean;
}) => {
  const [
    {
      landing: { imageId },
    },
    { updateLandingImageSrc, routeToEditPage },
  ] = useRecordedEventContext();

  const show = !imageId && recordedEventIsHovered;

  return (
    <ContentMenu show={show} styles={tw`top-0 right-0`}>
      <EditImagePopover
        onSelectImage={(imageId) => updateLandingImageSrc({ imageId })}
        tooltipText="add image"
      />
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{
          text: "go to edit page",
          placement: "left",
          type: "action",
        }}
      >
        <VideoCamera />
      </ContentMenu.Button>
    </ContentMenu>
  );
};

function RecordedEventContent() {
  const [recordedEvent] = useRecordedEventContext();
  const status = useRecordedEventStatus(recordedEvent);

  return (
    <>
      <div css={[tw`inline-block mb-sm`]}>
        <ArticleLikeContentStatusLabel
          publishDate={recordedEvent.publishInfo.date}
          status={status}
          includeNewType={false}
          showPublished={false}
        />
      </div>
      <RecordedEventImage />
      {/* <RecordedEventTitle /> */}
      {/* <RecordedEventAuthors /> */}
    </>
  );
}

const RecordedEventImage = () => {
  const [
    {
      landing: {
        imageId: summaryImageId,
        autoSection: { imgVertPosition },
      },
      video,
    },
  ] = useRecordedEventContext();

  const youtubeVideoId = video?.video.id;
  const youtubeVideoThumbnail = youtubeVideoId
    ? getThumbnailFromYoutubeId(youtubeVideoId)
    : null;

  return (
    <DivHover styles={tw`w-full aspect-ratio[16 / 9] mb-sm`}>
      {(isHovered) => (
        <>
          {summaryImageId ? (
            <ImageWrapper
              imgId={summaryImageId}
              objectFit="cover"
              vertPosition={imgVertPosition}
            />
          ) : youtubeVideoThumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              css={[tw`object-cover`]}
              src={youtubeVideoThumbnail}
              style={{ objectPosition: `50% ${imgVertPosition}%` }}
              alt=""
            />
          ) : (
            <div css={[tw`h-full grid place-items-center`]}>No image/video</div>
          )}
          <RecordedEventImageMenu show={isHovered} />
        </>
      )}
    </DivHover>
  );
};

const RecordedEventImageMenu = ({ show }: { show: boolean }) => {
  const [
    {
      landing: {
        autoSection: { imgVertPosition },
      },
    },
    { updateLandingAutoSectionImageVertPosition, updateLandingImageSrc },
  ] = useRecordedEventContext();

  const { canFocusHigher, canFocusLower, focusHigher, focusLower } =
    generateImgVertPosition(imgVertPosition, (imgVertPosition) =>
      updateLandingAutoSectionImageVertPosition({ imgVertPosition })
    );

  return (
    <ImageMenuUI
      canFocusHigher={canFocusHigher}
      canFocusLower={canFocusLower}
      focusHigher={focusHigher}
      focusLower={focusLower}
      show={show}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
    />
  );
};
