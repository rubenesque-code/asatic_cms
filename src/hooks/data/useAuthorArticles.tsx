import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";

const useAuthorArticles = (authorId: string) => {
  const allArticles = useSelector(selectArticles);
  const authorArticles = allArticles.filter((article) => {
    const isAuthorArticle = article.authorIds.includes(authorId);

    return isAuthorArticle;
  });

  return authorArticles;
};

export default useAuthorArticles;
