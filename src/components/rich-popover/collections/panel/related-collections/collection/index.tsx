import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import { $MissingEntity } from "^components/rich-popover/_presentation/RelatedEntities";
import Found from "./Found";

const Collection = ({ id }: { id: string }) => {
  const collection = useSelector((state) => selectCollectionById(state, id));

  return collection ? (
    <CollectionSlice.Provider collection={collection}>
      <Found />
    </CollectionSlice.Provider>
  ) : (
    <$MissingEntity entityType="collection" />
  );
};

export default Collection;
