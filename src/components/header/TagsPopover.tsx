import { TagSimple } from "phosphor-react";

import WithTags, { Props } from "^components/WithTags";
import HeaderIconButton from "./IconButton";

const TagsPopover = (props: Props) => {
  return (
    <WithTags {...props}>
      <HeaderIconButton tooltip="tags">
        <TagSimple />
      </HeaderIconButton>
    </WithTags>
  );
};

export default TagsPopover;
