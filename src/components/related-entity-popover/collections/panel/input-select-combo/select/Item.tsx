import CollectionSlice from "^context/collections/CollectionContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/related-entity-popover/_presentation/SelectEntities";
import { Translation_ } from "^components/related-entity-popover/_containers/SelectEntity";

const Item = () => {
  const [{ parentType }, { addCollectionToParent }] = useComponentContext();
  const [{ id: collectionId, translations }] = CollectionSlice.useContext();

  const processed = translations.filter((t) => t.title.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => addCollectionToParent(collectionId)}
      entityType="collection"
      parentType={parentType}
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.title}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;
