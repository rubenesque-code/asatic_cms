import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import { useComponentContext } from "../../../Context";

import {
  $Entity,
  $MissingEntity,
} from "^components/rich-popover/_presentation";
import Found from "./Found";

const Collection = ({ id: collectionId }: { id: string }) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  );

  const { parentEntityData, removeCollectionRelations } = useComponentContext();

  return (
    <$Entity
      entity={{
        element: collection ? (
          <CollectionSlice.Provider collection={collection}>
            <Found />
          </CollectionSlice.Provider>
        ) : (
          <$MissingEntity entityType="collection" />
        ),
        name: "collection",
      }}
      parentEntity={{
        name: parentEntityData.name,
        removeFrom: () => removeCollectionRelations(collectionId),
      }}
    />
  );
};

export default Collection;
