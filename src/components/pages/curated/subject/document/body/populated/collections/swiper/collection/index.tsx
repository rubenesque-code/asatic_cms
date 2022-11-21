import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Collection as CollectionType } from "^types/collection";

import Summary from "./Summary";
import Menu from "./Menu";
import Status from "./Status";
import ContainerUtility from "^components/ContainerUtilities";

const Collection = ({ collection }: { collection: CollectionType }) => {
  const [subjectTranslation] = SubjectTranslationSlice.useContext();

  return (
    <CollectionSlice.Provider collection={collection}>
      <CollectionTranslationSlice.Provider
        collectionId={collection.id}
        translation={selectTranslationForActiveLanguage(
          collection.translations,
          subjectTranslation.languageId
        )}
      >
        <ContainerUtility.isHovered>
          {(containerIsHovered) => (
            <>
              <Status />
              <Menu isShowing={containerIsHovered} />
              <Summary />
            </>
          )}
        </ContainerUtility.isHovered>
      </CollectionTranslationSlice.Provider>
    </CollectionSlice.Provider>
  );
};

export default Collection;
