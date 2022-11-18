import SubjectSlice from "^context/subjects/SubjectContext";

import { $EntitiesContainer } from "./_styles";

import Entity from "./entity";

// probs want ability to change order

const Populated = () => {
  const [{ articlesIds, blogsIds, collectionsIds, recordedEventsIds }] =
    SubjectSlice.useContext();

  return (
    <$EntitiesContainer>
      {articlesIds.map((id) => (
        <Entity entity={{ id, name: "article" }} key={id} />
      ))}
      {blogsIds.map((id) => (
        <Entity entity={{ id, name: "blog" }} key={id} />
      ))}
      {collectionsIds.map((id) => (
        <Entity entity={{ id, name: "collection" }} key={id} />
      ))}
      {recordedEventsIds.map((id) => (
        <Entity entity={{ id, name: "recordedEvent" }} key={id} />
      ))}
    </$EntitiesContainer>
  );
};

export default Populated;
