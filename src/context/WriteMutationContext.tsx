import { createContext, ReactElement, useContext } from "react";

type Value = readonly [
  writeToDb: () => void,
  data: { isError: boolean; isLoading: boolean; isSuccess: boolean } & Record<
    string,
    unknown
  >
];
const Context = createContext<Value>([() => null, {} as Value[1]] as Value);

const WriteMutationProvider = ({
  children,
  mutation,
}: { children: ReactElement } & { mutation: Value }) => {
  return <Context.Provider value={mutation}>{children}</Context.Provider>;
};
const useWriteMutationContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = context[0];
  if (!contextIsPopulated) {
    throw new Error(
      "useWriteMutationContext must be used within its provider!"
    );
  }
  return context;
};

export { WriteMutationProvider, useWriteMutationContext };
