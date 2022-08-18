/* eslint-disable jsx-a11y/alt-text */
import { ReactElement } from "react";
import tw from "twin.macro";
import Div from "^components/DivUtilities";
import SiteLanguage from "^components/SiteLanguage";
import StatusLabel from "^components/StatusLabel";
import {
  RecordedEventProvider,
  useRecordedEventContext,
} from "^context/recorded-events/RecordedEventContext";
import {
  RecordedEventTranslationProvider,
  useRecordedEventTranslationContext,
} from "^context/recorded-events/RecordedEventTranslationContext";
import { selectTranslationForSiteLanguage } from "^helpers/article";
import { generateImgVertPosition as generateImgVertPositionProps } from "^helpers/image";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";
import useRecordedEventStatus from "^hooks/useRecordedEventStatus";
import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/recordedEvents";
import RecordedEventUI from "./RecordedEventUI";

// todo: status. menu.

const RecordedEvent = ({ id }: { id: string }) => {
  return (
    <RecordedEventProviders id={id}>
      <>
        <RecordedEventUI>
          <Status />
          <Div.Hover>
            {(imageIsHovered) => (
              <>
                <Image />
                <ImageMenu show={imageIsHovered} />
              </>
            )}
          </Div.Hover>
          <RecordedEventUI.BottomCard>
            <Title />
          </RecordedEventUI.BottomCard>
        </RecordedEventUI>
      </>
    </RecordedEventProviders>
  );
};

export default RecordedEvent;

const RecordedEventProviders = ({
  children,
  id,
}: {
  children: ReactElement;
  id: string;
}) => {
  const recordedEvent = useSelector((state) => selectById(state, id))!;

  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForSiteLanguage(
    recordedEvent.translations,
    siteLanguageId
  );

  return (
    <RecordedEventProvider recordedEvent={recordedEvent}>
      <RecordedEventTranslationProvider
        recordedEventId={id}
        translation={translation}
      >
        {children}
      </RecordedEventTranslationProvider>
    </RecordedEventProvider>
  );
};

const Status = () => {
  const [recordedEvent] = useRecordedEventContext();
  const status = useRecordedEventStatus(recordedEvent);

  return (
    <div css={[tw`mb-sm`]}>
      <StatusLabel
        publishDate={recordedEvent.publishInfo.date}
        status={status}
        includeNewType={false}
        showPublished={false}
      />
    </div>
  );
};

const Image = () => {
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
    <RecordedEventUI.ImageContainer>
      {!youtubeVideoId ? (
        <RecordedEventUI.NoVideo />
      ) : summaryImageId ? (
        <RecordedEventUI.Image
          imgId={summaryImageId}
          vertPosition={imgVertPosition}
        />
      ) : (
        <RecordedEventUI.YoutubeThumbnailImage
          src={youtubeVideoThumbnail!}
          vertPosition={imgVertPosition}
        />
      )}
    </RecordedEventUI.ImageContainer>
  );
};

const ImageMenu = ({ show }: { show: boolean }) => {
  const [
    {
      video,
      landing: {
        autoSection: { imgVertPosition },
      },
    },
    { updateLandingAutoSectionImageVertPosition, updateLandingImageSrc },
  ] = useRecordedEventContext();

  const isVideo = video?.video.id;

  if (!isVideo) {
    return null;
  }

  const imgVertPositionProps = generateImgVertPositionProps(
    imgVertPosition,
    (imgVertPosition) =>
      updateLandingAutoSectionImageVertPosition({ imgVertPosition })
  );

  return (
    <RecordedEventUI.ImageMenu
      show={show}
      {...imgVertPositionProps}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
    />
  );
};

const Title = () => {
  const [{ title }] = useRecordedEventTranslationContext();

  return (
    <RecordedEventUI.Title>
      {title ? title : <RecordedEventUI.MissingTitle />}
    </RecordedEventUI.Title>
  );
};
