/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import CollectionSlice from "^context/collections/CollectionContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import {
  Authors_,
  Date_,
  Title_,
  Status_,
} from "^collection-of-documents-pages/_containers/summary";

/* import {
  Authors_,
  Date_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary"; */
import { $Container_ } from "../_presentation/$Summary_";
import { Menu_ } from "../_containers/Menu_";
import { HandleRecordedEventType } from "^components/_containers/handle-sub-entities";
import Image from "./Image";
import { $Title, $SubTitle } from "../_styles";
import { useEntityLanguageContext } from "^context/EntityLanguages";

const Summary = () => (
  <$Container_>
    {(isHovered) => (
      <>
        <Image />
        <VideoType />
        <Title />
        <$SubTitle>
          <Authors />
          <Date />
        </$SubTitle>
        <Status />
        <Menu isShowing={isHovered} />
      </>
    )}
  </$Container_>
);

export default Summary;

const VideoType = () => {
  return (
    <div css={[tw`uppercase mb-xxxs text-sm`]}>
      <HandleRecordedEventType />
    </div>
  );
};

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <Authors_ activeLanguageId={activeLanguageId} authorsIds={authorsIds} />
  );
};

const Date = () => {
  const [{ publishDate }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return <Date_ publishDate={publishDate} languageId={languageId} />;
};

const Status = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: collectionId },
    { removeRelatedEntity: removeRelatedEntityFromCollection },
  ] = CollectionSlice.useContext();
  const [
    { id: recordedEventId },
    {
      removeRelatedEntity: removeRelatedEntityFromRecordedEvent,
      routeToEditPage,
    },
  ] = RecordedEventSlice.useContext();

  const handleRemoveRecordedEventFromCollection = () => {
    removeRelatedEntityFromCollection({
      relatedEntity: { id: recordedEventId, name: "recordedEvent" },
    });
    removeRelatedEntityFromRecordedEvent({
      relatedEntity: { id: collectionId, name: "collection" },
    });
  };

  return (
    <Menu_
      isShowing={isShowing}
      removeEntityFromCollection={handleRemoveRecordedEventFromCollection}
      routeToEditPage={routeToEditPage}
    />
  );
};
