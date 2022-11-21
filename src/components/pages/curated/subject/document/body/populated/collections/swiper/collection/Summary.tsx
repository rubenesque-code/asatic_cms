/* eslint-disable jsx-a11y/alt-text */
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { Image_, Title_ } from "^curated-pages/_containers/entity-summary";
import { SummaryText_ } from "^curated-pages/_containers/article-like";

import {
  $SummaryContainer,
  $Title,
  $Text,
  $CollectionHeading,
  $collectionImage,
} from "../../../_styles/entity";

const Summary = () => {
  return (
    <$SummaryContainer>
      <Image />
      <CollectionHeading />
      <Title />
      <Text />
    </$SummaryContainer>
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
      containerStyles={$collectionImage}
      actions={{
        updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition }),
      }}
      data={{
        imageId,
        vertPosition: summaryImage.vertPosition || 50,
        isUsingImage: true,
      }}
    />
  );
};

const CollectionHeading = () => (
  <$CollectionHeading>Collection</$CollectionHeading>
);

const Title = () => {
  const [{ title }] = CollectionTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Text = () => {
  const [{ description, summary }, { updateLandingAutoSummary }] =
    CollectionTranslationSlice.useContext();

  return (
    <$Text>
      <SummaryText_
        numChars={180}
        text={summary.general || description}
        updateText={(text) => updateLandingAutoSummary({ text })}
      />
    </$Text>
  );
};
