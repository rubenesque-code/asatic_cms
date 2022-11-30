import TagSlice from "^context/tags/TagContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";

import { EntityName } from "^types/entity";

const name: EntityName = "tag";

const useUpdateStoreRelatedEntitiesOnDelete = () => {
  const [
    {
      id: tagId,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
      subjectsIds,
    },
  ] = TagSlice.useContext();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: tagId,
    name,
  };

  const updateStoreRelatedEntitiesOnDelete = () => {
    articlesIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromArticle({
          id,
          relatedEntity,
        })
      )
    );
    blogsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromBlog({
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
    recordedEventsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromRecordedEvent({
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
  };

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
