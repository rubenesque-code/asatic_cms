/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import CollectionSlice from "^context/collections/CollectionContext";

import {
  Container,
  Authors as Authors_,
  Date as Date_,
  Menu as Menu_,
  Title as Title_,
} from "../Summary";
import Image from "./Image";
import HandleRecordedEventType from "^components/_containers/HandleRecordedEventType";

const Summary = () => {
  return (
    <Container>
      {(isHovered) => (
        <>
          <Image />
          <VideoType />
          <Title />
          <Authors />
          <Date />
          <Menu isShowing={isHovered} />
        </>
      )}
    </Container>
  );
};

export default Summary;

const $VideoType = tw.div`uppercase mb-xxxs text-sm`;

const VideoType = () => {
  return (
    <$VideoType>
      <HandleRecordedEventType />
    </$VideoType>
  );
};

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <div css={[tw`mt-xxs`]}>
      <Title_ title={title} />
    </div>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();

  return (
    <div css={[tw`mt-xxs`]}>
      <Authors_ authorsIds={authorsIds} />
    </div>
  );
};

const Date = () => {
  const [{ publishDate }] = RecordedEventSlice.useContext();

  return (
    <div css={[tw`mt-xxs`]}>
      <Date_ publishDate={publishDate} />
    </div>
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [, { removeCollection, routeToEditPage }] =
    RecordedEventSlice.useContext();

  return (
    <Menu_
      isShowing={isShowing}
      removeDocFromCollection={() => removeCollection({ collectionId })}
      routeToEditPage={routeToEditPage}
    />
  );
};
