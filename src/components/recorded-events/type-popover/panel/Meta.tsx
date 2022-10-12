import tw from "twin.macro";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

const Meta = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <div>
      <$Heading>Video Type</$Heading>
      <$Description>
        Give a heading for the the type of video this is. E.g. A talk,
        interview, event, etc.
      </$Description>
      {!recordedEventTypeId ? (
        <$NoRelatedEntitiesText>
          This video has not been given a type yet.
        </$NoRelatedEntitiesText>
      ) : (
        <$RelatedEntitiesText>This video has the type:</$RelatedEntitiesText>
      )}
    </div>
  );
};

export default Meta;

const $Heading = tw.h4`font-medium text-lg`;
const $Description = tw.p`text-gray-600 mt-xs text-sm`;
const $NoRelatedEntitiesText = tw.p`text-gray-800 text-sm mt-xs`;
const $RelatedEntitiesText = tw.p`text-sm mt-md`;
