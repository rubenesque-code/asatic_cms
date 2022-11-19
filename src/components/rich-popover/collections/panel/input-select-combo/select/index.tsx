import { useSelector } from "^redux/hooks";
import { selectCollections } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import useCollectionsFuzzySearch from "^hooks/collections/useFuzzySearch";

import InputSelectCombo from "^components/InputSelectCombo";
import { $Container } from "^components/rich-popover/_styles/selectEntities";
import { useComponentContext } from "../../../Context";
import Item from "./Item";
import { arrayDivergence, mapIds } from "^helpers/general";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const { parentEntityData } = useComponentContext();

  const excludedCollectionsIds = parentEntityData.collectionsIds;

  const queryItems = useCollectionsFuzzySearch({
    query,
    unwantedIds: parentEntityData.collectionsIds,
  });

  const allCollections = useSelector(selectCollections);
  const isUnusedCollection = Boolean(
    arrayDivergence(mapIds(allCollections), excludedCollectionsIds).length
  );

  return (
    <InputSelectCombo.Select
      isItem={isUnusedCollection}
      isMatch={Boolean(queryItems.length)}
    >
      <$Container>
        {queryItems.map((collection) => (
          <CollectionSlice.Provider collection={collection} key={collection.id}>
            <Item />
          </CollectionSlice.Provider>
        ))}
      </$Container>
    </InputSelectCombo.Select>
  );
};

export default Select;
