import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { selectBlogs } from "^redux/state/blogs";
import { selectRecordedEvents } from "^redux/state/recordedEvents";

const usePrimaryDocuments = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const primaryDocuments = useSelector((state) => ({
    articles: selectArticles(state),
    blogs: selectBlogs(state),
    recordedEvents: selectRecordedEvents(state),
  }));

  return primaryDocuments;
};

export default usePrimaryDocuments;
