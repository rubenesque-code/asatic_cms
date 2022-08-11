import { useDispatch, useSelector } from "^redux/hooks";
import {
  selectAll as selectArticles,
  removeAuthor as removeAuthorFromArticle,
  removeCollection as removeCollectionFromArticle,
  removeSubject as removeSubjectFromArticle,
  removeTag as removeTagFromArticle,
} from "^redux/state/articles";
import {
  selectAll as selectBlogs,
  removeAuthor as removeAuthorFromBlog,
  removeCollection as removeCollectionFromBlog,
  removeSubject as removeSubjectFromBlog,
  removeTag as removeTagFromBlog,
} from "^redux/state/blogs";
import {
  selectAll as selectRecordedEvents,
  removeAuthor as removeAuthorFromRecordedEvent,
  removeCollection as removeCollectionFromRecorededEvent,
  removeSubject as removeSubjectFromRecordedEvent,
  removeTag as removeTagFromRecordedEvent,
} from "^redux/state/recordedEvents";

import {
  filterPrimaryContentByRelationToSubContentDoc,
  subContentTypeToField,
} from "^helpers/general";

import { SubContentType } from "^types/primary-content";

const useDeleteSubContentFromPrimaryContent = ({
  subContentId,
  subContentType,
}: {
  subContentId: string;
  subContentType: SubContentType;
}) => {
  const subContentField = subContentTypeToField(subContentType);

  const dispatch = useDispatch();

  const articles = useSelector(selectArticles);
  const blogs = useSelector(selectBlogs);
  const recordedEvents = useSelector(selectRecordedEvents);

  const relatedArticles = filterPrimaryContentByRelationToSubContentDoc({
    content: articles,
    subContentField,
    subContentId,
  });

  const relatedBlogs = filterPrimaryContentByRelationToSubContentDoc({
    content: blogs,
    subContentField,
    subContentId,
  });

  const relatedRecordedEvents = filterPrimaryContentByRelationToSubContentDoc({
    content: recordedEvents,
    subContentField,
    subContentId,
  });

  const handleDeleteSubContentFromPrimaryContent = () => {
    for (let i = 0; i < relatedArticles.length; i++) {
      const { id: articleId } = relatedArticles[i];
      if (subContentType === "author") {
        dispatch(
          removeAuthorFromArticle({ authorId: subContentId, id: articleId })
        );
      }
      if (subContentType === "collection") {
        dispatch(
          removeCollectionFromArticle({
            collectionId: subContentId,
            id: articleId,
          })
        );
      }
      if (subContentType === "subject") {
        dispatch(
          removeSubjectFromArticle({
            subjectId: subContentId,
            id: articleId,
          })
        );
      }
      if (subContentType === "tag") {
        dispatch(
          removeTagFromArticle({
            tagId: subContentId,
            id: articleId,
          })
        );
      }
    }
    for (let i = 0; i < relatedBlogs.length; i++) {
      const { id: blogId } = relatedBlogs[i];
      if (subContentType === "author") {
        dispatch(removeAuthorFromBlog({ authorId: subContentId, id: blogId }));
      }
      if (subContentType === "collection") {
        dispatch(
          removeCollectionFromBlog({
            collectionId: subContentId,
            id: blogId,
          })
        );
      }
      if (subContentType === "subject") {
        dispatch(
          removeSubjectFromBlog({
            subjectId: subContentId,
            id: blogId,
          })
        );
      }
      if (subContentType === "tag") {
        dispatch(
          removeTagFromBlog({
            tagId: subContentId,
            id: blogId,
          })
        );
      }
    }
    for (let i = 0; i < relatedRecordedEvents.length; i++) {
      const { id: recordedEventId } = relatedRecordedEvents[i];
      if (subContentType === "author") {
        dispatch(
          removeAuthorFromRecordedEvent({
            authorId: subContentId,
            id: recordedEventId,
          })
        );
      }
      if (subContentType === "collection") {
        dispatch(
          removeCollectionFromRecorededEvent({
            collectionId: subContentId,
            id: recordedEventId,
          })
        );
      }
      if (subContentType === "subject") {
        dispatch(
          removeSubjectFromRecordedEvent({
            subjectId: subContentId,
            id: recordedEventId,
          })
        );
      }
      if (subContentType === "tag") {
        dispatch(
          removeTagFromRecordedEvent({
            tagId: subContentId,
            id: recordedEventId,
          })
        );
      }
    }
  };

  return handleDeleteSubContentFromPrimaryContent;
};

export default useDeleteSubContentFromPrimaryContent;
