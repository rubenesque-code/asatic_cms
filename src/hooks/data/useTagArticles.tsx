import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";

const useTagArticles = (tagId: string) => {
  const allArticles = useSelector(selectArticles);
  const tagArticles = allArticles.filter((article) => {
    const isTagArticle = article.tagIds.includes(tagId);

    return isTagArticle;
  });

  return tagArticles;
};

export default useTagArticles;
