import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { RecordedEvent as RecordedEventType } from "^types/recordedEvent";

import Summary from "./Summary";
import Menu from "./Menu";
import Status from "./Status";

const RecordedEvent = ({
  recordedEvent,
  containerIsHovered,
}: {
  recordedEvent: RecordedEventType;
  containerIsHovered: boolean;
}) => {
  const [subjectTranslation] = SubjectTranslationSlice.useContext();

  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      <RecordedEventTranslationSlice.Provider
        recordedEventId={recordedEvent.id}
        translation={selectTranslationForActiveLanguage(
          recordedEvent.translations,
          subjectTranslation.languageId
        )}
      >
        <>
          <Status />
          <Menu isShowing={containerIsHovered} />
          <Summary />
        </>
      </RecordedEventTranslationSlice.Provider>
    </RecordedEventSlice.Provider>
  );
};

export default RecordedEvent;
