import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypes } from "^redux/state/recordedEventsTypes";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import { fuzzySearch } from "^helpers/general";

const useRecordedEventTypeFuzzySearchForRecordedEvent = (query: string) => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const recordedEventTypes = useSelector(selectRecordedEventTypes);
  const filteredForExcluded = recordedEventTypes.filter(
    (re) => re.id !== recordedEventTypeId
  );

  if (!query.length) {
    return filteredForExcluded;
  }

  const queryMatches = fuzzySearch(
    ["translations.name"],
    filteredForExcluded,
    query
  ).map((f) => f.item);

  return queryMatches;
};

export default useRecordedEventTypeFuzzySearchForRecordedEvent;
