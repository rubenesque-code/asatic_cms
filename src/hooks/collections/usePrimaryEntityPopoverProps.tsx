import { useDispatch, useSelector } from "^redux/hooks";
import { addCollection as addCollectionToArticle } from "^redux/state/articles";
import { addCollection as addCollectionToBlog } from "^redux/state/blogs";
import { addCollection as addCollectionToRecordedEvent } from "^redux/state/recordedEvents";
import { selectPrimaryEntitiesRelatedToCollection } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import { mapIds } from "^helpers/general";

import { MyOmit } from "^types/utilities";

import { PrimaryEntityPopover_Props } from "^components/rich-popover/primary-entity";

type HookReturn = MyOmit<PrimaryEntityPopover_Props, "children">;

const useCollectionPrimaryEntityPopoverProps = (): HookReturn => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const dispatch = useDispatch();

  const collectionEntities = useSelector((state) =>
    selectPrimaryEntitiesRelatedToCollection(state, collectionId)
  );

  return {
    parentActions: {
      addArticleToParent: (articleId) =>
        dispatch(addCollectionToArticle({ collectionId, id: articleId })),
      addBlogToParent: (blogId) =>
        dispatch(addCollectionToBlog({ collectionId, id: blogId })),
      addRecordedEventToParent: (recordedEventId) =>
        dispatch(
          addCollectionToRecordedEvent({ collectionId, id: recordedEventId })
        ),
    },
    parentData: {
      excludedEntities: {
        articles: mapIds(collectionEntities.articles),
        blogs: mapIds(collectionEntities.blogs),
        recordedEvents: mapIds(collectionEntities.recordedEvents),
      },
      parentType: "collection",
    },
  };
};

export default useCollectionPrimaryEntityPopoverProps;
