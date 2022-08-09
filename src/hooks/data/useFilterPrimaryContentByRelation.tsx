import { useSelector } from "^redux/hooks";
import { SubContent } from "^types/primary-content";

// todo: since below fields are common to all 'primary content' types, change Types

const useFilterPrimaryContentByRelation = (
  field: keyof SubContent,
  docId: string
) => {
  const allArticles = useSelector(selectAll);
  const filteredArticles = allArticles.filter((article) => {
    const isDocArticle = article[field].includes(docId);

    return isDocArticle;
  });

  return filteredArticles;
};

export default useFilterPrimaryContentByRelation;
