import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { arrayDivergence, sortStringsByLookup } from "^helpers/general";

const useRecordedEventTypeTranslationsForRecordedEvent = () => {
  const [{ languagesIds: recordedEventLanguagesIds }] =
    RecordedEventSlice.useContext();
  const [{ languageId: activeLanguageId }] =
    RecordedEventTranslationSlice.useContext();

  const recordedEventLanguagesIdsOrdered = sortStringsByLookup(
    activeLanguageId,
    recordedEventLanguagesIds
  );

  const [{ translations, languagesIds: recordedEventTypeLanguagesIds }] =
    RecordedEventTypeSlice.useContext();

  const inactiveTranslationsLanguagesIds = arrayDivergence(
    recordedEventTypeLanguagesIds,
    recordedEventLanguagesIds
  );
  const inactiveTranslationsProcessed = inactiveTranslationsLanguagesIds
    .map((languageId) => translations.find((t) => t.languageId === languageId)!)
    .filter((t) => t.name?.length);

  return {
    activeLanguagesIds: recordedEventLanguagesIdsOrdered,
    inactiveTranslations: inactiveTranslationsProcessed,
  };
};

export default useRecordedEventTypeTranslationsForRecordedEvent;
