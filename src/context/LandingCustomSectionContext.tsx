import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { LandingSectionCustom } from "^types/landing";

type ContextValue = LandingSectionCustom;

const Context = createContext<ContextValue>({} as ContextValue);

const LandingCustomSectionProvider = ({
  section,
  children,
}: {
  section: LandingSectionCustom;
  children: ReactElement;
}) => {
  return <Context.Provider value={section}>{children}</Context.Provider>;
};

const useLandingCustomSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context);
  if (contextIsEmpty) {
    throw new Error(
      "useLandingCustomSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { LandingCustomSectionProvider, useLandingCustomSectionContext };
