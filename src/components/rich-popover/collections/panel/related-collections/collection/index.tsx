import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import { useComponentContext } from "../../../Context";
import CollectionSlice from "^context/collections/CollectionContext";

import { ROUTES } from "^constants/routes";

import {
  $MissingEntity,
  $RelatedEntityMenu_,
  $RelatedEntity_,
} from "^components/rich-popover/_presentation";
import Found from "./Found";

const RelatedEntity = ({ id }: { id: string }) => {
  return (
    <$RelatedEntity_ entity={<Collection id={id} />} menu={<Menu id={id} />} />
  );
};

export default RelatedEntity;

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

const Menu = ({ id }: { id: string }) => {
  const collection = useSelector((state) => selectCollectionById(state, id));

  const { removeCollectionRelations } = useComponentContext();

  return (
    <$RelatedEntityMenu_
      relatedEntity={{
        remove: () => removeCollectionRelations(id),
        href: collection ? `${ROUTES.COLLECTIONS.route}/${id}` : undefined,
      }}
    />
  );
};
