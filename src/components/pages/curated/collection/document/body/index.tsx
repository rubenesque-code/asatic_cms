import { useSelector } from "^redux/hooks";
import { selectPrimaryEntitiesRelatedToCollection } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import { $RelatedEntitiesContainer } from "./_presentation";
import Empty from "./Empty";
import Populated from "./populated";

const Body = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const { articles, blogs, recordedEvents } = useSelector((state) =>
    selectPrimaryEntitiesRelatedToCollection(state, collectionId)
  );

  const relatedEntities = [...articles, ...blogs, ...recordedEvents];

  return (
    <$RelatedEntitiesContainer>
      {relatedEntities.length ? <Populated /> : <Empty />}
    </$RelatedEntitiesContainer>
  );
};

export default Body;
