import { createContext, ReactElement, useContext } from "react";

import { useCreateAuthorMutation } from "^redux/services/authors";

import { checkObjectHasField } from "^helpers/general";
import { Mutation } from "^types/mutation";

type Value = [ReturnType<typeof useCreateAuthorMutation>[0], Mutation[1]];

const Context = createContext<Value>({} as Value);

const WriteMutationProvider = ({ children }: { children: ReactElement }) => {
  const [createAuthorInDb, { isError, isLoading, isSuccess }] =
    useCreateAuthorMutation();

  return (
    <Context.Provider
      value={[createAuthorInDb, { isError, isLoading, isSuccess }]}
    >
      {children}
    </Context.Provider>
  );
};

const useWriteMutationContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error(
      "useWriteMutationContext must be used within its provider!"
    );
  }
  return context;
};

export { WriteMutationProvider, useWriteMutationContext };
