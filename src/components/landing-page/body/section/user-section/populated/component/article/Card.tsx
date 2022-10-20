/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import $CardContainer from "../_presentation/$CardContainer_";
import Status_ from "../_containers/Status_";
import Image_ from "../_containers/ArticleLikeImage_";
import $ArticleLikeTitle from "../_presentation/$Title_";
import Authors_ from "../_containers/Authors_";
import ArticleLikeSummaryText_ from "../_containers/ArticleLikeSummaryText";
import ArticleLikeMenu_ from "../_containers/ArticleLikeMenu_";

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
  const [translation, { updateLandingCustomSummary }] =
    ArticleTranslationSlice.useContext();

  return (
    <ArticleLikeSummaryText_
      onUpdate={(summary) => updateLandingCustomSummary({ summary })}
      translation={translation}
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <ArticleLikeMenu_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      toggleUseImageOn={toggleUseSummaryImage}
      usingImage={summaryImage.useImage}
    />
  );
};

const Image = () => {
  const [
    { summaryImage, landingCustomSection },
    {
      toggleUseSummaryImage,
      updateLandingCustomImageAspectRatio,
      updateLandingCustomImageVertPosition,
      updateSummaryImageSrc,
    },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <Image_
      body={body}
      entityType="article"
      landingCustomSection={landingCustomSection}
      summaryImage={summaryImage}
      toggleUseImage={toggleUseSummaryImage}
      updateAspectRatio={(aspectRatio) =>
        updateLandingCustomImageAspectRatio({ aspectRatio })
      }
      updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
      updateVertPosition={(vertPosition) =>
        updateLandingCustomImageVertPosition({ vertPosition })
      }
    />
  );
};
