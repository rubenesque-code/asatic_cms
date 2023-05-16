import { useDeleteCollectionMutation } from "^redux/services/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import useUpdateStoreRelatedEntitiesOnDelete from "./useUpdateStoreRelatedEntitiesOnDelete";

const useDeleteFromDbAndUpdateStore = () => {
  const [
    {
      id: collectionId,
      articlesIds,
      blogsIds,
      recordedEventsIds,
      subjectsIds,
      tagsIds,
    },
  ] = CollectionSlice.useContext();
  const [deleteFromDb] = useDeleteCollectionMutation();

  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteFromDb({
      id: collectionId,
      subEntities: {
        articlesIds,
        blogsIds,
        recordedEventsIds,
        subjectsIds,
        tagsIds,
      },
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteFromDbAndUpdateStore;
