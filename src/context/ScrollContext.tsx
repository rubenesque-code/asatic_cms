import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

type Value = {
  top: number;
  prevScrollNum: number;
  scrollNum: number;
  updatePrevScrollNum: () => void;
};

const Context = createContext<Value>({} as Value);

const ScrollContextProvider = ({
  children,
  ...contextValue
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
const useScrollContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useScrollContext must be used within its provider!");
  }
  return context;
};

export { ScrollContextProvider, useScrollContext };
