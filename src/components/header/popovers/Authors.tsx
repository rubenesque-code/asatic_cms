import { MyOmit } from "^types/utilities";

import { AuthorIcon } from "^components/Icons";
import {
  AuthorsPopover_,
  AuthorsPopoverButton_,
  AuthorsPopover_Props,
} from "^components/rich-popover/authors";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const HeaderAuthorsPopover_ = (
  props: MyOmit<AuthorsPopover_Props, "children">
) => {
  return (
    <AuthorsPopover_ {...props}>
      <Button />
    </AuthorsPopover_>
  );
};

const Button = () => {
  return (
    <AuthorsPopoverButton_>
      {({ authorsStatus }) => (
        <$RelatedEntityButton_
          errors={typeof authorsStatus === "object" ? authorsStatus : null}
          tooltip="authors"
        >
          <AuthorIcon />
        </$RelatedEntityButton_>
      )}
    </AuthorsPopoverButton_>
  );
};
