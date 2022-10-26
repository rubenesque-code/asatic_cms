import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Collection } from "^types/collection";

import SiteLanguage from "^components/SiteLanguage";
import Content from "./content";

const Slide = ({ collectionId: collectionId }: { collectionId: string }) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;

  return (
    <CollectionProviders collection={collection} key={collection.id}>
      <Content />
    </CollectionProviders>
  );
};

export default Slide;

const CollectionProviders = ({
  collection: collection,
  children,
}: {
  children: ReactElement;
  collection: Collection;
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
