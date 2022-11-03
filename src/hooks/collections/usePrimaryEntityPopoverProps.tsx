import { useDispatch, useSelector } from "^redux/hooks";
import { addCollection as addCollectionToArticle } from "^redux/state/articles";
import { addCollection as addCollectionToBlog } from "^redux/state/blogs";
import { addCollection as addCollectionToRecordedEvent } from "^redux/state/recordedEvents";
import { selectPrimaryEntitiesRelatedToCollection } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import { mapIds } from "^helpers/general";

import { MyOmit } from "^types/utilities";

import { PrimaryEntityPopover_Props } from "^components/rich-popover/primary-entity";
import { addChildEntityToCollection } from "^redux/state/collections";

type HookReturn = MyOmit<PrimaryEntityPopover_Props, "children">;

const useCollectionPrimaryEntityPopoverProps = (): HookReturn => {
  const [{ id: collectionId, relatedEntities }] = CollectionSlice.useContext();
  const dispatch = useDispatch();

  const collectionEntities = useSelector((state) =>
    selectPrimaryEntitiesRelatedToCollection(state, relatedEntities)
  );

  return {
    parentActions: {
      addArticleToParent: (articleId) => {
        dispatch(addCollectionToArticle({ collectionId, id: articleId }));
        dispatch(
          addChildEntityToCollection({
            id: collectionId,
            relatedEntity: { entityId: articleId, type: "article" },
          })
        );
      },
      addBlogToParent: (blogId) => {
        dispatch(addCollectionToBlog({ collectionId, id: blogId }));
        dispatch(
          addChildEntityToCollection({
            id: collectionId,
            relatedEntity: { entityId: blogId, type: "blog" },
          })
        );
      },
      addRecordedEventToParent: (recordedEventId) => {
        dispatch(
          addCollectionToRecordedEvent({ collectionId, id: recordedEventId })
        );
        dispatch(
          addChildEntityToCollection({
            id: collectionId,
            relatedEntity: {
              entityId: recordedEventId,
              type: "recorded-event",
            },
          })
        );
      },
    },
    parentData: {
      excludedEntities: {
        articles: mapIds(
          collectionEntities.articles.flatMap((e) => (e ? [e] : []))
        ),
        blogs: mapIds(collectionEntities.blogs.flatMap((e) => (e ? [e] : []))),
        recordedEvents: mapIds(
          collectionEntities.recordedEvents.flatMap((e) => (e ? [e] : []))
        ),
      },
      parentType: "collection",
    },
  };
};

export default useCollectionPrimaryEntityPopoverProps;
