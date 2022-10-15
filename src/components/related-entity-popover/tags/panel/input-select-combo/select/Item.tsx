import TagSlice from "^context/tags/TagContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/related-entity-popover/_presentation/SelectEntities";
import { $TranslationText as $Text } from "^components/related-entity-popover/_styles/selectEntities";

const Item = () => {
  const [{ parentType }, { addTagToParent }] = useComponentContext();
  const [{ id: tagId, text }] = TagSlice.useContext();

  return (
    <$SelectEntity_
      addEntityToParent={() => addTagToParent(tagId)}
      entityType="tag"
      parentType={parentType}
    >
      {["_"].map((_, i) => (
        <$Text key={i}>{text}</$Text>
      ))}
    </$SelectEntity_>
  );
};

export default Item;
