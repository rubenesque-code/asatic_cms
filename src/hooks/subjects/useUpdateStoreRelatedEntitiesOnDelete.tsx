import SubjectSlice from "^context/subjects/SubjectContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";

import { EntityName } from "^types/entity";

const name: EntityName = "subject";

const useUpdateStoreRelatedEntitiesOnDelete = () => {
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

  const dispatch = useDispatch();

  const relatedEntity = {
    id: subjectId,
    name,
  };

  const updateStoreRelatedEntitiesOnDelete = () => {
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
    collectionsIds.forEach((collectionId) =>
      dispatch(
        removeRelatedEntityFromCollection({
          id: collectionId,
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
    tagsIds.forEach((tagId) =>
      dispatch(
        removeRelatedEntityFromTag({
          id: tagId,
          relatedEntity,
        })
      )
    );
  };

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
