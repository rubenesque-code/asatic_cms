/* eslint-disable jsx-a11y/alt-text */
import { $SwiperSectionLayout_ } from "^curated-pages/collection-of-documents/_presentation";
import { Swiper_ } from "^curated-pages/collection-of-documents/_containers/swiper";
import { Collection } from "^types/collection";
import { orderDisplayContent } from "^helpers/displayContent";
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import {
  Image_,
  Title_,
  Text_,
  Status_,
  SwiperComponentMenu_,
} from "../_containers/summary";
import { getCollectionSummary } from "^helpers/collection";
import ProvidersWithOwnLanguages from "^components/_containers/collections/ProvidersWithOwnLanguages";
import ContainerUtility from "^components/ContainerUtilities";
import tw from "twin.macro";

const CollectionsSwiperSection = ({
  collections,
  ...removeFromParentProp
}: {
  collections: Collection[];
} & RemoveFromParentProp) => {
  return (
    <$SwiperSectionLayout_
      moreFromText="More from collections"
      swiper={<Swiper collections={collections} {...removeFromParentProp} />}
      title="Collections"
    />
  );
};

export default CollectionsSwiperSection;

const Swiper = ({
  collections,
  ...removeFromParentProp
}: { collections: Collection[] } & RemoveFromParentProp) => {
  const ordered = orderDisplayContent(collections);

  return (
    <Swiper_
      slides={ordered.map((collection) => (
        <SwiperSlide
          collection={collection}
          {...removeFromParentProp}
          key={collection.id}
        />
      ))}
    />
  );
};

const SwiperSlide = ({
  collection,
  ...removeFromParentProp
}: { collection: Collection } & RemoveFromParentProp) => {
  return (
    <ProvidersWithOwnLanguages recordedEvent={collection}>
      <CollectionSummary {...removeFromParentProp} />
    </ProvidersWithOwnLanguages>
  );
};

const CollectionSummary = (removeFromParentProp: RemoveFromParentProp) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative h-full`}>
      {(containerIsHovered) => (
        <>
          <Image />
          <Title />
          <Text />
          <Status />
          <Menu isShowing={containerIsHovered} {...removeFromParentProp} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const Image = () => {
  const [
    { summaryImage, bannerImage },
    { updateSummaryImageSrc, updateSummaryImageVertPosition },
  ] = CollectionSlice.useContext();

  const imageId = summaryImage.imageId || bannerImage.imageId || null;

  return (
    <Image_
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

  return <Title_ title={title} />;
};

const Text = () => {
  const [translation, { updateSummaryText }] =
    CollectionTranslationSlice.useContext();

  const text = getCollectionSummary(translation);

  return (
    <Text_
      maxCharacters={180}
      text={text}
      updateSummary={(text) => updateSummaryText({ text })}
    />
  );
};

const Status = () => {
  const [{ status, publishDate }] = CollectionSlice.useContext();

  return <Status_ status={status} publishDate={publishDate} />;
};

type RemoveFromParentProp = {
  removeFromParent?: {
    parent: { name: "subject"; id: string };
    func: (entityId: string) => void;
  };
};

const Menu = ({
  isShowing,
  removeFromParent,
}: {
  isShowing: boolean;
} & RemoveFromParentProp) => {
  const [
    { id },
    { routeToEditPage, removeRelatedEntity: removeRelatedEntityFromCollection },
  ] = CollectionSlice.useContext();

  return (
    <SwiperComponentMenu_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      removeComponent={
        !removeFromParent
          ? undefined
          : () => {
              removeFromParent.func(id);
              removeRelatedEntityFromCollection({
                relatedEntity: { id, name: removeFromParent.parent.name },
              });
            }
      }
    />
  );
};
