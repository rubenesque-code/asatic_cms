import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Collection as CollectionType } from "^types/collection";

import SiteLanguage from "^components/SiteLanguage";
import Collection from "./Collection";

const SwiperSlideContent = ({ collectionId }: { collectionId: string }) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;

  return (
    <CollectionProviders collection={collection} key={collection.id}>
      <Collection />
    </CollectionProviders>
  );
};

export default SwiperSlideContent;

const CollectionProviders = ({
  collection,
  children,
}: {
  children: ReactElement;
  collection: CollectionType;
}) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <CollectionSlice.Provider collection={collection} key={collection.id}>
      {([{ id: collectionId, translations }]) => (
        <CollectionTranslationSlice.Provider
          collectionId={collectionId}
          translation={selectTranslationForActiveLanguage(
            translations,
            siteLanguageId
          )}
        >
          {children}
        </CollectionTranslationSlice.Provider>
      )}
    </CollectionSlice.Provider>
  );
};
