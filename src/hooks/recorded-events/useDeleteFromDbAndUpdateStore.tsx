import { useDeleteRecordedEventMutation } from "^redux/services/recordedEvents";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";
import { removeRecordedEventRelation } from "^redux/state/recordedEventsTypes";

import { EntityName } from "^types/entity";

const name: EntityName = "recordedEvent";

const useDeleteFromDbAndUpdateStore = () => {
  const [
    {
      id: recordedEventId,
      collectionsIds,
      authorsIds,
      subjectsIds,
      tagsIds,
      recordedEventTypeId,
    },
  ] = RecordedEventSlice.useContext();
  const [deleteRecordedEventFromDb] = useDeleteRecordedEventMutation();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: recordedEventId,
    name,
  };

  const updateRelatedEntitiesOnDelete = () => {
    authorsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromAuthor({
          id,
          relatedEntity,
        })
      )
    );
    collectionsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromCollection({
          id,
          relatedEntity,
        })
      )
    );
    subjectsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromSubject({
          id,
          relatedEntity,
        })
      )
    );
    tagsIds.forEach((tagId) =>
      dispatch(
        removeRelatedEntityFromTag({
          id: tagId,
          relatedEntity,
        })
      )
    );
    if (recordedEventTypeId) {
      dispatch(
        removeRecordedEventRelation({
          id: recordedEventTypeId,
          recordedEventId,
        })
      );
    }
  };

  const handleDelete = async () => {
    await deleteRecordedEventFromDb({
      id: recordedEventId,
      subEntities: {
        authorsIds,
        collectionsIds,
        recordedEventTypeId,
        subjectsIds,
        tagsIds,
      },
    });
    updateRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteFromDbAndUpdateStore;
