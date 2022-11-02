import { useDispatch } from "^redux/hooks";
import { removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntityFromTag } from "^redux/state/tags";

const useOnDeleteDisplayEntity = ({
  entityId,
  authorsIds,
  collectionsIds,
  subjectsIds,
  tagsIds,
}: {
  entityId: string;
  authorsIds?: string[];
  collectionsIds?: string[];
  subjectsIds: string[];
  tagsIds: string[];
}) => {
  const dispatch = useDispatch();

  const onDelete = () => {
    if (authorsIds) {
      for (let i = 0; i < authorsIds.length; i++) {
        const authorId = authorsIds[i];
        dispatch(
          removeRelatedEntityFromAuthor({
            id: authorId,
            relatedEntityId: entityId,
          })
        );
      }
    }
    if (collectionsIds) {
      for (let i = 0; i < collectionsIds.length; i++) {
        const collectionId = collectionsIds[i];
        dispatch(
          removeRelatedEntityFromCollection({
            id: collectionId,
            relatedEntityId: entityId,
          })
        );
      }
    }
    for (let i = 0; i < subjectsIds.length; i++) {
      const subjectId = subjectsIds[i];
      dispatch(
        removeRelatedEntityFromSubject({
          id: subjectId,
          relatedEntityId: entityId,
        })
      );
    }
    for (let i = 0; i < tagsIds.length; i++) {
      const tagId = tagsIds[i];
      dispatch(
        removeRelatedEntityFromTag({
          id: tagId,
          relatedEntityId: entityId,
        })
      );
    }
  };

  return onDelete;
};

export default useOnDeleteDisplayEntity;
