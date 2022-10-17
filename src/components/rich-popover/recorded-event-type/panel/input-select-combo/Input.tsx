import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as createType,
  selectTotalRecordedEventTypes,
} from "^redux/state/recordedEventsTypes";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import InputSelectCombo_ from "^components/InputSelectCombo";

const Input = () => {
  const { inputValue, setInputValue } = InputSelectCombo_.useContext();
  const [, { updateType }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  const recordedEventTypes = useSelector(selectTotalRecordedEventTypes);

  const dispatch = useDispatch();

  const handleCreateType = () => {
    const typeId = generateUId();
    dispatch(createType({ id: typeId, name: inputValue, languageId }));
    updateType({ typeId });
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder={
        recordedEventTypes
          ? "Search for a video type or enter a new one"
          : "Enter first recorded event type"
      }
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateType();
      }}
      languageId={languageId}
    />
  );
};

export default Input;
