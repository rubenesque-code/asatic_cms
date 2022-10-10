/* eslint-disable jsx-a11y/alt-text */

import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/article";
import { generateImgVertPositionProps as generateImgVertPositionProps } from "^helpers/image";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import Container from "^components/ContainerUtilities";
import SiteLanguage from "^components/SiteLanguage";
import StatusLabel from "^components/StatusLabel";

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
  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, id)
  )!;

  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForActiveLanguage(
    recordedEvent.translations,
    siteLanguageId
  );

  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      <RecordedEventTranslationSlice.Provider
        recordedEventId={id}
        translation={translation}
      >
        {children}
      </RecordedEventTranslationSlice.Provider>
    </RecordedEventSlice.Provider>
  );
};

const Menu = ({ show }: { show: boolean }) => {
  const [, { routeToEditPage }] = RecordedEventSlice.useContext();

  return <RecordedEventUI.Menu routeToEditPage={routeToEditPage} show={show} />;
};

const Status = () => {
  const [{ publishDate, status }] = RecordedEventSlice.useContext();

  return (
    <div css={[tw`mb-sm inline-block`]}>
      <StatusLabel publishDate={publishDate} status={status} />
    </div>
  );
};

const Image = () => {
  const [
    {
      landingImage: {
        imageId: summaryImageId,
        autoSection: { imgVertPosition },
      },
      youtubeId,
    },
  ] = RecordedEventSlice.useContext();

  const youtubeVideoThumbnail = youtubeId
    ? getThumbnailFromYoutubeId(youtubeId)
    : null;

  return (
    <RecordedEventUI.ImageContainer>
      {!youtubeId ? (
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
      youtubeId,
      landingImage: {
        autoSection: { imgVertPosition },
      },
    },
    { updateLandingAutoSectionImageVertPosition, updateLandingImageSrc },
  ] = RecordedEventSlice.useContext();

  const isVideo = youtubeId;

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
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <RecordedEventUI.Title>
      {title ? title : <RecordedEventUI.MissingTitle />}
    </RecordedEventUI.Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return (
    <RecordedEventUI.Authors>
      <DocAuthorsText authorIds={authorsIds} docActiveLanguageId={languageId} />
    </RecordedEventUI.Authors>
  );
};
