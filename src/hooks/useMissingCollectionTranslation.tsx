import { useSelector } from "^redux/hooks";
import { selectEntitiesByIds as selectCollectionsByIds } from "^redux/state/collections";

const useMissingCollectionTranslation = ({
  languagesById,
  collectionsById,
}: {
  languagesById: string[];
  collectionsById: string[];
}) => {
  const collections = useSelector((state) =>
    selectCollectionsByIds(state, collectionsById)
  );
  const validCollections = collections.flatMap((c) => (c ? [c] : []));
  let isMissingTranslation = false;

  for (let i = 0; i < languagesById.length; i++) {
    const languageId = languagesById[i];

    for (let j = 0; j < validCollections.length; j++) {
      const { translations } = validCollections[j];
      const collectionLanguagesById = translations.map((t) => t.languageId);

      if (!collectionLanguagesById.includes(languageId)) {
        isMissingTranslation = true;
      }
    }
  }

  return isMissingTranslation;
};

export default useMissingCollectionTranslation;
