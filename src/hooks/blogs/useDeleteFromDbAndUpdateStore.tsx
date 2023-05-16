import { useDeleteBlogMutation } from "^redux/services/blogs";

import BlogSlice from "^context/blogs/BlogContext";

import useUpdateStoreRelatedEntitiesOnDelete from "./useUpdateStoreRelatedEntitiesOnDelete";

const useDeleteBlog = () => {
  const [{ id: blogId, collectionsIds, authorsIds, subjectsIds, tagsIds }] =
    BlogSlice.useContext();
  const [deleteBlogFromDb] = useDeleteBlogMutation();

  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteBlogFromDb({
      id: blogId,
      subEntities: { authorsIds, collectionsIds, subjectsIds, tagsIds },
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteBlog;
