import useUpdateSubEntitiesInStoreOnParentDelete from "^hooks/useUpdateSubEntitiesInStoreOnParentDelete";
import { useDeleteRecordedEventMutation } from "^redux/services/recordedEvents";

const useDeleteRecordedEvent = ({
  entityId,
  deleteFromDb,
  authorsIds,
  collectionsIds,
  subjectsIds,
  tagsIds,
}: {
  deleteFromDb: ReturnType<typeof useDeleteRecordedEventMutation>[0];
  entityId: string;
  authorsIds: string[];
  collectionsIds: string[];
  subjectsIds: string[];
  tagsIds: string[];
}) => {
  const props = {
    entityId,
    authorsIds,
    collectionsIds,
    subjectsIds,
    tagsIds,
  };

  const updateSubEntitiesInStore =
    useUpdateSubEntitiesInStoreOnParentDelete(props);

  const handleDelete = async () => {
    await deleteFromDb({
      ...props,
      useToasts: true,
    });
    updateSubEntitiesInStore();
  };

  return handleDelete;
};

export default useDeleteRecordedEvent;
