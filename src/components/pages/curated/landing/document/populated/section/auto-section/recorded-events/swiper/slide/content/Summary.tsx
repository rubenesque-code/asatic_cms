/* eslint-disable jsx-a11y/alt-text */
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import {
  getArticleSummaryFromTranslation,
  getImageFromArticleBody,
} from "^helpers/article-like";

import {
  Image_,
  Authors_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { Text_ } from "^components/pages/curated/_containers/article-like";
import { $imageContainer, $authors, $Title } from "../../../../_styles/entity";

const Summary = () => {
  return (
    <>
      <Image />
      <Title />
      <Authors />
      <Text />
    </>
  );
};

export default Summary;

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <$Title color="cream">
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return (
    <Authors_
      activeLanguageId={languageId}
      authorsIds={authorsIds}
      styles={$authors}
    />
  );
};

const Image = () => {
  const [
    { summaryImage },
    {
      toggleUseSummaryImage,
      updateSummaryImageSrc,
      updateSummaryImageVertPosition,
    },
  ] = RecordedEventSlice.useContext();
  const [{ body }] = RecordedEventTranslationSlice.useContext();

  const imageId = summaryImage.imageId || getImageFromArticleBody(body);

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
