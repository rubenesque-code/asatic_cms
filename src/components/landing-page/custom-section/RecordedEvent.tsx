/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";
import { WarningCircle, Image as ImageIcon } from "phosphor-react";

import ContainerUtility from "^components/ContainerUtilities";
import ContentMenu from "^components/menus/Content";
import SiteLanguage from "^components/SiteLanguage";
import WithAddDocImage from "^components/WithAddDocImage";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { selectTranslationForActiveLanguage } from "^helpers/article";
import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import { ComponentMenu } from ".";
import ResizeImage from "^components/resize/Image";
import MyImage from "^components/images/MyImage";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";
import { generateImgVertPositionProps } from "^helpers/image";
import ImageMenuUI from "^components/menus/Image";

const RecordedEvent = () => {
  const [{ docId }] = LandingCustomSectionComponentSlice.useContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, docId)
  );

  return recordedEvent ? (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      <RecordedEventTranslationSlice.Provider
        recordedEventId={recordedEvent.id}
        translation={selectTranslationForActiveLanguage(
          recordedEvent.translations,
          siteLanguageId
        )}
      >
        <RecordedEventFound />
      </RecordedEventTranslationSlice.Provider>
    </RecordedEventSlice.Provider>
  ) : (
    <RecordedEventMissing />
  );
};

export default RecordedEvent;

const RecordedEventMissing = () => {
  return (
    <div
      css={[
        tw`relative p-md border-2 border-red-warning h-full grid place-items-center`,
      ]}
    >
      <div css={[tw`text-center`]}>
        <h4 css={[tw`font-medium flex items-center justify-center gap-xs`]}>
          <span css={[tw`text-red-warning`]}>
            <WarningCircle weight="bold" />
          </span>
          Missing recorded event
        </h4>
        <p css={[tw`mt-sm text-sm text-gray-700`]}>
          This component references an recorded event that couldn&apos;t be
          found. <br /> It has probably been deleted by a user, but you can try
          refreshing the page.
        </p>
      </div>
    </div>
  );
};

const RecordedEventFound = () => {
  return (
    <ContainerUtility.isHovered styles={tw`relative pb-lg min-h-full`}>
      {(isHovered) => (
        <>
          <div css={[tw`px-xs mt-sm`]}>
            <h4 css={[tw`uppercase `]}>Video</h4>
          </div>
          <div css={[tw`relative mt-xs`]}>
            <Image />
          </div>
          <div css={[tw`mt-xs px-xs `]}>
            <Title />
          </div>
          <RecordedEventMenu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const RecordedEventMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [, { updateLandingImageSrc }] = RecordedEventSlice.useContext();

  return (
    <ComponentMenu isShowing={isShowing}>
      <WithAddDocImage
        onAddImage={(imageId) => updateLandingImageSrc({ imageId })}
      >
        <ContentMenu.Button tooltipProps={{ text: "change image" }}>
          <ImageIcon />
        </ContentMenu.Button>
      </WithAddDocImage>
    </ComponentMenu>
  );
};

const Image = () => {
  const [
    {
      landingImage: {
        imageId: landingImageId,
        customSection: { imgAspectRatio, imgVertPosition },
      },
      youtubeId,
    },
    { updateLandingCustomSectionImageAspectRatio },
  ] = RecordedEventSlice.useContext();

  const isImage = landingImageId || youtubeId;

  if (!isImage) {
    return null;
  }

  return (
    <ContainerUtility.isHovered styles={tw`px-xs pt-xs`}>
      {(isHovered) => (
        <ResizeImage
          aspectRatio={imgAspectRatio}
          onAspectRatioChange={(imgAspectRatio) =>
            updateLandingCustomSectionImageAspectRatio({ imgAspectRatio })
          }
        >
          <>
            {landingImageId ? (
              <MyImage
                imgId={landingImageId}
                objectFit="cover"
                vertPosition={imgVertPosition}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                css={[tw`object-cover w-full h-full`]}
                src={getThumbnailFromYoutubeId(youtubeId!)}
                style={{ objectPosition: `50% ${imgVertPosition}%` }}
                alt=""
              />
            )}
            <ImageMenu isShowing={isHovered} />
          </>
        </ResizeImage>
      )}
    </ContainerUtility.isHovered>
  );
};

const ImageMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      landingImage: {
        customSection: { imgVertPosition },
      },
    },
    { updateLandingCustomSectionImageVertPosition, updateLandingImageSrc },
  ] = RecordedEventSlice.useContext();

  const imgVertPositionProps = generateImgVertPositionProps(
    imgVertPosition,
    (imgVertPosition) =>
      updateLandingCustomSectionImageVertPosition({ imgVertPosition })
  );

  return (
    <ImageMenuUI
      containerStyles={tw`absolute right-0 top-5`}
      {...imgVertPositionProps}
      show={isShowing}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
    />
  );
};

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <h3 css={[tw`text-3xl font-serif-eng`]}>
      {title ? (
        title
      ) : (
        <div css={[tw`flex items-center gap-sm`]}>
          <span css={[tw`text-gray-placeholder`]}>title...</span>
        </div>
      )}
    </h3>
  );
};
