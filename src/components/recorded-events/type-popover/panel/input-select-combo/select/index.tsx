import { useSelector } from "^redux/hooks";
import { selectTotalRecordedEventTypes } from "^redux/state/recordedEventsTypes";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import useRecordedEventTypeFuzzySearchForRecordedEvent from "^hooks/recorded-events-types/useFuzzySearchForRecordedEvent";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./item";
import { $EntitiesContainer } from "../../_styles/relatedEntity";
import tw from "twin.macro";

const Select = () => {
  const numRecordedEventTypes = useSelector(selectTotalRecordedEventTypes);
  const { inputValue: query } = InputSelectCombo.useContext();
  const queryItems = useRecordedEventTypeFuzzySearchForRecordedEvent(query);

  return (
    <InputSelectCombo.Select
      show={Boolean(numRecordedEventTypes)}
      isMatch={Boolean(queryItems.length)}
    >
      <$EntitiesContainer css={[tw`pb-md`]}>
        {queryItems.map((recordedEventType) => (
          <RecordedEventTypeSlice.Provider
            recordedEventType={recordedEventType}
            key={recordedEventType.id}
          >
            <Item />
          </RecordedEventTypeSlice.Provider>
        ))}
      </$EntitiesContainer>
    </InputSelectCombo.Select>
  );
};

export default Select;
