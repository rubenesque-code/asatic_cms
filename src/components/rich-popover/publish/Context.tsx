import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { Publishable } from "^types/display-entity";

export type ComponentContextValue = {
  publishStatus: Publishable["publishStatus"];
  togglePublishStatus: () => void;
};

const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

export function ComponentProvider({
  children,
  ...contextValue
}: {
  children: ReactElement;
} & ComponentContextValue) {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "usePublishPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
