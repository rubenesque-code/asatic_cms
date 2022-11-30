import TagSlice from "^context/tags/TagContext";
import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectCollectionsByIds } from "^redux/state/collections";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";
import { selectSubjectsByIds } from "^redux/state/subjects";

const useRelatedDocuments = () => {
  const [
    { articlesIds, blogsIds, collectionsIds, recordedEventsIds, subjectsIds },
  ] = TagSlice.useContext();

  const relatedDocuments = useSelector((state) => ({
    articles: {
      all: selectArticlesByIds(state, articlesIds),
      get defined() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get isUndefined() {
        return this.all.includes(undefined);
      },
    },
    blogs: {
      all: selectBlogsByIds(state, blogsIds),
      get defined() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get isUndefined() {
        return this.all.includes(undefined);
      },
    },
    collections: {
      all: selectCollectionsByIds(state, collectionsIds),
      get defined() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get isUndefined() {
        return this.all.includes(undefined);
      },
    },
    recordedEvents: {
      all: selectRecordedEventsByIds(state, recordedEventsIds),
      get defined() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get isUndefined() {
        return this.all.includes(undefined);
      },
    },
    subjects: {
      all: selectSubjectsByIds(state, subjectsIds),
      get defined() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get isUndefined() {
        return this.all.includes(undefined);
      },
    },
  }));

  return relatedDocuments;
};

export default useRelatedDocuments;
