import ArticleSlice from "^context/articles/ArticleContext";

import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";
import { removeComponentsByEntity as removeLandingComponentsByEntity } from "^redux/state/landing";

import { EntityName } from "^types/entity";

const name: EntityName = "article";

const useUpdateStoreRelatedEntitiesOnDelete = () => {
  const [{ id: articleId, collectionsIds, authorsIds, subjectsIds, tagsIds }] =
    ArticleSlice.useContext();

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
    dispatch(removeLandingComponentsByEntity({ id: articleId }));
  };

  return updateStoreRelatedEntitiesOnDelete;
};

export default useUpdateStoreRelatedEntitiesOnDelete;
