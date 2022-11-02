import CollectionSlice from "^context/collections/CollectionContext";

import { $RelatedEntitiesContainer } from "./_presentation";
import Empty from "./Empty";
import Populated from "./populated";

const Body = () => {
  const [{ relatedEntities }] = CollectionSlice.useContext();
  console.log("relatedEntities:", relatedEntities);

  return (
    <$RelatedEntitiesContainer>
      {relatedEntities.length ? <Populated /> : <Empty />}
    </$RelatedEntitiesContainer>
  );
};

export default Body;
