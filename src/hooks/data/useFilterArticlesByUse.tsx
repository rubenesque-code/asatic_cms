import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";
import { Article } from "^types/article";

const useFilterArticlesByUse = (
  field: keyof Pick<
    Article,
    "authorIds" | "collectionIds" | "subjectIds" | "tagIds"
  >,
  docId: string
) => {
  const allArticles = useSelector(selectAll);
  const filteredArticles = allArticles.filter((article) => {
    const isDocArticle = article[field].includes(docId);

    return isDocArticle;
  });

  return filteredArticles;
};

export default useFilterArticlesByUse;
