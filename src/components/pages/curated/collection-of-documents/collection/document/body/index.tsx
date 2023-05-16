import CollectionSlice from "^context/collections/CollectionContext";

import { $RelatedEntitiesContainer } from "./_presentation";
import Empty from "./Empty";
import Populated from "./populated";

const Body = () => {
  const [{ articlesIds, blogsIds, recordedEventsIds }] =
    CollectionSlice.useContext();

  return (
    <$RelatedEntitiesContainer>
      {articlesIds.length || blogsIds.length || recordedEventsIds.length ? (
        <Populated />
      ) : (
        <Empty />
      )}
    </$RelatedEntitiesContainer>
  );
};

export default Body;
