/* eslint-disable jsx-a11y/alt-text */
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import $CardContainer from "../_presentation/$CardContainer_";
import Status_ from "../_containers/Status_";
import Image_ from "../_containers/ArticleLikeImage_";
import $ArticleLikeTitle from "../_presentation/$Title_";
import Authors_ from "../_containers/Authors_";
import ArticleLikeSummaryText_ from "../_containers/ArticleLikeSummaryText";
import ArticleLikeMenu_ from "../_containers/ArticleLikeMenu_";

const entityType = "blog";

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
  const [{ status, publishDate }] = BlogSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

const Title = () => {
  const [{ title }] = BlogTranslationSlice.useContext();

  return <$ArticleLikeTitle title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  return <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />;
};

const SummaryText = () => {
  const [translation, { updateLandingCustomSummary }] =
    BlogTranslationSlice.useContext();

  return (
    <ArticleLikeSummaryText_
      onUpdate={(summary) => updateLandingCustomSummary({ summary })}
      translation={translation}
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    BlogSlice.useContext();

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
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();

  return (
    <Image_
      body={body}
      entityType={entityType}
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
