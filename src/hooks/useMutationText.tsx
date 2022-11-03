import { useEffect, useState } from "react";
import { Mutation } from "^types/mutation";

const useMutationText = ({
  createMutationData,
  deleteMutationData,
}: {
  createMutationData: Mutation[1];
  deleteMutationData: Mutation[1];
}) => {
  const [mutationType, setMutationType] = useState<"save" | "delete" | null>(
    null
  );

  useEffect(() => {
    if (createMutationData.isLoading) {
      setMutationType("save");
    } else if (deleteMutationData.isLoading) {
      setMutationType("delete");
    }
  }, [createMutationData.isLoading, deleteMutationData.isLoading]);

  const isError = createMutationData.isError || deleteMutationData.isError;
  const isLoading =
    createMutationData.isLoading || deleteMutationData.isLoading;
  const isSuccess =
    createMutationData.isSuccess || deleteMutationData.isSuccess;

  return {
    mutationType,
    isError,
    isLoading,
    isSuccess,
  };
};

export default useMutationText;
