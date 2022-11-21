/* eslint-disable jsx-a11y/alt-text */
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { Title_, Authors_ } from "^curated-pages/_containers/entity-summary";

import { SummaryImage_ as Image_ } from "^components/pages/curated/_containers/recorded-event";
import { HandleRecordedEventType } from "^components/_containers/handle-sub-entities";
import {
  $SummaryContainer,
  $Title,
  $Authors,
  $RecordedEventType,
  $recordedEventImage,
} from "../_styles";

const Summary = () => {
  return (
    <$SummaryContainer>
      <Image />
      <RecordedEventType />
      <Title />
      <Authors />
    </$SummaryContainer>
  );
};

export default Summary;

// todo: test change image
const Image = () => {
  return <Image_ containerStyles={$recordedEventImage} />;
};

const RecordedEventType = () => {
  return (
    <$RecordedEventType>
      <HandleRecordedEventType />
    </$RecordedEventType>
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
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return (
    <$Authors>
      <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />
    </$Authors>
  );
};
