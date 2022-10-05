/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import CollectionSlice from "^context/collections/CollectionContext";
import {
  Article as Article_,
  Authors as Authors_,
  Date as Date_,
  Menu as Menu_,
  Text as Text_,
  Title as Title_,
  Image as Image_,
} from "../article-like/Article";
import { SubTitleContainer } from "../styles";

const Article = () => {
  return (
    <Article_>
      {(isHovered) => (
        <>
          <Image />
          <Title />
          <SubTitleContainer>
            <Authors />
            <Date />
          </SubTitleContainer>
          <Text />
          <Menu isShowing={isHovered} />
        </>
      )}
    </Article_>
  );
};

export default Article;

const Image = () => {
  const [
    { landingImage },
    {
      toggleUseLandingImage,
      updateLandingImageSrc,
      updateLandingCustomSectionImageVertPosition,
    },
  ] = ArticleSlice.useContext();

  return (
    <Image_
      imageId={landingImage.imageId}
      toggleUseImage={toggleUseLandingImage}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
      updateVertPosition={(imgVertPosition) =>
        updateLandingCustomSectionImageVertPosition({ imgVertPosition })
      }
      useImage={landingImage.useImage}
      vertPosition={landingImage.customSection.imgVertPosition}
    />
  );
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();

  return <Authors_ authorsIds={authorsIds} />;
};

const Date = () => {
  const [{ publishDate }] = ArticleSlice.useContext();

  return <Date_ publishDate={publishDate} />;
};

const Text = () => {
  const [translation, { updateCollectionSummary }] =
    ArticleTranslationSlice.useContext();

  return (
    <Text_
      translation={translation}
      updateDocCollectionSummary={(summary) =>
        updateCollectionSummary({ summary })
      }
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [
    { landingImage },
    { toggleUseLandingImage, updateLandingImageSrc, removeCollection },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <Menu_
      articleBody={body}
      isShowing={isShowing}
      landingImageId={landingImage.imageId}
      removeDocFromCollection={() => removeCollection({ collectionId })}
      toggleUseImage={toggleUseLandingImage}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
      useImage={landingImage.useImage}
    />
  );
};
