import { $RelatedEntitiesContainer } from "./_presentation";
import Empty from "./Empty";
import Populated from "./populated";
import SubjectSlice from "^context/subjects/SubjectContext";

const Body = () => {
  const [{ articlesIds, blogsIds, collectionsIds, recordedEventsIds }] =
    SubjectSlice.useContext();

  const isContent =
    articlesIds.length ||
    blogsIds.length ||
    collectionsIds.length ||
    recordedEventsIds.length;

  return (
    <$RelatedEntitiesContainer>
      {isContent ? <Populated /> : <Empty />}
    </$RelatedEntitiesContainer>
  );
};

export default Body;
