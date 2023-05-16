import AuthorSlice from "^context/authors/AuthorContext";
import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";

const useRelatedDocuments = () => {
  const [{ articlesIds, blogsIds, recordedEventsIds }] =
    AuthorSlice.useContext();

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
    recordedEvents: {
      all: selectRecordedEventsByIds(state, recordedEventsIds),
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
