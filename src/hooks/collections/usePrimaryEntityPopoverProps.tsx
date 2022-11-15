import CollectionSlice from "^context/collections/CollectionContext";

import { MyOmit } from "^types/utilities";

import { PrimaryEntityPopover_Props } from "^components/rich-popover/primary-entity";

type HookReturn = MyOmit<PrimaryEntityPopover_Props, "children">;

const useCollectionPrimaryEntityPopoverProps = (): HookReturn => {
  const [
    { id: collectionId, articlesIds, blogsIds, recordedEventsIds },
    { addRelatedEntity: addRelatedEntityToCollection },
  ] = CollectionSlice.useContext();

  return {
    parentEntity: {
      actions: {
        addPrimaryEntity: (relatedEntity) =>
          addRelatedEntityToCollection({ relatedEntity }),
      },
      data: {
        existingEntitiesIds: {
          articles: articlesIds,
          blogs: blogsIds,
          recordedEvents: recordedEventsIds,
        },
        id: collectionId,
        name: "collection",
      },
    },
  };
};

export default useCollectionPrimaryEntityPopoverProps;
