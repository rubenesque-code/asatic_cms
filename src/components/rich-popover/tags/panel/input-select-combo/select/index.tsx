import { useSelector } from "^redux/hooks";
import { selectTotalTags } from "^redux/state/tags";

import TagSlice from "^context/tags/TagContext";

import useTagsFuzzySearch from "^hooks/tags/useFuzzySearch";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./Item";

import { $Container } from "^components/rich-popover/_styles/selectEntities";
import { useComponentContext } from "../../../Context";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const [{ parentTagsIds }] = useComponentContext();

  const numTags = useSelector(selectTotalTags);
  const queryItems = useTagsFuzzySearch({
    query,
    unwantedIds: parentTagsIds,
  });

  return (
    <InputSelectCombo.Select
      show={Boolean(numTags)}
      isMatch={Boolean(queryItems.length)}
    >
      <$Container>
        {queryItems.map((tag) => (
          <TagSlice.Provider tag={tag} key={tag.id}>
            <Item />
          </TagSlice.Provider>
        ))}
      </$Container>
    </InputSelectCombo.Select>
  );
};

export default Select;
