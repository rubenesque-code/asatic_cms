/* eslint-disable jsx-a11y/alt-text */
import CollectionSlice from "^context/collections/CollectionContext";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import {
  getArticleLikeSummaryText,
  getImageFromArticleLikeBody,
} from "^helpers/article-like";

import {
  Authors_,
  Date_,
  Title_,
  Image_,
} from "^components/pages/curated/_containers/entity-summary";
import { ToggleUseImageButton_ } from "^components/pages/curated/_containers/ImageMenu_";
import { $Container_ } from "../_presentation/$Summary_";
import { Menu_ } from "../_containers/Menu_";
import { $Title, $SubTitle, $imageContainer } from "../_styles";
import { useEntityLanguageContext } from "^context/EntityLanguages";
import { Text_ } from "^curated-pages/_containers/entity-summary";

const Summary = () => {
  return (
    <$Container_>
      {(isHovered) => (
        <>
          <Image />
          <Title />
          <$SubTitle>
            <Authors />
            <Date />
          </$SubTitle>
          <Text />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$Container_>
  );
};

export default Summary;

const Image = () => {
  const [
    { summaryImage },
    {
      toggleUseSummaryImage,
      updateSummaryImageSrc,
      updateSummaryImageVertPosition,
    },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  const imageId = summaryImage.imageId || getImageFromArticleLikeBody(body);

  return (
    <Image_
      containerStyles={$imageContainer}
      actions={{
        toggleUseImage: toggleUseSummaryImage,
        updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition }),
      }}
      data={{
        imageId,
        vertPosition: summaryImage.vertPosition || 50,
        isUsingImage: summaryImage.useImage,
      }}
    />
  );
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <Authors_ activeLanguageId={activeLanguageId} authorsIds={authorsIds} />
  );
};

const Date = () => {
  const [{ publishDate }] = ArticleSlice.useContext();

  return <Date_ publishDate={publishDate} />;
};

const Text = () => {
  const [translation, { updateSummary }] = ArticleTranslationSlice.useContext();

  const text = getArticleLikeSummaryText(translation);

  return (
    <Text_
      maxChars={300}
      text={text}
      updateSummary={(summary) => updateSummary({ summary })}
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: collectionId },
    { removeRelatedEntity: removeRelatedEntityFromCollection },
  ] = CollectionSlice.useContext();
  const [
    { summaryImage, id: articleId },
    {
      toggleUseSummaryImage,
      removeRelatedEntity: removeRelatedEntityFromArticle,
      routeToEditPage,
    },
  ] = ArticleSlice.useContext();

  const handleRemoveArticleFromCollection = () => {
    removeRelatedEntityFromCollection({
      relatedEntity: { id: articleId, name: "article" },
    });
    removeRelatedEntityFromArticle({
      relatedEntity: { id: collectionId, name: "collection" },
    });
  };

  return (
    <Menu_
      isShowing={isShowing}
      removeEntityFromCollection={handleRemoveArticleFromCollection}
      routeToEditPage={routeToEditPage}
      extraButtons={
        !summaryImage.useImage ? (
          <ToggleUseImageButton_ toggleUseImage={toggleUseSummaryImage} />
        ) : null
      }
    />
  );
};
