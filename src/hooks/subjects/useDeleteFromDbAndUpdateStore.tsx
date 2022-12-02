import { useDeleteSubjectMutation } from "^redux/services/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";

import useUpdateStoreRelatedEntitiesOnDelete from "./useUpdateStoreRelatedEntitiesOnDelete";

const useDeleteFromDbAndUpdateStore = () => {
  const [
    {
      id: subjectId,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
      tagsIds,
    },
  ] = SubjectSlice.useContext();
  const [deleteSubjectFromDb] = useDeleteSubjectMutation();

  const updateRelatedEntities = useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteSubjectFromDb({
      id: subjectId,
      subEntities: {
        articlesIds,
        blogsIds,
        collectionsIds,
        recordedEventsIds,
        tagsIds,
      },
    });
    updateRelatedEntities();
  };

  return handleDelete;
};

export default useDeleteFromDbAndUpdateStore;
