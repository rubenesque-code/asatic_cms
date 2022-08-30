import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";
import { Collection } from "^types/collection";

const HandleDocCollection = ({
  collectionId,
  docActiveLanguageId,
}: {
  collectionId: string;
  docActiveLanguageId: string;
}) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  );

  return collection ? (
    <HandleTranslation
      docActiveLanguageId={docActiveLanguageId}
      collection={collection}
    />
  ) : (
    <SubContentMissingFromStore subContentType="collection" />
  );
};

export default HandleDocCollection;

const HandleTranslation = ({
  collection: { translations },
  docActiveLanguageId,
}: {
  collection: Collection;
  docActiveLanguageId: string;
}) => {
  const translation = translations.find(
    (t) => t.languageId === docActiveLanguageId
  );

  return (
    <>
      {translation ? (
        translation.title
      ) : (
        <MissingText tooltipText="missing translation for collection" />
      )}
    </>
  );
};
