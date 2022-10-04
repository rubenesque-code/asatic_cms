import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { getFirstImageFromArticleBody } from "^helpers/article";

import { Empty, Populated } from "../article-like/Image";
import { ImageContainer } from "../styles";

const Image = () => {
  const [
    { landingImage },
    {
      updateLandingImageSrc,
      updateLandingCustomSectionImageVertPosition,
      toggleUseLandingImage,
    },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  const imageId = landingImage.imageId
    ? landingImage.imageId
    : getFirstImageFromArticleBody(body);

  const updateImageSrc = (imageId: string) =>
    updateLandingImageSrc({ imageId });

  if (!landingImage.useImage) {
    return null;
  }

  return (
    <ImageContainer>
      {imageId ? (
        <Populated
          imageId={imageId}
          toggleUseImage={() => toggleUseLandingImage()}
          updateImageSrc={updateImageSrc}
          updateVertPosition={(imgVertPosition) =>
            updateLandingCustomSectionImageVertPosition({ imgVertPosition })
          }
          vertPosition={landingImage.customSection.imgVertPosition}
        />
      ) : (
        <Empty
          toggleUseImage={() => toggleUseLandingImage()}
          updateImageSrc={updateImageSrc}
        />
      )}
    </ImageContainer>
  );
};

export default Image;
