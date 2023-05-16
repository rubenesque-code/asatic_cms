import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { EntityName } from "^types/entity";

export type ComponentContextValue = {
  deleteEntity: () => void;
  entityType: EntityName;
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
      "useEntityPageSettingsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
