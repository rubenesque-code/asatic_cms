import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { Mutation } from "^types/mutation";

const Context = createContext<Mutation>([
  () => null,
  {} as Mutation[1],
] as Mutation);

const WriteMutationProvider = ({
  children,
  mutation,
}: { children: ReactElement } & { mutation: Mutation }) => {
  return <Context.Provider value={mutation}>{children}</Context.Provider>;
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
