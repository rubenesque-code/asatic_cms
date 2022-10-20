import { AuthorIcon } from "^components/Icons";
import { AuthorsPopoverButton_ } from "^components/rich-popover/authors";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const AuthorsHeaderButton = () => {
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
