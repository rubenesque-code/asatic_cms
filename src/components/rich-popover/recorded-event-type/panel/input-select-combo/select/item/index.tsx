import { useDispatch } from "^redux/hooks";
import {
  removeRecordedEventRelation as removeRecordedEventRelationFromRecordedEventType,
  addRecordedEventRelation as addRecordedEventRelationToRecordedEventType,
} from "^redux/state/recordedEventsTypes";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { $SelectEntity_ } from "^components/rich-popover/_presentation/SelectEntities";
import { Translation_ } from "^components/rich-popover/_containers/SelectEntity";

const Item = () => {
  const [
    { id: recordedEventId, recordedEventTypeId: currentRecordedEventTypeId },
    { updateType: updateRecordedEventCategory },
  ] = RecordedEventSlice.useContext();
  const [{ id: typeId }] = RecordedEventTypeSlice.useContext();

  const [{ translations }] = RecordedEventTypeSlice.useContext();

  const processed = translations.filter((t) => t.name?.length);

  const dispatch = useDispatch();

  const handleUpdateType = () => {
    updateRecordedEventCategory({ typeId });

    dispatch(
      addRecordedEventRelationToRecordedEventType({
        id: typeId,
        recordedEventId,
      })
    );
    if (currentRecordedEventTypeId) {
      dispatch(
        removeRecordedEventRelationFromRecordedEventType({
          id: currentRecordedEventTypeId,
          recordedEventId,
        })
      );
    }
  };

  return (
    <$SelectEntity_
      addEntityToParent={handleUpdateType}
      entityType="video type"
      parentType="video document"
      addToParentText="Update video document type"
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.name!}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;
