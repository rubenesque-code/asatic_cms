import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import { useSelector } from "^redux/hooks";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";
import { RecordedEventTypeTranslation } from "^types/recordedEventType";

export const useIsTranslationUsed = (
  translation: RecordedEventTypeTranslation
): boolean => {
  const [{ recordedEventsIds }] = RecordedEventTypeSlice.useContext();

  const isTranslationUsed = useSelector((state) => {
    const recordedEvents = selectRecordedEventsByIds(
      state,
      recordedEventsIds
    ).flatMap((e) => (e ? [e] : []));

    const relatedEntitiesLanguageIds = [...recordedEvents].flatMap((e) =>
      e.translations.flatMap((t) => t.languageId)
    );

    return relatedEntitiesLanguageIds.includes(translation.languageId);
  });

  return isTranslationUsed;
};
