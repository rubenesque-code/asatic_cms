import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { useEntityLanguageContext } from "^context/EntityLanguages";

import { AuthorsPopover_ } from "^components/rich-popover";
import { $DocumentHeaderContainer } from "^document-pages/_styles/$articleLikeDocument";
import {
  $Authors_,
  $Date_,
  $Title_,
} from "^document-pages/_presentation/article-like";

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
    { id, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

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
        id,
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
