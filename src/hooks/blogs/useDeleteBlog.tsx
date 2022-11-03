import useUpdateSubEntitiesInStoreOnParentDelete from "^hooks/useUpdateSubEntitiesInStoreOnParentDelete";
import { useDeleteBlogMutation } from "^redux/services/blogs";

const useDeleteBlog = ({
  entityId,
  authorsIds,
  collectionsIds,
  deleteFromDb,
  subjectsIds,
  tagsIds,
}: {
  deleteFromDb: ReturnType<typeof useDeleteBlogMutation>[0];
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

export default useDeleteBlog;
