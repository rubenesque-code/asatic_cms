import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";

const useAuthorArticles = (authorId: string) => {
  const allArticles = useSelector(selectAll);
  const authorArticles = allArticles.filter((article) => {
    const isAuthorArticle = article.authorIds.includes(authorId);

    return isAuthorArticle;
  });

  return authorArticles;
};

export default useAuthorArticles;
