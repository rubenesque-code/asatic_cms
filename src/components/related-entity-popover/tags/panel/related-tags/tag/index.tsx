import { useSelector } from "^redux/hooks";
import { selectTagById } from "^redux/state/tags";

import TagSlice from "^context/tags/TagContext";

import { $MissingEntity } from "^components/related-entity-popover/_presentation/RelatedEntities";
import Found from "./Found";

const Tag = ({ id }: { id: string }) => {
  const tag = useSelector((state) => selectTagById(state, id));

  return tag ? (
    <TagSlice.Provider tag={tag}>
      <Found />
    </TagSlice.Provider>
  ) : (
    <$MissingEntity entityType="tag" />
  );
};

export default Tag;
