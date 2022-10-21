import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

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
  const [{ publishDate }, { updatePublishDate }] = BlogSlice.useContext();

  return (
    <$Date_
      publishDate={publishDate}
      updatePublishDate={(date) => updatePublishDate({ date })}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    BlogTranslationSlice.useContext();

  return (
    <$Title_
      title={title}
      translationId={translationId}
      updateTitle={(title) => updateTitle({ title })}
    />
  );
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <$Authors_ activeLanguageId={activeLanguageId} authorsIds={authorsIds} />
  );
};
