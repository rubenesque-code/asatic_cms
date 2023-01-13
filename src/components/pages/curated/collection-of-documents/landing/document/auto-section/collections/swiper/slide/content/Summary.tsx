/* eslint-disable jsx-a11y/alt-text */
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import {
  Image_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { $imageContainer, $Title } from "../../../../_styles/entity";
import { Text_ } from "^curated-pages/_containers/entity-summary";
import { getCollectionSummary } from "^helpers/collection";

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
        isUsingImage: true,
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
  const [translation, { updateSummaryText }] =
    CollectionTranslationSlice.useContext();

  const text = getCollectionSummary(translation);

  return (
    <Text_
      maxChars={180}
      text={text}
      updateSummary={(text) => updateSummaryText({ text })}
    />
  );
};
