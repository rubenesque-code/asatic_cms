import { useDeleteArticleMutation } from "^redux/services/articles";

import ArticleSlice from "^context/articles/ArticleContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";

import { EntityName } from "^types/entity";

const useDeleteArticle = () => {
  const [{ id: articleId, collectionsIds, authorsIds, subjectsIds, tagsIds }] =
    ArticleSlice.useContext();
  const [deleteSubjectFromDb] = useDeleteArticleMutation();

  const dispatch = useDispatch();

  const name: EntityName = "article";
  const relatedEntity = {
    id: articleId,
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
    await deleteSubjectFromDb({
      id: articleId,
      subEntities: { authorsIds, collectionsIds, subjectsIds, tagsIds },
    });
    updateRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteArticle;
