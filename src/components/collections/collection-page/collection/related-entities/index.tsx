import { useSelector } from "^redux/hooks";
import { selectPrimaryEntityRelatedToCollection } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import Empty from "./Empty";
import Populated from "./Populated";
import { Container } from "./styles/styles";

const RelatedDocs = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const { articles, blogs, recordedEvents } = useSelector((state) =>
    selectPrimaryEntityRelatedToCollection(state, collectionId)
  );

  const relatedDocs = [...articles, ...blogs, ...recordedEvents];

  return (
    <Container>{relatedDocs.length ? <Populated /> : <Empty />}</Container>
  );
};

export default RelatedDocs;
