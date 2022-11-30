import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { selectBlogs } from "^redux/state/blogs";
import { selectCollections } from "^redux/state/collections";
import { selectRecordedEvents } from "^redux/state/recordedEvents";
import { selectSubjects } from "^redux/state/subjects";

const useDisplayDocuments = () => {
  const displayDocuments = useSelector((state) => ({
    articles: selectArticles(state),
    blogs: selectBlogs(state),
    collections: selectCollections(state),
    recordedEvents: selectRecordedEvents(state),
    subjects: selectSubjects(state),
  }));

  return displayDocuments;
};

export default useDisplayDocuments;
