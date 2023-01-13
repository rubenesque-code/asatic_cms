import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

type ContextValue = {
  colSpan: "1/2" | "1/4";
  rowSpan: 1 | 2;
  imageOverride?: "always-hide" | "always-show";
};

const Context = createContext<ContextValue>({} as ContextValue);

const CustomSectionComponentProvider = ({
  children,
  ...contextValue
}: {
  children: ReactElement;
} & ContextValue) => {
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
const useCustomSectionComponentContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useCustomSectionComponentContext must be used within its provider!"
    );
  }
  return context;
};

export { CustomSectionComponentProvider, useCustomSectionComponentContext };
