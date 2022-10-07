import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { PrimaryEntityType } from "^types/primary-entity";

export type ContextValue = {
  addEntity: ({
    entityId,
    entityType,
  }: {
    entityType: PrimaryEntityType;
    entityId: string;
  }) => void;
  addEntityTo: string;
};

const Context = createContext<ContextValue>({} as ContextValue);

const ComponentProvider = ({
  children,
  ...value
}: { children: ReactElement } & ContextValue) => {
  return <Context.Provider value={{ ...value }}>{children}</Context.Provider>;
};

const useComponentContext = () => {
  const context = useContext(Context);
  const isWithinProvider = checkObjectHasField(context);

  if (!isWithinProvider) {
    throw new Error("useComponentContext must be used within its provider");
  }

  return context;
};

export { ComponentProvider, useComponentContext };
