import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as createType,
  selectRecordedEventTypes,
  selectTotalRecordedEventTypes,
} from "^redux/state/recordedEventsTypes";

import InputSelectCombo_ from "^components/InputSelectCombo";

import tw from "twin.macro";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { fuzzySearch } from "^helpers/general";
import { RecordedEventType } from "^types/recordedEvent";
import { AddRelatedEntityIcon } from "^components/Icons";
import s_transition from "^styles/transition";

const InputSelectCombo = () => {
  return (
    <$Container>
      <InputSelectCombo_>
        <>
          <Input />
          <Select />
        </>
      </InputSelectCombo_>
    </$Container>
  );
};

export default InputSelectCombo;

const $Container = tw.div`mt-lg`;

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
    />
  );
};

const Select = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const recordedEventTypes = useSelector(selectRecordedEventTypes);
  const recordedEventTypesProcessed = recordedEventTypes.filter(
    (r) => r.id !== recordedEventTypeId
  );

  const { inputValue: query } = InputSelectCombo_.useContext();

  const queryMatches = fuzzySearch(
    ["translations.name"],
    recordedEventTypesProcessed,
    query
  ).map((f) => f.item);

  const items = query.length ? queryMatches : recordedEventTypesProcessed;

  return (
    <InputSelectCombo_.Select show={Boolean(recordedEventTypes.length)}>
      {items.map((recordedEventType) => (
        <SelectRecordedEventType
          recordedEventType={recordedEventType}
          key={recordedEventType.id}
        />
      ))}
    </InputSelectCombo_.Select>
  );
};

const SelectRecordedEventType = ({
  recordedEventType,
}: {
  recordedEventType: RecordedEventType;
}) => {
  const [, { updateType }] = RecordedEventSlice.useContext();
  const [{ languageId: activeLanguageId }] =
    RecordedEventTranslationSlice.useContext();

  const translationsProcessed = recordedEventType.translations
    .filter((t) => t.name.length)
    .sort((a, b) => {
      if (a.languageId === activeLanguageId) {
        return -1;
      } else if (b.languageId === activeLanguageId) {
        return 1;
      } else {
        return 0;
      }
    });

  return (
    <div
      css={[tw`cursor-pointer flex items-center justify-between`]}
      className="group"
      onClick={() => updateType({ typeId: recordedEventType.id })}
    >
      <div>
        {translationsProcessed.map((translation) => (
          <p key={translation.id}>{translation.name}</p>
        ))}
      </div>
      <div css={[s_transition.onGroupHover]}>
        <span>
          <AddRelatedEntityIcon />
        </span>
      </div>
    </div>
  );
};
