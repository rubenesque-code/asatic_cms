import { useSelector } from "^redux/hooks";
import { selectTagById } from "^redux/state/tags";

import { useComponentContext } from "../../../Context";
import TagSlice from "^context/tags/TagContext";

import { ROUTES } from "^constants/routes";

import {
  $MissingEntity,
  $RelatedEntityMenu_,
  $RelatedEntity_,
} from "^components/rich-popover/_presentation";
import Found from "./Found";
import { Tag as TagType } from "^types/tag";

const RelatedEntity = ({ id }: { id: string }) => {
  const tag = useSelector((state) => selectTagById(state, id));

  return (
    <$RelatedEntity_
      entity={<Tag tag={tag} />}
      menu={<Menu tagId={id} tagIsMissing={Boolean(tag)} />}
    />
  );
};

export default RelatedEntity;

const Tag = ({ tag }: { tag: TagType | undefined }) => {
  return tag ? (
    <TagSlice.Provider tag={tag}>
      <Found />
    </TagSlice.Provider>
  ) : (
    <$MissingEntity entityType="subject" />
  );
};

const Menu = ({
  tagIsMissing,
  tagId,
}: {
  tagIsMissing: boolean;
  tagId: string;
}) => {
  const { removeTagRelations } = useComponentContext();

  return (
    <$RelatedEntityMenu_
      relatedEntity={{
        remove: () => removeTagRelations(tagId),
        href: tagIsMissing ? undefined : `${ROUTES.TAGS.route}/${tagId}`,
      }}
    />
  );
};
