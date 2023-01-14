import { ReactElement } from "react";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import { EntityLanguageProvider } from "^context/EntityLanguages";

import { Collection as CollectionType } from "^types/collection";

const ProvidersWithOwnLanguages = ({
  collection,
  children,
}: {
  collection: CollectionType;
  children: ReactElement;
}) => {
  return (
    <CollectionSlice.Provider collection={collection}>
      {([{ id: collectionId, languagesIds, translations }]) => (
        <EntityLanguageProvider entity={{ languagesIds }}>
          {({ activeLanguageId }) => (
            <CollectionTranslationSlice.Provider
              collectionId={collectionId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </CollectionTranslationSlice.Provider>
          )}
        </EntityLanguageProvider>
      )}
    </CollectionSlice.Provider>
  );
};

export default ProvidersWithOwnLanguages;
