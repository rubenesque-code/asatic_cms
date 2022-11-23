import { useDeleteBlogMutation } from "^redux/services/blogs";

import BlogSlice from "^context/blogs/BlogContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";

import { EntityName } from "^types/entity";

const name: EntityName = "blog";

const useDeleteBlog = () => {
  const [{ id: blogId, collectionsIds, authorsIds, subjectsIds, tagsIds }] =
    BlogSlice.useContext();
  const [deleteBlogFromDb] = useDeleteBlogMutation();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: blogId,
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
  };

  const handleDelete = async () => {
    await deleteBlogFromDb({
      entityId: blogId,
      authorsIds,
      collectionsIds,
      subjectsIds,
      tagsIds,
      useToasts: true,
    });
    updateRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteBlog;
