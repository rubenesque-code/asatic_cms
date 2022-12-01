import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { useDispatch } from "^redux/hooks";
import { updateType } from "^redux/state/recordedEvents";

const useUpdateStoreRelatedEntitiesOnDelete = () => {
  const [{ recordedEventsIds }] = RecordedEventTypeSlice.useContext();

  const dispatch = useDispatch();

  const updateStoreRelatedEntitiesOnDelete = () => {
    recordedEventsIds.forEach((id) =>
      dispatch(updateType({ id, typeId: null }))
    );
  };

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
