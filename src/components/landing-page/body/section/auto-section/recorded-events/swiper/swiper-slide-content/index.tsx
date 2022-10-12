import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { RecordedEvent as RecordedEventType } from "^types/recordedEvent";

import SiteLanguage from "^components/SiteLanguage";
import RecordedEvent from "./RecordedEvent";

const SwiperSlideContent = ({
  recordedEventId,
}: {
  recordedEventId: string;
}) => {
  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, recordedEventId)
  )!;

  return (
    <RecordedEventProviders
      recordedEvent={recordedEvent}
      key={recordedEvent.id}
    >
      <RecordedEvent />
    </RecordedEventProviders>
  );
};

export default SwiperSlideContent;

const RecordedEventProviders = ({
  recordedEvent,
  children,
}: {
  children: ReactElement;
  recordedEvent: RecordedEventType;
}) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <RecordedEventSlice.Provider
      recordedEvent={recordedEvent}
      key={recordedEvent.id}
    >
      {([{ id: recordedEventId, translations }]) => (
        <RecordedEventTranslationSlice.Provider
          recordedEventId={recordedEventId}
          translation={selectTranslationForActiveLanguage(
            translations,
            siteLanguageId
          )}
        >
          {children}
        </RecordedEventTranslationSlice.Provider>
      )}
    </RecordedEventSlice.Provider>
  );
};
