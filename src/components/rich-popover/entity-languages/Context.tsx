import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { EntityNameSubSet } from "^types/entity";

type ParentEntity = {
  name: EntityNameSubSet<
    "article" | "blog" | "collection" | "recordedEvent" | "subject"
  >;
  languagesIds: string[];
  addTranslation: (languageId: string) => void;
  removeTranslation: (languageId: string) => void;
};

export type ParentEntityProp = {
  parentEntity: ParentEntity;
};

type ComponentContextValue = ParentEntityProp;

const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

export function ComponentProvider({
  children,
  parentEntity,
}: {
  children: ReactElement;
} & ParentEntityProp) {
  return (
    <ComponentContext.Provider value={{ parentEntity }}>
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useEntityLanguagePopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
