import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { RecordedEvent as RecordedEventType } from "^types/recordedEvent";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import SiteLanguage from "^components/SiteLanguage";
import MissingEntity_ from "../_containers/MissingEntity_";
import Card from "./Card";

const entityType = "video document";

const RecordedEvent = () => {
  const [{ entityId: recordedEventId }] =
    LandingCustomSectionComponentSlice.useContext();

  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, recordedEventId)
  );

  return recordedEvent ? (
    <Found recordedEvent={recordedEvent} />
  ) : (
    <MissingEntity_ entityType={entityType} />
  );
};

export default RecordedEvent;

const Found = ({ recordedEvent }: { recordedEvent: RecordedEventType }) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      <RecordedEventTranslationSlice.Provider
        recordedEventId={recordedEvent.id}
        translation={selectTranslationForActiveLanguage(
          recordedEvent.translations,
          siteLanguageId
        )}
      >
        <Card />
      </RecordedEventTranslationSlice.Provider>
    </RecordedEventSlice.Provider>
  );
};
