/* eslint-disable jsx-a11y/alt-text */
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import {
  Image_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { Text_ } from "^components/pages/curated/_containers/article-like";
import { $imageContainer, $Title, $Text } from "../../../../_styles/entity";

const Summary = () => {
  return (
    <>
      <Image />
      <Title />
      <Text />
    </>
  );
};

export default Summary;

const Image = () => {
  const [
    { summaryImage, bannerImage },
    { updateSummaryImageSrc, updateSummaryImageVertPosition },
  ] = CollectionSlice.useContext();

  const imageId = summaryImage.imageId || bannerImage.imageId || null;

  return (
    <Image_
      containerStyles={$imageContainer}
      actions={{
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
  const [{ title }] = CollectionTranslationSlice.useContext();

  return (
    <$Title color="white">
      <Title_ title={title} />
    </$Title>
  );
};

const Text = () => {
  const [{ description, landingAutoSummary }, { updateLandingAutoSummary }] =
    CollectionTranslationSlice.useContext();

  return (
    <$Text>
      <Text_
        numChars={180}
        text={landingAutoSummary || description}
        updateText={(text) => updateLandingAutoSummary({ text })}
      />
    </$Text>
  );
};
