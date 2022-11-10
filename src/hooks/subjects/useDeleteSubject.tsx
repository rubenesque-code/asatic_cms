import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvent } from "^redux/state/recordedEvents";
// import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
// import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";

import { EntityName } from "^types/entity";
import SubjectSlice from "^context/subjects/SubjectContext";
import { useDeleteSubjectMutation } from "^redux/services/subjects";

const useDeleteSubject = () => {
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
  const [deleteSubjectFromDb] = useDeleteSubjectMutation();

  const dispatch = useDispatch();

  const name: EntityName = "subject";
  const relatedEntity = {
    id: subjectId,
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

  const handleDelete = async () => {
    await deleteSubjectFromDb({
      id: subjectId,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
      tagsIds,
      useToasts: true,
    });
    updateRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteSubject;
