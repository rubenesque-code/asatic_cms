import { AuthorIcon } from "^components/Icons";
import {
  AuthorsPopover_,
  AuthorsPopoverButton_,
} from "^components/rich-popover/authors";
import { ParentEntityProp } from "^components/rich-popover/authors/Context";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const HeaderAuthorsPopover_ = ({ parentEntity }: ParentEntityProp) => {
  return (
    <AuthorsPopover_ parentEntity={parentEntity}>
      <Button />
    </AuthorsPopover_>
  );
};

const Button = () => {
  return (
    <AuthorsPopoverButton_>
      {({ authorsStatus }) => (
        <$RelatedEntityButton_ statusArr={authorsStatus} entityName="author">
          <AuthorIcon />
        </$RelatedEntityButton_>
      )}
    </AuthorsPopoverButton_>
  );
};
