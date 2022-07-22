import { createContext, ReactElement, useContext } from "react";

import useHovered from "^hooks/useHovered";

type ContextValue = boolean;
const Context = createContext<ContextValue>(false as ContextValue);

const HoverProvider = ({ children }: { children: ReactElement }) => {
  const [isHovered, handlers] = useHovered();

  const value = isHovered as ContextValue;

  return (
    <Context.Provider value={value}>
      <div {...handlers}>{children}</div>
    </Context.Provider>
  );
};

const useHoverContext = () => {
  const context = useContext(Context);
  console.log("context:", context);
  const contextIsPopulated = typeof context === "boolean";
  if (!contextIsPopulated) {
    throw new Error("useHoverContext must be used within its provider!");
  }
  return context;
};

export { HoverProvider, useHoverContext };
