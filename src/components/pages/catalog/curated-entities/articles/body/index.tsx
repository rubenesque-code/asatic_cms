import { useWriteMutationContext } from "^context/WriteMutationContext";

import Table from "./Table";
import { $CreateEntityButton_ } from "../../../_presentation";
import { BodySkeleton_ } from "../../../_containers";
import { useDeleteMutationContext } from "../DeleteMutationContext";

const Body = () => {
  const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  return (
    <BodySkeleton_
      createButton={<CreateButton />}
      table={<Table />}
      title="Articles"
      isLoadingMutation={
        createMutationData.isLoading || deleteMutationData.isLoading
      }
    />
  );
};

export default Body;

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <$CreateEntityButton_ entityType="article" onClick={writeToDb} />;
};
