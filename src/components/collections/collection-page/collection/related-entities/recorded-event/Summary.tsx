/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import CollectionSlice from "^context/collections/CollectionContext";

import ContainerUtility from "^components/ContainerUtilities";
import {
  Authors as Authors_,
  Date as Date_,
  Menu as Menu_,
  Title as Title_,
} from "../related-entity/Summary";
import Image from "./Image";

const Summary = () => {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <>
          <Image />
          <Title />
          <Authors />
          <Date />
          <Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
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
  const [{ id: collectionId }, { routeToEditPage }] =
    CollectionSlice.useContext();
  const [, { removeCollection }] = RecordedEventSlice.useContext();

  return (
    <Menu_
      isShowing={isShowing}
      removeDocFromCollection={() => removeCollection({ collectionId })}
      routeToEditPage={routeToEditPage}
    />
  );
};
