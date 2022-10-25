import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import DocLanguages from "^components/DocLanguages";
import { $DocumentHeaderContainer } from "../../_styles/$ArticleLike";
import { $Authors_, $Date_, $Title_ } from "../../_presentation/article-like";

const Header = () => (
  <$DocumentHeaderContainer>
    <Date />
    <Title />
    <Authors />
  </$DocumentHeaderContainer>
);

export default Header;

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] = ArticleSlice.useContext();

  return (
    <$Date_
      publishDate={publishDate}
      updatePublishDate={(date) => updatePublishDate({ date })}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    ArticleTranslationSlice.useContext();

  return (
    <$Title_
      title={title}
      translationId={translationId}
      updateTitle={(title) => updateTitle({ title })}
    />
  );
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <$Authors_ activeLanguageId={activeLanguageId} authorsIds={authorsIds} />
  );
};