import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import DocLanguages from "^components/DocLanguages";
import { $DocumentHeaderContainer } from "../../_styles/$ArticleLike";
import { $Authors_, $Date_, $Title_ } from "../../_presentation/article-like";
import { AuthorsPopover_ } from "^components/rich-popover";

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
  const [
    { id: blogId, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <AuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id: blogId,
        name: "blog",
        removeAuthor: (authorId) =>
          removeRelatedEntityFromBlog({
            relatedEntity: { id: authorId, name: "author" },
          }),
        translationLanguagesIds: languagesIds,
      }}
    >
      <$Authors_ activeLanguageId={activeLanguageId} authorsIds={authorsIds} />
    </AuthorsPopover_>
  );
};
