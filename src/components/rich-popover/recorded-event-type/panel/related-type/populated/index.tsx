import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import {
  $MissingEntity,
  $Entity,
} from "^components/rich-popover/_presentation/RelatedEntities";
import { $Container } from "^components/rich-popover/_styles/relatedEntities";

import Found from "./Found";

const Populated = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const recordedEventType = useSelector((state) =>
    selectRecordedEventTypeById(state, recordedEventTypeId!)
  );

  return (
    <$Container>
      <$Entity
        entity={{
          element: recordedEventType ? (
            <RecordedEventTypeSlice.Provider
              recordedEventType={recordedEventType}
            >
              <Found />
            </RecordedEventTypeSlice.Provider>
          ) : (
            <$MissingEntity entityType="video document type" />
          ),
          name: "recordedEventType",
        }}
        parentEntity={{
          name: "recordedEvent",
        }}
      />
    </$Container>
  );
};

export default Populated;
