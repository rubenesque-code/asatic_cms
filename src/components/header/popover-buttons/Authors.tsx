import { AuthorIcon } from "^components/Icons";
import { AuthorsPopoverButton_ } from "^components/rich-popover/authors";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

const AuthorsHeaderButton = () => {
  return (
    <AuthorsPopoverButton_>
      {({ authorsStatus }) => (
        <$RelatedEntityButton_
          errors={typeof authorsStatus === "object" ? authorsStatus : null}
        >
          <AuthorIcon />
        </$RelatedEntityButton_>
      )}
    </AuthorsPopoverButton_>
  );
};

export default AuthorsHeaderButton;
