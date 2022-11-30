import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";

import { EntityName } from "^types/entity";

const name: EntityName = "recordedEventType";

// todo : add related entities to recorded event type (for just recorded event)
const useUpdateStoreRelatedEntitiesOnDelete = () => {
  const [{ id: recordedEventTypeId }] = RecordedEventTypeSlice.useContext();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: recordedEventTypeId,
    name,
  };

  const updateStoreRelatedEntitiesOnDelete = () => {
    articlesIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromArticle({
          id,
          relatedEntity,
        })
      )
    );
    blogsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromBlog({
          id,
          relatedEntity,
        })
      )
    );
    recordedEventsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromRecordedEvent({
          id,
          relatedEntity,
        })
      )
    );
  };

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
