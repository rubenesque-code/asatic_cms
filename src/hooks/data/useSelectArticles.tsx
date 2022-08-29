import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";

const useSelectArticles = () => {
  const articles = useSelector(selectArticles);

  return articles;
};

export default useSelectArticles;
