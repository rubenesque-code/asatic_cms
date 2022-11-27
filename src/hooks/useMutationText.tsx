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
  }, [createMutationData, deleteMutationData]);

  return {
    mutationType,
    isError:
      mutationType === "save"
        ? createMutationData.isError
        : mutationType === "delete"
        ? deleteMutationData.isError
        : false,
    isLoading:
      mutationType === "save"
        ? createMutationData.isLoading
        : mutationType === "delete"
        ? deleteMutationData.isLoading
        : false,

    isSuccess:
      mutationType === "save"
        ? createMutationData.isSuccess
        : mutationType === "delete"
        ? deleteMutationData.isSuccess
        : false,
  };
};

export default useMutationText;
