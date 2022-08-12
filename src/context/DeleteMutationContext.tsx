import { createContext, ReactElement, useContext } from "react";

type Value = readonly [
  deleteFromDb: ({
    id,
    useToasts,
  }: {
    id: string;
    useToasts?: boolean;
  }) => void,
  data: { isError: boolean; isLoading: boolean; isSuccess: boolean } & Record<
    string,
    unknown
  >
];
const Context = createContext<Value>({} as Value);

const DeleteMutationProvider = ({
  children,
  mutation,
}: { children: ReactElement } & { mutation: Value }) => {
  return <Context.Provider value={mutation}>{children}</Context.Provider>;
};
const useDeleteMutationContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = context[0];
  if (!contextIsPopulated) {
    throw new Error(
      "useDeleteMutationContext must be used within its provider!"
    );
  }
  return context;
};

export { DeleteMutationProvider, useDeleteMutationContext };