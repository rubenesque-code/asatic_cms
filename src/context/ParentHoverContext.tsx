import { createContext, ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "^helpers/general";

export type HoverHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

type ContextValue = [isHovered: boolean, handlers: HoverHandlers];
const Context = createContext<ContextValue>([false, {}] as ContextValue);

const HoverProvider = ({ children }: { children: ReactElement }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const value = [isHovered, handlers] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useHoverContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[1]);
  if (contextIsEmpty) {
    throw new Error("useHoverContext must be used within its provider!");
  }
  return context;
};

export { HoverProvider, useHoverContext };
