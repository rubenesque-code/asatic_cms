import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import SubjectSlice from "^context/subjects/SubjectContext";

import { EntityMenu_ } from "../_container";

const RecorededEventMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();
  const [
    { id: recordedEventId },
    {
      removeRelatedEntity: removeRelatedEntityFromRecorededEvent,
      routeToEditPage,
    },
  ] = RecordedEventSlice.useContext();

  const handleRemoveRecordedEvent = () => {
    removeRelatedEntityFromSubject({
      relatedEntity: { id: recordedEventId, name: "recordedEvent" },
    });
    removeRelatedEntityFromRecorededEvent({
      relatedEntity: { id: subjectId, name: "subject" },
    });
  };

  return (
    <EntityMenu_
      isShowing={isShowing}
      removeEntity={() => handleRemoveRecordedEvent()}
      routeToEntityPage={routeToEditPage}
    />
  );
};

export default RecorededEventMenu;
