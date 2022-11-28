import { useDeleteArticleMutation } from "^redux/services/articles";

import AuthorSlice from "^context/authors/AuthorContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";

import { EntityName } from "^types/entity";

const name: EntityName = "author";

const useDeleteAuthorFromDbAndUpdateStore = () => {
  const [{ id: articleId, collectionsIds, authorsIds, subjectsIds, tagsIds }] =
    AuthorSlice.useContext();
  const [deleteArticleFromDb] = useDeleteArticleMutation();

  const dispatch = useDispatch();

  const relatedEntity = {
    id: articleId,
    name,
  };

  const updateStoreRelatedEntitiesOnDelete = () => {
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
    await deleteArticleFromDb({
      id: articleId,
      subEntities: { authorsIds, collectionsIds, subjectsIds, tagsIds },
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteAuthorFromDbAndUpdateStore;
