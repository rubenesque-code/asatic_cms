import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypes } from "^redux/state/recordedEventsTypes";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { fuzzySearch, mapLanguageIds } from "^helpers/general";
import { RecordedEventTypeTranslation } from "^types/recordedEvent";

import { AddRelatedEntityIcon } from "^components/Icons";
import InputSelectCombo_ from "^components/InputSelectCombo";

import s_transition from "^styles/transition";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import { TranslationLanguage_ } from "^components/_containers/TranslationLanguage";
import { Fragment } from "react";

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
        <RecordedEventTypeSlice.Provider
          recordedEventType={recordedEventType}
          key={recordedEventType.id}
        >
          <SelectListItem />
        </RecordedEventTypeSlice.Provider>
      ))}
    </InputSelectCombo_.Select>
  );
};

export default Select;

const SelectListItem = () => {
  const [recordedEventType] = RecordedEventTypeSlice.useContext();
  const [, { updateType }] = RecordedEventSlice.useContext();

  return (
    <div
      css={[tw`cursor-pointer flex items-center justify-between`]}
      className="group"
      onClick={() => updateType({ typeId: recordedEventType.id })}
    >
      <div css={[tw`flex items-center gap-xs`]}>
        <div css={[tw`w-[2px] h-[16px] bg-gray-200`]} />
        <Translations />
      </div>
      <div css={[s_transition.onGroupHover]}>
        <span>
          <AddRelatedEntityIcon />
        </span>
      </div>
    </div>
  );
};

const Translations = () => {
  const [recordedEvent] = RecordedEventSlice.useContext();
  const [{ languageId: activeLanguageId }] =
    RecordedEventTranslationSlice.useContext();
  const [recordedEventType] = RecordedEventTypeSlice.useContext();

  const translationsProcessed = recordedEventType.translations
    .filter((t) => t.name.length)
    .sort((a) => {
      if (a.languageId === activeLanguageId) {
        return -1;
      } else if (
        mapLanguageIds(recordedEvent.translations).includes(a.languageId)
      ) {
        return -1;
      } else {
        return 0;
      }
    });

  return (
    <div css={[tw`flex items-center gap-sm text-sm`]}>
      {translationsProcessed.map((translation, i) => (
        <Fragment key={translation.id}>
          {i !== 0 ? <div css={[tw`w-[1px] h-[15px] bg-gray-200`]} /> : null}
          <Translation translation={translation} />
        </Fragment>
      ))}
    </div>
  );
};

const Translation = ({
  translation,
}: {
  translation: RecordedEventTypeTranslation;
}) => {
  return (
    <div css={[tw`flex`]}>
      <p css={[tw`text-gray-700 mr-xs`]}>{translation.name}</p>
      <TranslationLanguage_ languageId={translation.languageId} />
    </div>
  );
};
