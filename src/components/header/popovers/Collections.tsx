import { MyOmit } from "^types/utilities";

import { CollectionIcon } from "^components/Icons";
import {
  CollectionsPopover_,
  CollectionsPopover_Props,
  CollectionsPopoverButton_,
} from "^components/rich-popover/collections";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const HeaderCollectionsPopover_ = (
  props: MyOmit<CollectionsPopover_Props, "children">
) => {
  return (
    <CollectionsPopover_ {...props}>
      <Button />
    </CollectionsPopover_>
  );
};

const Button = () => {
  return (
    <CollectionsPopoverButton_>
      {({ entityCollectionsStatus }) => (
        <$RelatedEntityButton_
          statusArr={entityCollectionsStatus}
          entityName="collection"
        >
          <CollectionIcon />
        </$RelatedEntityButton_>
      )}
    </CollectionsPopoverButton_>
  );
};
