/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import { $SwiperSectionLayout_ } from "^curated-pages/collection-of-documents/_presentation";
import { Swiper_ } from "^curated-pages/collection-of-documents/_containers/swiper";
import { RecordedEvent } from "^types/recordedEvent";
import { orderDisplayContent } from "^helpers/displayContent";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import {
  Image_,
  Title_,
  Status_,
  SwiperComponentMenu_,
  Authors_,
} from "../_containers/summary";
import ContainerUtility from "^components/ContainerUtilities";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";
import { PlayIcon } from "^components/Icons";

const RecordedEventsSwiperSection = ({
  recordedEvents,
  parentLanguageId,
  ...removeFromParentProp
}: {
  recordedEvents: RecordedEvent[];
  parentLanguageId: string;
} & RemoveFromParentProp) => {
  return (
    <$SwiperSectionLayout_
      moreFromText="More from videos"
      swiper={
        <Swiper
          recordedEvents={recordedEvents}
          parentLanguageId={parentLanguageId}
          {...removeFromParentProp}
        />
      }
      title="Videos"
    />
  );
};

export default RecordedEventsSwiperSection;

const Swiper = ({
  recordedEvents,
  parentLanguageId,
  ...removeFromParentProp
}: {
  recordedEvents: RecordedEvent[];
  parentLanguageId: string;
} & RemoveFromParentProp) => {
  const ordered = orderDisplayContent(recordedEvents);

  return (
    <Swiper_
      slides={ordered.map((recordedEvent) => (
        <SwiperSlide
          recordedEvent={recordedEvent}
          parentLanguageId={parentLanguageId}
          {...removeFromParentProp}
          key={recordedEvent.id}
        />
      ))}
    />
  );
};

const SwiperSlide = ({
  recordedEvent,
  parentLanguageId,
  ...removeFromParentProp
}: {
  recordedEvent: RecordedEvent;
  parentLanguageId: string;
} & RemoveFromParentProp) => {
  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      <RecordedEventTranslationSlice.Provider
        recordedEventId={recordedEvent.id}
        translation={
          recordedEvent.translations.find(
            (translation) => translation.languageId === parentLanguageId
          )!
        }
      >
        <RecordedEventSummary {...removeFromParentProp} />
      </RecordedEventTranslationSlice.Provider>
    </RecordedEventSlice.Provider>
  );
};

const RecordedEventSummary = (removeFromParentProp: RemoveFromParentProp) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative h-full pb-sm`}>
      {(containerIsHovered) => (
        <>
          <Image />
          <Title />
          <Authors />
          <Status />
          <Menu isShowing={containerIsHovered} {...removeFromParentProp} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const Image = () => {
  const [
    { summaryImage, youtubeId },
    { updateSummaryImageSrc, updateSummaryImageVertPosition },
  ] = RecordedEventSlice.useContext();

  const imageId =
    summaryImage.imageId ||
    (youtubeId ? getThumbnailFromYoutubeId(youtubeId) : null);

  return (
    <div css={[tw`relative mb-sm`]}>
      <Image_
        actions={{
          updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
          updateVertPosition: (vertPosition) =>
            updateSummaryImageVertPosition({ vertPosition }),
        }}
        data={{
          imageId,
          vertPosition: summaryImage.vertPosition || 50,
          isUsingImage: true,
        }}
      >
        {!summaryImage.imageId && imageId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            css={[tw`absolute w-full h-full object-cover `]}
            src={imageId}
            style={{
              objectPosition: `50% ${summaryImage.vertPosition || 50}%`,
            }}
            alt=""
          />
        ) : null}
      </Image_>
      <PlayIcon styles={tw`absolute text-5xl right-sm bottom-sm`} />
    </div>
  );
};

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return <Title_ title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return <Authors_ authorsIds={authorsIds} activeLanguageId={languageId} />;
};

const Status = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return <Status_ status={status} publishDate={publishDate} />;
};

type RemoveFromParentProp = {
  removeFromParent?: {
    parent: { name: "subject" | "collection"; id: string };
    func: (entityId: string) => void;
  };
};

const Menu = ({
  isShowing,
  removeFromParent,
}: {
  isShowing: boolean;
} & RemoveFromParentProp) => {
  const [
    { id },
    { routeToEditPage, removeRelatedEntity: removeRelatedEntityFromCollection },
  ] = RecordedEventSlice.useContext();

  return (
    <SwiperComponentMenu_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      removeComponent={
        !removeFromParent
          ? undefined
          : () => {
              removeFromParent.func(id);
              removeRelatedEntityFromCollection({
                relatedEntity: { id, name: removeFromParent.parent.name },
              });
            }
      }
    />
  );
};
