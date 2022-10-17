import { useSelector } from "^redux/hooks";
import { selectTotalCollections } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import useCollectionsFuzzySearch from "^hooks/collections/useFuzzySearch";

import InputSelectCombo from "^components/InputSelectCombo";
import { $Container } from "^components/rich-popover/_styles/selectEntities";
import { useComponentContext } from "../../../Context";
import Item from "./Item";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const [{ parentCollectionsIds }] = useComponentContext();

  const numCollections = useSelector(selectTotalCollections);
  const queryItems = useCollectionsFuzzySearch({
    query,
    unwantedIds: parentCollectionsIds,
  });

  return (
    <InputSelectCombo.Select
      show={Boolean(numCollections)}
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
