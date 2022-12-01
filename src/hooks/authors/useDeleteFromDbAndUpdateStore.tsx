import { useDeleteAuthorMutation } from "^redux/services/authors";

import AuthorSlice from "^context/authors/AuthorContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";

import { EntityName } from "^types/entity";

const name: EntityName = "author";

const useDeleteAuthorFromDbAndUpdateStore = () => {
  const [{ id: articleId, articlesIds, blogsIds, recordedEventsIds }] =
    AuthorSlice.useContext();
  const [deleteArticleFromDb] = useDeleteAuthorMutation();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: articleId,
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

  const handleDelete = async () => {
    await deleteArticleFromDb({
      id: articleId,
      subEntities: { articlesIds, blogsIds, recordedEventsIds },
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteAuthorFromDbAndUpdateStore;
