import AuthorSlice from "^context/authors/AuthorContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";

import { EntityName } from "^types/entity";

const name: EntityName = "author";

const useUpdateStoreRelatedEntitiesOnDelete = () => {
  const [{ id: authorId, articlesIds, blogsIds, recordedEventsIds }] =
    AuthorSlice.useContext();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: authorId,
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
    recordedEventsIds.forEach((id) =>
      dispatch(
        removeRelatedEntityFromRecordedEvent({
          id,
          relatedEntity,
        })
      )
    );
  };

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
