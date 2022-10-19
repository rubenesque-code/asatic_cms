/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import Status_ from "../_containers/Status_";
import Authors_ from "../_containers/ArticleLikeAuthors_";
import ArticleLikeSummaryText_ from "../_containers/ArticleLikeSummaryText";
import $ArticleLikeTitle from "../_presentation/$ArticleLikeTitle_";
import $CardContainer from "../_presentation/$CardContainer_";
import ArticleLikeMenu_ from "../_containers/ArticleLikeMenu_";
import MyImage from "^components/images/MyImage";
import { getImageFromArticleBody } from "^helpers/article-like";
import ResizeImage from "^components/resize/Image";
import ContentMenu from "^components/menus/Content";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import $Image_ from "../_presentation/$Image_";
import tw from "twin.macro";

const Card = () => {
  return (
    <$CardContainer>
      {(isHovered) => (
        <>
          <Status />
          <Image />
          <Title />
          <Authors />
          <SummaryText />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$CardContainer>
  );
};

export default Card;

const Status = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <$ArticleLikeTitle title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />;
};

const SummaryText = () => {
  // const [{ authorsIds }] = ArticleSlice.useContext();
  const [translation, { updateLandingCustomSummary }] =
    ArticleTranslationSlice.useContext();

  return (
    <ArticleLikeSummaryText_
      // authorsIds={authorsIds}
      onUpdate={(summary) => updateLandingCustomSummary({ summary })}
      translation={translation}
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <ArticleLikeMenu_
      isShowing={isShowing}
      toggleUseImageOn={toggleUseSummaryImage}
      usingImage={summaryImage.useImage}
    />
  );
};

// todo: toggle use image on image menu

const Image = () => {
  const [{ summaryImage }] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  if (!summaryImage.useImage) {
    return null;
  }

  const imageId = summaryImage.imageId || getImageFromArticleBody(body);

  return (
    <$Image_>
      {(isHovered) => (
        <>
          {imageId ? <ImagePopulated imageId={imageId} /> : <ImageEmpty />}
          <ImageMenu isShowing={isHovered} />
        </>
      )}
    </$Image_>
  );
};

const ImageEmpty = () => {
  return <div css={[]}>No image</div>;
};

const ImagePopulated = ({ imageId }: { imageId: string }) => {
  const [{ landingCustomSection }, { updateLandingCustomImageAspectRatio }] =
    ArticleSlice.useContext();

  return (
    <ResizeImage
      aspectRatio={landingCustomSection.imgAspectRatio}
      onAspectRatioChange={(aspectRatio) =>
        updateLandingCustomImageAspectRatio({ aspectRatio })
      }
    >
      <MyImage
        imgId={imageId}
        objectFit="cover"
        vertPosition={landingCustomSection.imgVertPosition || 50}
      />
    </ResizeImage>
  );
};

const ImageMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { landingCustomSection },
    { updateLandingCustomImageVertPosition, updateSummaryImageSrc },
  ] = ArticleSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <ImageMenuButtons
        updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
        updateVertPosition={(vertPosition) =>
          updateLandingCustomImageVertPosition({ vertPosition })
        }
        vertPosition={landingCustomSection.imgVertPosition}
      />
    </ContentMenu>
  );
};
