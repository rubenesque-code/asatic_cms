import { useSelector } from "^redux/hooks";
import { selectPrimaryEntitiesRelatedToCollection } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import Empty from "./Empty";
import Populated from "./Populated";
import { RelatedEntitiesContainer } from "./styles/Containers";

const RelatedDocs = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const { articles, blogs, recordedEvents } = useSelector((state) =>
    selectPrimaryEntitiesRelatedToCollection(state, collectionId)
  );

  const relatedDocs = [...articles, ...blogs, ...recordedEvents];

  return (
    <RelatedEntitiesContainer>
      {relatedDocs.length ? <Populated /> : <Empty />}
    </RelatedEntitiesContainer>
  );
};

export default RelatedDocs;
