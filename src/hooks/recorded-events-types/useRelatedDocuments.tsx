import { useSelector } from "^redux/hooks";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

const useRelatedDocuments = () => {
  const [{ recordedEventsIds }] = RecordedEventTypeSlice.useContext();

  const relatedDocuments = useSelector((state) => ({
    recordedEvents: {
      all: selectRecordedEventsByIds(state, recordedEventsIds),
      get defined() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get isUndefined() {
        return this.all.includes(undefined);
      },
    },
  }));

  return relatedDocuments;
};

export default useRelatedDocuments;
