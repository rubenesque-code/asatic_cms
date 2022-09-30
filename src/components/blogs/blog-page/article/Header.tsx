import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import DocLanguages from "^components/DocLanguages";

import HeaderUnpopulated from "^components/article-like/entity-page/article/Header";

const Header = () => {
  return (
    <HeaderUnpopulated>
      <>
        <Date />
        <Title />
        <Authors />
      </>
    </HeaderUnpopulated>
  );
};

export default Header;

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] = BlogSlice.useContext();

  return (
    <HeaderUnpopulated.Date
      publishDate={publishDate}
      updatePublishDate={(date) => updatePublishDate({ date })}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    BlogTranslationSlice.useContext();

  return (
    <HeaderUnpopulated.Title
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
    <HeaderUnpopulated.Authors
      activeLanguageId={activeLanguageId}
      authorsIds={authorsIds}
    />
  );
};
