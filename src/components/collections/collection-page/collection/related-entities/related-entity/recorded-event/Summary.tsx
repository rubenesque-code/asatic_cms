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

const Summary = () => {
  return (
    <Container>
      {(isHovered) => (
        <>
          <Image />
          <h4 css={[tw`uppercase mb-xxxs text-sm`]}>Talks & Events</h4>
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

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return <Title_ title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();

  return <Authors_ authorsIds={authorsIds} />;
};

const Date = () => {
  const [{ publishDate }] = RecordedEventSlice.useContext();

  return <Date_ publishDate={publishDate} />;
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
