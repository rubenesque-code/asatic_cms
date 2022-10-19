/* eslint-disable jsx-a11y/alt-text */
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { Title_, Text_, Image_ } from "../../../_containers/Entity_";

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

  const imageId = summaryImage.imageId || bannerImage.imageId;

  return (
    <Image_
      imageId={imageId}
      summaryImage={summaryImage}
      updateImageSrc={(imageId: string) => updateSummaryImageSrc({ imageId })}
      updateVertPosition={(vertPosition: number) =>
        updateSummaryImageVertPosition({ vertPosition })
      }
    />
  );
};

const Title = () => {
  const [{ title }] = CollectionTranslationSlice.useContext();

  return <Title_ color="white" title={title} />;
};

const Text = () => {
  const [{ description }, { updateDescription }] =
    CollectionTranslationSlice.useContext();

  return (
    <Text_
      numChars={180}
      text={description}
      updateEntityAutoSectionSummary={(description) =>
        updateDescription({ description })
      }
    />
  );
};
