import { ReactElement } from "react";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { RecordedEvent } from "^types/recordedEvent";

import { EntityLanguageProvider } from "^context/EntityLanguages";

const RecordedEventProvidersWithOwnLanguages = ({
  recordedEvent,
  children,
}: {
  recordedEvent: RecordedEvent;
  children: ReactElement;
}) => {
  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      {([{ id: recordedEventId, languagesIds, translations }]) => (
        <EntityLanguageProvider entity={{ languagesIds }}>
          {({ activeLanguageId }) => (
            <RecordedEventTranslationSlice.Provider
              recordedEventId={recordedEventId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </RecordedEventTranslationSlice.Provider>
          )}
        </EntityLanguageProvider>
      )}
    </RecordedEventSlice.Provider>
  );
};

export default RecordedEventProvidersWithOwnLanguages;
