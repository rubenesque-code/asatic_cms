import { createContext, ReactElement, useContext } from "react";

import { useDeleteAuthorMutation } from "^redux/services/authors";

import { checkObjectHasField } from "^helpers/general";
import { Mutation } from "^types/mutation";

type Value = [ReturnType<typeof useDeleteAuthorMutation>[0], Mutation[1]];

const Context = createContext<Value>({} as Value);

const DeleteMutationProvider = ({ children }: { children: ReactElement }) => {
  const [deleteAuthorFromDb, { isError, isLoading, isSuccess }] =
    useDeleteAuthorMutation();

  return (
    <Context.Provider
      value={[deleteAuthorFromDb, { isError, isLoading, isSuccess }]}
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
