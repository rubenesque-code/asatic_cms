import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import DocLanguages from "^components/DocLanguages";

import Header, {
  Authors as AuthorsUnpopulated,
  Date as DateUnpopulated,
  Title as TitleUnpopulated,
} from "^components/article-like/entity-page/article/Header";

const ArticleHeader = () => {
  return (
    <Header>
      <>
        <Date />
        <Title />
        <Authors />
      </>
    </Header>
  );
};

export default ArticleHeader;

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] = ArticleSlice.useContext();

  return (
    <DateUnpopulated
      publishDate={publishDate}
      updatePublishDate={(date) => updatePublishDate({ date })}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    ArticleTranslationSlice.useContext();

  return (
    <TitleUnpopulated
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
    <AuthorsUnpopulated
      activeLanguageId={activeLanguageId}
      authorsIds={authorsIds}
    />
  );
};
