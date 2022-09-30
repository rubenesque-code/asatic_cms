import { ReactElement } from "react";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { RecordedEvent } from "^types/recordedEvent";

import DocLanguages from "^components/DocLanguages";

const ProvidersWithTranslationLanguages = ({
  recordedEvent,
  children,
}: {
  recordedEvent: RecordedEvent;
  children: ReactElement;
}) => {
  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      {([{ id: recordedEventId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
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
        </DocLanguages.Provider>
      )}
    </RecordedEventSlice.Provider>
  );
};

export default ProvidersWithTranslationLanguages;
