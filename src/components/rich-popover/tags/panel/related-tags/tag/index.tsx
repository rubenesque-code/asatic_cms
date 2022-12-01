import { useSelector } from "^redux/hooks";
import { selectTagById } from "^redux/state/tags";

import TagSlice from "^context/tags/TagContext";
import { useComponentContext } from "../../../Context";

import {
  $EntityOld,
  $MissingEntity,
} from "^components/rich-popover/_presentation";
import Found from "./Found";

const Tag = ({ id: tagId }: { id: string }) => {
  const tag = useSelector((state) => selectTagById(state, tagId));

  const { parentEntityData, removeTagRelations } = useComponentContext();

  return (
    <$EntityOld
      entity={{
        element: tag ? (
          <TagSlice.Provider tag={tag}>
            <Found />
          </TagSlice.Provider>
        ) : (
          <$MissingEntity entityType="tag" />
        ),
        name: "tag",
      }}
      parentEntity={{
        name: parentEntityData.name,
        removeFrom: () => removeTagRelations(tagId),
      }}
    />
  );
};

export default Tag;
