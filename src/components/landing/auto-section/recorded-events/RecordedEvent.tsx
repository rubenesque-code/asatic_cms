/* eslint-disable jsx-a11y/alt-text */
import { ReactElement } from "react";
import tw from "twin.macro";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import Container from "^components/ContainerUtilities";
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
import { selectTranslationForActiveLanguage } from "^helpers/article";
import { generateImgVertPositionProps as generateImgVertPositionProps } from "^helpers/image";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";
import useRecordedEventStatus from "^hooks/useRecordedEventStatus";
import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/recordedEvents";
import RecordedEventUI from "./RecordedEventUI";

const RecordedEvent = ({ id }: { id: string }) => {
  return (
    <RecordedEventProviders id={id}>
      <>
        <Container.isHovered styles={tw`h-full`}>
          {(recordedEventIsHovered) => (
            <RecordedEventUI.Container>
              <Menu show={recordedEventIsHovered} />
              <Status />
              <Container.isHovered>
                {(imageIsHovered) => (
                  <>
                    <Image />
                    <ImageMenu show={imageIsHovered} />
                  </>
                )}
              </Container.isHovered>
              <RecordedEventUI.BottomCard>
                <Title />
                <Authors />
              </RecordedEventUI.BottomCard>
            </RecordedEventUI.Container>
          )}
        </Container.isHovered>
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

  const translation = selectTranslationForActiveLanguage(
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

const Menu = ({ show }: { show: boolean }) => {
  const [, { routeToEditPage }] = useRecordedEventContext();

  return <RecordedEventUI.Menu routeToEditPage={routeToEditPage} show={show} />;
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

const Authors = () => {
  const [{ authorIds }] = useRecordedEventContext();
  const [{ languageId }] = useRecordedEventTranslationContext();

  return (
    <RecordedEventUI.Authors>
      <DocAuthorsText authorIds={authorIds} docActiveLanguageId={languageId} />
    </RecordedEventUI.Authors>
  );
};
