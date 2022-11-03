import { useDispatch } from "^redux/hooks";
import { removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntityFromTag } from "^redux/state/tags";
import {
  removeCollection as removeCollectionFromArticle,
  removeSubject as removeSubjectFromArticle,
} from "^redux/state/articles";
import {
  removeCollection as removeCollectionFromBlog,
  removeSubject as removeSubjectFromBlog,
} from "^redux/state/blogs";
import {
  removeCollection as removeCollectionFromRecordedEvent,
  removeSubject as removeSubjectFromRecordedEvent,
} from "^redux/state/recordedEvents";

const useUpdateSubEntitiesInStoreOnParentDelete = ({
  entityId,
  authorsIds,
  collectionsIds,
  subjectsIds,
  tagsIds,
  articlesIds,
  blogsIds,
  recordedEventsIds,
  parent,
}: {
  entityId: string;
  authorsIds?: string[];
  collectionsIds?: string[];
  subjectsIds?: string[];
  tagsIds: string[];
  articlesIds: string[];
  blogsIds: string[];
  recordedEventsIds: string[];
  parent?: { type: "collection" | "subject"; id: string };
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
    if (subjectsIds) {
      for (let i = 0; i < subjectsIds.length; i++) {
        const subjectId = subjectsIds[i];
        dispatch(
          removeRelatedEntityFromSubject({
            id: subjectId,
            relatedEntityId: entityId,
          })
        );
      }
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
    if (articlesIds) {
      for (let i = 0; i < articlesIds.length; i++) {
        const articleId = articlesIds[i];
        if (parent?.type === "collection") {
          dispatch(
            removeCollectionFromArticle({
              collectionId: parent.id,
              id: articleId,
            })
          );
        }
        if (parent?.type === "subject") {
          dispatch(
            removeSubjectFromArticle({
              subjectId: parent.id,
              id: articleId,
            })
          );
        }
      }
    }
    if (blogsIds) {
      for (let i = 0; i < blogsIds.length; i++) {
        const blogId = blogsIds[i];
        if (parent?.type === "collection") {
          dispatch(
            removeCollectionFromBlog({
              collectionId: parent.id,
              id: blogId,
            })
          );
        }
        if (parent?.type === "subject") {
          dispatch(
            removeSubjectFromBlog({
              subjectId: parent.id,
              id: blogId,
            })
          );
        }
      }
    }
    if (recordedEventsIds) {
      for (let i = 0; i < recordedEventsIds.length; i++) {
        const recordedEventId = recordedEventsIds[i];
        if (parent?.type === "collection") {
          dispatch(
            removeCollectionFromRecordedEvent({
              collectionId: parent.id,
              id: recordedEventId,
            })
          );
        }
        if (parent?.type === "subject") {
          dispatch(
            removeSubjectFromRecordedEvent({
              subjectId: parent.id,
              id: recordedEventId,
            })
          );
        }
      }
    }
  };

  return onDelete;
};

export default useUpdateSubEntitiesInStoreOnParentDelete;
