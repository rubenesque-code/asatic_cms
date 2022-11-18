import ArticleSlice from "^context/articles/ArticleContext";
import { Article as ArticleType } from "^types/article";

import Summary from "./Summary";
import Menu from "./Menu";
import Status from "./Status";
import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

const Article = ({
  article,
  containerIsHovered,
}: {
  article: ArticleType;
  containerIsHovered: boolean;
}) => {
  const [subjectTranslation] = SubjectTranslationSlice.useContext();

  return (
    <ArticleSlice.Provider article={article}>
      <ArticleTranslationSlice.Provider
        articleId={article.id}
        translation={selectTranslationForActiveLanguage(
          article.translations,
          subjectTranslation.languageId
        )}
      >
        <>
          <Status />
          <Summary />
          <Menu isShowing={containerIsHovered} />
        </>
      </ArticleTranslationSlice.Provider>
    </ArticleSlice.Provider>
  );
};

export default Article;
