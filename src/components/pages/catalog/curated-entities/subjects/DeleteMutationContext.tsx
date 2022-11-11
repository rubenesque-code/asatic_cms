import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { useDeleteCollectionMutation } from "^redux/services/collections";
import { Mutation } from "^types/mutation";

type Value = [ReturnType<typeof useDeleteCollectionMutation>[0], Mutation[1]];

const Context = createContext<Value>({} as Value);

const DeleteMutationProvider = ({ children }: { children: ReactElement }) => {
  const [deleteArticleFromDb, { isError, isLoading, isSuccess }] =
    useDeleteCollectionMutation();

  return (
    <Context.Provider
      value={[deleteArticleFromDb, { isError, isLoading, isSuccess }]}
    >
      {children}
    </Context.Provider>
  );
};

const useDeleteMutationContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error(
      "useDeleteMutationContext must be used within its provider!"
    );
  }
  return context;
};

export { DeleteMutationProvider, useDeleteMutationContext };
