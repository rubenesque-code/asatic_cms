import CollectionSlice from "^context/collections/CollectionContext";

import Empty from "./Empty";
import Populated from "./Populated";

const RelatedDocs = () => {
  const [{ relatedDocs }] = CollectionSlice.useContext();

  return relatedDocs.length ? <Populated /> : <Empty />;
};

export default RelatedDocs;
