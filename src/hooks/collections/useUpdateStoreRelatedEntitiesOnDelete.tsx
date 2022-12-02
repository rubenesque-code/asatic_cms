import CollectionSlice from "^context/collections/CollectionContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";

import { EntityName } from "^types/entity";

const name: EntityName = "collection";

const useUpdateStoreRelatedEntitiesOnDelete = () => {
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

  const dispatch = useDispatch();

  const relatedEntity = {
    id: collectionId,
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

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
