import { MyOmit } from "^types/utilities";

import { TagIcon } from "^components/Icons";
import {
  TagsPopoverButton_,
  TagsPopover_,
  TagsPopover_Props,
} from "^components/rich-popover/tags";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const HeaderTagsPopover_ = (
  props: MyOmit<TagsPopover_Props, "children">
) => {
  return (
    <TagsPopover_ {...props}>
      <Button />
    </TagsPopover_>
  );
};

const Button = () => {
  return (
    <TagsPopoverButton_>
      {({ entityTagsStatus }) => (
        <$RelatedEntityButton_ status={entityTagsStatus} entityName="tag">
          <TagIcon />
        </$RelatedEntityButton_>
      )}
    </TagsPopoverButton_>
  );
};
