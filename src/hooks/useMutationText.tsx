import { useEffect, useState } from "react";
import { Mutation } from "^types/mutation";

const useMutationText = ({
  createMutationData: {
    isError: isWriteError,
    isLoading: isLoadingWrite,
    isSuccess: isWriteSuccess,
  },
  deleteMutationData: {
    isError: isDeleteError,
    isLoading: isLoadingDelete,
    isSuccess: isDeleteSuccess,
  },
}: {
  createMutationData: Mutation[1];
  deleteMutationData: Mutation[1];
}) => {
  const [mutationType, setMutationType] = useState<"save" | "delete" | null>(
    null
  );

  useEffect(() => {
    if (isLoadingWrite) {
      setMutationType("save");
    }
    if (isLoadingDelete) {
      setMutationType("delete");
    }
  }, [isLoadingWrite, isLoadingDelete]);

  const isError = isWriteError || isDeleteError;
  const isLoading = isLoadingWrite || isLoadingDelete;
  const isSuccess = isWriteSuccess || isDeleteSuccess;

  return {
    mutationType,
    isError,
    isLoading,
    isSuccess,
  };
};

export default useMutationText;
