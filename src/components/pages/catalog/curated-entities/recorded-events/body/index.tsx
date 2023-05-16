import { useWriteMutationContext } from "^context/WriteMutationContext";

import Table from "./Table";
import { $CreateEntityButton_ } from "../../../_presentation";
import { BodySkeleton_ } from "../../../_containers";

const Body = () => (
  <BodySkeleton_
    createEntity={<CreateButton />}
    entities={<Table />}
    title="Video Documents"
  />
);

export default Body;

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return (
    <$CreateEntityButton_ entityType="video document" onClick={writeToDb} />
  );
};
