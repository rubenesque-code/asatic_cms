import { CollectionIcon } from "^components/Icons";
import { CollectionsPopoverButton_ } from "^components/rich-popover/collections";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

const CollectionsHeaderButton = () => {
  return (
    <CollectionsPopoverButton_>
      {({ entityCollectionsStatus }) => (
        <$RelatedEntityButton_
          errors={
            typeof entityCollectionsStatus === "object"
              ? entityCollectionsStatus.errors
              : null
          }
          tooltip="collections"
        >
          <CollectionIcon />
        </$RelatedEntityButton_>
      )}
    </CollectionsPopoverButton_>
  );
};

export default CollectionsHeaderButton;
