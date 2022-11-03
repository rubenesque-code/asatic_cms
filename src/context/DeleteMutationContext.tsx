import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

// intent is to provide ui with async delete info (loading, success, error)

type Value = readonly [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteFromDb: ({
    id,
    useToasts,
    authorsIds,
  }: {
    id: string;
    useToasts: boolean;
    authorsIds: string[];
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
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error(
      "useDeleteMutationContext must be used within its provider!"
    );
  }
  return context;
};

export { DeleteMutationProvider, useDeleteMutationContext };
