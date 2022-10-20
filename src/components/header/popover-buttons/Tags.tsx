import { TagIcon } from "^components/Icons";
import { TagsPopoverButton_ } from "^components/rich-popover/tags";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const TagsHeaderButton = () => {
  return (
    <TagsPopoverButton_>
      {({ entityTagsStatus }) => (
        <$RelatedEntityButton_
          errors={
            typeof entityTagsStatus === "object" ? entityTagsStatus : null
          }
          tooltip="tags"
        >
          <TagIcon />
        </$RelatedEntityButton_>
      )}
    </TagsPopoverButton_>
  );
};
