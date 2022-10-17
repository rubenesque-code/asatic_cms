import { TagIcon } from "^components/Icons";
import { TagsPopoverButton_ } from "^components/rich-popover/tags";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

const TagsHeaderButton = () => {
  return (
    <TagsPopoverButton_>
      {({ entityTagsStatus }) => (
        <$RelatedEntityButton_
          errors={
            typeof entityTagsStatus === "object" ? entityTagsStatus : null
          }
        >
          <TagIcon />
        </$RelatedEntityButton_>
      )}
    </TagsPopoverButton_>
  );
};

export default TagsHeaderButton;
