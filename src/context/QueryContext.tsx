import { createContext, ReactElement, useContext, useState } from "react";

type Value = {
  query: string;
  setQuery: (query: string) => void;
};
const Context = createContext<Value>({} as Value);

const QueryProvider = ({ children }: { children: ReactElement }) => {
  const [query, setQuery] = useState("");
  return (
    <Context.Provider value={{ query, setQuery }}>{children}</Context.Provider>
  );
};

const useQueryContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useQueryContext must be used within its provider!");
  }
  return context;
};

export { QueryProvider, useQueryContext };
