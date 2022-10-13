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
        <$RelatedEntityText css={[tw`text-gray-800`]}>
          This video has not been given a type yet.
        </$RelatedEntityText>
      ) : (
        <$RelatedEntityText>This video has the type:</$RelatedEntityText>
      )}
    </div>
  );
};

export default Meta;

const $Heading = tw.h4`font-medium text-lg`;
const $Description = tw.p`text-gray-600 mt-xs text-sm`;
const $RelatedEntityText = tw.p`text-sm mt-sm`;
