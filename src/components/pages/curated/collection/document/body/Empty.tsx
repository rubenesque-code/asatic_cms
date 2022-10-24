import $Empty from "./_presentation/$Empty";

import useCollectionPrimaryEntityPopoverProps from "^hooks/collections/usePrimaryEntityPopoverProps";

import { PrimaryEntityPopover_ } from "^components/rich-popover/primary-entity";

const Empty = () => {
  const collectionProps = useCollectionPrimaryEntityPopoverProps();

  return (
    <$Empty
      addPrimaryEntityPopover={(button) => (
        <PrimaryEntityPopover_ {...collectionProps}>
          {button}
        </PrimaryEntityPopover_>
      )}
    />
  );
};

export default Empty;
