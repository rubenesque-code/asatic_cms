import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";

const useSelectArticles = () => {
  const articles = useSelector(selectAll);

  return articles;
};

export default useSelectArticles;
