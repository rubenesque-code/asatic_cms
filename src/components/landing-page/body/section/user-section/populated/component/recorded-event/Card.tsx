/* eslint-disable jsx-a11y/alt-text */
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import $CardContainer from "../_presentation/$CardContainer_";
import Status_ from "../_containers/Status_";
import Image from "./Image";
import $Title from "../_presentation/$Title_";
import Authors_ from "../_containers/Authors_";
import Menu_ from "../_containers/Menu_";
import HandleRecordedEventType from "^components/_containers/HandleRecordedEventType";
import { $RecordedEventVideoType as $VideoType } from "../_styles";

const Card = () => {
  return (
    <$CardContainer>
      {(isHovered) => (
        <>
          <Status />
          <VideoType />
          <Image />
          <Title />
          <Authors />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$CardContainer>
  );
};

export default Card;

const Status = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

const VideoType = () => {
  return (
    <$VideoType>
      <HandleRecordedEventType />
    </$VideoType>
  );
};

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return <$Title title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />;
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [, { routeToEditPage }] = RecordedEventSlice.useContext();

  return <Menu_ isShowing={isShowing} routeToEntityPage={routeToEditPage} />;
};
