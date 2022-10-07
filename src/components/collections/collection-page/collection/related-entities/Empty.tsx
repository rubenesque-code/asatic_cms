import { useDispatch } from "^redux/hooks";
import { addCollection as addCollectionToArticle } from "^redux/state/articles";
import { addCollection as addCollectionToBlog } from "^redux/state/blogs";
import { addCollection as addCollectionToRecordedEvent } from "^redux/state/recordedEvents";

import CollectionSlice from "^context/collections/CollectionContext";

import PrimaryContentPopover from "^components/add-primary-entity-popover";
import BodyEmpty from "^components/display-content/entity-page/article/BodyEmpty";
import { EmptyContainer, EmptyContentContainer } from "./styles";

const Empty = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();

  const dispatch = useDispatch();

  return (
    <EmptyContainer>
      <EmptyContentContainer>
        <BodyEmpty text="Get started with the collection.">
          <PrimaryContentPopover
            addEntity={({ entityId, entityType }) => {
              if (entityType === "article") {
                dispatch(
                  addCollectionToArticle({ collectionId, id: entityId })
                );
              } else if (entityType === "blog") {
                dispatch(addCollectionToBlog({ collectionId, id: entityId }));
              } else if (entityType === "recorded-event") {
                dispatch(
                  addCollectionToRecordedEvent({ id: entityId, collectionId })
                );
              }
            }}
            addEntityTo="collection"
          >
            <BodyEmpty.AddContentButton>
              Add document
            </BodyEmpty.AddContentButton>
          </PrimaryContentPopover>
        </BodyEmpty>
      </EmptyContentContainer>
    </EmptyContainer>
  );
};

export default Empty;
