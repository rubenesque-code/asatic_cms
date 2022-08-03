import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

type Value = { func: (id: string) => void };
const Context = createContext<Value>({} as Value);
const FuncProvider = ({
  children,
  ...value
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
const useFuncContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useFuncContext must be used within its provider!");
  }
  return context;
};

export { FuncProvider, useFuncContext };
