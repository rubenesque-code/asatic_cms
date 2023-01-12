import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import Summary from "./Summary";
import Menu from "./Menu";
import Status from "./Status";
import ContainerUtility from "^components/ContainerUtilities";
import { RecordedEvent } from "^types/recordedEvent";

const RecordedEventSummary = ({
  recordedEvent: recordedEvent,
}: {
  recordedEvent: RecordedEvent;
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
        <ContainerUtility.isHovered>
          {(containerIsHovered) => (
            <>
              <Status />
              <Menu isShowing={containerIsHovered} />
              <Summary />
            </>
          )}
        </ContainerUtility.isHovered>
      </RecordedEventTranslationSlice.Provider>
    </RecordedEventSlice.Provider>
  );
};

export default RecordedEventSummary;
