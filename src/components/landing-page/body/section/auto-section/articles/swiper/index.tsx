import SiteLanguage from "^components/SiteLanguage";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { selectTranslationForActiveLanguage } from "^helpers/displayContent";
import { arrayDivergence, mapIds } from "^helpers/general";
import useFindDocsUsedInCustomLandingSections from "^hooks/useFindDocsUsedInCustomLandingSections";
import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { Article as ArticleType } from "^types/article";
import Swiper_ from "../../_containers/Swiper";
import SwiperElement_ from "./SwiperElement";

const Swiper = () => {
  const articles = useSelector(selectArticles);

  const usedArticlesIds = useFindDocsUsedInCustomLandingSections("article");
  const articlesIds = [...new Set(mapIds(articles))];
  const unusedArticlesIds = arrayDivergence(articlesIds, usedArticlesIds);

  const articlesOrderedIds = [...unusedArticlesIds, ...usedArticlesIds];
  const articlesOrdered = articlesOrderedIds.map(
    (id) => articles.find((a) => a.id === id)!
  );

  return (
    <Swiper_
      colorTheme="cream"
      elements={articlesOrdered.map((article) => (
        <SwiperElement article={article} key={article.id} />
      ))}
    />
  );
};

export default Swiper;

const SwiperElement = ({ article }: { article: ArticleType }) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <ArticleSlice.Provider article={article} key={article.id}>
      {([{ id: articleId, translations }]) => (
        <ArticleTranslationSlice.Provider
          articleId={articleId}
          translation={selectTranslationForActiveLanguage(
            translations,
            siteLanguageId
          )}
        >
          <SwiperElement_ />
        </ArticleTranslationSlice.Provider>
      )}
    </ArticleSlice.Provider>
  );
};
