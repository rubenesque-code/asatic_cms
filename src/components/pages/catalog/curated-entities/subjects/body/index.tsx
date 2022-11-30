import { useWriteMutationContext } from "^context/WriteMutationContext";

import Table from "./Table";
import { $CreateEntityButton_ } from "../../../_presentation";
import { BodySkeleton_ } from "../../../_containers";

// todo: is same for each curated entity apart from  table, title and entity type on create button
const Body = () => (
  <BodySkeleton_
    createEntity={<CreateButton />}
    entities={<Table />}
    title="Subjects"
  />
);

export default Body;

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <$CreateEntityButton_ entityType="subject" onClick={writeToDb} />;
};
