import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import {
  $MissingEntity,
  $RelatedEntity_,
} from "^components/rich-popover/_presentation";
import { $Container } from "^components/rich-popover/_styles/relatedEntities";

import Found from "./Found";

const Populated = () => {
  return (
    <$Container>
      <RelatedEntity />
    </$Container>
  );
};

export default Populated;

const RelatedEntity = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <$RelatedEntity_
      entity={<RecordedEventType id={recordedEventTypeId!} />}
      menu={null}
    />
  );
};

const RecordedEventType = ({ id }: { id: string }) => {
  const recordedEventType = useSelector((state) =>
    selectRecordedEventTypeById(state, id)
  );

  return recordedEventType ? (
    <RecordedEventTypeSlice.Provider recordedEventType={recordedEventType}>
      <Found />
    </RecordedEventTypeSlice.Provider>
  ) : (
    <$MissingEntity entityType="video document type" />
  );
};
