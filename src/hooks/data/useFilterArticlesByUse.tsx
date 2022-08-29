import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { Article } from "^types/article";

// todo: since below fields are common to all 'primary content' types, change Types

const useFilterArticlesByUse = (
  field: keyof Pick<
    Article,
    "authorIds" | "collectionIds" | "subjectIds" | "tagIds"
  >,
  docId: string
) => {
  const allArticles = useSelector(selectArticles);
  const filteredArticles = allArticles.filter((article) => {
    const isDocArticle = article[field].includes(docId);

    return isDocArticle;
  });

  return filteredArticles;
};

export default useFilterArticlesByUse;
