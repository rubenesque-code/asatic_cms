import { ReactElement } from "react";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { Collection as CollectionType } from "^types/collection";

import DocLanguages from "^components/DocLanguages";

const ProvidersWithTranslationLanguages = ({
  collection,
  children,
}: {
  collection: CollectionType;
  children: ReactElement;
}) => {
  return (
    <CollectionSlice.Provider collection={collection}>
      {([{ id: collectionId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
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
        </DocLanguages.Provider>
      )}
    </CollectionSlice.Provider>
  );
};

export default ProvidersWithTranslationLanguages;
