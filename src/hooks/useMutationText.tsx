import { useEffect, useState } from "react";
import { Mutation } from "^types/mutation";

const useMutationText = ({
  createMutationData,
  deleteMutationData,
  saveMutationData,
}: {
  createMutationData: Mutation[1];
  deleteMutationData: Mutation[1];
  saveMutationData?: Mutation[1];
}) => {
  const [mutationType, setMutationType] = useState<
    "save" | "delete" | "create" | null
  >(null);

  useEffect(() => {
    if (createMutationData.isLoading) {
      setMutationType("create");
    } else if (deleteMutationData.isLoading) {
      setMutationType("delete");
    } else if (saveMutationData?.isLoading) {
      setMutationType("save");
    }
  }, [createMutationData, deleteMutationData, saveMutationData]);

  return {
    mutationType,
    isError:
      mutationType === "save"
        ? saveMutationData!.isError
        : mutationType === "delete"
        ? deleteMutationData.isError
        : mutationType === "create"
        ? createMutationData.isError
        : false,
    isLoading:
      mutationType === "save"
        ? saveMutationData!.isLoading
        : mutationType === "delete"
        ? deleteMutationData.isLoading
        : mutationType === "create"
        ? createMutationData.isLoading
        : false,

    isSuccess:
      mutationType === "save"
        ? saveMutationData!.isSuccess
        : mutationType === "delete"
        ? deleteMutationData.isSuccess
        : mutationType === "create"
        ? createMutationData.isSuccess
        : false,
  };
};

export default useMutationText;
