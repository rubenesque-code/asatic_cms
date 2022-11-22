import { MyOmit } from "^types/utilities";

import { CollectionIcon } from "^components/Icons";
import {
  CollectionsPopover_,
  CollectionsPopover_Props,
  CollectionsPopoverButton_,
} from "^components/rich-popover/collections";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";
import { selectEntityCollectionsStatus } from "^redux/state/complex-selectors/entity-status/collection";

export const HeaderCollectionsPopover_ = (
  props: MyOmit<CollectionsPopover_Props, "children">
) => {
  return (
    <CollectionsPopover_ {...props}>
      <Button />
    </CollectionsPopover_>
  );
};

type EntityCollectionsStatus = ReturnType<typeof selectEntityCollectionsStatus>;

const interpretCollectionsStatusForButton = (
  statusArr: EntityCollectionsStatus
) => {
  const isUndefined = statusArr.find((status) => status === "undefined");
  if (isUndefined) {
    return "missing entity";
  }

  const isInvalid = statusArr.find(
    (status) => typeof status === "object" && status.status === "invalid"
  );
  if (isInvalid) {
    return "invalid entity";
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

const Button = () => {
  return (
    <CollectionsPopoverButton_>
      {({ entityCollectionsStatus }) => (
        <$RelatedEntityButton_
          status={interpretCollectionsStatusForButton(entityCollectionsStatus)}
          entityName="collection"
        >
          <CollectionIcon />
        </$RelatedEntityButton_>
      )}
    </CollectionsPopoverButton_>
  );
};
