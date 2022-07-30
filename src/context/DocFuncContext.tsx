import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

type Value = { func: (id: string) => void };
const Context = createContext<Value>({} as Value);
const DocFuncProvider = ({
  children,
  ...value
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
const useDocFuncContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useDocFuncContext must be used within its provider!");
  }
  return context;
};

export { DocFuncProvider, useDocFuncContext };
