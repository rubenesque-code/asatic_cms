import { useSelector } from "^redux/hooks";
import { selectTotalRecordedEventTypes } from "^redux/state/recordedEventsTypes";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import useRecordedEventTypeFuzzySearchForRecordedEvent from "^hooks/recorded-events-types/useFuzzySearchForRecordedEvent";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./item";

import { $Container } from "^components/related-entity-popover/_styles/selectEntities";

const Select = () => {
  const numRecordedEventTypes = useSelector(selectTotalRecordedEventTypes);
  const { inputValue: query } = InputSelectCombo.useContext();
  const queryItems = useRecordedEventTypeFuzzySearchForRecordedEvent(query);

  return (
    <InputSelectCombo.Select
      show={Boolean(numRecordedEventTypes)}
      isMatch={Boolean(queryItems.length)}
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
