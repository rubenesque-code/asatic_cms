import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";

import { EntityName } from "^types/entity";
import CollectionSlice from "^context/collections/CollectionContext";
import { useDeleteCollectionMutation } from "^redux/services/collections";

const useDeleteCollection = () => {
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
  const [deleteCollectionFromDb] = useDeleteCollectionMutation();

  const dispatch = useDispatch();

  const name: EntityName = "collection";
  const relatedEntity = {
    id: collectionId,
    name,
  };

  const updateRelatedEntitiesOnDelete = () => {
    articlesIds.forEach((articleId) =>
      dispatch(
        removeRelatedEntityFromArticle({
          id: articleId,
          relatedEntity,
        })
      )
    );
    blogsIds.forEach((blogId) =>
      dispatch(
        removeRelatedEntityFromBlog({
          id: blogId,
          relatedEntity,
        })
      )
    );
    recordedEventsIds.forEach((recordedEventId) =>
      dispatch(
        removeRelatedEntityFromRecordedEvent({
          id: recordedEventId,
          relatedEntity,
        })
      )
    );
    subjectsIds.forEach((subjectId) =>
      dispatch(
        removeRelatedEntityFromSubject({
          id: subjectId,
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
    await deleteCollectionFromDb({
      id: collectionId,
      articlesIds,
      blogsIds,
      recordedEventsIds,
      subjectsIds,
      tagsIds,
      useToasts: true,
    });
    updateRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteCollection;
