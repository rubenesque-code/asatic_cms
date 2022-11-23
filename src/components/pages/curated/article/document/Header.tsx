import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { useEntityLanguageContext } from "^context/EntityLanguages";

import { AuthorsPopover_ } from "^components/rich-popover";
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
  const [
    { id, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToArticle,
      removeRelatedEntity: removeRelatedEntityFromArticle,
    },
  ] = ArticleSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <AuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id,
        name: "article",
        removeAuthor: (authorId) =>
          removeRelatedEntityFromArticle({
            relatedEntity: { id: authorId, name: "author" },
          }),
        translationLanguagesIds: languagesIds,
      }}
    >
      <$Authors_ activeLanguageId={activeLanguageId} authorsIds={authorsIds} />
    </AuthorsPopover_>
  );
};
