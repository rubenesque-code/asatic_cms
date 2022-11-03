import useUpdateSubEntitiesInStoreOnParentDelete from "^hooks/useUpdateSubEntitiesInStoreOnParentDelete";
import { useDeleteCollectionMutation } from "^redux/services/collections";

const useDeleteCollection = ({
  entityId,
  deleteFromDb,
  ...subEntitiesIds
}: {
  deleteFromDb: ReturnType<typeof useDeleteCollectionMutation>[0];
  entityId: string;
  subjectsIds: string[];
  tagsIds: string[];
  articlesIds: string[];
  blogsIds: string[];
  recordedEventsIds: string[];
}) => {
  const props = {
    entityId: entityId,
    ...subEntitiesIds,
  };

  const updateSubEntitiesInStore = useUpdateSubEntitiesInStoreOnParentDelete({
    ...props,
    parent: { id: entityId, type: "collection" },
  });

  const handleDelete = async () => {
    await deleteFromDb({
      ...props,
      useToasts: true,
    });
    updateSubEntitiesInStore();
  };

  return handleDelete;
};

export default useDeleteCollection;
