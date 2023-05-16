import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { $RelatedEntityText_ } from "^components/rich-popover/_presentation";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <>
      <$Heading>Video Type</$Heading>
      <$Description>
        Give a heading for the the type of video this is. E.g. A talk,
        interview, event, etc.
      </$Description>
      <$RelatedEntityText_
        popoverEntity={{ label: entityNameToLabel("recordedEventType") }}
        relatedEntity={{
          isOne: Boolean(recordedEventTypeId),
          label: entityNameToLabel("recordedEvent"),
        }}
      />
    </>
  );
};

export default Meta;
