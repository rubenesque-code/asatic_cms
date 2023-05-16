import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";
import { Collection } from "^types/collection";

const HandleDocCollection = ({ collectionId }: { collectionId: string }) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  );

  return collection ? (
    <HandleTranslation collection={collection} />
  ) : (
    <SubContentMissingFromStore subContentType="collection" />
  );
};

export default HandleDocCollection;

const HandleTranslation = ({ collection }: { collection: Collection }) => {
  return (
    <>
      {collection.title.length ? (
        collection.title
      ) : (
        <MissingText tooltipText="missing title for collection" />
      )}
    </>
  );
};
