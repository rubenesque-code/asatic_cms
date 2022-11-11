import TagSlice from "^context/tags/TagContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/rich-popover/_presentation/SelectEntities";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/selectEntities";

const Item = () => {
  const [{ parentType }, { addTag: addTagToParent }] = useComponentContext();
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
