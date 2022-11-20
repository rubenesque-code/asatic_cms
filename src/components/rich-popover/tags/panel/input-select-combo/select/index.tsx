import { useSelector } from "^redux/hooks";
import { selectTags } from "^redux/state/tags";

import TagSlice from "^context/tags/TagContext";

import useTagsFuzzySearch from "^hooks/tags/useFuzzySearch";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./Item";

import { $Container } from "^components/rich-popover/_styles/selectEntities";
import { useComponentContext } from "../../../Context";
import { arrayDivergence, mapIds } from "^helpers/general";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const { parentEntityData } = useComponentContext();

  const excludedTagsIds = parentEntityData.tagsIds;

  const queryItems = useTagsFuzzySearch({
    query,
    excludedIds: excludedTagsIds,
  });

  const allTags = useSelector(selectTags);
  const isUnusedTag = Boolean(
    arrayDivergence(mapIds(allTags), excludedTagsIds).length
  );

  return (
    <InputSelectCombo.Select
      isItem={isUnusedTag}
      isMatch={Boolean(queryItems.length)}
      entityName="tag"
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
