import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypes } from "^redux/state/recordedEventsTypes";

import { arrayDivergence, mapIds } from "^helpers/general";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import useRecordedEventTypeFuzzySearchForRecordedEvent from "^hooks/recorded-events-types/useFuzzySearchForRecordedEvent";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./item";
import { $Container } from "^components/rich-popover/_styles/selectEntities";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const queryItems = useRecordedEventTypeFuzzySearchForRecordedEvent(query);

  const allRecordedEventTypes = useSelector(selectRecordedEventTypes);
  const isUnusedRecordedEventType = Boolean(
    arrayDivergence(mapIds(allRecordedEventTypes), [recordedEventTypeId || ""])
      .length
  );

  return (
    <InputSelectCombo.Select
      isItem={isUnusedRecordedEventType}
      isMatch={Boolean(queryItems.length)}
      entityName="recordedEventType"
    >
      <$Container>
        {queryItems.map((recordedEventType) => (
          <RecordedEventTypeSlice.Provider
            recordedEventType={recordedEventType}
            key={recordedEventType.id}
          >
            <Item />
          </RecordedEventTypeSlice.Provider>
        ))}
      </$Container>
    </InputSelectCombo.Select>
  );
};

export default Select;
