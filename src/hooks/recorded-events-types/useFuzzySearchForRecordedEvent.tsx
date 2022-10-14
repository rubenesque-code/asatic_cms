import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypes } from "^redux/state/recordedEventsTypes";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import { fuzzySearch } from "^helpers/general";

const useRecordedEventTypeFuzzySearchForRecordedEvent = (query: string) => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const recordedEventTypes = useSelector(selectRecordedEventTypes);
  const recordedEventTypesProcessed = recordedEventTypes.filter(
    (r) => r.id !== recordedEventTypeId
  );

  const queryMatches = fuzzySearch(
    ["translations.name"],
    recordedEventTypesProcessed,
    query
  ).map((f) => f.item);

  const items = query.length ? queryMatches : recordedEventTypesProcessed;

  return items;
};

export default useRecordedEventTypeFuzzySearchForRecordedEvent;
