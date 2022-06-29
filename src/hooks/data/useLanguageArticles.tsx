import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";

const useLanguageArticles = (languageId: string) => {
  const allArticles = useSelector(selectAll);
  const languageArticles = allArticles.filter((article) => {
    const articleLanguagesById = article.translations.flatMap(
      (t) => t.languageId
    );
    const isLanguageArticle = articleLanguagesById.includes(languageId);

    return isLanguageArticle;
  });

  return languageArticles;
};

export default useLanguageArticles;
