import { useWriteMutationContext } from "^context/WriteMutationContext";

import Table from "./Table";
import { $CreateEntityButton_ } from "../../../_presentation";
import { BodySkeleton_ } from "../../../_containers";

const Body = () => (
  <BodySkeleton_
    createButton={<CreateButton />}
    table={<Table />}
    title="Collections"
  />
);

export default Body;

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <$CreateEntityButton_ entityType="collection" onClick={writeToDb} />;
};
