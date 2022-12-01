import TagSlice from "^context/tags/TagContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/rich-popover/_presentation";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/selectEntities";

const Item = () => {
  const { parentEntityData, addTagRelations } = useComponentContext();
  const [{ id: tagId, text }] = TagSlice.useContext();

  return (
    <$SelectEntity_
      addEntityToParent={() => addTagRelations(tagId)}
      entityType="tag"
      parentType={parentEntityData.name}
    >
      {["_"].map((_, i) => (
        <$Text key={i}>{text}</$Text>
      ))}
    </$SelectEntity_>
  );
};

export default Item;
