import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import {
  $Description,
  $Heading,
  $NoRelatedEntityText,
  $RelatedEntityText,
} from "^components/related-entity-popover/_styles";

const Meta = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <>
      <$Heading>Video Type</$Heading>
      <$Description>
        Give a heading for the the type of video this is. E.g. A talk,
        interview, event, etc.
      </$Description>
      {!recordedEventTypeId ? (
        <$NoRelatedEntityText>
          This video has not been given a type yet.
        </$NoRelatedEntityText>
      ) : (
        <$RelatedEntityText>This video has the type:</$RelatedEntityText>
      )}
    </>
  );
};

export default Meta;
