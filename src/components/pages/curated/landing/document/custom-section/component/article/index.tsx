import { useSelector } from "^redux/hooks";
import { selectArticleById } from "^redux/state/articles";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { Article as ArticleType } from "^types/article";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import SiteLanguage from "^components/SiteLanguage";
import MissingEntity_ from "../_containers/MissingEntity_";
import Card from "^curated-pages/collection-of-documents/_components/ArticleSummary";
// import Card from "./Card";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

const Article = () => {
  const [{ entity, id: componentId }] =
    LandingCustomSectionComponentSlice.useContext();
  const article = useSelector((state) => selectArticleById(state, entity.id));

  return article ? (
    <Found article={article} />
  ) : (
    <MissingEntity_ componentId={componentId} entityType="article" />
  );
};

export default Article;

const Found = ({ article }: { article: ArticleType }) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();
  const [{ changeSpanIsDisabled, width }, { removeOne, updateComponentWidth }] =
    LandingCustomSectionComponentSlice.useContext();

  return (
    <ArticleSlice.Provider article={article}>
      <ArticleTranslationSlice.Provider
        articleId={article.id}
        translation={selectTranslationForActiveLanguage(
          article.translations,
          siteLanguageId
        )}
      >
        <Card
          ignoreDeclaredSpan={changeSpanIsDisabled}
          removeComponent={removeOne}
          span={width}
          updateComponentSpan={(width) => updateComponentWidth({ width })}
        />
      </ArticleTranslationSlice.Provider>
    </ArticleSlice.Provider>
  );
};
