import { AuthorIcon } from "^components/Icons";
import {
  AuthorsPopover_,
  AuthorsPopoverButton_,
} from "^components/rich-popover/authors";
import { ParentEntityProp } from "^components/rich-popover/authors/Context";
import { selectEntityAuthorsStatus } from "^redux/state/complex-selectors/entity-status/author";
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
        <$RelatedEntityButton_
          status={interpretStatusForButton(authorsStatus)}
          entityName="author"
        >
          <AuthorIcon />
        </$RelatedEntityButton_>
      )}
    </AuthorsPopoverButton_>
  );
};

type EntityCollectionsStatus = ReturnType<typeof selectEntityAuthorsStatus>;

const interpretStatusForButton = (statusArr: EntityCollectionsStatus) => {
  const isUndefined = statusArr.find((status) => status === "undefined");
  if (isUndefined) {
    return "missing entity";
  }

  const isMissingTranslation = statusArr.find(
    (status) =>
      typeof status === "object" &&
      status.status === "warning" &&
      status.warnings?.includes("missing translation for parent language")
  );
  if (isMissingTranslation) {
    return "missing translation";
  }

  return "good";
};
