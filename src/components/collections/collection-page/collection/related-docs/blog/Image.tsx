import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { getFirstImageFromArticleBody } from "^helpers/article";

import { Empty, Populated, PopulatedMenu } from "../article-like/Image";
import { ImageContainer } from "../styles";

const Image = () => {
  const [
    { landingImage },
    { updateLandingImageSrc, updateLandingCustomSectionImageVertPosition },
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();

  const imageId = landingImage.imageId
    ? landingImage.imageId
    : getFirstImageFromArticleBody(body);

  const updateImageSrc = (imageId: string) =>
    updateLandingImageSrc({ imageId });

  return (
    <ImageContainer>
      {imageId ? (
        <Populated
          imageId={imageId}
          menu={(isShowing) => (
            <PopulatedMenu
              isShowing={isShowing}
              updateImageSrc={updateImageSrc}
              updateVertPosition={(imgVertPosition) =>
                updateLandingCustomSectionImageVertPosition({ imgVertPosition })
              }
              vertPosition={landingImage.customSection.imgVertPosition}
            />
          )}
          vertPosition={landingImage.customSection.imgVertPosition}
        />
      ) : (
        <Empty updateImageSrc={updateImageSrc} />
      )}
    </ImageContainer>
  );
};

export default Image;
